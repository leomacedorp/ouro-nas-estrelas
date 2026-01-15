import Link from 'next/link';
import { ArrowRight, Star, Moon, Sun, Lock, MessageCircle } from 'lucide-react';
import ZodiacGrid from '@/components/ZodiacGrid';
import DailyRitual from '@/components/DailyRitual';
import { homeContent } from '@/lib/content/home';
import { siteConfig } from '@/lib/siteConfig';

export default function Home() {
  return (
    <>
      {/* Ritual Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pb-10 pt-20">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-mystic-950">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-950/30 blur-[150px] animate-pulse duration-[5000ms]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gold-900/10 blur-[150px]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay" />
        </div>

        {/* Daily Ritual Interaction */}
        <DailyRitual />

        {/* Gentle Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
          <ArrowRight className="w-5 h-5 rotate-90" />
        </div>
      </section>

      {/* Zodiac Grid Integration */}
      <div id="signos" className="border-t border-white/5 bg-mystic-950 relative z-20">
        <ZodiacGrid />
      </div>

      {/* Benefits / Methodology Section */}
      <section className="py-24 bg-mystic-900 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 mb-4">{homeContent.benefits.title}</h2>
            <p className="text-slate-400">{homeContent.benefits.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            {homeContent.benefits.cards.map((card, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/5 card-gradient">
                <h3 className="text-xl font-serif font-semibold text-gold-400 mb-3">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-mystic-950 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif font-bold text-center text-slate-200 mb-12">
            {homeContent.testimonials.title}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeContent.testimonials.items.map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                <p className="text-slate-300 italic text-sm mb-4">
                  "{item.text}"
                </p>
                <p className="text-gold-500 text-xs font-bold uppercase tracking-wider">{item.author} &bull; {item.sign}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-gold-900/20 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100 mb-6">
            {homeContent.final_cta.title}
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">
            {homeContent.final_cta.description}
          </p>

          <Link
            href={siteConfig.whatsapp.url()}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold-600 hover:bg-gold-500 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-gold-500/20"
          >
            <MessageCircle className="w-5 h-5" />
            {homeContent.final_cta.button_text}
          </Link>
        </div>
      </section>
    </>
  );
}
