"use client";

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Sun, Moon, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type FocusType = 'Direção' | 'Prosperidade' | 'Vínculos' | null;

export default function DailyRitual() {
    const [focus, setFocus] = useState<FocusType>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('daily_focus') as FocusType;
        if (saved) setFocus(saved);
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
                    Estado do Dia &bull; {new Date().toLocaleDateString('pt-BR')}
                </p>
            </div>

            {/* 2) FOCUS SELECTION */}
            <div className="bg-mystic-900/50 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <h2 className="text-2xl md:text-3xl font-serif text-slate-100 mb-8 relative z-10">
                    O que você busca clareza hoje?
                </h2>

                <div className="grid md:grid-cols-3 gap-4 relative z-10">
                    <button
                        onClick={() => handleFocusSelect('Direção')}
                        className={cn(
                            "p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 group/btn",
                            focus === 'Direção'
                                ? "bg-gold-600/20 border-gold-500 text-gold-200 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-gold-500/30 hover:text-slate-200"
                        )}
                    >
                        <Sun className={cn("w-6 h-6", focus === 'Direção' ? "text-gold-400" : "text-slate-500 group-hover/btn:text-gold-400")} />
                        <span className="font-medium tracking-wide">Direção</span>
                    </button>

                    <button
                        onClick={() => handleFocusSelect('Prosperidade')}
                        className={cn(
                            "p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 group/btn",
                            focus === 'Prosperidade'
                                ? "bg-gold-600/20 border-gold-500 text-gold-200 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-gold-500/30 hover:text-slate-200"
                        )}
                    >
                        <Zap className={cn("w-6 h-6", focus === 'Prosperidade' ? "text-gold-400" : "text-slate-500 group-hover/btn:text-gold-400")} />
                        <span className="font-medium tracking-wide">Prosperidade</span>
                    </button>

                    <button
                        onClick={() => handleFocusSelect('Vínculos')}
                        className={cn(
                            "p-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3 group/btn",
                            focus === 'Vínculos'
                                ? "bg-gold-600/20 border-gold-500 text-gold-200 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-gold-500/30 hover:text-slate-200"
                        )}
                    >
                        <Shield className={cn("w-6 h-6", focus === 'Vínculos' ? "text-gold-400" : "text-slate-500 group-hover/btn:text-gold-400")} />
                        <span className="font-medium tracking-wide">Vínculos</span>
                    </button>
                </div>

                {focus && (
                    <div className="mt-8 animate-in fade-in slide-in-from-top-2">
                        <p className="text-gold-300 text-sm mb-4">Foco definido: <span className="font-semibold text-white">{focus}</span></p>
                        <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
                            Sua leitura será ajustada para revelar o que está oculto nesta área.
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
