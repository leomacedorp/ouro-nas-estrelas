import { notFound } from 'next/navigation';
import DownloadPDFButton from '@/components/DownloadPDFButton';
import { createAdminClient } from '@/lib/supabase/admin';
import { ZODIAC_SIGNS } from '@/lib/constants';

export const runtime = 'nodejs';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}

export default async function MinhaLeituraPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { t } = await searchParams;
  if (!t) return notFound();

  const supabase = createAdminClient();
  const { data: reading } = await supabase
    .from('premium_readings')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!reading) return notFound();
  if (String(reading.access_token) !== String(t)) return notFound();

  const signName = ZODIAC_SIGNS.find(s => s.slug === reading.sign_slug)?.name || reading.sign_slug;

  // content can be either an object or (in some edge cases) a JSON string.
  const rawContent = reading.content as any;
  const safeJsonParse = (v: unknown) => {
    if (typeof v !== 'string') return null;
    const s = v.trim();
    if (!s.startsWith('{') || !s.endsWith('}')) return null;
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  };

  // Normalize content to an object.
  let c: any = rawContent;
  const parsedContent = safeJsonParse(rawContent);
  if (parsedContent && typeof parsedContent === 'object') {
    c = parsedContent;
  }

  // Some providers sometimes return a nested JSON inside c.leitura.
  if (typeof c?.leitura === 'string') {
    const nested = safeJsonParse(c.leitura);
    if (nested && typeof nested === 'object') {
      c = {
        ...c,
        titulo: c.titulo || (nested as any).titulo,
        leitura: (nested as any).leitura ?? c.leitura,
      };
    }
  }

  const hasSymbolicReading = typeof c?.leitura === 'string' && c.leitura.trim().length > 0;

  // Formatar data para DD/MM/YYYY
  const formatDate = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <main className="min-h-screen bg-mystic-950 text-slate-200">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Envolve o conteúdo para captura do PDF */}
        <div id="premium-reading-content" className="p-4 bg-mystic-950">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">
              {hasSymbolicReading ? (c.titulo || 'Sua Leitura Premium') : 'Sua Leitura Premium'}
            </h1>
            <p className="text-slate-400">{signName} • válida para {formatDate(reading.date_key)}</p>
          </div>

          {hasSymbolicReading ? (
            <section className="p-6 md:p-10 rounded-3xl bg-white/5 border border-white/10">
              <p className="text-slate-200 leading-relaxed whitespace-pre-line text-lg">
                {c.leitura}
              </p>
            </section>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <Card title="❤️ Amor & Vínculos" content={c.amor} />
              <Card title="💰 Dinheiro & Recursos" content={c.dinheiro} />
              <Card title="🚀 Carreira & Missão" content={c.carreira} />
              <Card title="🚧 O Grande Bloqueio" content={c.bloqueio} />
              <Card title="💎 Ouro Escondido" content={c.oportunidade} />
              <Card title="🔮 Conselho Mágico" content={c.conselho} />
            </div>
          )}

          <div className="mt-10 text-center text-sm text-slate-500 pb-4">
            Ouro Nas Estrelas — {new Date().getFullYear()}
          </div>
        </div>

        <div className="mt-8 text-center flex flex-col items-center gap-4">
          <DownloadPDFButton targetId="premium-reading-content" fileName={`Leitura-${signName}.pdf`} />
          <p className="text-sm text-slate-500">
            Dica: salve este link — ele é o acesso permanente da sua leitura.
          </p>
        </div>
      </div>
    </main>
  );
}

function Card({ title, content }: { title: string; content: string }) {
  return (
    <section className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <h2 className="text-lg font-serif font-bold text-gold-300 mb-3">{title}</h2>
      <p className="text-slate-200 leading-relaxed">{content}</p>
    </section>
  );
}
