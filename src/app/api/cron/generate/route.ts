import { NextResponse, NextRequest } from 'next/server';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTodayBrazil } from '@/lib/dateUtils';
import { generateHoroscope, getProviderStatus } from '@/lib/aiProvider';
import OpenAI from 'openai';
import { getDayEnergyQuote } from '@/lib/dayEnergy';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Configuração (Modo A): processa 1 signo por execução para reduzir risco de timeout na Vercel
// (o vercel.json agenda múltiplas execuções para completar o lote do dia)
const MAX_SIGNS_PER_BATCH = 1;

// Busca signos que faltam para hoje
async function getMissingSigns(supabase: ReturnType<typeof createAdminClient>, today: string): Promise<typeof ZODIAC_SIGNS> {
    const { data: existing } = await supabase
        .from('horoscopes')
        .select('sign')
        .eq('date', today);

    const existingSigns = new Set(existing?.map(e => e.sign) || []);
    return ZODIAC_SIGNS.filter(sign => !existingSigns.has(sign.slug));
}

// ==================== ENERGIA DO DIA (IA 1x/dia) ====================
// Gera um pacote curto para a home (e futuras camadas), salvo em `site_settings.daily_energy_package`.
// Objetivo: dar sensação de "dia vivo" sem pagar IA por usuário.

type DailyEnergyPackage = {
    date: string;
    quote: string;
    byElement: { fogo: string; terra: string; ar: string; agua: string };
    provider: 'openai' | 'fallback';
    model: string;
    generatedAt: string;
};

function fallbackDailyEnergyPackage(today: string): DailyEnergyPackage {
    return {
        date: today,
        quote: getDayEnergyQuote(today),
        byElement: {
            fogo: 'Hoje, direção vale mais do que intensidade. Um foco por vez.',
            terra: 'Hoje, o básico bem cuidado resolve mais do que esforço extra.',
            ar: 'Hoje, clareza é remédio: simplifique e escolha uma conversa importante.',
            agua: 'Hoje, acolhimento com limite: sinta, mas não se afogue.'
        },
        provider: 'fallback',
        model: 'local',
        generatedAt: new Date().toISOString()
    };
}

