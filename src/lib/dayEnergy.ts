/**
 * Energia do Dia (Home)
 *
 * Objetivo: criar uma frase curta e memorável para a entrada do site,
 * variando de forma consistente por dia (sem parecer aleatório a cada refresh).
 *
 * Regras:
 * - Linguagem simbólica/psicológica (sem prever eventos).
 * - Determinística por data (YYYY-MM-DD).
 */

export function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // 32-bit
  }
  return Math.abs(hash);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

const WEEKDAY_QUOTES: Record<number, string[]> = {
  // 0 = Domingo
  0: [
    'Hoje o corpo pede pausa e a mente pede menos cobrança.',
    'Hoje a vida pede silêncio bom: aquele que reorganiza por dentro.',
    'Hoje é dia de recolher energia e devolver gentileza a si.',
    'Hoje, descansar também é uma forma de clareza.',
    'Hoje a intuição fala melhor quando você desacelera.'
  ],
  // 1 = Segunda
  1: [
    'Hoje o dia pede direção: pouco, mas com intenção.',
    'Hoje é dia de recomeço silencioso — foco no essencial.',
    'Hoje, organizar o básico devolve paz.',
    'Hoje a energia favorece colocar ordem no que estava solto.',
    'Hoje, um passo firme vale mais que pressa.'
  ],
  // 2 = Terça
  2: [
    'Hoje a energia pede ação com consciência — sem atropelar você.',
    'Hoje, coragem tranquila: decidir e seguir.',
    'Hoje, cortar excesso é abrir espaço.',
    'Hoje o dia favorece movimento: pequena atitude, grande alívio.',
    'Hoje, prioridade é remédio para a ansiedade.'
  ],
  // 3 = Quarta
  3: [
    'Hoje o dia pede clareza: menos ruído, mais foco.',
    'Hoje, uma conversa limpa pode destravar tudo.',
    'Hoje, revisar a rota é tão importante quanto avançar.',
    'Hoje a energia favorece alinhar mente e coração.',
    'Hoje, simplificar é uma decisão inteligente.'
  ],
  // 4 = Quinta
  4: [
    'Hoje a energia favorece expansão responsável: crescer sem se perder.',
    'Hoje, visão de longo prazo acalma o imediato.',
    'Hoje, maturidade emocional é o verdadeiro impulso.',
    'Hoje, confiança nasce de experiência — não de pressa.',
    'Hoje o dia pede amplitude no olhar e firmeza no passo.'
  ],
  // 5 = Sexta
  5: [
    'Hoje a energia favorece conexão: presença vale mais que explicação.',
    'Hoje, verdade dita com cuidado vira paz.',
    'Hoje, leveza sem fuga: prazer com consciência.',
    'Hoje, gentileza bem colocada muda relações.',
    'Hoje o dia pede troca — mas sem perder seus limites.'
  ],
  // 6 = Sábado
  6: [
    'Hoje a energia pede aterramento: corpo, rotina leve e descanso.',
    'Hoje, simplificar é recuperar energia.',
    'Hoje, cuidar do que sustenta é cuidar de você.',
    'Hoje, desacelerar sem culpa é sabedoria.',
    'Hoje o dia pede reparo: fechar ciclos pequenos e respirar.'
  ]
};

export function getDayEnergyQuote(dateBr: string): string {
  // Evita timezone drift: fixo em "meio-dia UTC"
  const d = new Date(`${dateBr}T12:00:00.000Z`);
  const weekday = d.getUTCDay();
  const seed = simpleHash(dateBr);

  const quotes = WEEKDAY_QUOTES[weekday] || WEEKDAY_QUOTES[1];
  return pick(quotes, seed + 13);
}
