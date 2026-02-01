/**
 * AI Provider - Camada Unificada de Geração de Horóscopo
 * Fallback em 3 níveis: OpenAI → Gemini → Template Local
 */

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getShortPrompt, getPremiumPrompt, getLunaPrompt, validateText } from './prompts';
import { isInCooldown, handleRateLimitError, getCooldownStatus } from './circuitBreaker';
import { generateLocalHoroscope } from './localTemplate';
import { isContentTooSimilar } from './similarity';

// Tipos
export interface GenerationResult {
    success: boolean;
    content: string | Record<string, string>;
    provider: 'openai' | 'gemini' | 'template';
    model: string;
    attempts: number;
    errors: string[];
    meta: {
        generatedAt: string;
        cooldownStatus: Record<string, unknown>;
    };
}

export interface GenerationOptions {
    sign: string;      // slug do signo (aries, touro, etc)
    signName: string;  // nome do signo (Áries, Touro, etc)
    dateBr: string;    // data no formato YYYY-MM-DD
    mode: 'short' | 'premium' | 'luna';  // modo de geração
    focus?: string;    // foco (amor, dinheiro, carreira) - apenas para premium

    // Anti-repetição (opcional) — usado principalmente no modo 'luna'
    theme?: string;            // tema do dia (ex.: limites, coragem, recomeço...)
    avoidContents?: string[];  // textos recentes (ex.: ontem/anteontem) para NÃO repetir
}

// Inicialização dos clientes
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'placeholder'
});

const genAI = process.env.GOOGLE_AI_API_KEY
    ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    : null;

/**
 * Tenta gerar com OpenAI
 */
function buildAntiRepetitionBlock(options: GenerationOptions, pass: number): string {
    const { mode, theme, avoidContents } = options;
    if (mode !== 'luna') return '';

    const recent = (avoidContents || []).filter(Boolean);
    const excerpts = recent
        .slice(0, 2)
        .map((t, idx) => {
            const clip = t.length > 900 ? t.slice(0, 900) + '…' : t;
            return `--- TEXTO RECENTE ${idx + 1} (NÃO REUTILIZAR FRASES/METÁFORAS/CONSELHO) ---\n${clip}`;
        })
        .join('\n\n');

    const strength = pass === 0
        ? 'Evite repetir o tom, as metáforas e o conselho.'
        : pass === 1
            ? 'IMPORTANTE: mude COMPLETAMENTE as metáforas e exemplos cotidianos. Use uma estrutura narrativa diferente e um conselho final diferente.'
            : 'MUITO IMPORTANTE: texto precisa parecer outro autor no mesmo tom. Proibido reutilizar qualquer frase marcante, analogia ou conselho dos textos recentes.';

    return `\n\n=== VARIAÇÃO / NÃO REPETIÇÃO ===\nTema do dia: ${theme || 'livre'}\n${strength}\n\n${excerpts ? `Conteúdos recentes para referência proibida:\n${excerpts}` : ''}`.trim();
}

async function tryOpenAI(options: GenerationOptions, pass: number = 0): Promise<{ success: boolean; content?: string; error?: string }> {
    const { signName, mode, focus } = options;

    // Verifica cooldown
    if (isInCooldown('openai')) {
        return { success: false, error: 'OpenAI em cooldown' };
    }

    try {
        console.log(`[OPENAI] Tentando gerar para ${signName}...`);

        const basePrompt = mode === 'premium' && focus
            ? getPremiumPrompt(signName, focus)
            : mode === 'luna'
                ? getLunaPrompt(signName)
                : getShortPrompt(signName);

        const prompt = `${basePrompt}\n\n${buildAntiRepetitionBlock(options, pass)}`.trim();

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: prompt },
                { role: 'user', content: `Gere a mensagem do dia para ${signName}.` }
            ],
            response_format: { type: 'json_object' },
            max_tokens: mode === 'premium' ? 1000 : 500
        });

        const rawContent = completion.choices[0].message.content;
        if (!rawContent) {
            return { success: false, error: 'Resposta vazia da OpenAI' };
        }

        console.log(`[OPENAI] ✅ ${signName} gerado com sucesso`);
        return { success: true, content: rawContent };

    } catch (error: unknown) {
        const err = error as { status?: number; code?: string; message?: string };

        // Rate limit - ativar cooldown
        if (err.status === 429 || err.code === 'rate_limit_exceeded') {
            handleRateLimitError('openai', err.message || '');
        }

        console.error(`[OPENAI] ❌ Falhou para ${signName}: ${err.status} - ${err.message}`);
        return { success: false, error: `${err.status || 'unknown'}: ${err.message || 'Erro desconhecido'}` };
    }
}

/**
 * Tenta gerar com Gemini
 */
