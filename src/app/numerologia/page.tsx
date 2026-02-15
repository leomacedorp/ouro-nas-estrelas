import { Metadata } from 'next';
import NumerologiaClient from '@/components/NumerologiaClient';

export const metadata: Metadata = {
    title: 'Calculadora de Numerologia Grátis | Ouro Nas Estrelas',
    description: 'Descubra seu Número de Destino, Alma e Expressão. Entenda sua missão de vida e seus talentos ocultos com nossa calculadora numerológica gratuita.',
    keywords: ['numerologia gratis', 'numero de destino', 'numero da alma', 'significado do nome', 'mapa numerologico']
};

export default function NumerologiaPage() {
    return <NumerologiaClient />;
}
