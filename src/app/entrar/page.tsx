import Link from 'next/link';
import LeadForm from '@/components/LeadForm';

export default function LoginPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden py-20 px-4">
            <div className="absolute inset-0 bg-radial-top-right from-indigo-500/20 via-slate-950 to-slate-950" />

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 relative z-10 items-start">

                {/* LADO 1: Login (Existente) */}
                <div>
                    <div className="text-left mb-8">
                        <h1 className="text-3xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                            Área de Membros
                        </h1>
                        <p className="text-slate-400 mt-2">Acesse seus conteúdos exclusivos.</p>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-8 shadow-2xl">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-500/50 transition-colors"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-500/50 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => alert('Login temporariamente desabilitado para manutenção.')}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-all hover:shadow-glow-indigo"
                            >
                                Entrar
                            </button>
                        </form>
                    </div>
                </div>

                {/* LADO 2: Captura (Novo) */}
                <div className="flex flex-col justify-center h-full">
                    <div className="mb-8 md:mt-0 mt-8">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">
                            Ainda não é membro?
                        </h2>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            O Clube das Estrelas é nossa comunidade fechada para quem busca profundidade.
                            <span className="text-gold-300 block mt-2">As vagas abrem apenas 3x ao ano.</span>
                        </p>

                        <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                                Lista de Espera Prioritária
                            </h3>
                            <LeadForm
                                type="membros"
                                buttonText="Quero ser avisado"
                                showPhone={true}
                                showMessage={false}
                                successMessage="Você será o primeiro a saber da próxima abertura!"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
