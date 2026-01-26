import { NextResponse, NextRequest } from 'next/server';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { getTodayBrazil } from '@/lib/dateUtils';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'placeholder'
});

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 min é suficiente para o novo formato

// Configuração otimizada
const MAX_SIGNS_PER_BATCH = 2; // Pode processar 2 signos por vez agora (texto menor)

// Resposta simplificada da OpenAI
interface OpenAIResponse {
    mensagem: string;
}

// Novo Prompt Otimizado (aprovado pelo ChatGPT)
function buildSystemPrompt(signName: string): string {
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

// Gera conteúdo para um signo
async function generateForSign(signName: string): Promise<OpenAIResponse | null> {
    try {
        console.log(`[OPENAI] Gerando mensagem para ${signName}...`);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: buildSystemPrompt(signName)
                },
                {
                    role: "user",
                    content: `Gere a mensagem do dia para ${signName}.`
                }
            ],
            response_format: { type: "json_object" },
            max_tokens: 500 // Reduzido de 4000 para 500
        });

        const rawContent = completion.choices[0].message.content;
        if (!rawContent) return null;

        const parsed = JSON.parse(rawContent) as OpenAIResponse;
        console.log(`[OPENAI] ✅ ${signName} gerado (${parsed.mensagem.length} caracteres)`);
        return parsed;

    } catch (error: unknown) {
        const err = error as { status?: number; code?: string; message?: string };
        console.error(`[ERROR] OpenAI falhou para ${signName}:`);
        console.error(`  - Status: ${err.status || 'N/A'}`);
        console.error(`  - Code: ${err.code || 'N/A'}`);
        console.error(`  - Message: ${err.message || JSON.stringify(error)}`);
        return null;
    }
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

        // Processa apenas alguns signos por execução (evita timeout)
        const signsToProcess = missingSigns.slice(0, MAX_SIGNS_PER_BATCH);

        for (const sign of signsToProcess) {
            console.log(`[GENERATE] Processando ${sign.name}...`);

            const content = await generateForSign(sign.name);

            if (!content) {
                console.error(`[ERROR] Falha ao gerar ${sign.name}`);
                errors.push(sign.name);
                continue;
            }

            // Salva no banco
            const { error } = await supabase
                .from('horoscopes')
                .insert({
                    sign: sign.slug,
                    date: today,
                    focus: 'geral', // Foco único agora
                    type: 'daily',
                    content: content.mensagem
                });

            if (error) {
                console.error(`[ERROR] Falha ao salvar ${sign.name}:`, error.message);
                errors.push(sign.name);
            } else {
                generated.push(sign.name);
                console.log(`[SAVE] ✅ ${sign.name} salvo no banco`);
            }
        }

        // Calcula restantes
        const remainingSigns = await getMissingSigns(today);

        const summary = {
            success: errors.length === 0,
            date: today,
            mode,
            format: 'mensagem_unica_otimizada',
            generated: generated.length,
            errors: errors.length,
            remaining: remainingSigns.length,
            details: {
                generated,
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
