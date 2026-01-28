import { notFound } from 'next/navigation';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { Sparkles, Calendar, ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getTodayBrazil, formatDateBrazil } from '@/lib/dateUtils';
import { generateLocalHoroscope } from '@/lib/localTemplate';

// Force dynamic rendering (no ISR cache)
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// Helper to get sign data
function getSign(slug: string) {
    return ZODIAC_SIGNS.find(s => s.slug === slug);
}

// Mensagem de fallback
const FALLBACK_MESSAGE = "A energia cósmica está em alinhamento especial neste momento. As estrelas preparam uma mensagem única para este signo. Em breve, uma leitura completa estará disponível com insights personalizados para o seu dia.";

// Fetch horoscope data (versão V2 - Geração Viva Local)
async function getHoroscope(sign: string) {
    const today = getTodayBrazil();

    // FORÇANDO GERAÇÃO LOCAL V2 (Bypass de Banco de Dados)
    // Isso garante que o usuário veja os novos templates imediatamente
    const localResult = generateLocalHoroscope({
        sign,
        focus: 'geral',
        dateBr: today
    });

    return {
        message: localResult.message,
        date: today,
        sign,
        isFallback: false, // Agora é oficial, não fallback
        fallbackReason: null
    };
}

export async function generateStaticParams() {
    return ZODIAC_SIGNS.map((sign) => ({
        sign: sign.slug,
    }));
}

interface PageProps {
    params: Promise<{ sign: string }>;
}

export default async function SignPage({ params }: PageProps) {
    const { sign: slug } = await params;
    const signData = getSign(slug);

    if (!signData) {
        notFound();
    }

    const horoscope = await getHoroscope(slug);

    return (
        <div className="min-h-screen pb-20 bg-mystic-950 text-slate-200">
            {/* Header / Hero */}
            <div className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-mystic-950" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="container mx-auto px-4 relative z-10">
                    <Link href="/#signos" className="inline-flex items-center text-slate-400 hover:text-gold-400 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Escolher outro signo
                    </Link>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gold-500/20 blur-[50px] rounded-full" />
                            <div className="relative bg-mystic-900/80 p-8 rounded-full border border-gold-500/20 shadow-glow-gold">
                                <span className="text-6xl md:text-7xl">{signData.symbol}</span>
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-100 mb-2 text-glow">
                                {signData.name}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {signData.dates}</span>
                                <span className="px-3 py-0.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs uppercase tracking-wider text-gold-500">
                                    {signData.element}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mensagem do Dia */}
            <div className="container mx-auto px-4 relative z-20">
                <div className="bg-mystic-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-12 shadow-2xl max-w-3xl mx-auto overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

                    {/* Header da leitura */}
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                        <h2 className="text-2xl font-serif text-gold-400 flex items-center gap-3">
                            <Sparkles className="w-5 h-5" /> Mensagem do Dia
                        </h2>
                        <span className="text-sm text-slate-500 uppercase tracking-widest">
                            {formatDateBrazil(horoscope.date)}
                        </span>
                    </div>

                    {/* Fallback Notice */}
                    {horoscope.isFallback && horoscope.fallbackReason && (
                        <div className="mb-8 px-4 py-3 bg-amber-900/20 border border-amber-500/30 rounded-xl text-amber-300 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {horoscope.fallbackReason}
                        </div>
                    )}

                    {/* Mensagem Principal */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-line font-medium text-justify">
                            {horoscope.message}
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="bg-gradient-to-r from-gold-900/20 to-indigo-900/20 rounded-2xl p-8 border border-gold-500/30 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-gold-500/10 transition-colors" />
                            <h3 className="text-xl font-serif text-white mb-4 relative z-10">
                                Quer uma leitura mais profunda?
                            </h3>
                            <p className="text-slate-300 mb-8 max-w-lg mx-auto relative z-10">
                                Receba uma análise personalizada com orientações específicas para o seu momento de vida.
                            </p>
                            <Link
                                href="/leitura-premium"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold-600 hover:bg-gold-500 text-white font-bold text-lg shadow-glow-gold hover:shadow-glow-gold-strong transition-all relative z-10"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Solicitar Leitura Personalizada
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
