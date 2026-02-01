import { NextResponse, NextRequest } from 'next/server';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTodayBrazil } from '@/lib/dateUtils';
import { generateHoroscope, getProviderStatus } from '@/lib/aiProvider';

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
