import Link from 'next/link';
import { Star, Moon, Sun, Heart } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2713&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                        Sobre o Ouro Nas Estrelas
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Conectando a sabedoria ancestral da astrologia com a tecnologia moderna para iluminar o seu caminho.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-indigo-950/10">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-serif font-semibold text-amber-500">Nossa Missão</h2>
                            <p className="text-slate-300 leading-relaxed">
                                Acreditamos que os astros não determinam nosso destino, mas oferecem um mapa valioso para navegarmos pela vida com mais consciência e propósito.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Ouro Nas Estrelas nasceu da vontade de tornar a astrologia acessível, prática e inspiradora. Combinamos cálculos astronômicos precisos com interpretações profundas para entregar horóscopos que realmente ressoam com sua jornada pessoal.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-indigo-500/20 text-center">
                                <Sun className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                                <h3 className="font-medium text-slate-200">Clareza</h3>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-indigo-500/20 text-center translate-y-8">
                                <Moon className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                                <h3 className="font-medium text-slate-200">Intuição</h3>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-indigo-500/20 text-center">
                                <Star className="w-8 h-8 text-amber-200 mx-auto mb-3" />
                                <h3 className="font-medium text-slate-200">Destino</h3>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-indigo-500/20 text-center translate-y-8">
                                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                                <h3 className="font-medium text-slate-200">Autoconhecimento</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif text-slate-100 mb-8">Comece sua jornada hoje</h2>
                    <Link
                        href="/signos"
                        className="inline-block px-8 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-medium transition-all hover:shadow-glow-gold"
                    >
                        Descubra seu Signo
                    </Link>
                </div>
            </section>
        </div>
    );
}
