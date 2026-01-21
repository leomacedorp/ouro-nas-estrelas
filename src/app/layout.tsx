import type { Metadata } from 'next';
import { Inter, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-dm-serif' });

export const metadata: Metadata = {
  title: 'Ouro Nas Estrelas - Horóscopo Diário',
  description: 'Seu guia cósmico diário para o autoconhecimento e prosperidade.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(inter.variable, dmSerif.variable, "antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col")}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
