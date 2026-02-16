"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Gem, ShieldCheck, CheckCircle2, ArrowRight, HeartHandshake, Sparkles, Flame, MessageCircleHeart, CalendarDays } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { BlurFade } from '@/components/ui/blur-fade';
import { Meteors } from '@/components/ui/meteors';

const STRIPE_PRICE_COUPLE = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_COUPLE || '';

export default function LeituraCasalPage() {
  const [acceptedSymbolicTerms, setAcceptedSymbolicTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!STRIPE_PRICE_COUPLE) {
      alert('Preço do produto ainda não configurado (Stripe).');
      return;
    }
    if (!acceptedSymbolicTerms) {
      alert('Confirme a leitura simbólica para continuar.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: STRIPE_PRICE_COUPLE,
          product: 'couple',
          acceptedSymbolicTerms: true,
        }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      alert('Não foi possível iniciar o pagamento.');
    } catch (e) {
      alert('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mystic-950 text-slate-200 selection:bg-gold-500/30">
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-mystic-950">
          <div className="absolute nebula-top-left nebula-size rounded-full bg-indigo-950/40 blur-nebula animate-pulse" />
          <div className="absolute nebula-bottom-right nebula-size rounded-full bg-rose-900/10 blur-nebula" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay" />
        </div>

        <Meteors number={14} className="opacity-30" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <BlurFade delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8 backdrop-blur-md">
              <Gem className="w-4 h-4 text-gold-400" />
              <span className="text-sm text-gold-300 font-bold tracking-wide uppercase">Leitura Automática</span>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-slate-100">
              Leitura Simbólica do Casal
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-purple-200">
                clareza, direção e reconexão
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 mb-6 leading-relaxed max-w-2xl mx-auto">
              Não é só “combina ou não combina”. É uma leitura profunda (e prática) do <b>padrão do encontro</b>,
              do <b>ponto cego</b> e do <b>ritual de 7 dias</b> para melhorar a relação.
            </p>
            <div className="mt-4 max-w-2xl mx-auto">
              <LaunchPrice
                launchPrice="26,90"
                fullPrice="53,90"
                headline="Lote de lançamento"
                sub="Válido por tempo limitado"
                // Ajuste a data de término quando quiser (ex.: fim do lançamento)
                endsAtIso={process.env.NEXT_PUBLIC_COUPLE_LAUNCH_ENDS_AT || ''}
                totalSlots={100}
              />
            </div>
          </BlurFade>

          <BlurFade delay={0.35}>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left mb-10">
              <Feature icon={<HeartHandshake className="w-5 h-5 text-rose-300" />} title="Arquétipo do Encontro">
                O “porquê” dessa conexão e o que ela quer curar/fortalecer.
              </Feature>
              <Feature icon={<Flame className="w-5 h-5 text-rose-300" />} title="Sombra do Casal">
                O padrão invisível que repete crise, afastamento ou ruído.
              </Feature>
              <Feature icon={<MessageCircleHeart className="w-5 h-5 text-purple-300" />} title="Tradução de linguagem">
                Como cada um ama, reage e se protege — e como falar sem acender gatilhos.
              </Feature>
              <Feature icon={<CalendarDays className="w-5 h-5 text-purple-300" />} title="Ritual de 7 dias">
                Micro-ações (10 min/dia) para destravar conexão e confiança.
              </Feature>
            </div>
          </BlurFade>

          <div className="mb-8 max-w-3xl mx-auto text-left">
            <label className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <input
                type="checkbox"
                checked={acceptedSymbolicTerms}
                onChange={(e) => setAcceptedSymbolicTerms(e.target.checked)}
                className="mt-1 h-5 w-5 accent-gold-500"
              />
              <span className="text-sm text-slate-300 leading-relaxed">
                Entendo que esta leitura é simbólica, feita para orientação e reflexão.
              </span>
            </label>
            <p className="mt-2 text-xs text-slate-500">
              Para continuar para o pagamento, marque a confirmação acima.
            </p>
          </div>

          <BlurFade delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ShimmerButton
                className="text-lg px-10 py-4 font-bold min-w-[260px]"
                onClick={handleCheckout}
                disabled={!acceptedSymbolicTerms || loading}
              >
                {loading ? 'Abrindo pagamento...' : 'Destravar Leitura do Casal (R$ 26,90)'}
                <Sparkles className="w-4 h-4 ml-2" />
              </ShimmerButton>

              <p className="text-sm text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Garantia de 7 dias
              </p>
            </div>
          </BlurFade>

          <div className="mt-10 text-sm text-slate-500">
            Já fez a sinastria gratuita? <Link className="text-gold-300 hover:text-gold-200 underline" href="/sinastria">Voltar para Sinastria</Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-mystic-900/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-100">O que você recebe</h2>
            <p className="text-slate-400 mt-3">
              Uma leitura místico-terapêutica com direção prática — sem prometer destino fixo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Deliverable title="Essência do Encontro">Missão do casal + por que vocês se atraem.</Deliverable>
            <Deliverable title="Dinâmica emocional">Gatilhos, necessidades e a forma de amar de cada um.</Deliverable>
            <Deliverable title="Química (com elegância)">O que acende e o que esfria — e como ajustar o ritmo.</Deliverable>
            <Deliverable title="Comunicação">Como falar para ser ouvido e evitar ruído/desgaste.</Deliverable>
            <Deliverable title="Dinheiro & projeto de vida">Como alinhar segurança, risco e decisões práticas.</Deliverable>
            <Deliverable title="Ritual de 7 dias">Plano leve, diário, para reconstruir conexão.</Deliverable>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center gap-2 text-gold-300 font-bold mb-2">
              <CheckCircle2 className="w-5 h-5" /> Automática e imediata
            </div>
            <p className="text-slate-400">
              Após o pagamento, você informa os dados do casal e a leitura é gerada na hora.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link href="/leitura-premium" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              Quero minha Leitura Pessoal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, children }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-black/30 border border-white/10">{icon}</span>
        <div className="font-semibold text-slate-100">{title}</div>
      </div>
      <div className="text-sm text-slate-400 leading-relaxed">{children}</div>
    </div>
  );
}

