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
  // 0 = Domingo (recolhimento, intuição)
  0: [
    'O silêncio de hoje carrega respostas que a pressa de ontem não deixou você ouvir.',
    'Há um tipo de descanso que reorganiza a alma. Hoje ele está disponível.',
    'O que você não resolve descansando, não resolve correndo.',
    'Intuição aguçada: confie no que você sente antes de pensar.',
    'Permita-se o luxo do vazio produtivo. O universo trabalha enquanto você respira.'
  ],
  // 1 = Segunda (recomeço, foco)
  1: [
    'O universo favorece quem começa pequeno mas com a direção certa.',
    'Menos planos, mais ação. Um passo vale mais que mil intenções.',
    'A clareza que você busca está do outro lado da primeira decisão.',
    'Hoje, organizar o caos interno reorganiza o mundo externo.',
    'Novo ciclo, nova chance. O passado não tem poder sobre este momento.'
  ],
  // 2 = Terça (ação, coragem)
  2: [
    'A coragem não espera a hora certa. Ela cria a hora certa.',
    'O medo que você enfrenta hoje vira força amanhã.',
    'Movimento consciente: cada passo carrega intenção, não desespero.',
    'Corte o que não serve. Espaço vazio atrai abundância.',
    'A hesitação é o único obstáculo real entre você e o que deseja.'
  ],
  // 3 = Quarta (clareza, comunicação)
  3: [
    'A verdade dita com amor cura. O silêncio dito com medo adoece.',
    'Clarifique antes de complicar. Simplicidade é inteligência refinada.',
    'Uma conversa honesta hoje evita meses de mal-entendidos.',
    'Sua mente é aliada quando focada, tirânica quando dispersa. Escolha.',
    'O que precisa ser dito já sabe o caminho. Apenas solte.'
  ],
  // 4 = Quinta (expansão, visão)
  4: [
    'Visão de águia: veja longe, mas não perca o chão de vista.',
    'Abundância é estado interno. Quando você muda, o externo acompanha.',
    'Crescer dói menos quando você não resiste ao processo.',
    'O universo conspira a favor de quem age com fé e estratégia.',
    'Sonhe grande, comece agora. A grandeza mora nos detalhes do presente.'
  ],
  // 5 = Sexta (conexão, prazer)
  5: [
    'Conexões verdadeiras não exigem esforço. Fluem como rio encontrando o mar.',
    'Permita-se o prazer sem culpa. Você merece colher o que plantou.',
    'A leveza de hoje é o combustível para a seriedade de amanhã.',
    'Quem você ama precisa da sua presença, não da sua perfeição.',
    'A alegria não é recompensa. É o caminho.'
  ],
  // 6 = Sábado (aterramento, reparo)
  6: [
    'Cuide das raízes para que as flores não murchem.',
    'Fazer menos com mais presença supera fazer muito com pressa.',
    'Seu corpo é templo. Hoje ele pede reverência, não exigência.',
    'Feche pequenos ciclos. A paz mora na conclusão do incompleto.',
    'Descanso não é preguiça. É a inteligência de quem sabe durar.'
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
