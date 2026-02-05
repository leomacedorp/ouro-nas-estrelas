"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
    const searchParams = useSearchParams();
    const foco = (searchParams.get('foco') || '').toLowerCase();
    const focus: 'amor' | 'dinheiro' | 'carreira' | 'geral' =
        foco === 'amor' || foco === 'dinheiro' || foco === 'carreira' ? (foco as any) : 'geral';

    const [acceptedSymbolicTerms, setAcceptedSymbolicTerms] = useState(false);

    // Mobile fix: evitar jump estranho do hash antes de carregar.
    // Quando vier com foco (amor/dinheiro/carreira), fazemos scroll para pricing depois do render.
    useEffect(() => {
        if (focus === 'geral') return;

        const scrollToPricing = () => {
            const el = document.getElementById('pricing');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        // Aguarda layout/hydration
        const t = window.setTimeout(scrollToPricing, 200);
        return () => window.clearTimeout(t);
    }, [focus]);

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
                        <p className="text-lg md:text-xl text-slate-400 mb-4 leading-relaxed max-w-2xl mx-auto">
                            Horóscopos de jornal são genéricos. Você precisa de um mapa de guerra.
                            Descubra o que está oculto nas suas finanças, relacionamentos e carreira hoje.
                        </p>
                        {focus !== 'geral' ? (
                            <p className="text-sm text-gold-300/90 font-medium mb-6">
                                Foco selecionado: <span className="text-gold-200 uppercase tracking-widest">{focus}</span>
                            </p>
                        ) : null}
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

            {/* ===== THE 7 DIMENSIONS (PRODUCT BREAKDOWN) ===== */}
            <section className="py-24 bg-mystic-900/30 relative">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 mb-4">
                            Sua vida, revelada em <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">7 dimensões</span> decisivas
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Não é um horóscopo. É um <span className="text-gold-400 font-bold">diagnóstico estratégico</span> para enxergar oportunidades, evitar erros e agir com clareza.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <LayerCard
                            icon="❤️" title="Amor & Vínculos"
                            desc="Entenda o que está invisível nas suas relações e fortaleça conexões com mais segurança emocional."
                        />
                        <LayerCard
                            icon="💰" title="Dinheiro & Recursos"
                            desc="Descubra onde o dinheiro está fluindo — e como aproveitar o momento certo para prosperar."
                        />
                        <LayerCard
                            icon="🚀" title="Carreira & Missão"
                            desc="Clareza para decisões profissionais e movimentos que aceleram seu crescimento."
                        />
                        <LayerCard
                            icon="🚧" title="O Grande Bloqueio"
                            desc="Identifique o padrão que mais atrasa sua vida hoje — e elimine antes que vire prejuízo."
                        />
                        <LayerCard
                            icon="💎" title="Ouro Escondido"
                            desc="A oportunidade que está diante de você, mas que poucos conseguem enxergar."
                        />
                        <LayerCard
                            icon="✨" title="Conselho Estratégico"
                            desc="A orientação direta e personalizada para o próximo passo da sua jornada."
                        />
                        {/* 7th DIMENSION - THE CROWN JEWEL */}
                        <div className="md:col-span-2 lg:col-span-3">
                            <BlurFade>
                                <div className="p-8 rounded-2xl bg-gradient-to-br from-gold-900/20 to-indigo-900/20 border border-gold-500/30 hover:border-gold-500/50 transition-all group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-wider border border-gold-500/30">
                                            Exclusivo
                                        </span>
                                    </div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                        <div className="text-6xl group-hover:scale-110 transition-transform">🔢</div>
                                        <div className="text-center md:text-left flex-1">
                                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-gold-300 mb-3">
                                                Código do Destino <span className="text-slate-400 text-lg font-normal">(Numerologia)</span>
                                            </h3>
                                            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                                                Seus números revelam talentos, ciclos e o caminho onde sua vida flui com mais força.
                                                <span className="text-gold-400 font-medium"> Use sua assinatura numérica para tomar decisões no momento certo.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </BlurFade>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PRICING SECTION ===== */}
            <section id="pricing" className="py-24 relative overflow-hidden scroll-mt-24">
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

                    <div className="mb-8 max-w-3xl mx-auto">
                        <label className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <input
                                type="checkbox"
                                checked={acceptedSymbolicTerms}
                                onChange={(e) => setAcceptedSymbolicTerms(e.target.checked)}
                                className="mt-1 h-5 w-5 accent-gold-500"
                            />
                            <span className="text-sm text-slate-300 leading-relaxed">
                                Entendi que esta leitura é simbólica, feita para orientação e reflexão.
                            </span>
                        </label>
                        <p className="mt-2 text-xs text-slate-500">
                            Para continuar para o pagamento, marque a confirmação acima.
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
                            focus={focus}
                            acceptedSymbolicTerms={acceptedSymbolicTerms}
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
                            focus={focus}
                            acceptedSymbolicTerms={acceptedSymbolicTerms}
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

function PricingCard({ title, price, period, features, buttonText, isPopular, link, priceId, focus, acceptedSymbolicTerms }: any) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!priceId) return;
        if (!acceptedSymbolicTerms) {
            alert('Confirme a leitura simbólica para continuar.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    // fallback: o backend também tenta inferir o mode
                    mode: isPopular ? 'subscription' : 'payment',
                    focus,
                    acceptedSymbolicTerms: Boolean(acceptedSymbolicTerms),
                }),
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
                    disabled={loading || !acceptedSymbolicTerms}
                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${ButtonColors} ${(!acceptedSymbolicTerms || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    {ButtonContent}
                </button>
            ) : (
                // Botão de Link (WhatsApp)
                <button
                    disabled={loading || !acceptedSymbolicTerms}
                    onClick={() => {
                        if (!acceptedSymbolicTerms) {
                            alert('Confirme a leitura simbólica para continuar.');
                            return;
                        }
                        window.location.href = link;
                    }}
                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${ButtonColors} ${(!acceptedSymbolicTerms || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}>
                >
                    {ButtonContent}
                </button>
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
