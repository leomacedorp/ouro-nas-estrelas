"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Star, Download, Share2, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { BlurFade } from '@/components/ui/blur-fade';
import { Meteors } from '@/components/ui/meteors';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { generatePremiumHoroscope, PremiumContent } from '@/lib/localPremiumTemplate';
import { siteConfig } from '@/lib/siteConfig';

export default function SucessoPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    // Estado
    const [selectedSign, setSelectedSign] = useState<string | null>(null);
    const [reading, setReading] = useState<PremiumContent | null>(null);
    const [isRevealing, setIsRevealing] = useState(false);

    // Efeito para simular carregamento da leitura
    const handleReveal = (signSlug: string) => {
        setIsRevealing(true);
        setSelectedSign(signSlug);

        // Simula um "download do cosmos"
        setTimeout(() => {
            const date = new Date().toISOString().split('T')[0];
            const result = generatePremiumHoroscope(signSlug, date);
            setReading(result);
            setIsRevealing(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-mystic-950 text-slate-200">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gold-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">

                {/* HEADLINE SUCESSO */}
                {!reading ? (
                    <div className="max-w-2xl mx-auto text-center">
                        <BlurFade delay={0}>
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/50 shadow-glow-green">
                                <CheckCircle2 className="w-10 h-10 text-green-400" />
                            </div>
                        </BlurFade>

                        <BlurFade delay={0.1}>
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                                Pagamento Confirmado!
                            </h1>
                        </BlurFade>

                        <BlurFade delay={0.2}>
                            <p className="text-lg text-slate-400 mb-12">
                                O universo recebeu sua troca de energia. Sua leitura premium está pronta para ser revelada. Escolha seu signo abaixo para acessar as 6 dimensões.
                            </p>
                        </BlurFade>

                        {/* SELETOR DE SIGNO */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {ZODIAC_SIGNS.map((sign) => (
                                <button
                                    key={sign.slug}
                                    onClick={() => handleReveal(sign.slug)}
                                    disabled={isRevealing}
                                    className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 group
                                        ${selectedSign === sign.slug
                                            ? 'bg-gold-500/20 border-gold-500 ring-2 ring-gold-500/50'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-gold-500/50'}
                                    `}
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{sign.symbol}</span>
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-gold-300">{sign.name}</span>
                                </button>
                            ))}
                        </div>

                        {isRevealing && (
                            <div className="mt-12 flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gold-300 font-serif animate-pulse">Consultando os astros...</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // RESULTADO DA LEITURA
                    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-1 rounded-full bg-gold-500/20 text-gold-300 text-sm font-bold mb-4 border border-gold-500/30">
                                LEITURA PREMIUM ATIVADA
                            </span>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                                Revelações para {ZODIAC_SIGNS.find(s => s.slug === selectedSign)?.name}
                            </h2>
                            <p className="text-slate-400">
                                Leitura válida para as próximas 24 horas.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            <ContentCard icon="❤️" title="Amor & Vínculos" content={reading.amor} delay={0.1} />
                            <ContentCard icon="💰" title="Dinheiro & Recursos" content={reading.dinheiro} delay={0.2} />
                            <ContentCard icon="🚀" title="Carreira & Missão" content={reading.carreira} delay={0.3} />
                            <ContentCard icon="🚧" title="O Grande Bloqueio" content={reading.bloqueio} isWarning delay={0.4} />
                            <ContentCard icon="💎" title="Ouro Escondido" content={reading.oportunidade} isGold delay={0.5} />
                            <ContentCard icon="🔮" title="Conselho Mágico" content={reading.conselho} isMystic delay={0.6} />
                        </div>

                        {/* FUTER DA ENTREGA */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                            <h3 className="text-xl font-bold text-white mb-4">Gostou da revelação?</h3>
                            <p className="text-slate-400 mb-6">
                                Essa energia muda a cada 24h. Para ter acesso a isso todos os dias, entre para o Clube.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link href={siteConfig.whatsapp.url(`Acabei de comprar a leitura de ${selectedSign} e adorei! Quero saber mais sobre o Clube.`)}>
                                    <ShimmerButton className="px-8 py-3">
                                        Quero Entrar no Clube
                                    </ShimmerButton>
                                </Link>
                                <button onClick={() => window.print()} className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center gap-2 transition-colors">
                                    <Download className="w-5 h-5" /> Salvar em PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ContentCard({ icon, title, content, isWarning, isGold, isMystic, delay }: any) {
    let borderColor = 'border-white/10';
    let bgColor = 'bg-white/5';
    let titleColor = 'text-slate-200';

    if (isWarning) {
        borderColor = 'border-red-500/30';
        bgColor = 'bg-red-950/20';
        titleColor = 'text-red-200';
    } else if (isGold) {
        borderColor = 'border-gold-500/30';
        bgColor = 'bg-gold-900/10';
        titleColor = 'text-gold-300';
    } else if (isMystic) {
        borderColor = 'border-purple-500/30';
        bgColor = 'bg-purple-900/10';
        titleColor = 'text-purple-300';
    }

    return (
        <BlurFade delay={delay}>
            <div className={`p-8 rounded-2xl border ${borderColor} ${bgColor} hover:border-opacity-50 transition-all h-full`}>
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{icon}</span>
                    <h3 className={`text-xl font-serif font-bold ${titleColor}`}>{title}</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-lg">
                    {content}
                </p>
            </div>
        </BlurFade>
    );
}
