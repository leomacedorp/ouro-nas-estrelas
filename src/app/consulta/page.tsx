import Link from 'next/link';
import { ArrowLeft, Calendar, Sparkles } from 'lucide-react';
import { Meteors } from '@/components/ui/meteors';
import LeadForm from '@/components/LeadForm';
import { BlurFade } from '@/components/ui/blur-fade';

export default function ConsultaPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden py-20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-mystic-950/80 via-indigo-950/20 to-mystic-950/80" />
            <Meteors number={15} className="opacity-40" />

            <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                <BlurFade delay={0.1}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8 backdrop-blur-md">
                        <Calendar className="w-4 h-4 text-gold-400 animate-pulse" />
                        <span className="text-sm text-gold-300 font-bold tracking-wide uppercase">Agenda 2026</span>
                    </div>
                </BlurFade>

                <BlurFade delay={0.2}>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-slate-100">
                        Consulta Simbólica
                    </h1>
                </BlurFade>

                <BlurFade delay={0.3}>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Atendimentos individuais para quem busca clareza profunda e direção.
                        <br /><span className="text-gold-300">Agenda restrita. Entre na lista para ter prioridade.</span>
                    </p>
                </BlurFade>

                <BlurFade delay={0.4}>
                    <div className="max-w-md mx-auto text-left">
                        <LeadForm
                            type="consulta"
                            buttonText="Solicitar Vaga"
                            showPhone={true}
                            showMessage={true}
                            placeholderMessage="Qual seu principal objetivo com a consulta?"
                            successMessage="Recebemos seu interesse! Entraremos em contato para agendar."
                        />
                    </div>
                </BlurFade>

                <BlurFade delay={0.5}>
                    <div className="mt-8">
                        <Link href="/" className="text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                            <ArrowLeft className="w-4 h-4" /> Voltar para o Início
                        </Link>
                    </div>
                </BlurFade>
            </div>
        </div>
    );
}
