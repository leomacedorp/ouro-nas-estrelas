import Link from 'next/link';
import { ArrowLeft, FileText, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

export default function TermosPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-mystic-950 text-slate-300">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-gold-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Início
                </Link>

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-100 mb-8 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-gold-500" /> Termos de Uso
                </h1>

                <div className="prose prose-invert prose-slate prose-lg max-w-none">
                    <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                    <h3>1. Boas-vindas ao {siteConfig.name}</h3>
                    <p>Ao acessar e usar nossa plataforma, você concorda com estes termos. Nosso objetivo é fornecer insights e orientações baseados em interpretações astrológicas simbólicas.</p>

                    <h3>2. Natureza do Serviço</h3>
                    <p>Todo o conteúdo fornecido (horóscopos, mapas astrais, leituras) destina-se ao autoconhecimento e entretenimento. A astrologia é uma linguagem simbólica e não substitui diagnósticos médicos, consultoria jurídica ou financeira profissional.</p>

                    <h3>3. Uso Consciente</h3>
                    <p>As decisões tomadas com base em nossas leituras são de inteira responsabilidade do usuário. Encorajamos o uso das descrições como ferramentas para reflexão pessoal.</p>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                    <p className="text-slate-400 text-sm">Dúvidas sobre nossos termos?</p>
                    <Link
                        href={siteConfig.whatsapp.url("Tenho dúvida sobre os Termos de Uso")}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Falar com Suporte
                    </Link>
                </div>
            </div>
        </div>
    );
}
