import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leitura Premium — Amor, dinheiro e carreira',
  description:
    'Uma leitura premium com orientação clara para amor, dinheiro e carreira. Entrega imediata e garantia de 7 dias.',
  alternates: { canonical: '/leitura-premium' },
  openGraph: {
    title: 'Leitura Premium — Amor, dinheiro e carreira',
    description:
      'Uma leitura premium com orientação clara para amor, dinheiro e carreira. Entrega imediata e garantia de 7 dias.',
    url: '/leitura-premium',
  },
  twitter: {
    title: 'Leitura Premium — Amor, dinheiro e carreira',
    description:
      'Uma leitura premium com orientação clara para amor, dinheiro e carreira. Entrega imediata e garantia de 7 dias.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
