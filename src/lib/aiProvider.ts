/**
 * AI Provider - Camada Unificada de Geração de Horóscopo
 * Fallback em 3 níveis: OpenAI → Gemini → Template Local
 */

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getShortPrompt, getPremiumPrompt, validateText } from './prompts';
import { isInCooldown, handleRateLimitError, getCooldownStatus } from './circuitBreaker';
import { generateTemplateMessage, generateTemplateSections } from './templateGenerator';

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
    mode: 'short' | 'premium';  // modo de geração
    focus?: string;    // foco (amor, dinheiro, carreira) - apenas para premium
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
async function tryOpenAI(options: GenerationOptions): Promise<{ success: boolean; content?: string; error?: string }> {
    const { signName, mode, focus } = options;

    // Verifica cooldown
    if (isInCooldown('openai')) {
        return { success: false, error: 'OpenAI em cooldown' };
    }

    try {
        console.log(`[OPENAI] Tentando gerar para ${signName}...`);

        const prompt = mode === 'premium' && focus
            ? getPremiumPrompt(signName, focus)
            : getShortPrompt(signName);

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
async function tryGemini(options: GenerationOptions): Promise<{ success: boolean; content?: string; error?: string }> {
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

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = mode === 'premium' && focus
            ? getPremiumPrompt(signName, focus)
            : getShortPrompt(signName);

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
    const { sign, dateBr, mode, focus } = options;

    console.log(`[TEMPLATE] Gerando para ${sign} via template local...`);

    if (mode === 'premium' && focus) {
        const sections = generateTemplateSections(sign, dateBr, focus);
        return { success: true, content: JSON.stringify(sections) };
    }

    const message = generateTemplateMessage(sign, dateBr);
    return { success: true, content: JSON.stringify({ mensagem: message }) };
}

/**
 * Função principal: gera horóscopo com fallback em 3 níveis
 */
export async function generateHoroscope(options: GenerationOptions): Promise<GenerationResult> {
    const errors: string[] = [];
    let attempts = 0;

    // Nível 1: OpenAI
    attempts++;
    const openaiResult = await tryOpenAI(options);
    if (openaiResult.success && openaiResult.content) {
        try {
            const parsed = JSON.parse(openaiResult.content);
            const content = options.mode === 'premium' ? parsed : parsed.mensagem;

            // Validação de qualidade
            const validation = validateText(typeof content === 'string' ? content : JSON.stringify(content));
            if (!validation.valid) {
                console.warn(`[QUALITY] Texto contém problemas: ${validation.issues.join(', ')}`);
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
    }

    // Nível 2: Gemini
    attempts++;
    const geminiResult = await tryGemini(options);
    if (geminiResult.success && geminiResult.content) {
        try {
            const parsed = JSON.parse(geminiResult.content);
            const content = options.mode === 'premium' ? parsed : parsed.mensagem;

            return {
                success: true,
                content,
                provider: 'gemini',
                model: 'gemini-pro',
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
