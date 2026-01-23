"use client";

import Link from 'next/link';
import { MessageCircle, Sparkles, Star, Lock, Zap, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { Meteors } from '@/components/ui/meteors';
import { BlurFade } from '@/components/ui/blur-fade';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { motion } from 'framer-motion';

export default function LeituraPremiumPage() {
    const whatsappMessage = "Olá! Vim pelo site e quero receber minha Leitura Premium (Simbólica e Psicológica).";

    return (
        <div className="min-h-screen bg-mystic-950 text-slate-200 selection:bg-gold-500/30">

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-mystic-950">
                    <div className="absolute nebula-top-left nebula-size rounded-full bg-indigo-950/40 blur-nebula animate-pulse" />
                    <div className="absolute nebula-bottom-right nebula-size rounded-full bg-gold-900/10 blur-nebula" />
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.3), transparent),
                               radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.2), transparent)`,
                            backgroundSize: '150px 150px',
                        }}
                    />
                </div>

                <Meteors number={20} className="opacity-40" />

                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <BlurFade delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8">
                            <Sparkles className="w-4 h-4 text-gold-400" />
                            <span className="text-sm text-gold-300 font-medium tracking-wide uppercase">Leitura Simbólica Profunda</span>
                        </div>
                    </BlurFade>

                    <BlurFade delay={0.2}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 leading-tight text-slate-100">
                            Existe uma camada da sua jornada que os horóscopos comuns <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">jamais alcançam.</span>
                        </h1>
                    </BlurFade>

                    <BlurFade delay={0.4}>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                            A leitura que acabou de ser vista mostra apenas a superfície simbólica do momento.
                            Mas existe uma camada mais profunda, onde padrões emocionais, bloqueios invisíveis e oportunidades ocultas se revelam com clareza.
                        </p>
                    </BlurFade>

                    <BlurFade delay={0.6}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link href={siteConfig.whatsapp.url(whatsappMessage)}>
                                <ShimmerButton className="text-lg px-10 py-4 md:px-12 md:py-5 font-bold">
                                    <span className="flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 fill-current" />
                                        Quero Receber Minha Leitura Premium
                                    </span>
                                </ShimmerButton>
                            </Link>
                        </motion.div>
                        <p className="mt-4 text-xs text-slate-500 uppercase tracking-widest">
                            Acesso exclusivo via WhatsApp
                        </p>
                    </BlurFade>
                </div>
            </section>

            {/* ===== DIFFERENTIALS (WHY IT WORKS) ===== */}
            <section className="py-24 relative overflow-hidden bg-mystic-900/50">
                <div className="container mx-auto px-4 relative z-10">
                    <BlurFade>
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-100 mb-6">
                                A maioria das previsões fala sobre eventos. <br />
                                <span className="text-gold-400">Nós falamos sobre consciência.</span>
                            </h2>
                            <p className="text-slate-400 text-lg">
                                Nosso método não tenta adivinhar o futuro. Ele revela como a energia coletiva do período interage com a essência psicológica de cada signo.
                            </p>
                        </div>
                    </BlurFade>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-indigo-400" />}
                            title="Astrologia Simbólica"
                            description="Cada leitura considera o clima coletivo do período, a natureza psicológica do signo e o atrito entre essas duas forças."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Compass className="w-6 h-6 text-gold-400" />}
                            title="Interpretação Emocional"
                            description="O foco não é o que vai acontecer, mas como agir, sentir e se posicionar com mais consciência diante dos desafios."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<MessageCircle className="w-6 h-6 text-emerald-400" />}
                            title="Linguagem Humana"
                            description="Sem clichês, sem previsões vazias e sem frases genéricas. Uma conversa adulta sobre seus processos internos."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* ===== DELIVERABLES (WHAT'S INCLUDED) ===== */}
            <section className="py-24 relative bg-mystic-950">
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">

                        <BlurFade delay={0.2}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gold-500/10 blur-nebula-sm rounded-full" />
                                <div className="relative glass p-8 rounded-2xl border border-white/10">
                                    <div className="flex flex-col gap-6">
                                        <DeliverableItem
                                            text="Leitura simbólica aprofundada (PDF exclusivo)"
                                            sub="De 600 a 900 palavras de análise profunda"
                                        />
                                        <DeliverableItem
                                            text="Áudio guiado com interpretação"
                                            sub="Para ouvir e integrar a mensagem no seu ritmo"
                                        />
                                        <DeliverableItem
                                            text="Ritual simbólico de alinhamento"
                                            sub="Prática real para sintonizar sua energia"
                                        />
                                    </div>
                                </div>
                            </div>
                        </BlurFade>

                        <BlurFade delay={0.4}>
                            <div className="space-y-8">
                                <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 leading-tight">
                                    O que torna essa leitura <span className="text-gold-400">única?</span>
                                </h3>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    Quando compreendemos o que se move dentro, as decisões se tornam mais conscientes.
                                    Quando reconhecemos padrões invisíveis, escolhas deixam de ser impulsivas.
                                </p>
                                <div className="p-6 bg-gold-900/10 border-l-2 border-gold-500 rounded-r-xl">
                                    <p className="text-gold-200 italic font-medium">
                                        "Essa leitura não prevê destinos. Ela oferece consciência para escolher melhor."
                                    </p>
                                </div>

                                <Link href={siteConfig.whatsapp.url(whatsappMessage)}>
                                    <button className="flex items-center gap-3 text-white bg-gold-600 hover:bg-gold-500 px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-gold-500/20 group">
                                        <MessageCircle className="w-5 h-5 fill-white/20" />
                                        Quero Receber Agora
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </BlurFade>

                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA ===== */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gold-900/20 to-mystic-950" />
                <Meteors number={15} />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <BlurFade>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                            Sua jornada de consciência começa agora.
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg">
                            Toque no botão abaixo para iniciar sua conversa no WhatsApp.
                        </p>

                        <Link href={siteConfig.whatsapp.url(whatsappMessage)}>
                            <ShimmerButton className="text-xl px-12 py-5">
                                <span className="flex items-center gap-2">
                                    <MessageCircle className="w-6 h-6" />
                                    Iniciar Leitura Premium
                                </span>
                            </ShimmerButton>
                        </Link>
                    </BlurFade>
                </div>
            </section>

        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <BlurFade delay={delay}>
            <div className="h-full p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-mystic-950 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-100 mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{description}</p>
            </div>
        </BlurFade>
    );
}

function DeliverableItem({ text, sub }: { text: string, sub: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 w-6 h-6 flex-shrink-0 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
                <h4 className="text-lg font-semibold text-slate-200">{text}</h4>
                <p className="text-sm text-slate-500">{sub}</p>
            </div>
        </div>
    );
}
