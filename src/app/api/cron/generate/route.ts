import { NextResponse, NextRequest } from 'next/server';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { getTodayBrazil } from '@/lib/dateUtils';
import { getMaxSimilarity } from '@/lib/similarity';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'placeholder'
});

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 min max para Vercel Pro

// Configuração de lotes e retry
const MAX_SIGNS_PER_BATCH = 1; // 1 signo por vez para evitar Timeout de 10s na Vercel (Hobby)
const MAX_RETRY_ATTEMPTS = 1; // Sem retries - deixa o cron tentar de novo
const BACKOFF_DELAYS = [0]; // Sem delay - retorna imediatamente em caso de erro

// Focos suportados
const FOCUSES = ['amor', 'dinheiro', 'carreira'] as const;
type Focus = typeof FOCUSES[number];

// Estrutura das 6 seções da leitura completa
interface LeituraSections {
    abertura: string;
    energia_atual: string;
    bloqueio: string;
    oportunidade: string;
    orientacao: string;
    encerramento: string;
}

interface OpenAIResponse {
    amor: LeituraSections;
    dinheiro: LeituraSections;
    carreira: LeituraSections;
}

// Delay helper
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Prompt oficial para leitura completa (Versão Site: SIMBÓLICA/PSICOLÓGICA)
function buildSystemPrompt(signName: string, today: string): string {
    return `Você é um analista simbólico e psicológico especializado em astrologia comportamental.

MISSÃO: Gerar uma leitura coletiva profunda para o signo ${signName} (${today}).
O conteúdo será exibido publicamente no site, portanto deve funcionar para qualquer pessoa do signo.

DIRETRIZES TÉCNICAS (OBRIGATÓRIO):
🚫 PROIBIDO usar pronomes pessoais diretos: "você", "seu", "sua", "te".
🚫 PROIBIDO usar linguagem preditiva: "vai acontecer", "terá", "receberá".
🚫 PROIBIDO prometer eventos concretos.
✅ OBRIGATÓRIO usar o SIGNO (${signName}) ou termos impessoais como sujeito.
   - Ex: "A energia de ${signName} pede...", "O momento favorece...", "O nativo sente..."

DIRETRIZES DE ESTILO (PSICOLOGIA SIMBÓLICA):
- Seu foco é: Consciência, Autoconhecimento, Regulação Emocional.
- Não trate a astrologia como superstição, mas como linguagem de padrões humanos.
- Analise o "Clima Coletivo" vs "Essência do Signo". Onde há atrito? Onde há fluxo?

ESTRUTURA OBRIGATÓRIA (6 seções):

1. abertura
Contextualização simbólica do período. Qual é a "atmosfera" emocional reinante? Como ela toca ${signName}?

2. energia_atual
O estado psicológico predominante. É um momento de expansão ou retração? Ação ou silêncio? Explicar o movimento interno.

3. bloqueio
Onde reside a tensão? Qual padrão comportamental repetitivo pode estar sabotando o fluxo? (Falar de padrões, não de azares).

4. oportunidade
O "ouro oculto". Que virtude ou postura mental o momento convida a desenvolver? A oportunidade é interna (consciência), não externa (ganhar algo).

5. orientacao
Conselho prático de postura. Como navegar essas águas? Sugestão de comportamento ou atitude mental.

6. encerramento
Fechamento editorial elegante. Reforçar a ideia de que essa é apenas uma camada e que a profundidade real exige análise individual.

FORMATO JSON:
{
  "amor": { ... },
  "dinheiro": { ... },
  "carreira": { ... }
}`;
}

// Busca conteúdos anteriores para verificação de similaridade
async function getPreviousContents(sign: string, focus: string, days: number = 7): Promise<string[]> {
    const { data } = await supabase
        .from('horoscopes')
        .select('content, layers')
        .eq('sign', sign)
        .eq('focus', focus)
        .order('date', { ascending: false })
        .limit(days);

    if (!data) return [];

    return data.flatMap(row => {
        const sections = row.layers as LeituraSections | null;
        if (!sections) return [row.content || ''];
        return [
            sections.abertura || '',
            sections.energia_atual || '',
            sections.bloqueio || '',
            sections.oportunidade || '',
            sections.orientacao || '',
            sections.encerramento || ''
        ].filter(Boolean);
    });
}

