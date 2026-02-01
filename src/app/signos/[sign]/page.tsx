import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { Sparkles, Calendar, ArrowLeft, MessageCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getTodayBrazil, formatDateBrazil } from '@/lib/dateUtils';
import { generateLocalHoroscope } from '@/lib/localTemplate';
import { getSettings } from '@/lib/cms/getSettings';
import { SIGN_GUIDES } from '@/lib/content/signGuides';

// ISR: atualiza periodicamente (suficiente pro “do dia” e bom pra SEO)
export const revalidate = 21600; // 6h

// Helper to get sign data
function getSign(slug: string) {
    return ZODIAC_SIGNS.find(s => s.slug === slug);
}

// Mensagem de fallback
const FALLBACK_MESSAGE = "A energia cósmica está em alinhamento especial neste momento. As estrelas preparam uma mensagem única para este signo. Em breve, uma leitura completa estará disponível com insights personalizados para o seu dia.";

// Fetch horoscope data (Mensagem do Dia)
async function getHoroscope(sign: string) {
    const today = getTodayBrazil();

    // Pacote do dia (IA 1x/dia) — melhora a sensação de "hoje" mesmo no fallback local.
    const settings = await getSettings(['daily_energy_package']);
    const dailyEnergyPackage = settings.daily_energy_package;

    // Por enquanto, a mensagem do dia vem do gerador local (determinístico por data+signo).
    // Como a página tem ISR (6h), o conteúdo é estável o suficiente para SEO.
    const localResult = generateLocalHoroscope({
        sign,
        focus: 'geral',
        dateBr: today,
        dailyEnergyPackage
    });

    return {
        message: localResult.message,
        date: today,
        sign
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { sign: slug } = await params;
    const signData = getSign(slug);

    if (!signData) return {};

    const guide = SIGN_GUIDES[slug];
    const title = `Horóscopo de ${signData.name} hoje + Guia completo do signo`;
    const description = guide
        ? `${guide.headline}. Veja características de ${signData.name}, amor, trabalho e dinheiro — e a mensagem do dia.`
        : `Veja o guia de ${signData.name} (amor, trabalho, dinheiro) e a mensagem do dia.`;

    return {
        title,
        description,
        alternates: { canonical: `/signos/${slug}` },
        openGraph: { title, description, url: `/signos/${slug}` },
        twitter: { title, description }
    };
}

export async function generateStaticParams() {
    return ZODIAC_SIGNS.map((sign) => ({
        sign: sign.slug,
    }));
}

interface PageProps {
    params: Promise<{ sign: string }>;
}

function jsonLdScript(data: unknown) {
    return (
        <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export default async function SignPage({ params }: PageProps) {
    const { sign: slug } = await params;
    const signData = getSign(slug);

    if (!signData) {
        notFound();
    }

    const horoscope = await getHoroscope(slug);
    const guide = SIGN_GUIDES[slug];

    const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://ouro-nas-estrelas-6sig.vercel.app').replace(/\/$/, '');
    const canonical = `${base}/signos/${slug}`;

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: `${base}/` },
            { '@type': 'ListItem', position: 2, name: 'Signos', item: `${base}/signos` },
            { '@type': 'ListItem', position: 3, name: signData.name, item: canonical },
        ],
    };

    const faqLd = guide
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: guide.faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
        }
        : null;

    return (
        <div className="min-h-screen pb-20 bg-mystic-950 text-slate-200">
            {jsonLdScript(breadcrumbLd)}
            {faqLd ? jsonLdScript(faqLd) : null}
            {/* Header / Hero */}
            <div className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-mystic-950" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="container mx-auto px-4 relative z-10">
                    <Link href="/#signos" className="inline-flex items-center text-slate-400 hover:text-gold-400 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Escolher outro signo
                    </Link>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gold-500/20 blur-[50px] rounded-full" />
                            <div className="relative bg-mystic-900/80 p-8 rounded-full border border-gold-500/20 shadow-glow-gold">
                                <span className="text-6xl md:text-7xl">{signData.symbol}</span>
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-100 mb-2 text-glow">
                                {signData.name}
                            </h1>
                            <p className="text-slate-400 max-w-2xl">
                                {guide?.headline || 'Guia do signo + mensagem do dia.'}
                            </p>
                            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {signData.dates}</span>
                                <span className="px-3 py-0.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs uppercase tracking-wider text-gold-500">
                                    {signData.element}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-20 flex flex-col gap-10">

                {/* Guia do signo (evergreen) */}
                {guide && (
                    <div className="order-2 bg-mystic-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl max-w-5xl mx-auto overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-100 mb-2">
                            Guia de {signData.name}
                        </h2>
                        <p className="text-slate-300 leading-relaxed mb-8 max-w-4xl">
                            {guide.essence}
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="font-bold text-gold-300 mb-3">Forças</h3>
                                <ul className="space-y-2 text-slate-300 text-sm">
                                    {guide.strengths.map((s, i) => (
                                        <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-gold-400" /> {s}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="font-bold text-gold-300 mb-3">Pontos de atenção</h3>
                                <ul className="space-y-2 text-slate-300 text-sm">
                                    {guide.shadows.map((s, i) => (
                                        <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-slate-400" /> {s}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6 mt-6">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="font-bold text-gold-300 mb-3">Amor</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">{guide.love}</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="font-bold text-gold-300 mb-3">Trabalho</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">{guide.work}</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="font-bold text-gold-300 mb-3">Dinheiro</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">{guide.money}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl font-serif font-bold text-slate-100 mb-4">Perguntas frequentes</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {guide.faqs.map((f, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                        <p className="font-bold text-gold-300 mb-2">{f.q}</p>
                                        <p className="text-slate-300 text-sm leading-relaxed">{f.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mensagem do Dia */}
                <div className="order-1 bg-mystic-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-12 shadow-2xl max-w-3xl mx-auto overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                        <h2 className="text-2xl font-serif text-gold-400 flex items-center gap-3">
                            <Sparkles className="w-5 h-5" /> Mensagem do Dia
                        </h2>
                        <span className="text-sm text-slate-500 uppercase tracking-widest">
                            {formatDateBrazil(horoscope.date)}
                        </span>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none">
                        <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-line font-medium text-justify">
                            {horoscope.message}
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <div className="bg-gradient-to-r from-gold-900/20 to-indigo-900/20 rounded-2xl p-8 border border-gold-500/30 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-gold-500/10 transition-colors" />
                            <h3 className="text-xl font-serif text-white mb-4 relative z-10">
                                Quer uma leitura mais profunda?
                            </h3>
                            <p className="text-slate-300 mb-8 max-w-lg mx-auto relative z-10">
                                Receba uma análise premium com orientações mais específicas para amor, dinheiro e carreira.
                            </p>
                            <Link
                                href="/leitura-premium"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold-600 hover:bg-gold-500 text-white font-bold text-lg shadow-glow-gold hover:shadow-glow-gold-strong transition-all relative z-10"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Liberar Leitura Premium
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
