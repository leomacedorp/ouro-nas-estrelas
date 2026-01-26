import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTodayBrazil } from '@/lib/dateUtils';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { generateHoroscope } from '@/lib/aiProvider';

export const dynamic = 'force-dynamic';

/**
 * Endpoint multifuncional:
 * 1. GET /api/clear-today -> Limpa tudo de hoje
 * 2. GET /api/clear-today?mode=force_sign&sign=aries -> Força regeração de um signo (focus: geral)
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const mode = searchParams.get('mode');
        const signParam = searchParams.get('sign');
        const today = getTodayBrazil();

        // ---------------------------------------------------------
        // MODO: FORCE SIGN (Regerar um signo específico com focus: geral)
        // ---------------------------------------------------------
        if (mode === 'force_sign') {
            if (!signParam) {
                return NextResponse.json({ success: false, error: 'Sign is required for force_sign mode' }, { status: 400 });
            }

            const sign = ZODIAC_SIGNS.find(s => s.slug === signParam);
            if (!sign) {
                return NextResponse.json({ success: false, error: 'Sign not found' }, { status: 404 });
            }

            console.log(`[FORCE] Deletando ${sign.name} de hoje (${today})...`);

            // Deleta anteriores
            await supabase.from('horoscopes')
                .delete()
                .eq('sign', sign.slug)
                .eq('date', today);

            console.log(`[FORCE] Gerando novo ${sign.name}...`);

            // Gera novo
            const result = await generateHoroscope({
                sign: sign.slug,
                signName: sign.name,
                dateBr: today,
                mode: 'short'
            });

            if (!result.success || !result.content) {
                return NextResponse.json({ success: false, error: 'Generation failed', result }, { status: 500 });
            }

            // Salva
            const content = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);
            const { error: dbError } = await supabase.from('horoscopes').insert({
                sign: sign.slug,
                date: today,
                focus: 'geral',
                type: 'daily',
                content: content,
                layers: {
                    provider: result.provider,
                    model: result.model,
                    attempts: result.attempts,
                    errors: result.errors,
                    generatedAt: result.meta.generatedAt
                }
            });

            if (dbError) {
                return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                action: 'force_sign',
                sign: sign.name,
                provider: result.provider
            });
        }

        // ---------------------------------------------------------
        // MODO PADRÃO: Limpar tudo de hoje
        // ---------------------------------------------------------
        console.log(`[CLEAR] Deletando horóscopos de ${today}...`);

        const { data: before } = await supabase
            .from('horoscopes')
            .select('sign')
            .eq('date', today);

        const { error: deleteError } = await supabase
            .from('horoscopes')
            .delete()
            .eq('date', today);

        if (deleteError) {
            return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
        }

        console.log(`[CLEAR] ✅ ${before?.length || 0} registros deletados`);

        return NextResponse.json({
            success: true,
            date: today,
            deleted: before?.length || 0,
            signs: before?.map(h => h.sign) || [],
            nextStep: 'Agora chame /api/cron/generate?mode=missing'
        });

    } catch (error) {
        console.error('[CLEAR] Erro:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