function Deliverable({ title, children }: any) {
  return (
    <div className="p-6 rounded-2xl bg-black/30 border border-white/10">
      <div className="font-serif text-lg text-slate-100 font-bold mb-2">{title}</div>
      <div className="text-sm text-slate-400 leading-relaxed">{children}</div>
    </div>
  );
}

function LaunchPrice({
  headline,
  sub,
  launchPrice,
  fullPrice,
  endsAtIso,
  totalSlots,
}: {
  headline: string;
  sub?: string;
  launchPrice: string;
  fullPrice: string;
  endsAtIso?: string;
  totalSlots?: number;
}) {
  // fallback: 7 dias a partir de agora
  const endsAt = useMemo(() => {
    if (endsAtIso) {
      const d = new Date(endsAtIso);
      if (!Number.isNaN(d.getTime())) return d;
    }
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  }, [endsAtIso]);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const remainingMs = Math.max(0, endsAt.getTime() - now);
  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
  const seconds = Math.floor((remainingMs / 1000) % 60);

  return (
    <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-900/15 to-rose-900/10 p-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-wider text-gold-300 font-bold">{headline}</div>
          {sub ? <div className="text-xs text-slate-400 mt-1">{sub}</div> : null}
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Preço normal</div>
          <div className="text-slate-200">
            <span className="text-red-300 line-through font-semibold">R$ {fullPrice}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400">Preço de lançamento</div>
          <div className="text-3xl md:text-4xl font-serif font-bold text-gold-200">R$ {launchPrice}</div>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-xs text-slate-400">Termina em</div>
          <div className="font-mono text-slate-100">
            {days}d {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          {typeof totalSlots === 'number' ? (
            <div className="mt-1 text-xs text-slate-400">Lote: {totalSlots} vagas</div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        * Podemos plugar um contador real (decrementando) usando Stripe ou um KV/DB. Hoje está só como “lote de 100”.
      </div>
    </div>
  );
}
