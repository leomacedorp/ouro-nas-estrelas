"use client";

import Link from 'next/link';
import { useState } from 'react';
import { MessageCircle, Sparkles, Star, Lock, Zap, Compass, ArrowRight, CheckCircle2, ShieldCheck, Gem } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { Meteors } from '@/components/ui/meteors';
import { BlurFade } from '@/components/ui/blur-fade';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { motion } from 'framer-motion';

// Variáveis de ambiente são injetadas no build para Client Components
const STRIPE_PRICE_SINGLE = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_SINGLE || '';
const STRIPE_PRICE_MONTHLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTHLY || '';

export default function LeituraPremiumPage() {
    // Debug: mostra se as variáveis estão configuradas
    console.log('[Stripe Config] Single:', STRIPE_PRICE_SINGLE ? 'OK' : 'MISSING');
    console.log('[Stripe Config] Monthly:', STRIPE_PRICE_MONTHLY ? 'OK' : 'MISSING');

    return (
        <div className="min-h-screen bg-mystic-950 text-slate-200 selection:bg-gold-500/30">

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-mystic-950">
                    <div className="absolute nebula-top-left nebula-size rounded-full bg-indigo-950/40 blur-nebula animate-pulse" />
                    <div className="absolute nebula-bottom-right nebula-size rounded-full bg-gold-900/10 blur-nebula" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
                </div>

                <Meteors number={15} className="opacity-30" />

                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <BlurFade delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8 backdrop-blur-md">
                            <Gem className="w-4 h-4 text-gold-400" />
                            <span className="text-sm text-gold-300 font-bold tracking-wide uppercase">Acesso Exclusivo</span>
                        </div>
                    </BlurFade>

                    <BlurFade delay={0.2}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight text-slate-100">
                            Pare de Adivinhar o Futuro.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">Comece a Criá-lo.</span>
                        </h1>
                    </BlurFade>

                    <BlurFade delay={0.3}>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Horóscopos de jornal são genéricos. Você precisa de um mapa de guerra.
                            Descubra o que está oculto nas suas finanças, relacionamentos e carreira hoje.
                        </p>
                    </BlurFade>

                    <BlurFade delay={0.4}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="#pricing">
                                    <ShimmerButton className="text-lg px-10 py-4 font-bold min-w-[240px]">
                                        Liberar Minha Leitura
                                    </ShimmerButton>
                                </Link>
                            </motion.div>
                            <p className="text-sm text-slate-500 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Garantia de 7 dias
                            </p>
                        </div>
                    </BlurFade>
                </div>
            </section>

            {/* ===== THE 6 LAYERS (PRODUCT BREAKDOWN) ===== */}
            <section className="py-24 bg-mystic-900/30 relative">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 mb-4">
                            O Que Você Recebe?
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Não é apenas um texto. É uma análise completa de <span className="text-gold-400 font-bold">6 dimensões</span> da sua vida.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <LayerCard
                            icon="❤️" title="Amor & Vínculos"
                            desc="O que está invisível na sua relação atual ou na sua busca. Não é sobre 'se vai dar certo', é sobre como fazer dar certo."
                        />
                        <LayerCard
                            icon="💰" title="Dinheiro & Recursos"
                            desc="Onde está a energia de prosperidade hoje. Pare de nadar contra a maré financeira e descubra o fluxo."
                        />
                        <LayerCard
                            icon="🚀" title="Carreira & Missão"
                            desc="A decisão estratégica para tomar nas próximas 24h. Liderança, foco e oportunidades profissionais."
                        />
                        <LayerCard
                            icon="🚧" title="O Grande Bloqueio"
                            desc="A armadilha mental que seu signo está propenso a cair hoje. Saber disso é evitar 80% dos problemas."
                        />
                        <LayerCard
                            icon="💎" title="Ouro Escondido"
                            desc="A oportunidade oculta que está na sua frente e você não está vendo por estar focado no problema errado."
                        />
                        <LayerCard
                            icon="🔮" title="Conselho Secreto"
                            desc="Uma frase mântrica personalizada (Afirmação de Poder) para alinhar sua vibração imediatamente."
                        />
                    </div>
                </div>
            </section>

            {/* ===== PRICING SECTION ===== */}
            <section id="pricing" className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-mystic-950 via-indigo-950/20 to-mystic-950" />

                <div className="container mx-auto px-4 relative z-10 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                            Escolha Seu Plano
                        </h2>
                        <p className="text-slate-400">
                            Invista em você menos do que custa um café por dia.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* PLANO ÚNICO */}
                        <PricingCard
                            title="Leitura Avulsa"
                            price="37"
                            period="/única"
                            features={[
                                "Leitura Completa (6 Dimensões)",
                                "Acesso Imediato",
                                "PDF para Download",
                                "Bônus: Ritual de Alinhamento"
                            ]}
                            buttonText="Comprar Apenas Uma"
                            isPopular={false}
                            priceId={STRIPE_PRICE_SINGLE}
                            link={siteConfig.whatsapp.url("Olá! Quero comprar a Leitura Avulsa por R$ 37.")}
                        />

                        {/* PLANO MENSAL (POPULAR) */}
                        <PricingCard
                            title="Clube das Estrelas"
                            price="97"
                            period="/mês"
                            features={[
                                "Leituras Premium ILIMITADAS",
                                "Todos os dias do mês",
                                "Acesso ao Grupo VIP",
                                "Desconto em Mapas ASTRAIS",
                                "Cancelamento a qualquer momento"
                            ]}
                            buttonText="Assinar e Economizar"
                            isPopular={true}
                            priceId={STRIPE_PRICE_MONTHLY}
                            link={siteConfig.whatsapp.url("Olá! Quero assinar o Clube das Estrelas por R$ 97/mês.")}
                        />
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="py-20 bg-mystic-900/20">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="text-2xl font-serif font-bold text-slate-200 mb-8">Dúvidas Frequentes</h2>
                    <div className="space-y-6 text-left">
                        <FaqItem q="Como recebo a leitura?" a="Imediatamente após a confirmação. Ela aparece na sua área de membros e também enviamos um resumo por WhatsApp." />
                        <FaqItem q="Serve para qualquer signo?" a="Sim! O sistema analisa seu signo solar (essência) e o trânsito planetário atual para gerar a leitura." />
                        <FaqItem q="Posso cancelar a assinatura?" a="Sim, a qualquer momento. Sem multas, sem letras miúdas. Você fica apenas se estiver vendo valor." />
                    </div>
                </div>
            </section>

        </div>
    );
}

function LayerCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
    return (
        <BlurFade>
            <div className="h-full p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/30 transition-all hover:-translate-y-1 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
                <h3 className="text-xl font-serif font-bold text-slate-100 mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </BlurFade>
    );
}

function PricingCard({ title, price, period, features, buttonText, isPopular, link, priceId }: any) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!priceId) return;

        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Erro ao iniciar pagamento. Tente novamente.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    // Botão unificado
    const ButtonColors = isPopular
        ? 'bg-gold-500 hover:bg-gold-400 text-mystic-950 shadow-glow-gold'
        : 'bg-white/10 hover:bg-white/20 text-white';

    const ButtonContent = loading ? (
        <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            Processando...
        </>
    ) : buttonText;

    return (
        <div className={`relative p-8 rounded-3xl border ${isPopular ? 'border-gold-500 bg-gold-900/10' : 'border-white/10 bg-white/5'} flex flex-col h-full`}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-500 text-mystic-950 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Mais Escolhido
                </div>
            )}

            <h3 className="text-xl font-medium text-slate-300 mb-2">{title}</h3>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-sm text-slate-500">R$</span>
                <span className="text-5xl font-bold text-slate-100">{price}</span>
                <span className="text-sm text-slate-500">{period}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feat: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${isPopular ? 'text-gold-400' : 'text-slate-500'}`} />
                        {feat}
                    </li>
                ))}
            </ul>

            {priceId ? (
                // Botão de API (Stripe)
                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${ButtonColors}`}>
                    {ButtonContent}
                </button>
            ) : (
                // Botão de Link (WhatsApp)
                <Link href={link} className="w-full">
                    <button className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${ButtonColors}`}>
                        {ButtonContent}
                    </button>
                </Link>
            )}
        </div>
    );
}

function FaqItem({ q, a }: { q: string, a: string }) {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h4 className="font-bold text-gold-300 mb-2">{q}</h4>
            <p className="text-slate-400 text-sm">{a}</p>
        </div>
    );
}
