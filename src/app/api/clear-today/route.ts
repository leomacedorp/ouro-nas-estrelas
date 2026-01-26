import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTodayBrazil } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

/**
 * Deleta todos os horóscopos de hoje
 * Útil para forçar regeração com novo template
 */
export async function GET() {
    try {
        const today = getTodayBrazil();

        console.log(`[CLEAR] Deletando horóscopos de ${today}...`);

        const { data: before, error: countError } = await supabase
            .from('horoscopes')
            .select('sign')
            .eq('date', today);

        if (countError) {
            return NextResponse.json({
                success: false,
                error: countError.message
            }, { status: 500 });
        }

        const { error: deleteError } = await supabase
            .from('horoscopes')
            .delete()
            .eq('date', today);

        if (deleteError) {
            return NextResponse.json({
                success: false,
                error: deleteError.message
            }, { status: 500 });
        }

        console.log(`[CLEAR] ✅ ${before?.length || 0} registros deletados`);

        return NextResponse.json({
            success: true,
            date: today,
            deleted: before?.length || 0,
            signs: before?.map(h => h.sign) || [],
            nextStep: 'Agora chame /api/cron/generate?mode=missing para regerar com o novo template'
        });

    } catch (error) {
        console.error('[CLEAR] Erro:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
