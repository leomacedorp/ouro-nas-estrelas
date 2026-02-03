"use client";

import { useState } from 'react';
import { Send, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';

interface LeadFormProps {
    type: 'contato' | 'clube' | 'consulta' | 'membros';
    buttonText?: string;
    placeholderMessage?: string;
    showPhone?: boolean;
    showMessage?: boolean;
    successMessage?: string;
}

export default function LeadForm({
    type,
    buttonText = "Enviar",
    placeholderMessage = "Como podemos ajudar?",
    showPhone = true,
    showMessage = true,
    successMessage = "Recebemos seu contato! Verifique seu email."
}: LeadFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/leads/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    type
                })
            });

            if (res.ok) {
                setIsSuccess(true);
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                alert('Erro ao enviar. Tente novamente.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sucesso!</h3>
                <p className="text-slate-300">{successMessage}</p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 text-sm text-gold-400 hover:text-gold-300 underline"
                >
                    Enviar nova mensagem
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Nome Completo</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-gold-500/50 focus:border-transparent transition-all outline-none"
                    placeholder="Seu nome"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Email</label>
                <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-gold-500/50 focus:border-transparent transition-all outline-none"
                    placeholder="seu@email.com"
                />
            </div>

            {showPhone && (
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">WhatsApp</label>
                    <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-gold-500/50 focus:border-transparent transition-all outline-none"
                        placeholder="(11) 99999-9999"
                    />
                </div>
            )}

            {showMessage && (
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">Mensagem</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-gold-500/50 focus:border-transparent transition-all outline-none resize-none h-32"
                        placeholder={placeholderMessage}
                    />
                </div>
            )}

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full group"
                >
                    <ShimmerButton className="w-full py-4 text-base font-bold">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Send className="w-5 h-5" /> {buttonText}
                            </span>
                        )}
                    </ShimmerButton>
                </button>
            </div>

            <p className="text-xs text-center text-slate-500 mt-4">
                Seus dados estão seguros. Não enviamos spam.
            </p>
        </form>
    );
}