async function ensureDailyEnergyPackage(
    supabase: ReturnType<typeof createAdminClient>,
    today: string
): Promise<{ ok: boolean; used: 'existing' | 'generated_openai' | 'generated_fallback'; error?: string }> {
    try {
        const { data } = await supabase
            .from('site_settings')
            .select('key, value')
            .eq('key', 'daily_energy_package')
            .maybeSingle();

        const existing = (data?.value as any) || null;
        if (existing?.date === today && typeof existing?.quote === 'string' && existing.quote.length > 0) {
            return { ok: true, used: 'existing' };
        }

        // Tenta OpenAI
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey) {
            const openai = new OpenAI({ apiKey });

            const system = `Você é Luna, orientadora emocional do Ouro nas Estrelas.
Não preveja acontecimentos.
Escreva linguagem simbólica e psicológica, elegante e humana.

Tarefa:
Gerar um PACOTE DA ENERGIA DO DIA para a home.

Regras:
- "quote" deve ter no máximo 120 caracteres.
- "byElement" deve ter 1 frase curta e prática por elemento (fogo/terra/ar/agua).
- Nada de promessas, destino, karma, previsões.
- Não use aspas no texto (deixe o site colocar).

Retorne apenas JSON no formato:
{
  "date": "YYYY-MM-DD",
  "quote": "...",
  "byElement": { "fogo": "...", "terra": "...", "ar": "...", "agua": "..." }
}`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: `Data (Brasil): ${today}` }
                ],
                response_format: { type: 'json_object' },
                max_tokens: 350
            });

            const raw = completion.choices[0]?.message?.content;
            if (raw) {
                const parsed = JSON.parse(raw) as { date?: string; quote?: string; byElement?: any };
                const pkg: DailyEnergyPackage = {
                    date: parsed.date || today,
                    quote: (parsed.quote || '').trim(),
                    byElement: {
                        fogo: String(parsed.byElement?.fogo || '').trim(),
                        terra: String(parsed.byElement?.terra || '').trim(),
                        ar: String(parsed.byElement?.ar || '').trim(),
                        agua: String(parsed.byElement?.agua || '').trim(),
                    },
                    provider: 'openai',
                    model: 'gpt-4o-mini',
                    generatedAt: new Date().toISOString()
                };

                const valid =
                    pkg.date === today &&
                    pkg.quote.length > 0 && pkg.quote.length <= 120 &&
                    pkg.byElement.fogo && pkg.byElement.terra && pkg.byElement.ar && pkg.byElement.agua;

                const finalPkg = valid ? pkg : fallbackDailyEnergyPackage(today);

                const { error: upsertError } = await supabase
                    .from('site_settings')
                    .upsert({
                        key: 'daily_energy_package',
                        value: finalPkg,
                        description: 'Pacote de energia do dia (IA 1x/dia) usado na Home',
                        category: 'content'
                    }, { onConflict: 'key' });

                if (upsertError) {
                    return { ok: false, used: 'generated_openai', error: upsertError.message };
                }

                return { ok: true, used: valid ? 'generated_openai' : 'generated_fallback' };
            }
        }

        // Fallback final
        const pkg = fallbackDailyEnergyPackage(today);
        const { error: upsertError } = await supabase
            .from('site_settings')
            .upsert({
                key: 'daily_energy_package',
                value: pkg,
                description: 'Pacote de energia do dia (fallback) usado na Home',
                category: 'content'
            }, { onConflict: 'key' });

        if (upsertError) {
            return { ok: false, used: 'generated_fallback', error: upsertError.message };
        }

        return { ok: true, used: 'generated_fallback' };

    } catch (e) {
        return { ok: false, used: 'generated_fallback', error: e instanceof Error ? e.message : 'unknown' };
    }
}

// Tema do dia: forçar variação perceptível sem perder o tom
const DAILY_THEMES = [
    'limites e proteção emocional',
    'coragem e iniciativa',
    'organização e clareza',
    'comunicação e conversas honestas',
    'descanso e autocuidado',
    'recomeço e desapego',
    'foco e disciplina leve'
];

function pickThemeForDay(dateKey: string, signSlug: string): string {
    // hash simples: soma de chars
    const seed = (dateKey + signSlug).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return DAILY_THEMES[seed % DAILY_THEMES.length];
}

async function getRecentContents(
    supabase: ReturnType<typeof createAdminClient>,
    signSlug: string,
    today: string
): Promise<string[]> {
    const { data } = await supabase
        .from('horoscopes')
        .select('date, content')
        .eq('type', 'daily')
        .eq('sign', signSlug)
        .lt('date', today)
        .order('date', { ascending: false })
        .limit(2);

    return (data || [])
        .map(r => (typeof r.content === 'string' ? r.content : ''))
        .filter(Boolean);
}

