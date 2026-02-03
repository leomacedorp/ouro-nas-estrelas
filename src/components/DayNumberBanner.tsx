'use client';

import { getUniversalDayMessage } from '@/lib/numerology';
import { Sparkles } from 'lucide-react';

interface DayNumberBannerProps {
    className?: string;
}

export function DayNumberBanner({ className = '' }: DayNumberBannerProps) {
    // Calcular número universal do dia
    const dayInfo = getUniversalDayMessage();

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div className="bg-gradient-to-r from-indigo-900/40 via-mystic-900/60 to-indigo-900/40 border-y border-gold-500/20">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
                        {/* Número */}
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-gold-400" />
                            <span className="text-gold-400 font-bold text-sm uppercase tracking-wider">
                                Dia {dayInfo.number}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-300 font-medium">
                                {dayInfo.title}
                            </span>
                        </div>

                        {/* Tema/Conselho */}
                        <div className="hidden sm:block text-slate-400 text-sm">
                            {dayInfo.theme}
                        </div>

                        {/* Conselho mobile */}
                        <div className="sm:hidden text-slate-400 text-xs max-w-xs">
                            {dayInfo.advice}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
