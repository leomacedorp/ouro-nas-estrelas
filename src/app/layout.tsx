import type { Metadata } from 'next';
import { Inter, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SmoothScrollProvider } from '@/components/ui/smooth-scroll';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-dm-serif' });

export const metadata: Metadata = {
  title: 'Ouro Nas Estrelas - Horóscopo Diário Personalizado',
  description: 'Seu guia cósmico diário para descobrir o ouro escondido em cada momento. Leituras astrológicas premium e personalizadas.',
  keywords: 'horóscopo, astrologia, signo, previsão, amor, dinheiro, carreira',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="lenis" suppressHydrationWarning>
      <body className={cn(
        inter.variable,
        dmSerif.variable,
        "antialiased bg-mystic-950 text-slate-100 min-h-screen flex flex-col"
      )}>
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
