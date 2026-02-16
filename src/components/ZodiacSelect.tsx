"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ZODIAC_SIGNS } from "@/lib/constants";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export function ZodiacSelect({ value, onChange, placeholder = "Escolher signo", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const current = useMemo(() => ZODIAC_SIGNS.find((s) => s.slug === value), [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // No mobile, se o seletor estiver perto do fim da tela, abre "pra cima" pra não ficar escondido.
  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // dropdown ~ 320px; se não couber embaixo mas couber mais em cima, abre pra cima
    setOpenUp(spaceBelow < 320 && spaceAbove > spaceBelow);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          "w-full flex items-center justify-between gap-3 appearance-none bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-center text-base text-white outline-none focus:ring-4 focus:ring-white/10 transition-all hover:bg-black/60"
        }
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={current ? "text-white" : "text-slate-300"}>
          {current ? `${current.symbol} ${current.name}` : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className={
            // z alto pra ficar acima do botão e demais elementos
            "absolute z-[80] w-full max-h-72 overflow-auto rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl " +
            (openUp ? "bottom-full mb-2" : "top-full mt-2")
          }
        >
          {ZODIAC_SIGNS.map((s) => {
            const active = s.slug === value;
            return (
              <button
                key={s.slug}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(s.slug);
                  setOpen(false);
                }}
                className={
                  "w-full px-4 py-3 text-left text-slate-100 hover:bg-white/10 flex items-center gap-2 " +
                  (active ? "bg-white/10" : "")
                }
              >
                <span className="w-5 text-slate-300">{s.symbol}</span>
                <span className="font-medium">{s.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
