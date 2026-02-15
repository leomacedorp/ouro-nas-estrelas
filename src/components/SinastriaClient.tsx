"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, Star, Flame, Briefcase, Users, Zap } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import Link from 'next/link';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { calculateCompatibility, CompatibilityFocus, CompatibilityResult } from '@/lib/compatibility';

const SIGNS_LIST = ZODIAC_SIGNS.map((data) => ({
    slug: data.slug,
    name: data.name,
    icon: data.symbol,
    element: data.element // display only
}));

const FOCUS_OPTIONS: Array<{ key: CompatibilityFocus; label: string; icon: any; helper: string }> = [
    { key: 'amor', label: 'Amor', icon: Heart, helper: 'carinho, vínculo e futuro' },
    { key: 'quimica', label: 'Química', icon: Zap, helper: 'atração e sintonia física' },
    { key: 'trabalho', label: 'Trabalho', icon: Briefcase, helper: 'parceria e performance' },
    { key: 'amizade', label: 'Amizade', icon: Users, helper: 'convivência e lealdade' },
];

function focusCopy(focus: CompatibilityFocus) {
    switch (focus) {
        case 'quimica':
            return { badge: 'Sexo / Química', title: 'Sinastria de Química', subtitle: 'Entenda atração, ritmo e o que acende (ou esfria) a conexão.' };
        case 'trabalho':
            return { badge: 'Trabalho', title: 'Sinastria Profissional', subtitle: 'Descubra como vocês funcionam juntos em metas, decisões e rotina.' };
        case 'amizade':
            return { badge: 'Amizade', title: 'Sinastria de Amizade', subtitle: 'Veja onde a amizade flui e como evitar ruídos na convivência.' };
        default:
            return { badge: 'Amor', title: 'Sinastria Amorosa', subtitle: 'Descubra a alquimia secreta entre dois corações.' };
    }
}

