import { NextResponse } from 'next/server';
import { buildSymbolicMap, getSymbolicMapSummary } from '@/lib/symbolicMap';
import { getPremiumSymbolicPrompt, getPremiumSymbolicPromptShort } from '@/lib/prompts';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Geração Premium via Engine Simbólica + IA
 * 
 * POST /api/premium-engine
 * Body: { name, birthDate, sign, mode?: 'full'|'short' }
 * 
 * Fluxo:
 * 1. Constrói Mapa Simbólico
 * 2. Gera Prompt Enriquecido
 * 3. Chama IA (OpenAI → Gemini → Fallback local)
 * 4. Retorna leitura personalizada
 */

interface RequestBody {
    name: string;
    birthDate: string;
    sign: string;
    mode?: 'full' | 'short';
}

interface GenerationResult {
    success: boolean;
    titulo?: string;
    leitura?: string;
    provider?: string;
    error?: string;
    meta?: {
        symbolicMapSummary: string;
        promptLength: number;
        readingLength: number;
        durationMs: number;
    };
}

/**
 * Chama OpenAI
 */
async function callOpenAI(prompt: string): Promise<{ success: boolean; content?: string; error?: string }> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return { success: false, error: 'OPENAI_API_KEY não configurada' };

    try {
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Você é um conselheiro simbólico premium. Responda APENAS com JSON válido.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 2000,
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0]?.message?.content || '';
        return { success: true, content };
    } catch (e: unknown) {
        const err = e as { code?: string; message?: string };
        return { success: false, error: err?.code || err?.message || 'OpenAI error' };
    }
}

/**
 * Chama Gemini via REST
 */
async function callGemini(prompt: string): Promise<{ success: boolean; content?: string; error?: string }> {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) return { success: false, error: 'GEMINI_API_KEY não configurada' };

    const models = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'];

    for (const model of models) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt + '\n\nResposta em JSON válido:' }] }],
                        generationConfig: { temperature: 0.8, maxOutputTokens: 2000 }
                    })
                }
            );

            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                if (text) return { success: true, content: text };
            }
        } catch (e) {
            console.log(`[Gemini] ${model} failed:`, e);
        }
    }

    return { success: false, error: 'Todos os modelos Gemini falharam' };
}

/**
 * Gera leitura local (fallback sem IA)
 */
function generateLocalFallback(map: ReturnType<typeof buildSymbolicMap>): { titulo: string; leitura: string } {
    const { identity, numerology, astronomy, archetype } = map;

    const titulo = `${identity.firstName}, sua jornada de ${archetype.sign}`;

    const leitura = `${identity.firstName}, como ${archetype.sign}, você carrega em si a força de ${archetype.coreIdentity.toLowerCase()}. Este é um momento especial da sua jornada.

Seu Número do Destino ${numerology.destiny.number} revela que ${numerology.destiny.interpretation.essence.toLowerCase()}. Essa energia pulsa em você desde sempre, guiando suas escolhas mesmo quando não percebe.

Estamos em um período de ${astronomy.moonPhase.name}, o que significa ${astronomy.moonPhase.energy.toLowerCase()}. A Lua em ${astronomy.moonSign.signName} intensifica sua natureza emocional, trazendo ${astronomy.moonSign.emotionalEnergy.toLowerCase()}.

Seu Ano Pessoal ${numerology.personalYear.number} (${numerology.personalYear.interpretation.title}) indica: ${numerology.personalYear.interpretation.essence}. ${numerology.personalYear.interpretation.strength}.

O maior presente que você pode dar a si é reconhecer que ${archetype.healingKey.toLowerCase()}. Este é o caminho para transformar seu medo de ${archetype.deepFear.toLowerCase()} em força genuína.

No amor, lembre-se: ${archetype.lovePattern} Com dinheiro: ${archetype.moneyPattern} No trabalho: ${archetype.workPattern}

${identity.firstName}, seu desejo mais profundo de ${archetype.hiddenDesire.toLowerCase()} não é fraqueza — é o que move a vida que você merece construir. Confie no processo.`;

    return { titulo, leitura };
}

