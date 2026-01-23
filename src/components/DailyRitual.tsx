"use client";

import { useState, useEffect } from 'react';
import { ArrowRight, Heart, Wallet, Briefcase, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getTodayBrazilFormatted } from '@/lib/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';

// Mapeamento para os focos do sistema
const FOCUSES = {
    amor: { label: 'Amor', icon: Heart, param: 'amor', description: 'Relacionamentos e conexões emocionais', color: 'rose' },
    dinheiro: { label: 'Dinheiro', icon: Wallet, param: 'dinheiro', description: 'Finanças e prosperidade material', color: 'emerald' },
    carreira: { label: 'Carreira', icon: Briefcase, param: 'carreira', description: 'Trabalho e crescimento profissional', color: 'blue' }
} as const;

type FocusType = keyof typeof FOCUSES | null;

export default function DailyRitual() {
    const [focus, setFocus] = useState<FocusType>(null);
    const [mounted, setMounted] = useState(false);
    const [todayDate, setTodayDate] = useState('');

    useEffect(() => {
        setMounted(true);
        setTodayDate(getTodayBrazilFormatted('medium'));
        const saved = localStorage.getItem('daily_focus') as FocusType;
        if (saved && saved in FOCUSES) {
            setFocus(saved);
        } else {
            setFocus('amor');
            localStorage.setItem('daily_focus', 'amor');
        }
    }, []);

    const handleFocusSelect = (selected: FocusType) => {
        setFocus(selected);
        localStorage.setItem('daily_focus', selected || '');
        if (selected) {
            document.getElementById('signos')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!mounted) return null;

    return (
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center px-4">
            {/* Daily State Quote */}
            <BlurFade delay={0.1}>
                <div className="mb-12">
                    <motion.div
                        className="inline-block border-y border-gold-500/30 py-3 px-8 mb-6"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <p className="font-serif text-xl md:text-2xl text-gold-200 tracking-wide italic">
                            "Hoje o silêncio fala mais alto que o movimento."
                        </p>
                    </motion.div>
                    <p className="text-slate-400 text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold-500" />
                        Estado do Dia • {todayDate}
                        <Sparkles className="w-4 h-4 text-gold-500" />
                    </p>
                </div>
            </BlurFade>

            {/* Focus Selection Card */}
            <BlurFade delay={0.3}>
                <motion.div
                    className="glass p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden"
                    whileHover={{ boxShadow: "0 0 60px rgba(245, 158, 11, 0.1)" }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <h2 className="text-2xl md:text-3xl font-serif text-slate-100 mb-8 relative z-10">
                        O que você busca clareza hoje?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-4 relative z-10">
                        {(['amor', 'dinheiro', 'carreira'] as const).map((focusKey, idx) => {
                            const focusData = FOCUSES[focusKey];
                            const Icon = focusData.icon;
                            const isSelected = focus === focusKey;

                            const colorClasses = {
                                amor: {
                                    selected: "bg-rose-600/20 border-rose-500 text-rose-200 glow-pulse",
                                    default: "bg-white/5 border-white/10 text-slate-400 hover:bg-rose-900/20 hover:border-rose-500/50 hover:text-rose-200"
                                },
                                dinheiro: {
                                    selected: "bg-emerald-600/20 border-emerald-500 text-emerald-200 glow-pulse",
                                    default: "bg-white/5 border-white/10 text-slate-400 hover:bg-emerald-900/20 hover:border-emerald-500/50 hover:text-emerald-200"
                                },
                                carreira: {
                                    selected: "bg-blue-600/20 border-blue-500 text-blue-200 glow-pulse",
                                    default: "bg-white/5 border-white/10 text-slate-400 hover:bg-blue-900/20 hover:border-blue-500/50 hover:text-blue-200"
                                }
                            };

                            const iconColors = {
                                amor: isSelected ? "text-rose-400" : "text-slate-500 group-hover/btn:text-rose-400",
                                dinheiro: isSelected ? "text-emerald-400" : "text-slate-500 group-hover/btn:text-emerald-400",
                                carreira: isSelected ? "text-blue-400" : "text-slate-500 group-hover/btn:text-blue-400"
                            };

                            return (
                                <motion.button
                                    key={focusKey}
                                    onClick={() => handleFocusSelect(focusKey)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * (idx + 1), duration: 0.5 }}
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        "p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 group/btn relative overflow-hidden",
                                        isSelected ? colorClasses[focusKey].selected : colorClasses[focusKey].default
                                    )}
                                >
                                    {/* Selected indicator glow */}
                                    {isSelected && (
                                        <motion.div
                                            className="absolute inset-0 opacity-20"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.2 }}
                                            layoutId="focus-glow"
                                        />
                                    )}

                                    <Icon className={cn("w-7 h-7 transition-all duration-300", iconColors[focusKey])} />
                                    <span className="font-medium tracking-wide text-lg">{focusData.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Selected Focus Info */}
                    <AnimatePresence mode="wait">
                        {focus && (
                            <motion.div
                                key={focus}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="mt-8"
                            >
                                <p className="text-gold-300 text-sm mb-3 flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                                    Foco definido: <span className="font-semibold text-white">{FOCUSES[focus].label}</span>
                                </p>
                                <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
                                    {FOCUSES[focus].description}. Escolha seu signo para ver a leitura personalizada.
                                </p>
                                <Link
                                    href="#signos"
                                    className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors group"
                                >
                                    <span className="border-b border-transparent group-hover:border-gold-400 pb-0.5">
                                        Escolha seu signo para revelar
                                    </span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </BlurFade>
        </div>
    );
}
