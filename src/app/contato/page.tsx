import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LeadForm from '@/components/LeadForm';

export default function ContatoPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden text-center py-20 px-4">
            <div className="absolute inset-0 bg-mystic-950 pointer-events-none">
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-gold-900/10 blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto w-full">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-gold-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Início
                </Link>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-200 to-gold-500">
                    Fale Conosco
                </h1>

                <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                    Tem alguma dúvida ou precisa de suporte? Nossa equipe retornará seu contato por email o mais breve possível.
                </p>

                <div className="text-left">
                    <LeadForm
                        type="contato"
                        buttonText="Enviar Mensagem"
                        placeholderMessage="Olá, gostaria de saber sobre..."
                        successMessage="Mensagem recebida! Nossa equipe responderá em até 24h úteis."
                    />
                </div>
            </div>
        </div>
    );
}
