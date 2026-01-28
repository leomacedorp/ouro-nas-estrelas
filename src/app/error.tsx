'use client';

import { useEffect } from 'react';
import { ShimmerButton } from '@/components/ui/shimmer-button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Runtime Error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-mystic-950 text-slate-200 p-4">
            <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">
                Algo não saiu como esperado...
            </h2>
            <p className="text-slate-400 mb-8 max-w-md text-center">
                {error.message || 'Ocorreu um erro inesperado ao carregar a aplicação.'}
            </p>
            <ShimmerButton onClick={() => reset()}>
                Tentar Novamente
            </ShimmerButton>
        </div>
    );
}