async function tryGemini(options: GenerationOptions, pass: number = 0): Promise<{ success: boolean; content?: string; error?: string }> {
    const { signName, mode, focus } = options;

    if (!genAI) {
        return { success: false, error: 'Gemini não configurado (sem API key)' };
    }

    // Verifica cooldown
    if (isInCooldown('gemini')) {
        return { success: false, error: 'Gemini em cooldown' };
    }

    try {
        console.log(`[GEMINI] Tentando gerar para ${signName} (fallback)...`);

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const basePrompt = mode === 'premium' && focus
            ? getPremiumPrompt(signName, focus)
            : mode === 'luna'
                ? getLunaPrompt(signName)
                : getShortPrompt(signName);

        const prompt = `${basePrompt}\n\n${buildAntiRepetitionBlock(options, pass)}`.trim();

        const fullPrompt = `${prompt}\n\nGere a mensagem do dia para ${signName}.`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            return { success: false, error: 'Resposta vazia do Gemini' };
        }

        // Gemini pode retornar texto com markdown, precisamos limpar
        let cleanedText = text;
        if (text.includes('```json')) {
            cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        } else if (text.includes('```')) {
            cleanedText = text.replace(/```\n?/g, '').trim();
        }

        console.log(`[GEMINI] ✅ ${signName} gerado com sucesso`);
        return { success: true, content: cleanedText };

    } catch (error: unknown) {
        const err = error as { status?: number; message?: string };

        // Rate limit do Gemini
        if (err.status === 429) {
            handleRateLimitError('gemini', err.message || '');
        }

        console.error(`[GEMINI] ❌ Falhou para ${signName}: ${err.message}`);
        return { success: false, error: err.message || 'Erro desconhecido' };
    }
}

/**
 * Gera com template local (fallback final)
 */
function generateFromTemplate(options: GenerationOptions): { success: boolean; content: string } {
    const { sign, dateBr, focus = 'amor' } = options;

    console.log(`[TEMPLATE] Gerando para ${sign} via template local premium...`);

    // Usa o novo sistema de templates com alta variação
    const result = generateLocalHoroscope({
        sign,
        focus,
        dateBr
    });

    return { success: true, content: JSON.stringify({ mensagem: result.message }) };
}

/**
 * Função principal: gera horóscopo com fallback em 3 níveis
 */
export async function generateHoroscope(options: GenerationOptions): Promise<GenerationResult> {
    const errors: string[] = [];
    let attempts = 0;

    const shouldCheckSimilarity = options.mode === 'luna' && (options.avoidContents?.length || 0) > 0;

    const acceptIfNotSimilar = (text: string): { ok: boolean; note?: string } => {
        if (!shouldCheckSimilarity) return { ok: true };
        const avoid = (options.avoidContents || []).filter(Boolean);
        const tooSimilar = isContentTooSimilar(text, avoid, 0.35);
        return tooSimilar ? { ok: false, note: 'too_similar' } : { ok: true };
    };

    // Nível 1: OpenAI (com até 3 passes de variação)
    for (let pass = 0; pass < 3; pass++) {
        attempts++;
        const openaiResult = await tryOpenAI(options, pass);
        if (openaiResult.success && openaiResult.content) {
            try {
                const parsed = JSON.parse(openaiResult.content);
                const content = options.mode === 'premium' ? parsed : parsed.mensagem;

                // Validação de qualidade
                const validation = validateText(typeof content === 'string' ? content : JSON.stringify(content));
                if (!validation.valid) {
                    console.warn(`[QUALITY] Texto contém problemas: ${validation.issues.join(', ')}`);
                }

                const simCheck = acceptIfNotSimilar(typeof content === 'string' ? content : JSON.stringify(content));
                if (!simCheck.ok) {
                    errors.push(`OpenAI: conteúdo muito similar aos dias anteriores (pass ${pass + 1})`);
                    continue;
                }

                return {
                    success: true,
                    content,
                    provider: 'openai',
                    model: 'gpt-4o-mini',
                    attempts,
                    errors,
                    meta: {
                        generatedAt: new Date().toISOString(),
                        cooldownStatus: getCooldownStatus()
                    }
                };
            } catch (parseError) {
                errors.push(`OpenAI parse error: ${parseError}`);
            }
        } else if (openaiResult.error) {
            errors.push(`OpenAI: ${openaiResult.error}`);
            break; // se falhou por provider, cai pro Gemini
        }
    }

    // Nível 2: Gemini (com até 3 passes de variação)
    for (let pass = 0; pass < 3; pass++) {
        attempts++;
        const geminiResult = await tryGemini(options, pass);
        if (geminiResult.success && geminiResult.content) {
            try {
                const parsed = JSON.parse(geminiResult.content);
                const content = options.mode === 'premium' ? parsed : parsed.mensagem;

                const simCheck = acceptIfNotSimilar(typeof content === 'string' ? content : JSON.stringify(content));
                if (!simCheck.ok) {
                    errors.push(`Gemini: conteúdo muito similar aos dias anteriores (pass ${pass + 1})`);
                    continue;
                }

                return {
                    success: true,
                    content,
                    provider: 'gemini',
                    model: 'gemini-1.5-flash',
                    attempts,
                    errors,
                    meta: {
                        generatedAt: new Date().toISOString(),
                        cooldownStatus: getCooldownStatus()
                    }
                };
            } catch (parseError) {
                errors.push(`Gemini parse error: ${parseError}`);
            }
        } else if (geminiResult.error) {
            errors.push(`Gemini: ${geminiResult.error}`);
            break;
        }
    }

    // Nível 3: Template Local
    attempts++;
    console.log(`[FALLBACK] Usando template local após ${attempts - 1} tentativas de API`);
    const templateResult = generateFromTemplate(options);
    const parsed = JSON.parse(templateResult.content);
    const content = options.mode === 'premium' ? parsed : parsed.mensagem;

    return {
        success: true,
        content,
        provider: 'template',
        model: 'local-v1',
        attempts,
        errors,
        meta: {
            generatedAt: new Date().toISOString(),
            cooldownStatus: getCooldownStatus()
        }
    };
}

/**
 * Retorna status atual dos providers
 */
export function getProviderStatus(): Record<string, unknown> {
    return {
        openai: {
            configured: !!process.env.OPENAI_API_KEY,
            inCooldown: isInCooldown('openai')
        },
        gemini: {
            configured: !!process.env.GOOGLE_AI_API_KEY,
            inCooldown: isInCooldown('gemini')
        },
        template: {
            configured: true,
            inCooldown: false
        },
        cooldowns: getCooldownStatus()
    };
}
