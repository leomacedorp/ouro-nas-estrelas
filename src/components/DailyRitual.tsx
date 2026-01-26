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

            {/* Focus Selection Removed for Consistency (Single General Reading) */}
            <div className="mt-8 flex justify-center">
                <Link
                    href="#signos"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('signos')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors group text-lg"
                >
                    <span className="border-b border-transparent group-hover:border-gold-400 pb-0.5">
                        Ver a mensagem dos astros para hoje
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
