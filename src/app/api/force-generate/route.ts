import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    console.log('[FORCE] Teste de rota ok');
    return NextResponse.json({ ok: true, message: 'Rota funcionando' });
}
