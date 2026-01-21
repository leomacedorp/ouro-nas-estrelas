import Link from 'next/link';
import { Sparkles, Calendar } from 'lucide-react';
import { getTodayBrazilFormatted } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

export default function HoroscopoPage() {
    const date = getTodayBrazilFormatted('full');

    return (
        <div className="min-h-screen pt-12 pb-20">
            {/* Header */}
            <div className="container mx-auto px-4 mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/20 border border-amber-500/20 text-amber-500 text-sm mb-6">
                    <Calendar className="w-4 h-4" />
                    <span>{date}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6">
                    Horóscopo do Dia
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    O alinhamento planetário de hoje traz energias únicas. Encontre seu signo abaixo para ler sua previsão diária completa.
                </p>
            </div>

            {/* Main Grid Navigation */}
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/signos/aries" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♈</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Áries</h3>
                                <p className="text-sm text-slate-500">21 Mar - 19 Abr</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>

                    <Link href="/signos/touro" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♉</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Touro</h3>
                                <p className="text-sm text-slate-500">20 Abr - 20 Mai</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>

                    <Link href="/signos/gemeos" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♊</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Gêmeos</h3>
                                <p className="text-sm text-slate-500">21 Mai - 20 Jun</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>

                    <Link href="/signos/cancer" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♋</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Câncer</h3>
                                <p className="text-sm text-slate-500">21 Jun - 22 Jul</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>

                    <Link href="/signos/leao" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♌</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Leão</h3>
                                <p className="text-sm text-slate-500">23 Jul - 22 Ago</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>

                    <Link href="/signos/virgem" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♍</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Virgem</h3>
                                <p className="text-sm text-slate-500">23 Ago - 22 Set</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>

                    <Link href="/signos/libra" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♎</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Libra</h3>
                                <p className="text-sm text-slate-500">23 Set - 22 Out</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>

                    <Link href="/signos/escorpiao" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♏</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Escorpião</h3>
                                <p className="text-sm text-slate-500">23 Out - 21 Nov</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>

                    <Link href="/signos/sagitario" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♐</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Sagitário</h3>
                                <p className="text-sm text-slate-500">22 Nov - 21 Dez</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>

                    <Link href="/signos/capricornio" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♑</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Capricórnio</h3>
                                <p className="text-sm text-slate-500">22 Dez - 19 Jan</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>

                    <Link href="/signos/aquario" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♒</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Aquário</h3>
                                <p className="text-sm text-slate-500">20 Jan - 18 Fev</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>

                    <Link href="/signos/peixes" className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-800/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">♓</span>
                            <div>
                                <h3 className="font-serif font-semibold text-slate-200 group-hover:text-amber-400 text-lg">Peixes</h3>
                                <p className="text-sm text-slate-500">19 Fev - 20 Mar</p>
                            </div>
                            <Sparkles className="w-4 h-4 ml-auto text-slate-700 group-hover:text-amber-500 transition-colors" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
