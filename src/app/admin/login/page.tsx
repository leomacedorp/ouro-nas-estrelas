"use client";

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // Sucesso
        router.push('/admin/dashboard');
        router.refresh(); // Atualiza middleware
    };

    return (
        <div className="min-h-screen bg-mystic-950 flex items-center justify-center p-4">

            <div className="absolute top-8 left-8">
                <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Site
                </Link>
            </div>

            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
                        <Lock className="w-5 h-5 text-gold-400" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-white mb-2">Painel de Controle</h1>
                    <p className="text-slate-400 text-sm">Acesso restrito à equipe Ouro nas Estrelas</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-mystic-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                            placeholder="admin@ouronasestrelas.com.br"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-mystic-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gold-600 hover:bg-gold-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar no Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
}
