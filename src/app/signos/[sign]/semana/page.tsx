import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { ArrowLeft, Calendar, Sparkles, MessageCircle } from 'lucide-react';
import { formatDateBrazil, getWeekStartBrazil, getWeekEndBrazil, getTodayBrazil } from '@/lib/dateUtils';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 21600; // 6h

function getSign(slug: string) {
  return ZODIAC_SIGNS.find((s) => s.slug === slug);
}

async function getWeeklyHoroscope(sign: string) {
  const today = getTodayBrazil();
  const weekStart = getWeekStartBrazil(today);

  const supabase = await createClient();
  if (!supabase) {
    return { message: null as string | null, dateKey: weekStart };
  }

  const { data } = await supabase
    .from('horoscopes')
    .select('content, date')
    .eq('type', 'weekly')
    .eq('sign', sign)
    .eq('date', weekStart)
    .maybeSingle();

  const content = (data?.content as any) || null;
  const message = typeof content === 'string'
    ? content
    : typeof content?.mensagem === 'string'
      ? content.mensagem
      : null;

  return { message, dateKey: weekStart };
}

interface PageProps {
  params: Promise<{ sign: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sign: slug } = await params;
  const signData = getSign(slug);
  if (!signData) return {};

  return {
    title: `Horóscopo da semana de ${signData.name} (previsão semanal)` ,
    description: `Veja o horóscopo semanal de ${signData.name} com orientações práticas e uma leitura clara para os próximos dias.`,
    alternates: { canonical: `/signos/${slug}/semana` },
  };
}

export async function generateStaticParams() {
  return ZODIAC_SIGNS.map((sign) => ({ sign: sign.slug }));
}

export default async function SemanaPage({ params }: PageProps) {
  const { sign: slug } = await params;
  const signData = getSign(slug);
  if (!signData) notFound();

  const weekly = await getWeeklyHoroscope(slug);
  const weekEnd = getWeekEndBrazil(weekly.dateKey);

  return (
    <div className="min-h-screen pb-20 bg-mystic-950 text-slate-200">
      <div className="relative pt-32 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-mystic-950" />
        <div className="container mx-auto px-4 relative z-10">
          <Link href={`/signos/${slug}`} className="inline-flex items-center text-slate-400 hover:text-gold-400 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o horóscopo de hoje
          </Link>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 mb-3">
            Horóscopo da Semana • {signData.name}
          </h1>
          <p className="text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {formatDateBrazil(weekly.dateKey)} até {formatDateBrazil(weekEnd)}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-mystic-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-12 shadow-2xl max-w-3xl mx-auto overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
            <h2 className="text-2xl font-serif text-gold-400 flex items-center gap-3">
              <Sparkles className="w-5 h-5" /> Previsão Semanal
            </h2>
            <span className="text-sm text-slate-500 uppercase tracking-widest">
              Atualiza automaticamente
            </span>
          </div>

          {weekly.message ? (
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-line font-medium text-justify">
                {weekly.message}
              </p>
            </div>
          ) : (
            <p className="text-slate-300">
              A previsão semanal ainda está sendo preparada. Volte em instantes.
            </p>
          )}

          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <Link
              href="/leitura-premium?foco=geral#pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold-600 hover:bg-gold-500 text-white font-bold text-lg shadow-glow-gold hover:shadow-glow-gold-strong transition-all"
            >
              <MessageCircle className="w-5 h-5" /> Liberar Leitura Premium
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
