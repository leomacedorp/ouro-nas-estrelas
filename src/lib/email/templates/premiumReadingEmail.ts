export type PremiumReadingEmailData = {
  customerName: string;
  birth: string;
  birthTime?: string;
  birthPlace?: string;
  sign: string;
  numerology?: {
    destiny?: string;
    soul?: string;
    personality?: string;
    personalYear?: string;
  };
  cards: {
    numerologia: string;
    amor: string;
    dinheiro: string;
    carreira: string;
    bloqueio: string;
    oportunidade: string;
    conselho: string;
  };
  leituraCompleta: string;
  brandName?: string;
};

function esc(s: string) {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function p(text: string) {
  // Preserve paragraph breaks
  const safe = esc(text).replace(/\n\n+/g, '</p><p style="margin:0 0 14px 0">').replace(/\n/g, '<br/>');
  return `<p style="margin:0 0 14px 0">${safe}</p>`;
}

export function renderPremiumReadingEmailHtml(data: PremiumReadingEmailData) {
  const brand = data.brandName || 'Ouro nas Estrelas';

  const headerLines: string[] = [
    `<b>Nascimento:</b> ${esc(data.birth)}${data.birthTime ? ` — ${esc(data.birthTime)}` : ''}${data.birthPlace ? ` — ${esc(data.birthPlace)}` : ''}`,
    `<b>Signo solar:</b> ${esc(data.sign)}`,
  ];

  const n = data.numerology;
  const numerologyLine = [
    n?.destiny ? `Destino ${n.destiny}` : null,
    n?.soul ? `Alma ${n.soul}` : null,
    n?.personality ? `Personalidade ${n.personality}` : null,
    n?.personalYear ? `Ano pessoal ${n.personalYear}` : null,
  ].filter(Boolean).join(' · ');

  if (numerologyLine) headerLines.push(`<b>Numerologia:</b> ${esc(numerologyLine)}`);

  return `
<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
  <h2 style="margin:0 0 12px 0">Sua Leitura Premium</h2>
  <p style="margin:0 0 16px 0">
    Olá, <b>${esc(data.customerName)}</b>.<br/>
    Aqui está sua leitura premium (modelo) com base nos seus dados:<br/>
    ${headerLines.join('<br/>')}
  </p>

  <hr style="border:none;border-top:1px solid #ddd;margin:18px 0" />

  <h3 style="margin:0 0 10px 0">1) Numerologia</h3>
  ${p(data.cards.numerologia)}

  <h3 style="margin:0 0 10px 0">2) Amor</h3>
  ${p(data.cards.amor)}

  <h3 style="margin:0 0 10px 0">3) Dinheiro</h3>
  ${p(data.cards.dinheiro)}

  <h3 style="margin:0 0 10px 0">4) Carreira</h3>
  ${p(data.cards.carreira)}

  <h3 style="margin:0 0 10px 0">5) Bloqueio</h3>
  ${p(data.cards.bloqueio)}

  <h3 style="margin:0 0 10px 0">6) Oportunidade</h3>
  ${p(data.cards.oportunidade)}

  <h3 style="margin:0 0 10px 0">7) Conselho</h3>
  ${p(data.cards.conselho)}

  <hr style="border:none;border-top:1px solid #ddd;margin:18px 0" />

  <h3 style="margin:0 0 10px 0">Leitura Completa</h3>
  <div style="white-space:pre-line">
    ${p(data.leituraCompleta)}
  </div>

  <p style="margin:18px 0 0 0;color:#555;font-size:12px">
    ${esc(brand)} — leitura simbólica e psicológica (sem previsões).
  </p>
</div>
`.trim();
}
