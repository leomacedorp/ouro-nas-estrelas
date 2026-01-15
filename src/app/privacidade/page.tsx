import Link from 'next/link';
import { ArrowLeft, ShieldCheck, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-mystic-950 text-slate-300">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-gold-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Início
                </Link>

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-100 mb-8 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-gold-500" /> Política de Privacidade
                </h1>

                <div className="prose prose-invert prose-slate prose-lg max-w-none">
                    <p>Sua confiança é a base da nossa conexão. No {siteConfig.name}, tratamos seus dados com o respeito e o sigilo que eles merecem.</p>

                    <h3>1. O que coletamos</h3>
                    <p>Coletamos apenas o essencial para entregar nossos serviços: nome e e-mail (para newsletter) ou dados de nascimento (data, hora e local) quando você solicita um Mapa Astral.</p>

                    <h3>2. Como usamos</h3>
                    <p>Seus dados são usados exclusivamente para: gerar suas leituras astrológicas, enviar as comunicações que você solicitou e melhorar sua experiência no site.</p>

                    <h3>3. Sigilo Absoluto</h3>
                    <p>Nunca vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing. Suas informações de nascimento são sagradas para nós.</p>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                    <p className="text-slate-400 text-sm">Quer saber mais sobre seus dados?</p>
                    <Link
                        href={siteConfig.whatsapp.url("Tenho dúvida sobre Privacidade")}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Falar com DPO
                    </Link>
                </div>
            </div>
        </div>
    );
}
