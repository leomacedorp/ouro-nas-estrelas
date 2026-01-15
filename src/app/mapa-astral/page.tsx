import Link from 'next/link';
import { ArrowLeft, Compass, Star, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

export default function MapaAstralPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-mystic-950 relative overflow-hidden text-slate-200">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-gold-900/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[50vh] h-[50vh] bg-indigo-900/10 rounded-full blur-[100px]" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-gold-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Início
                </Link>

                <div className="mb-6 inline-flex justify-center p-4 rounded-full bg-gold-500/10 border border-gold-500/20">
                    <Compass className="w-12 h-12 text-gold-400" />
                </div>

                <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-100 mb-6">
                    Seu Mapa Astral Completo
                </h1>

                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    O alinhamento exato dos astros no momento do seu nascimento revela seu propósito, desafios e potências ocultas.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
                    <div className="p-6 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/30 transition-colors">
                        <Star className="w-6 h-6 text-gold-400 mb-3" />
                        <h3 className="font-bold text-white mb-2">Tríade de Poder</h3>
                        <p className="text-sm text-slate-400">Sol (Essência), Lua (Emoção) e Ascendente (Expressão).</p>
                    </div>
                    <div className="p-6 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/30 transition-colors">
                        <Star className="w-6 h-6 text-gold-400 mb-3" />
                        <h3 className="font-bold text-white mb-2">12 Casas</h3>
                        <p className="text-sm text-slate-400">Como a energia flui em cada setor da sua vida (amor, trabalho, família).</p>
                    </div>
                    <div className="p-6 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/30 transition-colors">
                        <Star className="w-6 h-6 text-gold-400 mb-3" />
                        <h3 className="font-bold text-white mb-2">Aspectos</h3>
                        <p className="text-sm text-slate-400">As conversas entre os planetas que definem seus maiores talentos.</p>
                    </div>
                </div>

                <div className="p-8 rounded-2xl bg-gradient-to-r from-mystic-900 to-indigo-950 border border-gold-500/30 inline-block shadow-2xl">
                    <h3 className="text-2xl font-serif text-gold-300 mb-4">Descubra sua Assinatura Cósmica</h3>
                    <p className="text-slate-300 mb-8 max-w-md mx-auto">
                        Solicite sua leitura personalizada diretamente pelo WhatsApp e receba insights transformadores.
                    </p>
                    <Link
                        href={siteConfig.whatsapp.url("Gostaria de agendar a leitura do meu Mapa Astral")}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold-600 hover:bg-gold-500 text-white font-bold text-lg shadow-lg hover:shadow-gold-500/25 transition-all"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Agendar Leitura
                    </Link>
                </div>
            </div>
        </div>
    );
}
