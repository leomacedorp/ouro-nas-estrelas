import Link from 'next/link';
import { MessageCircle, ArrowLeft } from 'lucide-react';

export default function GenericSalesPage({
    title,
    description,
    ctaText = "Saiba Mais no WhatsApp"
}: {
    title: string;
    description: string;
    ctaText?: string;
}) {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-mystic-950">
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-gold-900/10 blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-gold-400 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Início
                </Link>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-200 to-gold-500">
                    {title}
                </h1>

                <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                    {description}
                </p>

                <Link
                    href="https://wa.me/5500000000000"
                    className="group relative px-8 py-4 bg-gold-600 hover:bg-gold-500 text-white rounded-full font-semibold text-lg transition-all glow-pulse inline-flex items-center gap-3"
                >
                    <MessageCircle className="w-5 h-5" />
                    {ctaText}
                </Link>
            </div>
        </div>
    );
}
