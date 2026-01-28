import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Traz as últimas 10 entradas de capricórnio para inspeção
        const { data, error } = await supabase
            .from('horoscopes')
            .select('*')
            .eq('sign', 'capricornio')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        return NextResponse.json({
            count: data?.length,
            records: data
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
