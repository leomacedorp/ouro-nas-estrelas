"use client";

import Link from 'next/link';
import { ArrowRight, MessageCircle, Sparkles, Star } from 'lucide-react';
import ZodiacGrid from '@/components/ZodiacGrid';
import DailyRitual from '@/components/DailyRitual';
import { homeContent } from '@/lib/content/home';
import { siteConfig } from '@/lib/siteConfig';
import { Meteors } from '@/components/ui/meteors';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextReveal } from '@/components/ui/text-reveal';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      {/* ===== HERO EPIC ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Layered Background */}
        <div className="absolute inset-0 bg-mystic-950">
          {/* Gradient Orbs */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-950/40 blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gold-900/20 blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[100px]" />

          {/* Star Field Pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
                               radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
                               radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.4), transparent),
                               radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.3), transparent)`,
              backgroundSize: '200px 200px',
            }}
          />
        </div>

        {/* Meteors */}
        <Meteors number={15} className="z-0" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center px-4 py-20">
          {/* Brand Badge */}
          <BlurFade delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-sm text-gold-300 font-medium tracking-wide">Leituras Astrológicas Premium</span>
            </div>
          </BlurFade>

          {/* Main Title */}
          <BlurFade delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight">
              <span className="text-slate-100">Descubra o </span>
              <span className="gold-gradient-text text-glow">Ouro</span>
              <br />
              <span className="text-slate-100">nas </span>
              <span className="text-gold-400">Estrelas</span>
            </h1>
          </BlurFade>

          {/* Subtitle */}
          <BlurFade delay={0.4}>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Seu guia cósmico diário para desvendar{' '}
              <span className="text-gold-300">oportunidades ocultas</span>{' '}
              e navegar com clareza pelo seu destino.
            </p>
          </BlurFade>

          {/* CTA Buttons */}
          <BlurFade delay={0.6}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#signos">
                <ShimmerButton className="min-w-[200px]">
                  <Star className="w-5 h-5" />
                  Ver Meu Signo
                </ShimmerButton>
              </Link>

              <motion.a
                href={siteConfig.whatsapp.url()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg
                           bg-white/5 border border-white/20 text-slate-200
                           hover:bg-white/10 hover:border-gold-500/30 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 text-green-400" />
                Leitura Personalizada
              </motion.a>
            </div>
          </BlurFade>

          {/* Scroll Indicator */}
          <BlurFade delay={0.8}>
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <span className="text-xs uppercase tracking-widest">Explore</span>
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </motion.div>
          </BlurFade>
        </div>
      </section>

      {/* ===== DAILY RITUAL ===== */}
      <section className="relative py-24 bg-mystic-900/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-mystic-950 via-transparent to-mystic-950" />
        <div className="relative z-10">
          <DailyRitual />
        </div>
      </section>

      {/* ===== ZODIAC GRID ===== */}
      <div id="signos" className="border-t border-white/5 bg-mystic-950 relative z-20">
        <BlurFade>
          <ZodiacGrid />
        </BlurFade>
      </div>

      {/* ===== BENEFITS SECTION ===== */}
      <section className="py-24 bg-mystic-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 to-transparent" />

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
                  className="p-8 rounded-2xl glass card-hover group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center mb-6 group-hover:glow-pulse transition-all">
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
      <section className="py-24 bg-mystic-950 relative overflow-hidden">
        <Meteors number={8} className="opacity-30" />

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
                  className="p-6 rounded-xl glass card-hover"
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
        <div className="absolute inset-0 bg-gradient-to-t from-gold-900/30 via-mystic-900/50 to-mystic-950" />
        <Meteors number={10} className="opacity-50" />

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
                <MessageCircle className="w-6 h-6" />
                {homeContent.final_cta.button_text}
              </ShimmerButton>
            </Link>
          </BlurFade>
        </div>
      </section>
    </>
  );
}
