import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTodayBrazil } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

/**
 * Debug: mostra exatamente o que tem no banco hoje
 */
export async function GET() {
    try {
        const today = getTodayBrazil();

        const { data, error } = await supabase
            .from('horoscopes')
            .select('*')
            .eq('date', today)
            .order('sign');

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            date: today,
            count: data?.length || 0,
            records: data?.map(h => ({
                sign: h.sign,
                focus: h.focus,
                contentPreview: h.content?.substring(0, 100) + '...',
                contentLength: h.content?.length || 0,
                layers: h.layers
            }))
        });

    } catch (error) {
        console.error('[DEBUG] Erro:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
