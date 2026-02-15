"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, Star, Flame, Wind, Droplets, Mountain } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import Link from 'next/link';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { calculateCompatibility, CompatibilityResult } from '@/lib/compatibility';

const SIGNS_LIST = Object.entries(ZODIAC_SIGNS).map(([slug, data]) => ({
    slug,
    name: data.name,
    icon: data.symbol,
    element: data.element // 'fogo', 'terra', 'ar', 'agua'
}));

export default function SinastriaClient() {
    const [signA, setSignA] = useState('');
    const [signB, setSignB] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CompatibilityResult | null>(null);

    const handleCalculate = async () => {
        if (!signA || !signB) return;
        setLoading(true);
        setResult(null);

        // Simulate calculation drama
        await new Promise(resolve => setTimeout(resolve, 2000));

        const res = calculateCompatibility(signA, signB);
        setResult(res);
        setLoading(false);
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
                        <span className="text-sm font-medium text-rose-200">Amor e Relacionamento</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-200 via-pink-200 to-purple-200">
                        Sinastria Amorosa
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Descubra a alquimia secreta entre dois corações.
                    </p>
                </motion.div>

                {/* Calculator Interface */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl mb-12 relative overflow-hidden">
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

                            {/* Details Grid */}
                            <div className="grid md:grid-cols-2">
                                <div className="p-8 border-r border-white/10 bg-white/5">
                                    <h3 className="text-sm font-bold uppercase text-rose-300 mb-4 flex items-center gap-2">
                                        <Flame className="w-4 h-4" /> Alquimia dos Elementos
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed mb-4">
                                        A interação entre {result.elements.a} e {result.elements.b} cria uma dinâmica única.
                                    </p>
                                    <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                                        <p className="text-rose-100 font-medium">✨ {result.elements.interaction}</p>
                                    </div>
                                </div>

                                <div className="p-8 bg-white/5">
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
                                <h4 className="text-white font-serif font-bold text-xl mb-4">Quer entender seu próprio coração primeiro?</h4>
                                <Link
                                    href="/leitura-premium"
                                    className="inline-flex items-center gap-2 text-rose-200 hover:text-white transition-colors border-b border-rose-200/50 hover:border-white pb-1"
                                >
                                    Fazer minha Leitura Pessoal Simbólica <ArrowRight className="w-4 h-4" />
                                </Link>
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
