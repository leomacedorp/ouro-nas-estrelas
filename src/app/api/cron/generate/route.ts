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
const MAX_SIGNS_PER_BATCH = 2;
const MAX_RETRY_ATTEMPTS = 3;
const BACKOFF_DELAYS = [20000, 40000, 80000]; // 20s, 40s, 80s

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

// Prompt oficial para leitura completa (Versão Site: SEM "VOCÊ")
function buildSystemPrompt(signName: string, today: string): string {
    return `Você é o Oráculo do Ouro Nas Estrelas, uma plataforma premium de previsões astrológicas.

MISSÃO: Criar Leituras Completas de tom editorial, místico e profissional. O texto será exibido publicamente no site.

REGRA DE OURO (LINGUAGEM):
🚫 PROIBIDO usar a palavra "você", "seu", "sua", ou se dirigir diretamente ao leitor.
✅ OBRIGATÓRIO usar o SIGNO (${signName}) ou termos impessoais como sujeito.
Exemplos:
- ERRADO: "Você entrará em uma fase de..."
- CERTO: "O nativo de ${signName} entrará em uma fase de..."
- ERRADO: "Sua energia está focada..."
- CERTO: "A energia escorpiana está focada..."
- ERRADO: "Aproveite para..."
- CERTO: "É um momento propício para..."

DADOS PARA ESTA LEITURA:
- Signo: ${signName}
- Data: ${today}

VOCÊ DEVE GERAR 3 LEITURAS COMPLETAS (uma para cada foco):
- amor: Relacionamentos, conexões emocionais
- dinheiro: Finanças, prosperidade material
- carreira: Trabalho, projetos, crescimento

ESTRUTURA OBRIGATÓRIA (6 seções):

1. abertura - Contextualização do momento para o signo. Ex: "Para ${signName}, a configuração astral atual revela..." (NUNCA usar "Você")

2. energia_atual - Descrever o momento presente do signo. Linguagem simbólica. 1-2 parágrafos.

3. bloqueio - Apontar padrões energéticos ou desafios do signo. Ex: "${signName} pode sentir uma resistência em..."

4. oportunidade - O "ouro escondido" para o signo. Algo que a energia favorece.

5. orientacao - Sugestão prática simbólica. Ex: "O momento pede cautela..." ou "A sugestão astral é..."

6. encerramento - Conclusão editorial indicando que há mais camadas a serem exploradas via leitura personalizada.

REGRAS DE QUALIDADE:
❌ NÃO repetir frases entre focos
❌ NÃO usar textos genéricos
❌ ZERO referência direta ao leitor ("você")
✅ Linguagem editorial e mística
✅ Texto entre 350 e 600 palavras
✅ Português do Brasil

FORMATO DE RESPOSTA (JSON):
{
  "amor": {
    "abertura": "...",
    "energia_atual": "...",
    "bloqueio": "...",
    "oportunidade": "...",
    "orientacao": "...",
    "encerramento": "..."
  },
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

            if ((isRateLimit || isServerError) && retryAttempt < MAX_RETRY_ATTEMPTS - 1) {
                const waitTime = BACKOFF_DELAYS[retryAttempt];
                console.log(`[RATE_LIMIT] ${signName} — tentativa ${retryAttempt + 1}/${MAX_RETRY_ATTEMPTS}, aguardando ${waitTime / 1000}s...`);
                await delay(waitTime);
                continue;
            }

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
