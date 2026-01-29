import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-top-right from-indigo-500/20 via-slate-950 to-slate-950" />

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                        Acesso Restrito
                    </h1>
                    <p className="text-slate-400 mt-2">Área administrativa do Ouro Nas Estrelas</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-8 shadow-2xl">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-500/50 transition-colors"
                                placeholder="admin@ouronasestrelas.com.br"
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
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-all hover:shadow-glow-indigo"
                        >
                            Entrar no Painel
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-slate-500 hover:text-slate-400 transition-colors">
                            Voltar ao site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