export async function GET(request: NextRequest) {
    try {
        // --- Proteção do endpoint (mínimo necessário) ---
        // Vercel Cron normalmente envia o header `x-vercel-cron: 1`.
        // Para disparos manuais (ex.: debug), permita `?secret=...` com `CRON_SECRET`.
        const isVercelCron = request.headers.get('x-vercel-cron') === '1';
        const searchParams = request.nextUrl.searchParams;
        const providedSecret = searchParams.get('secret');
        const expectedSecret = process.env.CRON_SECRET;

        const hasValidSecret = !!expectedSecret && !!providedSecret && providedSecret === expectedSecret;
        if (!isVercelCron && !hasValidSecret) {
            return NextResponse.json({
                success: false,
                error: 'Unauthorized',
                debug: {
                    isVercelCron,
                    expectedSecretPresent: !!expectedSecret,
                    providedSecretPresent: !!providedSecret,
                    providedSecretLength: providedSecret?.length || 0,
                }
            }, { status: 401 });
        }

        const today = getTodayBrazil();
        const mode = searchParams.get('mode') || 'missing';

        const supabase = createAdminClient();

        console.log(`[CRON] Iniciando geração para ${today} - Modo: ${mode.toUpperCase()}`);

        // Gera pacote da energia do dia (1x/dia) para a Home
        const dayEnergy = await ensureDailyEnergyPackage(supabase, today);
        console.log(`[CRON] Daily energy package:`, JSON.stringify(dayEnergy));
        console.log(`[CRON] Status dos providers:`, JSON.stringify(getProviderStatus()));

        const generated: string[] = [];
        const errors: string[] = [];
        const providers: Record<string, string> = {};

        // Busca signos faltantes
        const missingSigns = await getMissingSigns(supabase, today);

        if (missingSigns.length === 0) {
            console.log(`[CRON] ✅ Todos os ${ZODIAC_SIGNS.length} signos já foram gerados para ${today}`);
            return NextResponse.json({
                success: true,
                date: today,
                mode,
                message: 'Todos os signos já foram gerados',
                generated: 0,
                remaining: 0,
                providerStatus: getProviderStatus()
            });
        }

        console.log(`[CRON] ${missingSigns.length} signos pendentes: ${missingSigns.map(s => s.name).join(', ')}`);

        // Processa signos
        const signsToProcess = missingSigns.slice(0, MAX_SIGNS_PER_BATCH);

        for (const sign of signsToProcess) {
            try {
                console.log(`[GENERATE] Processando ${sign.name}...`);

                // Anti-repetição: pega ontem/anteontem do mesmo signo
                const avoidContents = await getRecentContents(supabase, sign.slug, today);
                const theme = pickThemeForDay(today, sign.slug);

                // Usa a camada unificada de AI
                const result = await generateHoroscope({
                    sign: sign.slug,
                    signName: sign.name,
                    dateBr: today,
                    mode: 'luna',
                    focus: 'geral',
                    theme,
                    avoidContents
                });

                if (!result.success || !result.content) {
                    console.error(`[ERROR] Falha ao gerar ${sign.name}: sem conteúdo`);
                    errors.push(sign.name);
                    continue;
                }

                // Prepara o conteúdo para salvar
                const content = typeof result.content === 'string'
                    ? result.content
                    : JSON.stringify(result.content);

                // Salva no banco com metadados
                const { error: dbError } = await supabase
                    .from('horoscopes')
                    .insert({
                        sign: sign.slug,
                        date: today,
                        focus: 'geral',
                        type: 'daily',
                        content: content,
                        // Metadados de auditoria (salvos no próprio content ou em coluna separada se existir)
                        layers: {
                            provider: result.provider,
                            model: result.model,
                            attempts: result.attempts,
                            errors: result.errors,
                            generatedAt: result.meta.generatedAt
                        }
                    });

                if (dbError) {
                    console.error(`[ERROR] Falha ao salvar ${sign.name}:`, dbError.message);
                    errors.push(sign.name);
                } else {
                    generated.push(sign.name);
                    providers[sign.name] = result.provider;
                    console.log(`[SAVE] ✅ ${sign.name} salvo (via ${result.provider})`);
                }

            } catch (signError) {
                // Erro isolado por signo - não derruba o cron
                console.error(`[ERROR] Erro inesperado ao processar ${sign.name}:`, signError);
                errors.push(sign.name);
            }
        }

        // Calcula restantes
        const remainingSigns = await getMissingSigns(supabase, today);

        const summary = {
            success: generated.length > 0,
            date: today,
            mode,
            format: 'resiliente_3_niveis',
            generated: generated.length,
            errors: errors.length,
            remaining: remainingSigns.length,
            details: {
                generated,
                providers,
                errors,
                pending: remainingSigns.map(s => s.name)
            },
            providerStatus: getProviderStatus()
        };

        console.log(`[CRON] Finalizado:`, JSON.stringify(summary, null, 2));

        return NextResponse.json(summary);

    } catch (error) {
        console.error('[CRON] Erro crítico:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            providerStatus: getProviderStatus()
        }, { status: 500 });
    }
}
