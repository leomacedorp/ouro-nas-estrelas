import Link from 'next/link';
import ZodiacGrid from '@/components/ZodiacGrid';

export default function SignosPage() {
    return (
        <div className="min-h-screen pt-12 pb-20">
            <div className="container mx-auto px-4 mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-4">
                    Os 12 Signos do Zodíaco
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Cada signo possui uma energia única, influenciada pelos elementos da natureza e pelos planetas regentes. Explore as características que tornam cada um especial.
                </p>
            </div>

            <ZodiacGrid />
        </div>
    );
}
