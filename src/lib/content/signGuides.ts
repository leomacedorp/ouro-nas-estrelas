import type { ZODIAC_SIGNS } from '../constants';

export type SignSlug = typeof ZODIAC_SIGNS extends readonly (infer T)[]
  ? T extends { slug: infer S }
    ? S extends string
      ? S
      : never
    : never
  : string;

export interface SignGuide {
  headline: string;
  essence: string;
  strengths: string[];
  shadows: string[];
  love: string;
  work: string;
  money: string;
  faqs: { q: string; a: string }[];
}

// Conteúdo evergreen (SEO): guia por signo.
// Objetivo: ser estável, útil e indexável. A “Mensagem do Dia” entra como bloco separado na página.
export const SIGN_GUIDES: Record<string, SignGuide> = {
  aries: {
    headline: 'Coragem, iniciativa e ação consciente',
    essence:
      'Áries é o impulso do começo. É o signo que abre caminhos, toma a frente e aprende fazendo. Quando canaliza bem a energia, vira liderança e coragem prática; quando exagera, vira pressa e conflito desnecessário.',
    strengths: ['iniciativa', 'coragem', 'autenticidade', 'capacidade de recomeçar'],
    shadows: ['impaciência', 'reatividade', 'competitividade excessiva', 'agir sem estratégia'],
    love:
      'No amor, Áries precisa de movimento e sinceridade. A chama acende rápido — o segredo é transformar impulso em presença e escuta.',
    work:
      'Na carreira, funciona melhor com autonomia, metas claras e desafios. Quando sente estagnação, perde energia. Projetos novos e liderança favorecem.',
    money:
      'Finanças pedem disciplina para não virar gasto emocional. Áries prospera quando coloca energia em execução e não em pressa.',
    faqs: [
      { q: 'Áries combina com quais signos?', a: 'Em geral, combina bem com Fogo (Leão, Sagitário) e com Ar (Gêmeos, Libra, Aquário), que alimentam o movimento e a troca.' },
      { q: 'Qual o maior desafio de Áries?', a: 'Aprender a pausar sem sentir que está perdendo. Estratégia e constância potencializam a coragem.' }
    ]
  },
  touro: {
    headline: 'Estabilidade, prazer e construção a longo prazo',
    essence:
      'Touro é o signo da consistência. Valoriza segurança, conforto e o que é real. Quando está alinhado, constrói com calma e firmeza; quando está em medo, resiste ao novo e se prende ao conhecido.',
    strengths: ['constância', 'senso de valor', 'paciência', 'capacidade de construir'],
    shadows: ['teimosia', 'apego', 'comodismo', 'medo de mudanças'],
    love:
      'No amor, Touro busca lealdade e presença. Pequenos rituais e cuidado no cotidiano valem mais do que promessas grandiosas.',
    work:
      'Na carreira, cresce quando tem previsibilidade e metas claras. Excelência vem do ritmo próprio. Mudanças funcionam melhor quando são planejadas.',
    money:
      'Boa intuição para poupar e acumular. O ponto de atenção é não travar por medo: dinheiro também precisa circular com consciência.',
    faqs: [
      { q: 'Touro é ciumento?', a: 'Pode ser quando sente insegurança. Confiança e rotina afetiva bem combinadas reduzem esse padrão.' },
      { q: 'O que Touro precisa para prosperar?', a: 'Constância, planejamento e escolhas financeiras que respeitem conforto sem virar gasto automático.' }
    ]
  },
  gemeos: {
    headline: 'Curiosidade, comunicação e inteligência em movimento',
    essence:
      'Gêmeos é o signo das conexões. Aprende rápido, adapta, comunica e cria pontes. Quando está bem, vira leveza e clareza; quando exagera, vira dispersão e ansiedade mental.',
    strengths: ['comunicação', 'adaptabilidade', 'curiosidade', 'rede de contatos'],
    shadows: ['dispersão', 'superficialidade', 'indecisão', 'excesso de estímulos'],
    love:
      'No amor, precisa de diálogo e novidade. Relação forte é aquela em que existe amizade, humor e conversa honesta.',
    work:
      'Na carreira, brilha em áreas que envolvem comunicação, vendas, ensino e criação. A chave é foco: menos frentes ao mesmo tempo.',
    money:
      'Pode ter múltiplas fontes de renda, mas precisa de organização. Detalhes contratuais importam muito.',
    faqs: [
      { q: 'Gêmeos muda muito de ideia?', a: 'Pode mudar quando aprende algo novo. O lado positivo é adaptação; o desafio é sustentar decisões.' },
      { q: 'Como Gêmeos melhora o foco?', a: 'Escolhendo poucas prioridades por dia e reduzindo distrações (principalmente digitais).' }
    ]
  },
  cancer: {
    headline: 'Sensibilidade, proteção e vínculo verdadeiro',
    essence:
      'Câncer é o signo do cuidado e da memória emocional. A intuição é forte e o coração é bússola. Quando está bem, vira acolhimento e força silenciosa; quando está ferido, vira retraimento e defesa.',
    strengths: ['intuição', 'lealdade', 'cuidado', 'profundidade emocional'],
    shadows: ['excesso de cautela', 'apego ao passado', 'oscilação emocional', 'se fechar demais'],
    love:
      'No amor, precisa de segurança e reciprocidade. A relação floresce quando o cuidado é mútuo e existe espaço para vulnerabilidade.',
    work:
      'Na carreira, funciona melhor em ambientes humanos e com propósito. A sensibilidade vira vantagem quando canalizada em empatia e leitura de contexto.',
    money:
      'Tende a buscar segurança financeira para acalmar emoções. Planejamento e reserva reduzem ansiedade e liberam energia para crescer.',
    faqs: [
      { q: 'Câncer é carente?', a: 'Pode parecer quando não se sente seguro. Com afeto consistente, o signo se torna muito estável.' },
      { q: 'Como Câncer lida com mudanças?', a: 'Melhor com transições suaves e previsibilidade. Mudanças bruscas pedem tempo de adaptação.' }
    ]
  },
  leao: {
    headline: 'Expressão, generosidade e autoestima real',
    essence:
      'Leão é o signo do brilho. Quer viver com verdade e criar impacto. Quando está bem, inspira e aquece; quando está inseguro, busca validação e se protege com orgulho.',
    strengths: ['carisma', 'criatividade', 'lealdade', 'liderança'],
    shadows: ['necessidade de aplauso', 'orgulho', 'drama', 'rigidez do ego'],
    love:
      'No amor, Leão precisa de admiração e carinho. Relações fortes têm elogio sincero, presença e diversão — sem jogos de poder.',
    work:
      'Na carreira, brilha onde pode criar, liderar e se posicionar. Quando tem palco e responsabilidade, entrega muito.',
    money:
      'Tende a gastar com experiência/estética. Prosperidade vem quando equilibra generosidade com estratégia e reserva.',
    faqs: [
      { q: 'Leão gosta de atenção?', a: 'Sim, mas principalmente de reconhecimento verdadeiro. Quando a autoestima está saudável, não precisa mendigar aplauso.' },
      { q: 'Como Leão evita conflitos?', a: 'Separando orgulho de valor pessoal e praticando humildade em conversas difíceis.' }
    ]
  },
  virgem: {
    headline: 'Clareza, serviço e melhoria contínua',
    essence:
      'Virgem é o signo do refinamento. Observa detalhes, melhora processos e busca eficiência. Quando está bem, vira excelência e cuidado; quando exagera, vira autocobrança e crítica constante.',
    strengths: ['organização', 'disciplina', 'praticidade', 'senso de melhoria'],
    shadows: ['perfeccionismo', 'ansiedade', 'autocrítica', 'controle excessivo'],
    love:
      'No amor, demonstra afeto com atitudes e cuidado. O desafio é lembrar de acolher (não só consertar).',
    work:
      'Na carreira, cresce quando tem autonomia para otimizar e padronizar. É ótimo para análise, operações, saúde e qualidade.',
    money:
      'Bom para planejar e cortar desperdícios. Atenção para não confundir segurança com medo de investir no que melhora a vida.',
    faqs: [
      { q: 'Virgem é frio?', a: 'Não. Só demonstra de forma prática. Quando se sente seguro, é muito afetuoso e presente.' },
      { q: 'Como Virgem reduz ansiedade?', a: 'Rotina simples, sono e “feito > perfeito” ajudam muito.' }
    ]
  },
  libra: {
    headline: 'Harmonia, diplomacia e escolhas maduras',
    essence:
      'Libra é o signo do equilíbrio e das relações. Busca justiça, beleza e conexão. Quando está bem, une pessoas; quando evita conflito, se perde em indecisão.',
    strengths: ['diplomacia', 'senso de justiça', 'estética', 'parcerias'],
    shadows: ['indecisão', 'evitar confronto', 'necessidade de aprovação', 'agradar demais'],
    love:
      'No amor, Libra precisa de parceria e gentileza. A relação cresce quando existe diálogo e quando o “não” também é permitido.',
    work:
      'Na carreira, brilha em negociação, atendimento, RH, design, direito e tudo que envolve mediação e estética.',
    money:
      'Pode gastar com beleza e experiências. Planejamento ajuda a manter equilíbrio sem culpa.',
    faqs: [
      { q: 'Libra tem dificuldade de decidir?', a: 'Pode ter, porque enxerga prós e contras. Definir critérios e prazos ajuda a destravar.' },
      { q: 'Como Libra lida com conflito?', a: 'Melhor quando encara com diplomacia. Conflito bem conduzido aumenta intimidade.' }
    ]
  },
  escorpiao: {
    headline: 'Intensidade, verdade e transformação',
    essence:
      'Escorpião é o signo da profundidade. Quer o real, sem máscara. Quando está bem, vira coragem emocional e poder pessoal; quando está ferido, vira controle e desconfiança.',
    strengths: ['intensidade', 'foco', 'lealdade', 'capacidade de renascer'],
    shadows: ['ciúme', 'controle', 'ressentimento', 'paranoia'],
    love:
      'No amor, busca profundidade e confiança. Relações fortes exigem transparência e limites saudáveis.',
    work:
      'Na carreira, tem talento para investigação, estratégia, crises e temas complexos. É forte em resolver o que outros evitam.',
    money:
      'Pode ter visão para “dinheiro escondido” (oportunidades). Precisa evitar decisões por emoção e vingança.',
    faqs: [
      { q: 'Escorpião perdoa?', a: 'Perdoa quando há verdade e reparo. O desafio é soltar o controle e não ruminar.' },
      { q: 'Como Escorpião se acalma?', a: 'Com profundidade: silêncio, introspecção, terapia, esporte intenso e descarrego emocional saudável.' }
    ]
  },
  sagitario: {
    headline: 'Expansão, fé e sentido',
    essence:
      'Sagitário é o signo da expansão. Busca liberdade, visão e propósito. Quando está bem, inspira; quando exagera, promete demais e perde constância.',
    strengths: ['otimismo', 'visão', 'humor', 'coragem para explorar'],
    shadows: ['exagero', 'falta de consistência', 'franqueza sem tato', 'fuga do tédio'],
    love:
      'No amor, precisa de espaço e honestidade. Relações fortes têm aventura e amizade, sem controle.',
    work:
      'Na carreira, brilha em ensino, vendas, comunicação, turismo e projetos com autonomia. Precisa de metas para não se dispersar.',
    money:
      'Pode gastar com experiências e generosidade. Planejamento simples evita exageros e mantém liberdade.',
    faqs: [
      { q: 'Sagitário odeia rotina?', a: 'Tende a cansar do repetitivo. Rotina funciona melhor quando tem propósito e margem para novidade.' },
      { q: 'Como Sagitário prospera?', a: 'Com visão + execução: transformar entusiasmo em passos concretos.' }
    ]
  },
  capricornio: {
    headline: 'Disciplina, estrutura e realização',
    essence:
      'Capricórnio é o signo da construção. Trabalha com o tempo e com a realidade. Quando está bem, vira consistência e liderança; quando pesa, vira cobrança e rigidez.',
    strengths: ['disciplina', 'maturidade', 'responsabilidade', 'foco em longo prazo'],
    shadows: ['autocobrança', 'pessimismo', 'isolamento', 'rigidez'],
    love:
      'No amor, demonstra com presença e compromisso. A relação melhora quando o afeto também é dito, não só feito.',
    work:
      'Na carreira, é excelente em gestão, estratégia e execução. Cresce quando delega e não carrega tudo sozinho.',
    money:
      'Planeja bem e constrói patrimônio. O desafio é não viver só para o futuro e esquecer o presente.',
    faqs: [
      { q: 'Capricórnio é frio?', a: 'Não. É reservado. Quando confia, é muito leal e protetor.' },
      { q: 'Como Capricórnio evita esgotamento?', a: 'Descanso como prioridade e limites claros. Constância sem pausa vira desgaste.' }
    ]
  },
  aquario: {
    headline: 'Visão, inovação e liberdade com propósito',
    essence:
      'Aquário é o signo do novo. Pensa diferente, enxerga tendências e valoriza autonomia. Quando está bem, vira inovação e comunidade; quando exagera, vira distância emocional.',
    strengths: ['criatividade', 'visão de futuro', 'independência', 'rede/comunidade'],
    shadows: ['frieza', 'rebeldia sem direção', 'isolamento', 'teimosia intelectual'],
    love:
      'No amor, precisa de amizade e liberdade. Relações saudáveis respeitam espaço e estimulam a mente.',
    work:
      'Na carreira, brilha em tecnologia, produto, estratégia, comunidades e inovação. Precisa de autonomia e ambientes menos rígidos.',
    money:
      'Pode ganhar com ideias e projetos digitais. Precisa de organização para transformar visão em receita.',
    faqs: [
      { q: 'Aquário é desapegado?', a: 'Pode parecer. Ele sente, mas processa pela mente. Conexão cresce com diálogo e respeito ao espaço.' },
      { q: 'Como Aquário prospera?', a: 'Inovando com método: transformar ideias em produto, serviço ou comunidade.' }
    ]
  },
  peixes: {
    headline: 'Intuição, compaixão e limites',
    essence:
      'Peixes é o signo da sensibilidade. Capta nuances e cria beleza no mundo. Quando está bem, vira empatia e arte; quando perde limites, vira exaustão e fuga.',
    strengths: ['intuição', 'compaixão', 'imaginação', 'capacidade de cura'],
    shadows: ['fuga', 'falta de foco', 'absorver problemas alheios', 'idealização'],
    love:
      'No amor, busca conexão emocional e delicadeza. Precisa de limites para não se sacrificar demais.',
    work:
      'Na carreira, brilha em arte, cuidado, terapia, educação e tudo que exige sensibilidade. Precisa de rotina mínima para sustentar o talento.',
    money:
      'Prospera quando organiza o básico e não confunde “bondade” com perder dinheiro. Clareza e contratos ajudam.',
    faqs: [
      { q: 'Peixes é sonhador?', a: 'Sim. O desafio é trazer sonho para a prática com passos simples e consistentes.' },
      { q: 'Como Peixes cria limites?', a: 'Dizendo “não” sem culpa, reduzindo exposição e priorizando descanso e rotina.' }
    ]
  },
};
