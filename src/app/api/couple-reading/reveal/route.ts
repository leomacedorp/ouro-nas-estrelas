import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL;

export async function POST(req: Request) {
  try {
    const { sessionId, a, b, focus } = await req.json();

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'missing_session_id' }, { status: 400 });
    }

    if (!a?.name || !a?.birthDate || !a?.sign || !b?.name || !b?.birthDate || !b?.sign) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'not_paid' }, { status: 403 });
    }

    const base = (SITE_URL || req.headers.get('origin') || '').replace(/\/$/, '');
    if (!base) {
      return NextResponse.json({ error: 'missing_site_url' }, { status: 500 });
    }

    // Chama engine (sem salvar em banco por enquanto)
    const engineRes = await fetch(`${base}/api/couple-engine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a, b, focus }),
    });

    const engineData = await engineRes.json();
    if (!engineRes.ok || !engineData?.success) {
      return NextResponse.json({ error: 'engine_failed' }, { status: 500 });
    }

    // Às vezes o engine cai no fallback e devolve o JSON inteiro como texto em `leitura`.
    // Ex.: leitura = '{"titulo":"...","leitura":"..."}'
    const tryExtractNested = (raw: unknown): { titulo?: string; leitura?: string } | null => {
      if (typeof raw !== 'string') return null;
      const s = raw.trim();
      if (!s.startsWith('{') || !s.includes('"leitura"')) return null;

      // 1) tenta parse direto
      try {
        const obj = JSON.parse(s);
        if (obj && typeof obj === 'object') {
          const t = (obj as any).titulo;
          const l = (obj as any).leitura;
          if (typeof t === 'string' || typeof l === 'string') return { titulo: t, leitura: l };
        }
      } catch {
        // ignore
      }

      // 2) extração manual do campo "leitura" (string JSON escapada)
      const idx = s.indexOf('"leitura"');
      if (idx < 0) return null;
      const after = s.slice(idx);
      const colon = after.indexOf(':');
      if (colon < 0) return null;
      let rest = after.slice(colon + 1).trim();
      if (!rest.startsWith('"')) return null;

      // captura string até aspas não-escapadas
      let out = '';
      let escaped = false;
      for (let i = 1; i < rest.length; i++) {
        const ch = rest[i];
        if (escaped) {
          out += ch;
          escaped = false;
          continue;
        }
        if (ch === '\\') {
          escaped = true;
          continue;
        }
        if (ch === '"') {
          break;
        }
        out += ch;
      }

      const leitura = out
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\"/g, '"');

      // titulo (best-effort)
      const tMatch = s.match(/"titulo"\s*:\s*"([\s\S]*?)"/);
      const titulo = tMatch?.[1]
        ? tMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
        : undefined;

      return { titulo, leitura };
    };

    const nested = tryExtractNested(engineData.leitura);

    return NextResponse.json({
      content: {
        titulo: nested?.titulo || engineData.titulo,
        leitura: nested?.leitura || engineData.leitura,
        provider: engineData.provider,
      },
    });
  } catch (e) {
    console.error('[couple-reading/reveal] Error', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
