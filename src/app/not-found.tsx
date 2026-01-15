import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-8xl font-serif text-amber-500 mb-6">404</h2>
            <h3 className="text-2xl font-serif text-slate-200 mb-4">Página Perdida no Espaço</h3>
            <p className="text-slate-400 max-w-md mb-8">
                Ops! Parece que os astros não se alinharam para esta página. Ela pode ter se movido ou nunca existiu.
            </p>
            <Link
                href="/"
                className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
                Voltar para a Terra (Home)
            </Link>
        </div>
    );
}
