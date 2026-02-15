import { Metadata } from 'next';
import SinastriaClient from '@/components/SinastriaClient';

export const metadata: Metadata = {
    title: 'Sinastria Amorosa: Compatibilidade dos Signos | Ouro Nas Estrelas',
    description: 'Descubra se o seu signo combina com o da pessoa amada. Calculadora de sinastria e compatibilidade amorosa gratuita.',
    keywords: ['sinastria amorosa', 'compatibilidade signos', 'combinacao astral', 'amor entre signos', 'mapa astral casal']
};

export default function SinastriaPage() {
    return <SinastriaClient />;
}
