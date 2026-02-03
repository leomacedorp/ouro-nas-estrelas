"use client";

import Link from 'next/link';
import { MessageCircle, Sparkles, Star } from 'lucide-react';
import { homeContent } from '@/lib/content/home';
import { siteConfig } from '@/lib/siteConfig';
import { motion } from 'framer-motion';
import CelestialWheel from '@/components/CelestialWheel';
import ZodiacGrid from '@/components/ZodiacGrid';
import DailyRitual from '@/components/DailyRitual';
import { DayNumberBanner } from '@/components/DayNumberBanner';
import { DestinyCalculator } from '@/components/DestinyCalculator';
import { BlurFade } from '@/components/ui/blur-fade';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { TextReveal } from '@/components/ui/text-reveal';

interface HomeClientProps {
    settings: Record<string, any>;
}

export default function HomeClient({ settings }: HomeClientProps) {
    // Usar settings do banco, com fallback para homeContent
    const heroHeadline = settings.hero_headline || 'Descubra o Ouro nas Estrelas';
    const heroDescription = settings.hero_description || homeContent.hero.description;
    const heroCTAText = settings.hero_cta_text || 'Ver Meu Signo';
    const heroCTALink = settings.hero_cta_link || '#signos';

    return (
        <>
            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

                        {/* Left Col: Text Content */}
                        <div className="flex-1 text-center lg:text-left max-w-2xl lg:pl-8">
                            <BlurFade delay={0.1}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                                    <Sparkles className="w-4 h-4 text-gold-400" />
                                    <span className="text-sm text-gold-300 font-medium tracking-wide uppercase">Portal de Astrologia</span>
                                </div>
                            </BlurFade>

                            <BlurFade delay={0.2}>
                                <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                                    <span className="text-slate-100">Descubra o </span>
                                    <span className="gold-gradient-text">Ouro</span>
                                    <br />
                                    <span className="text-slate-100">nas Estrelas</span>
                                </h1>
                            </BlurFade>

                            <BlurFade delay={0.4}>
                                <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                    {heroDescription}
                                </p>
                            </BlurFade>

                            <BlurFade delay={0.6}>
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                    <Link href={heroCTALink}>
                                        <ShimmerButton className="min-w-[200px] h-14 text-base font-bold">
                                            <Star className="w-5 h-5 mr-2" />
                                            {heroCTAText}
                                        </ShimmerButton>
                                    </Link>

                                    <motion.a
                                        href={siteConfig.whatsapp.url()}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-center gap-2 h-14 px-8 rounded-full font-bold text-base bg-white/5 border border-white/10 text-slate-200 backdrop-blur-sm hover:bg-white/10 hover:border-gold-500/30 hover:text-gold-200 transition-all duration-300"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Leitura Personalizada
                                    </motion.a>
                                </div>
                            </BlurFade>
                        </div>

                        {/* Right Col: Celestial Wheel */}
                        <div className="flex-1 w-full max-w-[600px] lg:max-w-full relative flex items-center justify-center">
                            <BlurFade delay={0.4} className="w-full flex justify-center">
                                <CelestialWheel />
                            </BlurFade>
                        </div>

                    </div>
                </div>
            </section>

            {/* ===== DAY NUMBER BANNER (Numerology) ===== */}
            <DayNumberBanner />

            {/* ===== DAILY RITUAL ===== */}
            <section className="relative py-24 bg-mystic-900/50 overflow-hidden">
                <div className="relative z-10">
                    <DailyRitual dailyEnergyPackage={settings.daily_energy_package} />
                </div>
            </section>

            {/* ===== ZODIAC GRID ===== */}
            <div id="signos" className="border-t border-white/5 bg-transparent relative">
                <div className="relative z-10">
                    <BlurFade>
                        <ZodiacGrid />
                    </BlurFade>
                </div>
            </div>

            {/* ===== DESTINY CALCULATOR (Lead Magnet) ===== */}
            <DestinyCalculator />

            {/* ===== BENEFITS SECTION ===== */}
            <section className="py-24 bg-transparent relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <BlurFade>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 mb-4 text-glow">
                                {homeContent.benefits.title}
                            </h2>
                            <p className="text-slate-400 text-lg max-w-xl mx-auto">
                                {homeContent.benefits.subtitle}
                            </p>
                        </div>
                    </BlurFade>

                    <div className="grid md:grid-cols-3 gap-8">
                        {homeContent.benefits.cards.map((card, idx) => (
                            <BlurFade key={idx} delay={0.1 * (idx + 1)}>
                                <motion.div
                                    className="p-8 rounded-2xl glass group"
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center mb-6">
                                        <Sparkles className="w-6 h-6 text-gold-400" />
                                    </div>
                                    <h3 className="text-xl font-serif font-semibold text-gold-400 mb-3">
                                        {card.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {card.description}
                                    </p>
                                </motion.div>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="py-24 bg-transparent relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <BlurFade>
                        <h2 className="text-2xl md:text-4xl font-serif font-bold text-center text-slate-200 mb-12">
                            {homeContent.testimonials.title}
                        </h2>
                    </BlurFade>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {homeContent.testimonials.items.map((item, idx) => (
                            <BlurFade key={idx} delay={0.1 * (idx + 1)}>
                                <motion.div
                                    className="p-6 rounded-xl glass"
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <p className="text-slate-300 italic text-sm mb-4 leading-relaxed">
                                        "{item.text}"
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
                                            <Star className="w-4 h-4 text-gold-400" />
                                        </div>
                                        <p className="text-gold-500 text-xs font-bold uppercase tracking-wider">
                                            {item.author} • {item.sign}
                                        </p>
                                    </div>
                                </motion.div>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA ===== */}
            <section className="py-32 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <BlurFade>
                        <TextReveal
                            text={homeContent.final_cta.title}
                            className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-100 mb-6 text-glow"
                        />
                    </BlurFade>

                    <BlurFade delay={0.3}>
                        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                            {homeContent.final_cta.description}
                        </p>
                    </BlurFade>

                    <BlurFade delay={0.5}>
                        <Link href={siteConfig.whatsapp.url()}>
                            <ShimmerButton className="text-xl px-12 py-5">
                                <MessageCircle className="w-6 h-6 mr-2" />
                                {homeContent.final_cta.button_text}
                            </ShimmerButton>
                        </Link>
                    </BlurFade>
                </div>
            </section>
        </>
    );
}
