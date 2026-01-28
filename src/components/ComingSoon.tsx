"use client";

import Link from 'next/link';
import { MessageCircle, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { BlurFade } from '@/components/ui/blur-fade';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Meteors } from '@/components/ui/meteors';

interface ComingSoonProps {
    title: string;
    subtitle: string;
    badge?: string;
    whatsappMessage?: string;
}

export default function ComingSoon({
    title,
    subtitle,
    badge = "Em Breve",
    whatsappMessage = "Olá! Gostaria de entrar na lista de espera."
}: ComingSoonProps) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
            {/* Background Effects (Overlay on Global BG) */}
            <div className="absolute inset-0 bg-gradient-to-b from-mystic-950/80 via-indigo-950/20 to-mystic-950/80" />

            <Meteors number={10} className="opacity-40" />

            <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                <BlurFade delay={0.1}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8 backdrop-blur-md">
                        <Clock className="w-4 h-4 text-gold-400 animate-pulse" />
                        <span className="text-sm text-gold-300 font-bold tracking-wide uppercase">{badge}</span>
                    </div>
                </BlurFade>

                <BlurFade delay={0.2}>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-slate-100">
                        {title}
                    </h1>
                </BlurFade>

                <BlurFade delay={0.3}>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </BlurFade>

                <BlurFade delay={0.4}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href={siteConfig.whatsapp.url(whatsappMessage)}>
                            <ShimmerButton className="text-lg px-8 py-4 font-bold min-w-[240px]">
                                <span className="flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    Entrar na Lista de Espera
                                </span>
                            </ShimmerButton>
                        </Link>

                        <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                            Voltar para o Início <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </BlurFade>
            </div>
        </div>
    );
}
