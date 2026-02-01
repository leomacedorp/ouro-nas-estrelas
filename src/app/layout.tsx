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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ouro-nas-estrelas-6sig.vercel.app'),
  title: {
    default: 'Ouro Nas Estrelas — Horóscopo e Leituras Premium',
    template: '%s — Ouro Nas Estrelas'
  },
  description: 'Horóscopo do dia e guias completos por signo. Leituras premium para amor, dinheiro e carreira — com uma linguagem humana, clara e acolhedora.',
  keywords: ['horóscopo', 'astrologia', 'signos', 'amor', 'dinheiro', 'carreira', 'leitura premium'],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: 'Ouro Nas Estrelas — Horóscopo e Leituras Premium',
    description: 'Horóscopo do dia e guias completos por signo. Leituras premium para amor, dinheiro e carreira.',
    url: '/',
    siteName: 'Ouro Nas Estrelas'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ouro Nas Estrelas — Horóscopo e Leituras Premium',
    description: 'Horóscopo do dia e guias completos por signo. Leituras premium para amor, dinheiro e carreira.'
  }
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
