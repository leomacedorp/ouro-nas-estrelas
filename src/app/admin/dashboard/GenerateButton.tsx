"use client";

import { useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function GenerateButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleGenerate = async () => {
        if (!confirm('Isso usará créditos da IA para gerar horóscopos faltantes. Continuar?')) return;

        setIsLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            const res = await fetch('/api/cron/generate?mode=missing', {
                method: 'GET',
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Falha na geração');

            setStatus('success');
            setMessage(`Sucesso! ${data.generated} gerados, ${data.skipped} pulados.`);
            router.refresh();
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('Erro ao gerar previsões. Verifique os logs.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-900/40 to-mystic-900/40 border border-indigo-500/30 rounded-xl hover:from-indigo-900/60 hover:to-mystic-900/60 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                        {isLoading ? (
                            <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                        )}
                    </div>
                    <div className="text-left">
                        <div className="font-medium text-slate-200">Gerar Previsões de Hoje</div>
                        <div className="text-xs text-slate-500">
                            {isLoading ? 'Processando com IA...' : 'Atualizar horóscopos manualmente'}
                        </div>
                    </div>
                </div>

                {status === 'success' && <CheckCircle className="w-6 h-6 text-emerald-400" />}
                {status === 'error' && <AlertCircle className="w-6 h-6 text-rose-400" />}
            </button>

            {message && (
                <div className={`text-xs px-2 py-1 rounded ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
}
