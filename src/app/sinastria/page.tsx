import { Metadata } from 'next';
import SinastriaClient from '@/components/SinastriaClient';

export const metadata: Metadata = {
    title: 'Sinastria: Compatibilidade entre Signos | Ouro Nas Estrelas',
    description: 'Descubra a compatibilidade entre signos por foco: amor, química, trabalho e amizade. Resultado rápido e prático.',
    keywords: ['sinastria', 'compatibilidade signos', 'signos combinam', 'sinastria amor', 'quimica dos signos', 'compatibilidade signos trabalho', 'compatibilidade amizade signos'],
    alternates: {
        canonical: '/sinastria'
    }
};

export default function SinastriaPage() {
    return <SinastriaClient />;
}
