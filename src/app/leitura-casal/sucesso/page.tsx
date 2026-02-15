"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function LeituraCasalSucessoPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [isValidating, setIsValidating] = useState(true);
  const [isValidPurchase, setIsValidPurchase] = useState(false);

  const [aName, setAName] = useState('');
  const [aBirth, setABirth] = useState('');
  const [aSign, setASign] = useState('');

  const [bName, setBName] = useState('');
  const [bBirth, setBBirth] = useState('');
  const [bSign, setBSign] = useState('');

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    async function validate() {
      if (!sessionId) {
        setIsValidPurchase(false);
        setIsValidating(false);
        return;
      }

      try {
        const res = await fetch('/api/stripe/validate-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        setIsValidPurchase(Boolean(data.valid));
      } catch {
        setIsValidPurchase(false);
      } finally {
        setIsValidating(false);
      }
    }

    validate();
  }, [sessionId]);

  const handleGenerate = async () => {
    if (!sessionId) return;
    if (!aName.trim() || !aBirth || !aSign || !bName.trim() || !bBirth || !bSign) {
      alert('Preencha os dados do casal para gerar a leitura.');
      return;
    }

    setLoading(true);
    setContent(null);

    try {
      const res = await fetch('/api/couple-reading/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          a: { name: aName, birthDate: aBirth, sign: aSign },
          b: { name: bName, birthDate: bBirth, sign: bSign },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert('Não foi possível gerar agora. Aguarde 1 minuto e tente novamente.');
        return;
      }

      setContent(data.content);
    } catch {
      alert('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-mystic-950 text-slate-200 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gold-300 font-serif animate-pulse">Validando seu pagamento...</p>
        </div>
      </div>
    );
  }

  if (!isValidPurchase) {
    return (
      <div className="min-h-screen bg-mystic-950 text-slate-200 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/50">
            <Lock className="w-10 h-10 text-red-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Acesso não liberado</h1>
          <p className="text-lg text-slate-400 mb-8">
            Não encontramos um pagamento válido para esta sessão. Se você acabou de pagar, aguarde alguns instantes e recarregue.
          </p>
          <Link href="/leitura-casal" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <ArrowRight className="w-5 h-5" /> Voltar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mystic-950 text-slate-200">
      <div className="container mx-auto px-4 py-20 relative z-10 max-w-4xl">
        {!content ? (
          <div className="max-w-2xl mx-auto text-center">
            <BlurFade delay={0}>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/50 shadow-glow-green">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
            </BlurFade>

            <BlurFade delay={0.1}>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Pagamento Confirmado!</h1>
            </BlurFade>

            <BlurFade delay={0.2}>
              <p className="text-lg text-slate-400 mb-8">
                Agora preencha os dados do casal para gerar a leitura simbólica completa.
              </p>
            </BlurFade>

            <div className="max-w-xl mx-auto mb-10 grid gap-4 text-left">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Nome (Pessoa 1)</label>
                  <input value={aName} onChange={(e) => setAName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10" placeholder="Ex.: Ana" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Data (Pessoa 1)</label>
                  <input type="date" value={aBirth} onChange={(e) => setABirth(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Signo (Pessoa 1)</label>
                <select value={aSign} onChange={(e) => setASign(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <option value="" disabled>Escolher signo</option>
                  {ZODIAC_SIGNS.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.symbol} {s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Nome (Pessoa 2)</label>
                  <input value={bName} onChange={(e) => setBName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10" placeholder="Ex.: Bruno" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Data (Pessoa 2)</label>
                  <input type="date" value={bBirth} onChange={(e) => setBBirth(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Signo (Pessoa 2)</label>
                <select value={bSign} onChange={(e) => setBSign(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <option value="" disabled>Escolher signo</option>
                  {ZODIAC_SIGNS.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.symbol} {s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <ShimmerButton className="px-10 py-4 text-lg font-bold" onClick={handleGenerate} disabled={loading}>
                {loading ? 'Gerando...' : 'Revelar Leitura do Casal'}
              </ShimmerButton>
            </div>

            <div className="mt-8 text-sm text-slate-500">
              Voltar para <Link className="text-gold-300 underline" href="/sinastria">Sinastria</Link>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1 rounded-full bg-gold-500/20 text-gold-300 text-sm font-bold mb-4 border border-gold-500/30">
                LEITURA DO CASAL ATIVADA
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">{content.titulo || 'Leitura do Casal'}</h2>
              <p className="text-slate-400">Uma leitura simbólica para orientar decisões e fortalecer o vínculo.</p>
            </div>

            <div className="p-8 rounded-3xl bg-black/40 border border-white/10">
              <MarkdownRenderer content={content.leitura || ''} className="text-lg" />
            </div>

            <div className="mt-10 text-center">
              <Link href="/leitura-premium" className="text-slate-300 hover:text-white underline">Quero minha leitura pessoal</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