// Gera conteúdo para um signo com RETRY e BACKOFF
async function generateForSignWithRetry(
    signName: string,
    signSlug: string,
    today: string,
    similarityAttempt: number = 1
): Promise<OpenAIResponse | null> {
    const uniquenessInstruction = similarityAttempt > 1
        ? `\n\nIMPORTANTE: Esta é a tentativa ${similarityAttempt}. O conteúdo anterior era muito similar aos dias anteriores. 
           Seja MUITO mais criativo. Use metáforas completamente diferentes. Traga insights únicos para este momento astral.`
        : '';

    for (let retryAttempt = 0; retryAttempt < MAX_RETRY_ATTEMPTS; retryAttempt++) {
        try {
            console.log(`[OPENAI] ${signName} - tentativa ${retryAttempt + 1}/${MAX_RETRY_ATTEMPTS}`);

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: buildSystemPrompt(signName, today) + uniquenessInstruction
                    },
                    {
                        role: "user",
                        content: `Gere as 3 leituras completas para ${signName} (${today}).`
                    }
                ],
                response_format: { type: "json_object" },
                max_tokens: 4000
            });

            const rawContent = completion.choices[0].message.content;
            return rawContent ? JSON.parse(rawContent) as OpenAIResponse : null;

        } catch (error: unknown) {
            const err = error as { status?: number; code?: string; message?: string };
            const isRateLimit = err.status === 429 || err.code === 'rate_limit_exceeded';
            const isServerError = err.status === 503 || err.status === 500;

            // Sem delay - retorna null imediatamente para não travar a função
            // O cron vai tentar de novo na próxima execução
            console.error(`[ERROR] ${signName} falhou (rate limit ou server error). Será tentado no próximo cron.`);

            console.error(`[ERROR] OpenAI failed for ${signName} after ${retryAttempt + 1} attempts:`, err.message || error);
            return null;
        }
    }

    return null;
}

// Verifica similaridade e regenera se necessário
async function generateWithSimilarityCheck(
    signName: string,
    signSlug: string,
    today: string,
    maxAttempts: number = 2,
    threshold: number = 0.65
): Promise<OpenAIResponse | null> {
    // Busca conteúdos anteriores para cada foco
    const previousContents: Record<Focus, string[]> = {
        amor: await getPreviousContents(signSlug, 'amor'),
        dinheiro: await getPreviousContents(signSlug, 'dinheiro'),
        carreira: await getPreviousContents(signSlug, 'carreira')
    };

    let bestResponse: OpenAIResponse | null = null;
    let bestSimilarity = 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const response = await generateForSignWithRetry(signName, signSlug, today, attempt);

        if (!response) continue;

        // Verifica similaridade para cada foco
        let maxSim = 0;
        for (const focus of FOCUSES) {
            const sections = response[focus];
            const allText = Object.values(sections).join(' ');
            const sim = getMaxSimilarity(allText, previousContents[focus]);
            maxSim = Math.max(maxSim, sim);
        }

        console.log(`[SIMILARITY] ${signName} attempt ${attempt}: ${(maxSim * 100).toFixed(1)}%`);

        if (maxSim < threshold) {
            return response;
        }

        if (maxSim < bestSimilarity) {
            bestSimilarity = maxSim;
            bestResponse = response;
        }
    }

    if (bestResponse) {
        console.log(`[SIMILARITY] ${signName}: Using best attempt with ${(bestSimilarity * 100).toFixed(1)}% similarity`);
    }
    return bestResponse;
}

// Extrai frase de impacto da abertura para o campo content
function extractContentFromSections(sections: LeituraSections): string {
    const firstSentence = sections.abertura.split(/[.!?]/)[0];
    return firstSentence.trim() + '.';
}

