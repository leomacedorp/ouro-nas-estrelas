import type { Metadata } from 'next';
import { Inter, DM_Serif_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SmoothScrollProvider } from '@/components/ui/smooth-scroll';
import CosmicBackground from '@/components/CosmicBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-dm-serif' });

// Google Analytics ID
const GA_MEASUREMENT_ID = 'G-6TWW6XHNTH';

export const metadata: Metadata = {
  title: 'Ouro Nas Estrelas - Horóscopo Diário Personalizado',
  description: 'Seu guia cósmico diário para descobrir o ouro escondido em cada momento. Leituras astrológicas premium e personalizadas.',
  keywords: 'horóscopo, astrologia, signo, previsão, amor, dinheiro, carreira',
};

import { createClient } from '@/lib/supabase/server';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Se supabase estiver offline (sem chaves), cria settings vazio
  let settings = {};

  if (supabase) {
    try {
      const { data: settingsData } = await supabase.from('site_settings').select('*');
      // Converte array [{key, value}] para objeto {key: value}
      if (settingsData) {
        settings = settingsData.reduce((acc, curr) => ({
          ...acc,
          [curr.key]: curr.value
        }), {});
      }
    } catch (e) {
      console.error("Error fetching settings:", e);
    }
  }

  return (
    <html lang="pt-BR" className="lenis" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={cn(
        inter.variable,
        dmSerif.variable,
        "antialiased bg-mystic-950 text-slate-100 min-h-screen flex flex-col"
      )}>
        <SmoothScrollProvider>
          <CosmicBackground intensity="medium" />
          <Navbar settings={settings} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
