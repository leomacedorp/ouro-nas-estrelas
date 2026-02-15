"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Lock, Star } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import Link from 'next/link';
import {
    calculateDestinyNumber,
    calculateSoulNumber,
    calculateExpressionNumber,
    getNumberInterpretation,
    calculatePersonalYear
} from '@/lib/numerology';

export default function NumerologiaClient() {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);

    // Results state
    const [destiny, setDestiny] = useState<any>(null);
    const [soul, setSoul] = useState<any>(null);
    const [expression, setExpression] = useState<any>(null);
    const [personalYear, setPersonalYear] = useState<number | null>(null);

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate "mystical calculation" time
        await new Promise(resolve => setTimeout(resolve, 1500));

        const destNum = calculateDestinyNumber(birthDate);
        const soulNum = calculateSoulNumber(name);
        const exprNum = calculateExpressionNumber(name);
        const pYear = calculatePersonalYear(birthDate);

        setDestiny({ number: destNum, ...getNumberInterpretation(destNum) });
        setSoul({ number: soulNum, ...getNumberInterpretation(soulNum) });
        setExpression({ number: exprNum, ...getNumberInterpretation(exprNum) });
        setPersonalYear(pYear);

        setShowResult(true);
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-mystic-950 text-slate-100 selection:bg-gold-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gold-900/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Sparkles className="w-4 h-4 text-gold-400" />
                        <span className="text-sm font-medium text-gold-200">Portal Místico</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gold-200 to-gold-400">
                        Calculadora Numerológica
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Descubra os números ocultos que regem sua alma, seu destino e seus talentos naturais.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-1 gap-12">
                    {/* Input Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
                    >
                        <form onSubmit={handleCalculate} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gold-200 uppercase tracking-wider ml-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Como na certidão de nascimento"
                                        className="w-full px-5 py-4 bg-mystic-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold-500/50 outline-none text-white placeholder:text-slate-600 transition-all font-serif text-lg"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gold-200 uppercase tracking-wider ml-1">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        required
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full px-5 py-4 bg-mystic-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-gold-500/50 outline-none text-white placeholder:text-slate-600 transition-all font-serif text-lg"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                className="w-full relative group overflow-hidden rounded-xl"
                            >
                                <ShimmerButton className="w-full py-5 text-lg font-bold">
                                    {loading ? 'Calculando Energias...' : 'Revelar Meu Mapa Numerológico'}
                                </ShimmerButton>
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Results Reveal */}
                    <AnimatePresence>
                        {showResult && destiny && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="space-y-8"
                            >
                                {/* Free Results Grid */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Destiny Card */}
                                    <ResultCard
                                        title="Número de Destino"
                                        number={destiny.number}
                                        subtitle={destiny.title}
                                        description={destiny.essence}
                                        delay={0}
                                    />
                                    {/* Soul Card */}
                                    <ResultCard
                                        title="Número da Alma"
                                        number={soul.number}
                                        subtitle={soul.title}
                                        description={soul.essence}
                                        delay={0.1}
                                    />
                                    {/* Expression Card */}
                                    <ResultCard
                                        title="Número de Expressão"
                                        number={expression.number}
                                        subtitle={expression.title}
                                        description={expression.strength}
                                        delay={0.2}
                                    />
                                </div>

                                {/* Premium Teaser (Blur) */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-b from-mystic-900 to-black p-1 text-center"
                                >
                                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>

                                    <div className="p-8 md:p-12 relative z-10">
                                        <div className="inline-flex p-3 rounded-full bg-gold-500/10 mb-6">
                                            <Lock className="w-8 h-8 text-gold-400" />
                                        </div>

                                        <h3 className="text-3xl font-serif font-bold text-white mb-4">
                                            Sua Previsão para 2026: Ano Pessoal {personalYear}
                                        </h3>

                                        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                                            Você descobriu sua essência, mas para onde ela está indo?
                                            Seu Ano Pessoal revela os desafios e oportunidades exatos dos próximos 12 meses.
                                        </p>

                                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                            <Link href="/leitura-premium" className="px-8 py-4 bg-gold-600 hover:bg-gold-500 text-white rounded-full font-bold transition-all shadow-[0_0_30px_-10px_rgba(234,179,8,0.5)] flex items-center gap-2">
                                                <Star className="w-5 h-5 fill-current" />
                                                Ver Previsão Completa no Clube
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </div>

                                        <p className="mt-6 text-sm text-slate-500">
                                            Acesso imediato • Leitura detalhada de ciclos
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}

function ResultCard({ title, number, subtitle, description, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="group hover:bg-white/10 transition-colors bg-white/5 border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50" />

            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">{title}</p>

            <div className="relative inline-block mb-4">
                <span className="text-6xl font-serif font-bold text-white">{number}</span>
                <div className="absolute -inset-4 bg-gold-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h3 className="text-lg font-bold text-gold-200 mb-2">{subtitle}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </motion.div>
    );
}
