import { notFound } from 'next/navigation';
import { ZODIAC_SIGNS } from '@/lib/constants';

import { Sparkles, Calendar, ArrowLeft, Sun, Zap, EyeOff, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

// Helper to get sign data
function getSign(slug: string) {
    return ZODIAC_SIGNS.find(s => s.slug === slug);
}

import { supabase } from '@/lib/supabase';

// Fetch horoscope data (Server Component)
async function getHoroscope(sign: string, type: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const today = new Date().toISOString().split('T')[0];

    // 1. Try to fetch from Supabase
    const { data: horoscope } = await supabase
        .from('horoscopes')
        .select('*')
        .eq('sign', sign)
        .eq('date', today)
        .eq('type', type)
        .single();

    if (horoscope) {
        return {
            content: horoscope.content,
            layers: horoscope.layers,
            date: horoscope.date,
            sign,
            type
        };
    }

    // 2. Fallback if not generated yet (Wait for cron or show yesterday's?)
    // For now, let's keep the mock as a "loading/fallback" state but indicate it needs generation
    return {
        content: "As estrelas estão se alinhando... (Aguardando geração do dia)",
        layers: {
            active: "Energia em processamento cósmico.",
            influence: "Aguarde um momento.",
            hidden: "Em breve."
        },
        date: today,
        sign,
        type
    };
}

export async function generateStaticParams() {
    return ZODIAC_SIGNS.map((sign) => ({
        sign: sign.slug,
    }));
}

export default async function SignPage({ params }: { params: Promise<{ sign: string }> }) {
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
                            <div className="relative bg-mystic-900/80 p-8 rounded-full border border-gold-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
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

            {/* Ritual Content - The 3 Layers */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-mystic-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-12 shadow-2xl max-w-4xl mx-auto overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

                    <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/5">
                        <h2 className="text-2xl font-serif text-gold-400 flex items-center gap-3">
                            <Sparkles className="w-5 h-5" /> Leitura do Ciclo
                        </h2>
                        <span className="text-sm text-slate-500 uppercase tracking-widest">
                            {new Date().toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                        </span>
                    </div>

                    <div className="space-y-12 mb-16">
                        {/* Layer 1: Active */}
                        <div className="relative pl-8 border-l-2 border-gold-500/30">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-mystic-900 border-2 border-gold-500" />
                            <h3 className="flex items-center gap-2 text-lg font-serif text-slate-100 mb-3">
                                <Sun className="w-4 h-4 text-gold-400" /> O Estado Ativo
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                {horoscope.layers.active}
                            </p>
                        </div>

                        {/* Layer 2: Influence */}
                        <div className="relative pl-8 border-l-2 border-indigo-500/30">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-mystic-900 border-2 border-indigo-500" />
                            <h3 className="flex items-center gap-2 text-lg font-serif text-slate-100 mb-3">
                                <Zap className="w-4 h-4 text-indigo-400" /> A Influência
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                {horoscope.layers.influence}
                            </p>
                        </div>

                        {/* Layer 3: Hidden */}
                        <div className="relative pl-8 border-l-2 border-emerald-500/30 bg-gradient-to-r from-emerald-900/5 to-transparent rounded-r-xl py-2">
                            <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-mystic-900 border-2 border-emerald-500" />
                            <h3 className="flex items-center gap-2 text-lg font-serif text-slate-100 mb-3">
                                <EyeOff className="w-4 h-4 text-emerald-400" /> O Oculto
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-lg italic">
                                "{horoscope.layers.hidden}"
                            </p>
                        </div>
                    </div>

                    {/* Conversion CTA */}
                    <div className="bg-gradient-to-r from-gold-900/20 to-indigo-900/20 rounded-2xl p-8 border border-gold-500/30 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-gold-500/10 transition-colors" />
                        <h3 className="text-xl font-serif text-white mb-4 relative z-10">Este é apenas o começo da leitura</h3>
                        <p className="text-slate-300 mb-8 max-w-lg mx-auto relative z-10">
                            A leitura astrológica completa revela trânsitos específicos para o seu momento de vida. Receba a continuação no seu WhatsApp.
                        </p>
                        <Link
                            href={siteConfig.whatsapp.url(`Gostaria de receber a leitura completa para ${signData.name}`)}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold-600 hover:bg-gold-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all relative z-10"
                        >
                            <MessageCircle className="w-5 h-5" />
                            {siteConfig.cta.sign_conversion}
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
