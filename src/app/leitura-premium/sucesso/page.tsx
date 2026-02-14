"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Star, Download, Share2, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { BlurFade } from '@/components/ui/blur-fade';
import { Meteors } from '@/components/ui/meteors';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { PremiumContent } from '@/lib/localPremiumTemplate';
import DownloadPDFButton from '@/components/DownloadPDFButton';
import { siteConfig } from '@/lib/siteConfig';

export default function SucessoPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    // Estado
    const [selectedSign, setSelectedSign] = useState<string | null>(null);
    const [reading, setReading] = useState<any>(null);
    const [isRevealing, setIsRevealing] = useState(false);

    // Dados para leitura premium simbólica
    const [customerName, setCustomerName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [isValidating, setIsValidating] = useState(true);
    const [isValidPurchase, setIsValidPurchase] = useState(false);

    useEffect(() => {
        async function validate() {
            if (!sessionId) {
                setIsValidPurchase(false);
                setIsValidating(false);
                return;
            }

            try {
                const res = await fetch('/api/stripe/validate-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId }),
                });
                const data = await res.json();
                setIsValidPurchase(Boolean(data.valid));
            } catch (e) {
                setIsValidPurchase(false);
            } finally {
                setIsValidating(false);
            }
        }

        validate();
    }, [sessionId]);

    const handleReveal = async (signSlug: string) => {
        if (!sessionId) return;

        if (!customerName.trim() || !birthDate.trim()) {
            alert('Preencha seu nome e sua data de nascimento para gerar a leitura premium personalizada.');
            return;
        }

        setIsRevealing(true);
        setSelectedSign(signSlug);

        try {
            const res = await fetch('/api/premium-reading/reveal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    signSlug,
                    name: customerName,
                    birthDate,
                    mode: 'full'
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert('Não foi possível validar seu pagamento. Se você acabou de pagar, aguarde 1 minuto e tente novamente.');
                setIsRevealing(false);
                return;
            }

            // Preferimos enviar o usuário para a página de leitura salva (mais estável no mobile)
            if (data.readingId && data.accessToken) {
                window.location.href = `/minha-leitura/${data.readingId}?t=${data.accessToken}`;
                return;
            }

            setReading(data.content);
        } catch (e) {
            alert('Erro ao gerar sua leitura. Tente novamente.');
        } finally {
            setIsRevealing(false);
        }
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
                {isValidating ? (
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="mt-12 flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gold-300 font-serif animate-pulse">Validando seu pagamento...</p>
                        </div>
                    </div>
                ) : !isValidPurchase ? (
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/50">
                            <Lock className="w-10 h-10 text-red-300" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Acesso não liberado</h1>
                        <p className="text-lg text-slate-400 mb-8">
                            Não encontramos um pagamento válido para esta sessão. Se você acabou de pagar, aguarde alguns instantes e recarregue.
                        </p>
                        <Link href="/leitura-premium" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <ArrowRight className="w-5 h-5" /> Voltar
                        </Link>
                    </div>
                ) : !reading ? (
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
                            <p className="text-lg text-slate-400 mb-8">
                                Para gerar sua leitura premium personalizada, preciso de 2 dados rápidos.
                            </p>
                        </BlurFade>

                        <div className="max-w-xl mx-auto mb-10 grid gap-4 text-left">
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Seu nome</label>
                                <input
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Ex.: Ana Clara"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Data de nascimento</label>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                                />
                                <p className="text-xs text-slate-500 mt-2">Usamos isso para numerologia e contexto simbólico (sem previsões de eventos).</p>
                            </div>
                        </div>

                        <BlurFade delay={0.25}>
                            <p className="text-lg text-slate-400 mb-12">
                                Agora escolha seu signo para revelar sua leitura.
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
                        <div id="premium-reading-content" className="p-4 bg-mystic-950">
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

                            <div className="text-center text-sm text-slate-500 pb-4">
                                Ouro Nas Estrelas — {new Date().getFullYear()}
                            </div>
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
                                <DownloadPDFButton targetId="premium-reading-content" fileName={`Leitura-${selectedSign}.pdf`} />
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
