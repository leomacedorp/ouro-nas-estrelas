import { NextResponse, NextRequest } from 'next/server';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { getTodayBrazil } from '@/lib/dateUtils';
import OpenAI from 'openai';

// Inicializa OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'placeholder'
});

// URL da API do Gemini (modelo 2.0 Flash)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Configuração
const MAX_SIGNS_PER_BATCH = 2;

// Resposta simplificada
interface AIResponse {
    mensagem: string;
}

// Prompt compartilhado
function buildPrompt(signName: string): string {
    return `Você é um astrólogo simbólico, empático e humano.

Crie uma mensagem diária para o signo ${signName}, usando uma linguagem simples, acolhedora e emocionalmente próxima.

REGRAS:

- Linguagem popular, clara e fácil de entender
- Tom acolhedor, humano, calmo e empático
- Escrita como se estivesse conversando com alguém querido
- Evitar qualquer termo técnico, psicológico ou científico
- Não usar palavras como: configuração, processo, estrutura, dinâmica, padrão, sistema, mecanismo, análise, reestruturação
- Não usar previsões diretas de acontecimentos
- Não usar pronomes pessoais ("você", "seu")
- Frases fluidas, naturais, quentes e humanas
- Máximo de 220 palavras

A mensagem deve abordar de forma natural:
- O clima emocional do dia
- Relações e sentimentos
- Trabalho e dinheiro de forma leve
- Um conselho simples e prático para encerrar

Evitar completamente:
- Linguagem de máquina
- Termos técnicos
- Frases genéricas de horóscopo
- Promessas ou previsões

Estilo desejado:
Sábio, acolhedor, humano, emocional, leve e inspirador.

Retorne exclusivamente em JSON:

{
  "mensagem": "Texto completo aqui"
}`;
}

// Tenta gerar com OpenAI
async function generateWithOpenAI(signName: string): Promise<AIResponse | null> {
    try {
        console.log(`[OPENAI] Tentando gerar para ${signName}...`);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: buildPrompt(signName) },
                { role: "user", content: `Gere a mensagem do dia para ${signName}.` }
            ],
            response_format: { type: "json_object" },
            max_tokens: 500
        });

        const rawContent = completion.choices[0].message.content;
        if (!rawContent) return null;

        console.log(`[OPENAI] ✅ ${signName} gerado com sucesso`);
        return JSON.parse(rawContent) as AIResponse;

    } catch (error: unknown) {
        const err = error as { status?: number; code?: string; message?: string };
        console.error(`[OPENAI] ❌ Falhou para ${signName}: ${err.status} - ${err.message}`);
        return null;
    }
}

// Tenta gerar com Gemini (Fallback)
async function generateWithGemini(signName: string): Promise<AIResponse | null> {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
        console.error('[GEMINI] ❌ API Key não configurada');
        return null;
    }

    try {
        console.log(`[GEMINI] Tentando gerar para ${signName} (fallback)...`);

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${buildPrompt(signName)}\n\nGere a mensagem do dia para ${signName}.`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[GEMINI] ❌ HTTP ${response.status}: ${errorText}`);
            return null;
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error('[GEMINI] ❌ Resposta vazia');
            return null;
        }

        // Gemini às vezes retorna texto com ```json ... ```, precisamos limpar
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanedText) as AIResponse;

        console.log(`[GEMINI] ✅ ${signName} gerado com sucesso (fallback)`);
        return parsed;

    } catch (error) {
        console.error(`[GEMINI] ❌ Erro para ${signName}:`, error);
        return null;
    }
}

// Função principal: tenta OpenAI, fallback para Gemini
async function generateForSign(signName: string): Promise<{ content: AIResponse | null; provider: string }> {
    // Tenta OpenAI primeiro
    let content = await generateWithOpenAI(signName);
    if (content) {
        return { content, provider: 'openai' };
    }

    // Fallback para Gemini
    content = await generateWithGemini(signName);
    if (content) {
        return { content, provider: 'gemini' };
    }

    return { content: null, provider: 'none' };
}

// Busca signos que faltam para hoje
async function getMissingSigns(today: string): Promise<typeof ZODIAC_SIGNS> {
    const { data: existing } = await supabase
        .from('horoscopes')
        .select('sign')
        .eq('date', today);

    const existingSigns = new Set(existing?.map(e => e.sign) || []);
    return ZODIAC_SIGNS.filter(sign => !existingSigns.has(sign.slug));
}

export async function GET(request: NextRequest) {
    try {
        const today = getTodayBrazil();
        const searchParams = request.nextUrl.searchParams;
        const mode = searchParams.get('mode') || 'missing';

        console.log(`[CRON] Iniciando geração para ${today} - Modo: ${mode.toUpperCase()}`);

        const generated: string[] = [];
        const errors: string[] = [];
        const providers: Record<string, string> = {};

        // Busca signos faltantes
        const missingSigns = await getMissingSigns(today);

        if (missingSigns.length === 0) {
            console.log(`[CRON] ✅ Todos os ${ZODIAC_SIGNS.length} signos já foram gerados para ${today}`);
            return NextResponse.json({
                success: true,
                date: today,
                mode,
                message: 'Todos os signos já foram gerados',
                generated: 0,
                remaining: 0
            });
        }

        console.log(`[CRON] ${missingSigns.length} signos pendentes: ${missingSigns.map(s => s.name).join(', ')}`);

        // Processa signos
        const signsToProcess = missingSigns.slice(0, MAX_SIGNS_PER_BATCH);

        for (const sign of signsToProcess) {
            console.log(`[GENERATE] Processando ${sign.name}...`);

            const { content, provider } = await generateForSign(sign.name);

            if (!content) {
                console.error(`[ERROR] Falha total ao gerar ${sign.name} (OpenAI + Gemini falharam)`);
                errors.push(sign.name);
                continue;
            }

            // Salva no banco
            const { error } = await supabase
                .from('horoscopes')
                .insert({
                    sign: sign.slug,
                    date: today,
                    focus: 'geral',
                    type: 'daily',
                    content: content.mensagem
                });

            if (error) {
                console.error(`[ERROR] Falha ao salvar ${sign.name}:`, error.message);
                errors.push(sign.name);
            } else {
                generated.push(sign.name);
                providers[sign.name] = provider;
                console.log(`[SAVE] ✅ ${sign.name} salvo (via ${provider})`);
            }
        }

        // Calcula restantes
        const remainingSigns = await getMissingSigns(today);

        const summary = {
            success: errors.length === 0,
            date: today,
            mode,
            format: 'mensagem_unica_com_fallback',
            generated: generated.length,
            errors: errors.length,
            remaining: remainingSigns.length,
            details: {
                generated,
                providers,
                errors,
                pending: remainingSigns.map(s => s.name)
            }
        };

        console.log(`[CRON] Finalizado:`, JSON.stringify(summary, null, 2));

        return NextResponse.json(summary);

    } catch (error) {
        console.error('[CRON] Erro crítico:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
