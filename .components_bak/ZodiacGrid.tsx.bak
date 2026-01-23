import Link from 'next/link';
import { ZODIAC_SIGNS } from '@/lib/constants';

export default function ZodiacGrid() {
    return (
        <section className="py-20 bg-slate-950">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-serif text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                    Escolha seu Signo
                </h2>
                <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
                    Selecione seu signo solar para descobrir o que os astros revelam sobre o seu dia, semana e mês.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {ZODIAC_SIGNS.map((sign) => (
                        <Link
                            key={sign.slug}
                            href={`/signos/${sign.slug}`}
                            className="group relative p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 hover:border-amber-500/30 hover:bg-indigo-900/30 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/5 group-hover:via-amber-500/5 group-hover:to-amber-500/10 rounded-2xl transition-all" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                                    {sign.symbol}
                                </span>
                                <h3 className="text-xl font-serif font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                                    {sign.name}
                                </h3>
                                <span className="text-xs text-amber-500/70 font-medium mt-1 mb-2">
                                    {sign.dates}
                                </span>
                                <p className="text-sm text-slate-500 line-clamp-2">
                                    {sign.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
