import { NextResponse } from 'next/server';
import { generateLocalHoroscope } from '@/lib/localTemplate';

export async function GET() {
    try {
        const result = generateLocalHoroscope({
            sign: 'aries',
            focus: 'amor',
            dateBr: '2026-01-27'
        });
        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