// Busca todos os focos faltantes para hoje
async function getMissingFocuses(today: string): Promise<Array<{ sign: typeof ZODIAC_SIGNS[number], missingFocuses: Focus[] }>> {
    const missing: Array<{ sign: typeof ZODIAC_SIGNS[number], missingFocuses: Focus[] }> = [];

    for (const sign of ZODIAC_SIGNS) {
        const { data: existing } = await supabase
            .from('horoscopes')
            .select('focus')
            .eq('sign', sign.slug)
            .eq('date', today)
            .in('focus', FOCUSES);

        const existingFocuses = new Set(existing?.map(e => e.focus) || []);
        const missingFocuses = FOCUSES.filter(f => !existingFocuses.has(f)) as Focus[];

        if (missingFocuses.length > 0) {
            missing.push({ sign, missingFocuses });
        }
    }

    return missing;
}

export async function GET(request: NextRequest) {
    try {
        const today = getTodayBrazil();
        const searchParams = request.nextUrl.searchParams;
        const mode = searchParams.get('mode') || 'full';
        const isMissingMode = mode === 'missing';

        const generated: string[] = [];
        const skipped: string[] = [];
        const errors: string[] = [];
        let signsProcessed = 0;

        console.log(`[CRON] Starting generation for ${today} (Brazil time) - Mode: ${mode.toUpperCase()}`);

        // Busca focos faltantes
        const allMissing = await getMissingFocuses(today);
        const totalMissingBefore = allMissing.reduce((sum, m) => sum + m.missingFocuses.length, 0);

        if (totalMissingBefore === 0) {
            console.log(`[CRON] All ${ZODIAC_SIGNS.length} signs already complete for ${today}`);
            return NextResponse.json({
                success: true,
                date: today,
                mode,
                message: 'All signs already complete',
                generated: 0,
                skipped: ZODIAC_SIGNS.length,
                remaining: 0
            });
        }

        // No modo missing, processa apenas signos com focos faltantes
        // No modo full, processa todos (mas ainda pula completos)
        const signsToProcess = isMissingMode
            ? allMissing.slice(0, MAX_SIGNS_PER_BATCH)
            : allMissing;

        for (const { sign, missingFocuses } of signsToProcess) {
            // Limite de lote em modo missing
            if (isMissingMode && signsProcessed >= MAX_SIGNS_PER_BATCH) {
                console.log(`[BATCH] Limit reached: ${MAX_SIGNS_PER_BATCH} signs per execution`);
                break;
            }

            if (missingFocuses.length === 0) {
                skipped.push(sign.name);
                continue;
            }

            console.log(`[GENERATE] ${sign.name} - missing: ${missingFocuses.join(', ')}`);

            // Gera conteúdo com retry e backoff
            const content = await generateWithSimilarityCheck(sign.name, sign.slug, today);

            if (!content) {
                console.error(`[ERROR] Failed to generate for ${sign.name}`);
                errors.push(sign.name);
                continue;
            }

            // Salva cada foco que está faltando
            for (const focus of missingFocuses) {
                const sections = content[focus];

                const { error } = await supabase
                    .from('horoscopes')
                    .insert({
                        sign: sign.slug,
                        date: today,
                        focus: focus,
                        type: 'daily',
                        content: extractContentFromSections(sections),
                        layers: sections
                    });

                if (error) {
                    console.error(`[ERROR] Failed to insert ${sign.name}/${focus}:`, error.message);
                    errors.push(`${sign.name}/${focus}`);
                }
            }

            generated.push(`${sign.name} (${missingFocuses.join(', ')})`);
            signsProcessed++;
        }

        // Recalcula faltantes após processamento
        const remainingMissing = await getMissingFocuses(today);
        const totalRemainingFocuses = remainingMissing.reduce((sum, m) => sum + m.missingFocuses.length, 0);
        const remainingSigns = remainingMissing.length;

        const summary = {
            success: errors.length === 0,
            date: today,
            mode,
            format: 'leitura_completa_6_secoes',
            generated: generated.length,
            skipped: skipped.length,
            errors: errors.length,
            remaining: {
                signs: remainingSigns,
                focuses: totalRemainingFocuses,
                details: remainingMissing.map(m => `${m.sign.name}: ${m.missingFocuses.join(', ')}`)
            },
            details: {
                generated,
                skipped,
                errors
            }
        };

        console.log(`[CRON] Completed:`, JSON.stringify(summary, null, 2));

        return NextResponse.json(summary);

    } catch (error) {
        console.error('[CRON] Generation error:', error);
        return NextResponse.json({ success: false, error: 'Failed to generate' }, { status: 500 });
    }
}
