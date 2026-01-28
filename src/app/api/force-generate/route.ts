import { NextResponse } from 'next/server';
import { generateHoroscope } from '@/lib/aiProvider';
import { getTodayBrazil } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    console.log('[FORCE] Forçando geração para Câncer...');
    const result = await generateHoroscope({
        sign: 'cancer',
        signName: 'Câncer',
        dateBr: getTodayBrazil(),
        mode: 'luna',
        focus: 'geral'
    });

    return NextResponse.json(result);
}
