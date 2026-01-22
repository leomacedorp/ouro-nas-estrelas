import { notFound } from 'next/navigation';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { Sparkles, Calendar, ArrowLeft, Heart, Wallet, Briefcase, MessageCircle, Zap, Lock, Gem, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';
import { supabase } from '@/lib/supabase';
import { getTodayBrazil, formatDateBrazil } from '@/lib/dateUtils';

// Force dynamic rendering (no ISR cache)
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// Focos disponíveis
const FOCUSES = {
    amor: { label: 'Amor', icon: Heart, color: 'rose' },
    dinheiro: { label: 'Dinheiro', icon: Wallet, color: 'emerald' },
    carreira: { label: 'Carreira', icon: Briefcase, color: 'blue' }
} as const;

type Focus = keyof typeof FOCUSES;

// Estrutura das 6 seções
interface LeituraSections {
    abertura: string;
    energia_atual: string;
    bloqueio: string;
    oportunidade: string;
    orientacao: string;
    encerramento: string;
}

// Helper to get sign data
function getSign(slug: string) {
    return ZODIAC_SIGNS.find(s => s.slug === slug);
}

// Mock data for fallback when no content available
const FALLBACK_SECTIONS: LeituraSections = {
    abertura: "A energia cósmica está em alinhamento especial neste momento. As estrelas preparam uma mensagem única para este signo.",
    energia_atual: "O universo está processando as vibrações astrais do dia. Em breve, uma leitura completa estará disponível com insights personalizados.",
    bloqueio: "Padrões energéticos estão sendo analisados para revelar o que precisa ser liberado neste ciclo.",
    oportunidade: "Novas possibilidades estão se formando no campo astral. O ouro escondido será revelado em instantes.",
    orientacao: "Mantenha-se receptivo às mensagens do cosmos. A orientação prática chegará em breve.",
    encerramento: "Esta leitura está sendo atualizada. Volte em alguns minutos para a versão completa com todos os detalhes."
};

// Fetch horoscope data with fallback chain (Server Component)
async function getHoroscope(sign: string, requestedFocus: Focus = 'amor') {
    const today = getTodayBrazil();

    // Tentativa 1: Foco solicitado para hoje
    const { data: primary } = await supabase
        .from('horoscopes')
        .select('*')
        .eq('sign', sign)
        .eq('date', today)
        .eq('focus', requestedFocus)
        .single();

    if (primary?.layers) {
        return {
            sections: primary.layers as LeituraSections,
            date: primary.date,
            focus: primary.focus as Focus,
            sign,
            isComplete: true,
            isFallback: false
        };
    }

    // Tentativa 2: Qualquer foco disponível hoje (preferência: amor > dinheiro > carreira)
    const { data: anyToday } = await supabase
        .from('horoscopes')
        .select('*')
        .eq('sign', sign)
        .eq('date', today)
        .in('focus', ['amor', 'dinheiro', 'carreira'])
        .order('focus', { ascending: true })
        .limit(1)
        .single();

    if (anyToday?.layers) {
        return {
            sections: anyToday.layers as LeituraSections,
            date: anyToday.date,
            focus: anyToday.focus as Focus,
            sign,
            isComplete: true,
            isFallback: true,
            fallbackReason: `Leitura de ${requestedFocus} em atualização. Mostrando ${anyToday.focus}.`
        };
    }

    // Tentativa 3: Última leitura disponível (qualquer dia)
    const { data: lastAvailable } = await supabase
        .from('horoscopes')
        .select('*')
        .eq('sign', sign)
        .eq('focus', requestedFocus)
        .order('date', { ascending: false })
        .limit(1)
        .single();

    if (lastAvailable?.layers) {
        return {
            sections: lastAvailable.layers as LeituraSections,
            date: lastAvailable.date,
            focus: lastAvailable.focus as Focus,
            sign,
            isComplete: true,
            isFallback: true,
            fallbackReason: 'Atualizando sua leitura, volte em instantes.'
        };
    }

    // Tentativa 4: Mock local
    return {
        sections: FALLBACK_SECTIONS,
        date: today,
        focus: requestedFocus,
        sign,
        isComplete: false,
        isFallback: true,
        fallbackReason: 'Atualizando sua leitura, volte em instantes.'
    };
}

export async function generateStaticParams() {
    return ZODIAC_SIGNS.map((sign) => ({
        sign: sign.slug,
    }));
}

interface PageProps {
    params: Promise<{ sign: string }>;
    searchParams: Promise<{ foco?: string }>;
}

export default async function SignPage({ params, searchParams }: PageProps) {
    const { sign: slug } = await params;
    const { foco } = await searchParams;

    const signData = getSign(slug);

    if (!signData) {
        notFound();
    }

    // Validar foco (default: amor)
    const currentFocus: Focus = (foco && foco in FOCUSES) ? foco as Focus : 'amor';
    const horoscope = await getHoroscope(slug, currentFocus);
    const FocusIcon = FOCUSES[currentFocus].icon;
    const focusLabel = FOCUSES[currentFocus].label;

    // CTA WhatsApp com signo + foco + data
    const whatsappMessage = `Olá! Quero receber a leitura completa de ${signData.name} (foco: ${focusLabel}) para ${formatDateBrazil(horoscope.date)}.`;

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

            {/* Focus Selector */}
            <div className="container mx-auto px-4 -mt-4 mb-8 relative z-20">
                <div className="flex justify-center gap-3 flex-wrap">
                    {(Object.keys(FOCUSES) as Focus[]).map((focus) => {
                        const Icon = FOCUSES[focus].icon;
                        const isActive = focus === currentFocus;
                        const colorClasses = {
                            amor: isActive ? 'bg-rose-600 border-rose-500 text-white' : 'border-rose-500/30 text-rose-400 hover:bg-rose-900/30',
                            dinheiro: isActive ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30',
                            carreira: isActive ? 'bg-blue-600 border-blue-500 text-white' : 'border-blue-500/30 text-blue-400 hover:bg-blue-900/30',
                        };

                        return (
                            <Link
                                key={focus}
                                href={`/signos/${slug}?foco=${focus}`}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${colorClasses[focus]}`}
                            >
                                <Icon className="w-4 h-4" />
                                {FOCUSES[focus].label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Leitura Completa - 6 Seções */}
            <div className="container mx-auto px-4 relative z-20">
                <div className="bg-mystic-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-12 shadow-2xl max-w-4xl mx-auto overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

                    <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/5">
                        <h2 className="text-2xl font-serif text-gold-400 flex items-center gap-3">
                            <FocusIcon className="w-5 h-5" /> Leitura Completa: {focusLabel}
                        </h2>
                        <span className="text-sm text-slate-500 uppercase tracking-widest">
                            {formatDateBrazil(horoscope.date)}
                        </span>
                    </div>

                    {/* Fallback Notice - Aviso discreto */}
                    {horoscope.isFallback && horoscope.fallbackReason && (
                        <div className="mb-8 px-4 py-3 bg-amber-900/20 border border-amber-500/30 rounded-xl text-amber-300 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {horoscope.fallbackReason}
                        </div>
                    )}

                    <div className="space-y-10">

                        {/* 1. Abertura */}
                        <section className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-gold-400" />
                                </div>
                                <h3 className="text-xl font-serif text-slate-100">Sua Leitura Começa Aqui</h3>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-lg pl-13">
                                {horoscope.sections.abertura}
                            </p>
                        </section>

                        {/* 2. Energia Atual */}
                        <section className="relative pl-8 border-l-2 border-indigo-500/30">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-mystic-900 border-2 border-indigo-500" />
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className="w-5 h-5 text-indigo-400" />
                                <h3 className="text-lg font-serif text-slate-100">Energia Atual</h3>
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                                {horoscope.sections.energia_atual}
                            </p>
                        </section>

                        {/* 3. O Que Está Bloqueando */}
                        <section className="relative pl-8 border-l-2 border-rose-500/30">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-mystic-900 border-2 border-rose-500" />
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="w-5 h-5 text-rose-400" />
                                <h3 className="text-lg font-serif text-slate-100">O Que Está Bloqueando</h3>
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                                {horoscope.sections.bloqueio}
                            </p>
                        </section>

                        {/* 4. Oportunidade Oculta */}
                        <section className="relative pl-8 border-l-2 border-emerald-500/30 bg-gradient-to-r from-emerald-900/10 to-transparent rounded-r-xl py-4 pr-4">
                            <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-mystic-900 border-2 border-emerald-500" />
                            <div className="flex items-center gap-3 mb-4">
                                <Gem className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-lg font-serif text-slate-100">Oportunidade Oculta</h3>
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                                {horoscope.sections.oportunidade}
                            </p>
                        </section>

                        {/* 5. Orientação Prática */}
                        <section className="relative pl-8 border-l-2 border-amber-500/30">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-mystic-900 border-2 border-amber-500" />
                            <div className="flex items-center gap-3 mb-4">
                                <Compass className="w-5 h-5 text-amber-400" />
                                <h3 className="text-lg font-serif text-slate-100">Orientação Prática</h3>
                            </div>
                            <p className="text-slate-300 leading-relaxed italic">
                                {horoscope.sections.orientacao}
                            </p>
                        </section>

                        {/* 6. Encerramento + CTA */}
                        <section className="mt-12 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <ArrowRight className="w-5 h-5 text-gold-400" />
                                <h3 className="text-lg font-serif text-slate-100">O Próximo Passo</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-8">
                                {horoscope.sections.encerramento}
                            </p>

                            {/* Conversion CTA */}
                            <div className="bg-gradient-to-r from-gold-900/20 to-indigo-900/20 rounded-2xl p-8 border border-gold-500/30 text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-gold-500/10 transition-colors" />
                                <h3 className="text-xl font-serif text-white mb-4 relative z-10">
                                    Receba sua leitura estendida no WhatsApp
                                </h3>
                                <p className="text-slate-300 mb-8 max-w-lg mx-auto relative z-10">
                                    A leitura astrológica completa revela trânsitos específicos para o seu momento de vida.
                                    Receba orientações personalizadas diretamente no seu WhatsApp.
                                </p>
                                <Link
                                    href="/leitura-premium"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold-600 hover:bg-gold-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all relative z-10"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Liberar Leitura Completa
                                </Link>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
