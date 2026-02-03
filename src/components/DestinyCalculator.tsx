'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { calculateDestinyNumber, getNumberInterpretation } from '@/lib/numerology';
import { BlurFade } from '@/components/ui/blur-fade';
import { ShimmerButton } from '@/components/ui/shimmer-button';

export function DestinyCalculator() {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [result, setResult] = useState<{
        number: number;
        title: string;
        essence: string;
        mission: string;
    } | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleCalculate = () => {
        if (!name.trim() || !birthDate) return;

        setIsCalculating(true);

        // Pequeno delay para efeito visual
        setTimeout(() => {
            const destinyNumber = calculateDestinyNumber(birthDate);
            const interp = getNumberInterpretation(destinyNumber);

            setResult({
                number: destinyNumber,
                title: interp?.title || `Número ${destinyNumber}`,
                essence: interp?.essence || '',
                mission: interp?.mission || ''
            });
            setIsCalculating(false);
        }, 800);
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-xl mx-auto">

                    {!result ? (
                        // FORM STATE
                        <BlurFade>
                            <div className="p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-wider mb-4 border border-gold-500/30">
                                        <Sparkles className="w-3 h-3" />
                                        Gratuito
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-100 mb-3">
                                        Descubra seu Número do Destino
                                    </h2>
                                    <p className="text-slate-400 text-sm md:text-base">
                                        Seus números revelam talentos, ciclos e o caminho onde sua vida flui com mais força.
                                    </p>
                                </div>

                                {/* Form */}
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Seu nome completo"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/40 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/40 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={handleCalculate}
                                    disabled={!name.trim() || !birthDate || isCalculating}
                                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShimmerButton
                                        className={`w-full py-4 text-base font-bold ${(!name.trim() || !birthDate || isCalculating) ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        {isCalculating ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Calculando...
                                            </span>
                                        ) : (
                                            'Calcular meu destino agora'
                                        )}
                                    </ShimmerButton>
                                </button>

                                <p className="text-center text-xs text-slate-500 mt-4">
                                    Grátis • Resultado imediato • 100% pessoal
                                </p>
                            </div>
                        </BlurFade>
                    ) : (
                        // RESULT STATE
                        <BlurFade>
                            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-900/30 to-mystic-900/50 border border-gold-500/30 backdrop-blur-sm">
                                {/* Result Header */}
                                <div className="text-center mb-8">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gold-500/20 border-2 border-gold-500/50 flex items-center justify-center">
                                        <span className="text-5xl font-serif font-bold text-gold-300">{result.number}</span>
                                    </div>
                                    <p className="text-gold-400 text-sm uppercase tracking-wider mb-2">Seu Número do Destino</p>
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-100">
                                        {result.title}
                                    </h3>
                                </div>

                                {/* Interpretation */}
                                <div className="bg-white/5 rounded-xl p-6 mb-6">
                                    <p className="text-slate-300 leading-relaxed mb-4">
                                        {result.essence}
                                    </p>
                                    <p className="text-gold-300/90 text-sm italic">
                                        "{result.mission}"
                                    </p>
                                </div>

                                {/* Teaser */}
                                <div className="text-center mb-6">
                                    <p className="text-slate-400 text-sm mb-4">
                                        Mas isso é só a superfície. Sua leitura completa revela:
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-left text-sm">
                                        {[
                                            'Ciclos favoráveis para dinheiro',
                                            'Decisões profissionais críticas',
                                            'Bloqueios ocultos',
                                            'Oportunidades invisíveis'
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <Link href="/leitura-premium" className="block">
                                    <ShimmerButton className="w-full py-4 text-base font-bold">
                                        Desbloquear análise completa
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </ShimmerButton>
                                </Link>

                                <p className="text-center text-xs text-slate-500 mt-4">
                                    Mapa simbólico • Numerologia • Astros • Leitura exclusiva
                                </p>

                                {/* Reset */}
                                <button
                                    onClick={() => setResult(null)}
                                    className="w-full mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    Calcular outro número
                                </button>
                            </div>
                        </BlurFade>
                    )}
                </div>
            </div>
        </section>
    );
}
