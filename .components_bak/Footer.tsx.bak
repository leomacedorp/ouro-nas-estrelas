"use client";

import Link from 'next/link';
import { Sparkles, ArrowRight, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';
import { siteConfig } from '@/lib/siteConfig';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    async function handleNewsletter(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            // Save locally first (resilience)
            localStorage.setItem('newsletter_email', email);

            // Try API call
            await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            setStatus('success');
            setEmail('');
        } catch (error) {
            console.warn('Newsletter API failed, but saved locally', error);
            setStatus('success'); // Show success to user anyway since we saved locally
        }
    }

    return (
        <footer className="border-t border-white/5 bg-mystic-950 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 group mb-6">
                            <Sparkles className="w-5 h-5 text-gold-400 group-hover:text-gold-300 transition-colors" />
                            <span className="font-serif text-xl font-bold text-slate-100">
                                {siteConfig.name}
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Seu oráculo diário para navegar os ciclos do destino com clareza e propósito.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <Twitter className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="font-serif text-lg text-slate-200 mb-6">Explorar</h4>
                        <ul className="space-y-3">
                            {siteConfig.links.footer.explore.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-slate-400 hover:text-gold-400 text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-serif text-lg text-slate-200 mb-6">Legal</h4>
                        <ul className="space-y-3">
                            {siteConfig.links.footer.legal.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-slate-400 hover:text-gold-400 text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-serif text-lg text-slate-200 mb-6">Boletim Astral</h4>
                        <p className="text-slate-400 text-sm mb-4">Receba os trânsitos da semana.</p>

                        {status === 'success' ? (
                            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                                ✨ Cadastro recebido! Observe os sinais.
                            </div>
                        ) : (
                            <form onSubmit={handleNewsletter} className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Seu melhor e-mail"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 w-full"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="p-2 rounded-lg bg-gold-600 hover:bg-gold-500 text-white transition-colors disabled:opacity-50"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-slate-600 text-xs">
                    <p>&copy; {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.</p>
                    <p className="mt-2 text-slate-700">As previsões são para entretenimento e autoconhecimento.</p>
                </div>
            </div>
        </footer>
    );
}
