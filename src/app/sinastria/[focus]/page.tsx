import { Metadata } from 'next';
import SinastriaClient from '@/components/SinastriaClient';

const FOCUS: Record<string, { title: string; description: string; keywords: string[] }> = {
  amor: {
    title: 'Sinastria Amorosa: Compatibilidade no Amor | Ouro Nas Estrelas',
    description: 'Descubra se os signos combinam no amor. Compatibilidade amorosa por signos com dicas práticas e claras.',
    keywords: ['sinastria amorosa', 'compatibilidade amor', 'signos combinam', 'combinacao de signos', 'sinastria signos'],
  },
  quimica: {
    title: 'Sinastria de Química: Atração e Sintonia | Ouro Nas Estrelas',
    description: 'Veja a química entre dois signos: atração, ritmo e o que acende (ou esfria) a conexão.',
    keywords: ['compatibilidade sexual signos', 'quimica dos signos', 'sinastria sexo', 'atração entre signos', 'sinastria quimica'],
  },
  trabalho: {
    title: 'Sinastria Profissional: Compatibilidade no Trabalho | Ouro Nas Estrelas',
    description: 'Entenda como dois signos funcionam juntos no trabalho: decisões, ritmo, comunicação e resultados.',
    keywords: ['compatibilidade signos trabalho', 'signos no trabalho', 'parceria profissional signos', 'sinastria trabalho'],
  },
  amizade: {
    title: 'Sinastria de Amizade: Compatibilidade entre Signos | Ouro Nas Estrelas',
    description: 'Descubra a compatibilidade de amizade entre dois signos e como fortalecer a convivência.',
    keywords: ['compatibilidade amizade signos', 'amizade entre signos', 'signos combinam amizade', 'sinastria amizade'],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ focus: string }> }): Promise<Metadata> {
  const { focus } = await params;
  const meta = FOCUS[focus] || FOCUS.amor;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  };
}

export default async function SinastriaFocusPage({ params }: { params: Promise<{ focus: string }> }) {
  const { focus } = await params;
  // Se foco inválido, cai em amor
  const safeFocus = (FOCUS[focus] ? focus : 'amor') as any;
  return <SinastriaClient defaultFocus={safeFocus} />;
}