export default function SinastriaClient({ defaultFocus = 'amor' }: { defaultFocus?: CompatibilityFocus }) {
    const [focus, setFocus] = useState<CompatibilityFocus>(defaultFocus);
    const [signA, setSignA] = useState('');
    const [signB, setSignB] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CompatibilityResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = async () => {
        if (!signA || !signB) return;
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            // Simulate calculation drama
            await new Promise(resolve => setTimeout(resolve, 2000));

            const res = calculateCompatibility(signA, signB, focus);
            setResult(res);
        } catch (e) {
            setError('Não foi possível calcular agora. Tente novamente.');
            console.error('[sinastria] calculateCompatibility failed', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-mystic-950 text-slate-100 selection:bg-rose-500/30 overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-rose-900/10 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Heart className="w-4 h-4 text-rose-400 fill-current" />
                        <span className="text-sm font-medium text-rose-200">{focusCopy(focus).badge}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-200 via-pink-200 to-purple-200">
                        {focusCopy(focus).title}
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {focusCopy(focus).subtitle}
                    </p>
                </motion.div>

                {/* Calculator Interface */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl mb-12 relative overflow-hidden">
                    {/* Focus selector */}
                    <div className="relative z-10 mb-10">
                        <p className="text-sm font-medium text-slate-300 uppercase tracking-wider text-center mb-4">Qual é o foco?</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {FOCUS_OPTIONS.map((opt) => {
                                const Icon = opt.icon;
                                const active = focus === opt.key;
                                return (
                                    <button
                                        key={opt.key}
                                        onClick={() => setFocus(opt.key)}
                                        className={
                                            `rounded-2xl border px-4 py-4 text-left transition-all ` +
                                            (active
                                                ? 'border-rose-500/50 bg-rose-500/10'
                                                : 'border-white/10 bg-black/30 hover:bg-black/40')
                                        }
                                        type="button"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className={active ? 'text-rose-300' : 'text-slate-400'} size={18} />
                                            <span className={active ? 'text-white font-semibold' : 'text-slate-200 font-semibold'}>{opt.label}</span>
                                        </div>
                                        <div className={active ? 'text-rose-100/80 text-xs mt-1' : 'text-slate-400 text-xs mt-1'}>
                                            {opt.helper}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {/* Decorative Background inside card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-purple-500/5 pointer-events-none" />

                    <div className="grid md:grid-cols-[1fr,auto,1fr] gap-8 items-center relative z-10">
                        {/* Sign A Selector */}
                        <SignSelector
                            label="Seu Signo"
                            value={signA}
                            onChange={setSignA}
                            color="rose"
                        />

                        {/* Connection Icon */}
                        <div className="hidden md:flex flex-col items-center justify-center pt-8">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        {/* Sign B Selector */}
                        <SignSelector
                            label="Signo da Pessoa"
                            value={signB}
                            onChange={setSignB}
                            color="purple"
                        />
                    </div>

                    <div className="mt-12 text-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCalculate}
                            disabled={!signA || !signB || loading}
                            className="w-full md:w-auto min-w-[300px] relative group"
                        >
                            <ShimmerButton
                                className="w-full py-5 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed !bg-gradient-to-r !from-rose-500 !to-purple-600"
                                shimmerColor="rgba(255, 255, 255, 0.2)"
                            >
                                {loading ? 'Calculando Conexão...' : 'Revelar Compatibilidade'}
                            </ShimmerButton>
                        </motion.button>
                    </div>
                </div>

                {/* Results Reveal */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-8 bg-rose-500/10 border border-rose-500/20 text-rose-100 rounded-2xl p-4 text-center"
                        >
                            {error}
                        </motion.div>
                    )}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            {/* Score Header */}
                            <div className="p-10 text-center border-b border-white/10 relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 opacity-50" />

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="inline-block mb-6"
                                >
                                    <div className="text-7xl font-serif font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                                        {result.score}%
                                    </div>
                                    <div className="text-sm uppercase tracking-widest text-slate-400">Compatibilidade</div>
                                </motion.div>

                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-200 to-purple-200 mb-4">
                                    {result.label}
                                </h2>
                                <p className="text-lg text-slate-300 max-w-xl mx-auto italic">
                                    "{result.description}"
                                </p>
                            </div>

                            {/* Details */}
                            <div className="grid md:grid-cols-2">
                                <div className="p-8 border-r border-white/10 bg-white/5">
                                    <h3 className="text-sm font-bold uppercase text-rose-300 mb-4 flex items-center gap-2">
                                        <Flame className="w-4 h-4" /> O que favorece
                                    </h3>
                                    <p className="text-slate-200 leading-relaxed mb-6">{result.blocks.favorable}</p>

                                    <h3 className="text-sm font-bold uppercase text-rose-300 mb-4 flex items-center gap-2">
                                        <Flame className="w-4 h-4" /> O que pode atrapalhar
                                    </h3>
                                    <p className="text-slate-200 leading-relaxed">{result.blocks.challenging}</p>
                                </div>

                                <div className="p-8 bg-white/5">
                                    <h3 className="text-sm font-bold uppercase text-purple-300 mb-4 flex items-center gap-2">
                                        <Star className="w-4 h-4" /> Ação de hoje (10 min)
                                    </h3>
                                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl mb-6">
                                        <p className="text-purple-100 font-medium">✨ {result.blocks.actionToday}</p>
                                    </div>

                                    <h3 className="text-sm font-bold uppercase text-purple-300 mb-4 flex items-center gap-2">
                                        <Star className="w-4 h-4" /> Conselho Cósmico
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.tips.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-300">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Upsell Footer */}
                            <div className="p-8 bg-gradient-to-r from-rose-900/30 to-purple-900/30 text-center">
                                <h4 className="text-white font-serif font-bold text-xl mb-4">Quer destravar a leitura simbólica completa?</h4>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link
                                        href="/leitura-casal"
                                        className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold transition-colors"
                                    >
                                        Destravar Leitura do Casal <ArrowRight className="w-4 h-4" />
                                    </Link>

                                    <Link
                                        href="/leitura-premium"
                                        className="inline-flex items-center gap-2 text-rose-200 hover:text-white transition-colors border-b border-rose-200/50 hover:border-white pb-1"
                                    >
                                        Quero minha Leitura Pessoal <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}

function SignSelector({ label, value, onChange, color }: any) {
    const borderColor = color === 'rose' ? 'focus:border-rose-500' : 'focus:border-purple-500';
    const ringColor = color === 'rose' ? 'focus:ring-rose-500/20' : 'focus:ring-purple-500/20';

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300 uppercase tracking-wider text-center">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full appearance-none bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-center text-lg text-white outline-none focus:ring-4 transition-all ${borderColor} ${ringColor} cursor-pointer hover:bg-black/60`}
                >
                    <option value="" disabled>Escolher Signo</option>
                    {SIGNS_LIST.map(sign => (
                        <option key={sign.slug} value={sign.slug} className="bg-slate-900 py-2">
                            {sign.icon} {sign.name}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
            </div>
        </div>
    );
}
