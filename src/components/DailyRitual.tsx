"use client";

import { useState, useEffect } from 'react';
import { ArrowRight, Heart, Wallet, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getTodayBrazilFormatted } from '@/lib/dateUtils';

// Mapeamento para os novos focos do sistema
const FOCUSES = {
    amor: { label: 'Amor', icon: Heart, param: 'amor', description: 'Relacionamentos e conexões emocionais' },
    dinheiro: { label: 'Dinheiro', icon: Wallet, param: 'dinheiro', description: 'Finanças e prosperidade material' },
    carreira: { label: 'Carreira', icon: Briefcase, param: 'carreira', description: 'Trabalho e crescimento profissional' }
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
        // Default to 'amor' if nothing saved or if saved value is invalid
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
        // Smooth scroll to zodiac grid if selected
        if (selected) {
            document.getElementById('signos')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!mounted) return null;

    return (
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center px-4 animate-in fade-in zoom-in duration-1000">

            {/* 1) DAILY STATE ("Estado do Dia") */}
            <div className="mb-12">
                <div className="inline-block border-y border-gold-500/30 py-2 px-6 mb-6">
                    <p className="font-serif text-xl md:text-2xl text-gold-200 tracking-wide italic">
                        "Hoje o silêncio fala mais alto que o movimento."
                    </p>
                </div>
                <p className="text-slate-400 text-sm uppercase tracking-[0.2em]">
                    Estado do Dia &bull; {todayDate}
                </p>
            </div>

            {/* 2) FOCUS SELECTION */}
            <div className="bg-mystic-900/50 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <h2 className="text-2xl md:text-3xl font-serif text-slate-100 mb-8 relative z-10">
                    O que você busca clareza hoje?
                </h2>

                <div className="grid md:grid-cols-3 gap-4 relative z-10">
                    {(['amor', 'dinheiro', 'carreira'] as const).map((focusKey) => {
                        const focusData = FOCUSES[focusKey];
                        const Icon = focusData.icon;
                        const isSelected = focus === focusKey;

                        const colorClasses = {
                            amor: isSelected
                                ? "bg-rose-600/20 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-rose-900/20 hover:border-rose-500/30 hover:text-rose-200",
                            dinheiro: isSelected
                                ? "bg-emerald-600/20 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-emerald-900/20 hover:border-emerald-500/30 hover:text-emerald-200",
                            carreira: isSelected
                                ? "bg-blue-600/20 border-blue-500 text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-blue-900/20 hover:border-blue-500/30 hover:text-blue-200"
                        };

                        const iconColors = {
                            amor: isSelected ? "text-rose-400" : "text-slate-500 group-hover/btn:text-rose-400",
                            dinheiro: isSelected ? "text-emerald-400" : "text-slate-500 group-hover/btn:text-emerald-400",
                            carreira: isSelected ? "text-blue-400" : "text-slate-500 group-hover/btn:text-blue-400"
                        };

                        return (
                            <button
                                key={focusKey}
                                onClick={() => handleFocusSelect(focusKey)}
                                className={cn(
                                    "p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 group/btn",
                                    colorClasses[focusKey]
                                )}
                            >
                                <Icon className={cn("w-6 h-6", iconColors[focusKey])} />
                                <span className="font-medium tracking-wide">{focusData.label}</span>
                            </button>
                        );
                    })}
                </div>

                {focus && (
                    <div className="mt-8 animate-in fade-in slide-in-from-top-2">
                        <p className="text-gold-300 text-sm mb-4">
                            Foco definido: <span className="font-semibold text-white">{FOCUSES[focus].label}</span>
                        </p>
                        <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
                            {FOCUSES[focus].description}. Escolha seu signo para ver a leitura personalizada.
                        </p>
                        <Link
                            href="#signos"
                            className="inline-flex items-center gap-2 text-slate-300 hover:text-gold-400 transition-colors border-b border-transparent hover:border-gold-400 pb-0.5"
                        >
                            Escolha seu signo para revelar <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