/**
 * Extrai JSON da resposta da IA
 */
function extractJSON(text: string): { titulo?: string; leitura?: string } {
    // Remove markdown code blocks se existirem
    let cleanText = text
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/g, '')
        .trim();

    // Tenta parse direto
    try {
        return JSON.parse(cleanText);
    } catch {
        // Tenta extrair JSON do meio do texto
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch {
                // Fallback
            }
        }
    }

    // Se não conseguir extrair JSON, usa o texto como leitura
    return { titulo: 'Sua Leitura Premium', leitura: text };
}

export async function POST(request: Request): Promise<Response> {
    const startTime = Date.now();

    try {
        const body: RequestBody = await request.json();
        const { name, birthDate, sign, mode = 'short' } = body;

        // Validação básica
        if (!name || !birthDate || !sign) {
            return NextResponse.json({
                success: false,
                error: 'Campos obrigatórios: name, birthDate, sign'
            }, { status: 400 });
        }

        console.log('[premium-engine] Gerando para:', { name, sign, mode });

        // 1. Construir Mapa Simbólico
        const symbolicMap = buildSymbolicMap(name, birthDate, sign);
        const mapSummary = getSymbolicMapSummary(symbolicMap);

        // 2. Gerar Prompt
        const prompt = mode === 'short'
            ? getPremiumSymbolicPromptShort(symbolicMap)
            : getPremiumSymbolicPrompt(symbolicMap);

        let provider = '';
        let aiContent = '';

        // 3. Tentar OpenAI primeiro
        console.log('[premium-engine] Tentando OpenAI...');
        const openaiResult = await callOpenAI(prompt);
        if (openaiResult.success && openaiResult.content) {
            provider = 'OpenAI gpt-4o-mini';
            aiContent = openaiResult.content;
            console.log('[premium-engine] OpenAI sucesso!');
        } else {
            console.log('[premium-engine] OpenAI falhou:', openaiResult.error);

            // 4. Tentar Gemini
            console.log('[premium-engine] Tentando Gemini...');
            const geminiResult = await callGemini(prompt);
            if (geminiResult.success && geminiResult.content) {
                provider = 'Gemini';
                aiContent = geminiResult.content;
                console.log('[premium-engine] Gemini sucesso!');
            } else {
                console.log('[premium-engine] Gemini falhou:', geminiResult.error);
            }
        }

        let titulo: string;
        let leitura: string;

        // 5. Processar resultado ou usar fallback
        if (aiContent) {
            const parsed = extractJSON(aiContent);
            titulo = parsed.titulo || `A jornada de ${symbolicMap.identity.firstName}`;
            leitura = parsed.leitura || aiContent;
        } else {
            console.log('[premium-engine] Usando fallback local');
            provider = 'Template Local';
            const fallback = generateLocalFallback(symbolicMap);
            titulo = fallback.titulo;
            leitura = fallback.leitura;
        }

        const duration = Date.now() - startTime;

        const result: GenerationResult = {
            success: true,
            titulo,
            leitura,
            provider,
            meta: {
                symbolicMapSummary: mapSummary,
                promptLength: prompt.length,
                readingLength: leitura.length,
                durationMs: duration
            }
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error('[premium-engine] Erro:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        }, { status: 500 });
    }
}

// GET para teste rápido
export async function GET(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'Maria da Silva';
    const birthDate = searchParams.get('birth') || '1990-05-15';
    const sign = searchParams.get('sign') || 'cancer';
    const mode = (searchParams.get('mode') || 'short') as 'full' | 'short';

    // Simula um POST
    const fakeRequest = new Request(request.url, {
        method: 'POST',
        body: JSON.stringify({ name, birthDate, sign, mode })
    });

    return POST(fakeRequest);
}
