/**
 * Mapa Simbólico - Arquétipos psicológicos profundos dos signos
 * Parte da Engine Simbólica para leituras premium personalizadas
 */

import { generateNumerologyProfile, NumerologyProfile, getNumerologySummary } from './numerology';
import { getAstronomicalContext, AstronomicalContext, getAstronomyDescription } from './astronomy';

// ========== TIPOS ==========

export interface SignArchetype {
    sign: string;
    signSlug: string;
    element: 'fogo' | 'terra' | 'ar' | 'água';
    quality: 'cardinal' | 'fixo' | 'mutável';
    ruler: string;
    symbol: string;
    coreIdentity: string;
    emotionalPatterns: string[];
    strengths: string[];
    challenges: string[];
    hiddenDesire: string;
    deepFear: string;
    lovePattern: string;
    moneyPattern: string;
    workPattern: string;
    healingKey: string;
}

export interface SymbolicMap {
    identity: {
        name: string;
        firstName: string;
        sign: string;
        birthDate: string;
    };
    numerology: NumerologyProfile;
    astronomy: AstronomicalContext;
    archetype: SignArchetype;
    generatedAt: string;
}

// ========== ARQUÉTIPOS DOS 12 SIGNOS ==========

const SIGN_ARCHETYPES: Record<string, SignArchetype> = {
    aries: {
        sign: 'Áries',
        signSlug: 'aries',
        element: 'fogo',
        quality: 'cardinal',
        ruler: 'Marte',
        symbol: '♈',
        coreIdentity: 'O Guerreiro que inicia, conquista e abre caminhos com coragem',
        emotionalPatterns: [
            'Reações intensas e imediatas às situações',
            'Dificuldade em lidar com a espera e a paciência',
            'Necessidade de ação para processar emoções',
            'Tendência a explodir e depois esquecer rapidamente'
        ],
        strengths: ['Coragem', 'Iniciativa', 'Autenticidade', 'Energia vital'],
        challenges: ['Impulsividade', 'Impaciência', 'Egocentrismo', 'Agressividade'],
        hiddenDesire: 'Ser reconhecido como pioneiro e herói',
        deepFear: 'Ser irrelevante, não deixar marca no mundo',
        lovePattern: 'Busca conquista e intensidade. Precisa aprender a sustentar depois de conquistar.',
        moneyPattern: 'Ganha bem quando lidera. Gasta impulsivamente. Precisa de freio.',
        workPattern: 'Excelente para começar projetos. Precisa de equipe para manter.',
        healingKey: 'Aprender que pausar não é fraqueza, é estratégia'
    },
    touro: {
        sign: 'Touro',
        signSlug: 'touro',
        element: 'terra',
        quality: 'fixo',
        ruler: 'Vênus',
        symbol: '♉',
        coreIdentity: 'O Construtor que materializa, estabiliza e aprecia a beleza',
        emotionalPatterns: [
            'Processamento lento mas profundo das emoções',
            'Teimosia como mecanismo de autopreservação',
            'Necessidade de segurança material para paz emocional',
            'Dificuldade em aceitar mudanças não planejadas'
        ],
        strengths: ['Persistência', 'Sensualidade', 'Praticidade', 'Lealdade'],
        challenges: ['Teimosia', 'Possessividade', 'Resistência à mudança', 'Materialismo'],
        hiddenDesire: 'Construir algo duradouro e belo que perdure',
        deepFear: 'Perder tudo que construiu, instabilidade total',
        lovePattern: 'Lento para se entregar, mas extremamente leal. Precisa de demonstrações concretas.',
        moneyPattern: 'Excelente para acumular. Valoriza qualidade. Pode ser avarento.',
        workPattern: 'Consistente e confiável. Melhor em rotinas. Não force mudanças bruscas.',
        healingKey: 'Aceitar que a única constante é a mudança'
    },
    gemeos: {
        sign: 'Gêmeos',
        signSlug: 'gemeos',
        element: 'ar',
        quality: 'mutável',
        ruler: 'Mercúrio',
        symbol: '♊',
        coreIdentity: 'O Comunicador que conecta, aprende e traduz mundos',
        emotionalPatterns: [
            'Racionalização das emoções como defesa',
            'Necessidade de verbalizar para processar',
            'Mudanças rápidas de humor e interesse',
            'Dificuldade em sustentar intensidade emocional'
        ],
        strengths: ['Comunicação', 'Versatilidade', 'Curiosidade', 'Adaptabilidade'],
        challenges: ['Superficialidade', 'Dispersão', 'Inconsistência', 'Ansiedade mental'],
        hiddenDesire: 'Entender tudo, conectar todos os pontos',
        deepFear: 'Ficar preso, não ter saída, monotonia',
        lovePattern: 'Precisa de estímulo mental constante. Conversa é afeto. Pode parecer frio.',
        moneyPattern: 'Múltiplas fontes de renda. Gasta com informação e mobilidade.',
        workPattern: 'Excelente multitarefa. Precisa de variedade. Evite rotinas rígidas.',
        healingKey: 'Aprofundar em vez de só ampliar'
    },
    cancer: {
        sign: 'Câncer',
        signSlug: 'cancer',
        element: 'água',
        quality: 'cardinal',
        ruler: 'Lua',
        symbol: '♋',
        coreIdentity: 'O Protetor que nutre, cuida e preserva memórias',
        emotionalPatterns: [
            'Sensibilidade extrema ao ambiente e às pessoas',
            'Dificuldade em soltar o passado e mágoas',
            'Necessidade de segurança emocional para funcionar',
            'Tendência a se fechar quando ferido (casca do caranguejo)'
        ],
        strengths: ['Intuição', 'Cuidado', 'Memória emocional', 'Proteção'],
        challenges: ['Apego', 'Mágoa guardada', 'Manipulação emocional', 'Dependência'],
        hiddenDesire: 'Criar um lar seguro onde todos são amados incondicionalmente',
        deepFear: 'Abandono, não ter para onde voltar, ser esquecido',
        lovePattern: 'Cuida intensamente. Pode sufocar. Precisa se sentir necessário.',
        moneyPattern: 'Foco em segurança familiar. Economiza para emergências. Generoso com os seus.',
        workPattern: 'Prospera em ambientes acolhedores. Excelente em cuidar de pessoas/projetos.',
        healingKey: 'Aprender a soltar sem se perder'
    },
    leao: {
        sign: 'Leão',
        signSlug: 'leao',
        element: 'fogo',
        quality: 'fixo',
        ruler: 'Sol',
        symbol: '♌',
        coreIdentity: 'O Rei/Rainha que irradia, lidera e inspira pelo exemplo',
        emotionalPatterns: [
            'Necessidade profunda de reconhecimento e admiração',
            'Generosidade como expressão de poder',
            'Dificuldade em mostrar vulnerabilidade',
            'Drama como forma de processar emoções'
        ],
        strengths: ['Liderança', 'Generosidade', 'Criatividade', 'Carisma'],
        challenges: ['Orgulho', 'Arrogância', 'Necessidade de atenção', 'Autoritarismo'],
        hiddenDesire: 'Ser amado por quem você é, não pelo que faz',
        deepFear: 'Ser ignorado, não importar, ser comum',
        lovePattern: 'Ama intensamente e espera devoção. Precisa ser o centro, mas também é muito leal.',
        moneyPattern: 'Ganha bem em posições de destaque. Gasta com luxo e generosidade.',
        workPattern: 'Nasce para liderar. Precisa de reconhecimento. Excelente motivador.',
        healingKey: 'Descobrir que ser vulnerável é a maior força'
    },
    virgem: {
        sign: 'Virgem',
        signSlug: 'virgem',
        element: 'terra',
        quality: 'mutável',
        ruler: 'Mercúrio',
        symbol: '♍',
        coreIdentity: 'O Analista que aperfeiçoa, serve e busca a excelência',
        emotionalPatterns: [
            'Autocrítica constante como mecanismo de controle',
            'Ansiedade por imperfeição e erros',
            'Dificuldade em aceitar elogios e abundância',
            'Expressão de amor através do serviço e ajuda prática'
        ],
        strengths: ['Análise', 'Serviço', 'Discernimento', 'Praticidade'],
        challenges: ['Perfeccionismo', 'Autocrítica', 'Preocupação excessiva', 'Rigidez'],
        hiddenDesire: 'Ser reconhecido por sua competência e utilidade',
        deepFear: 'Ser inútil, incompetente, não servir para nada',
        lovePattern: 'Demonstra amor cuidando. Pode criticar por amor. Precisa relaxar exigências.',
        moneyPattern: 'Excelente em administrar. Pode economizar demais. Precisa se permitir prazer.',
        workPattern: 'Perfeccionista. Excelente em detalhes. Pode travar buscando perfeição.',
        healingKey: 'Aceitar que "bom o suficiente" é bom o suficiente'
    },
    libra: {
        sign: 'Libra',
        signSlug: 'libra',
        element: 'ar',
        quality: 'cardinal',
        ruler: 'Vênus',
        symbol: '♎',
        coreIdentity: 'O Diplomata que harmoniza, equilibra e busca justiça',
        emotionalPatterns: [
            'Dificuldade em tomar partido e fazer escolhas definitivas',
            'Tendência a se moldar ao outro para manter paz',
            'Necessidade de relacionamento para se sentir completo',
            'Conflito interno entre necessidades próprias e alheias'
        ],
        strengths: ['Diplomacia', 'Equilíbrio', 'Senso estético', 'Justiça'],
        challenges: ['Indecisão', 'Dependência de aprovação', 'Passivo-agressividade', 'Superficialidade'],
        hiddenDesire: 'Encontrar a parceria perfeita que o complete',
        deepFear: 'Solidão, rejeição, ser considerado injusto',
        lovePattern: 'Vive para o relacionamento. Pode se perder no outro. Precisa manter identidade.',
        moneyPattern: 'Gasta com beleza e experiências sociais. Precisa de equilíbrio entre poupar e gastar.',
        workPattern: 'Excelente em parcerias e mediação. Pode procrastinar decisões importantes.',
        healingKey: 'Aprender que conflito às vezes é saudável'
    },
    escorpiao: {
        sign: 'Escorpião',
        signSlug: 'escorpiao',
        element: 'água',
        quality: 'fixo',
        ruler: 'Plutão',
        symbol: '♏',
        coreIdentity: 'O Transformador que penetra, regenera e renasce das cinzas',
        emotionalPatterns: [
            'Intensidade emocional que pode ser avassaladora',
            'Dificuldade em perdoar e esquecer traições',
            'Necessidade de controle como proteção',
            'Tendência a testar limites e lealdade dos outros'
        ],
        strengths: ['Intensidade', 'Profundidade', 'Resiliência', 'Intuição psicológica'],
        challenges: ['Ciúme', 'Manipulação', 'Ressentimento', 'Obsessão'],
        hiddenDesire: 'Fundir-se completamente com alguém, intimidade total',
        deepFear: 'Traição, perder o controle, exposição da vulnerabilidade',
        lovePattern: 'Ama com profundidade total. Tudo ou nada. Pode sufocar de intensidade.',
        moneyPattern: 'Bom com recursos compartilhados. Pode usar dinheiro como poder.',
        workPattern: 'Excelente investigador. Não desiste. Pode criar inimigos por intensidade.',
        healingKey: 'Transformar sem destruir, soltar sem abandonar'
    },
    sagitario: {
        sign: 'Sagitário',
        signSlug: 'sagitario',
        element: 'fogo',
        quality: 'mutável',
        ruler: 'Júpiter',
        symbol: '♐',
        coreIdentity: 'O Explorador que expande, busca verdade e significa',
        emotionalPatterns: [
            'Otimismo como mecanismo de defesa',
            'Dificuldade em lidar com limitações e rotina',
            'Necessidade de liberdade e espaço para crescer',
            'Tendência a fugir quando as coisas ficam pesadas'
        ],
        strengths: ['Otimismo', 'Sabedoria', 'Generosidade', 'Aventura'],
        challenges: ['Excesso', 'Falta de tato', 'Irresponsabilidade', 'Inquietude'],
        hiddenDesire: 'Encontrar o significado último da existência',
        deepFear: 'Perder a liberdade, ficar preso, vida sem sentido',
        lovePattern: 'Precisa de parceiro que cresça junto. Pode fugir de compromisso. Ama com entusiasmo.',
        moneyPattern: 'Gasta com experiências e viagens. Sortudo, mas pode exagerar.',
        workPattern: 'Precisa de propósito maior. Excelente em ensinar e inspirar.',
        healingKey: 'Aprender que às vezes a jornada é para dentro'
    },
    capricornio: {
        sign: 'Capricórnio',
        signSlug: 'capricornio',
        element: 'terra',
        quality: 'cardinal',
        ruler: 'Saturno',
        symbol: '♑',
        coreIdentity: 'O Mestre que estrutura, conquista e deixa legado',
        emotionalPatterns: [
            'Repressão emocional como forma de controle',
            'Medo de parecer fraco ou incompetente',
            'Dificuldade em pedir ajuda',
            'Tendência a carregar peso excessivo sozinho'
        ],
        strengths: ['Disciplina', 'Ambição', 'Responsabilidade', 'Perseverança'],
        challenges: ['Frieza', 'Workaholismo', 'Pessimismo', 'Rigidez'],
        hiddenDesire: 'Construir um legado que seja respeitado',
        deepFear: 'Fracasso, não ser respeitado, chegar ao fim sem conquistar',
        lovePattern: 'Demonstra amor com compromisso e provisão. Pode parecer distante. Leal até o fim.',
        moneyPattern: 'Excelente em construir patrimônio. Pode sacrificar prazer por segurança.',
        workPattern: 'Nasceu para grandes conquistas. Pode esquecer de viver no processo.',
        healingKey: 'Permitir-se prazer e descanso sem culpa'
    },
    aquario: {
        sign: 'Aquário',
        signSlug: 'aquario',
        element: 'ar',
        quality: 'fixo',
        ruler: 'Urano',
        symbol: '♒',
        coreIdentity: 'O Visionário que revoluciona, liberta e pensa no coletivo',
        emotionalPatterns: [
            'Distanciamento emocional como proteção',
            'Dificuldade com intimidade e vulnerabilidade',
            'Necessidade de ser diferente e original',
            'Tendência a intelectualizar emoções'
        ],
        strengths: ['Originalidade', 'Humanitarismo', 'Independência', 'Visão de futuro'],
        challenges: ['Distanciamento', 'Excentricidade', 'Teimosia ideológica', 'Frieza'],
        hiddenDesire: 'Fazer diferença no mundo, deixar marca coletiva',
        deepFear: 'Ser como todo mundo, perder a individualidade',
        lovePattern: 'Precisa de amizade antes. Liberdade é essencial. Ama a humanidade mais que indivíduos.',
        moneyPattern: 'Pode ter ideias geniais. Nem sempre liga para dinheiro. Generoso com causas.',
        workPattern: 'Inovador. Precisa de liberdade. Excelente em tecnologia e causas sociais.',
        healingKey: 'Equilibrar mente e coração, coletivo e individual'
    },
    peixes: {
        sign: 'Peixes',
        signSlug: 'peixes',
        element: 'água',
        quality: 'mutável',
        ruler: 'Netuno',
        symbol: '♓',
        coreIdentity: 'O Místico que dissolve, sonha e conecta com o transcendente',
        emotionalPatterns: [
            'Absorção de emoções alheias como esponja',
            'Dificuldade em distinguir fantasia de realidade',
            'Tendência a escapar quando a realidade pesa',
            'Necessidade de recolhimento e solidão regeneradora'
        ],
        strengths: ['Intuição', 'Compaixão', 'Criatividade', 'Espiritualidade'],
        challenges: ['Escapismo', 'Vitimização', 'Indefinição', 'Dependência'],
        hiddenDesire: 'Fundir-se com algo maior, transcender a separação',
        deepFear: 'A dureza do mundo real, não ter para onde fugir',
        lovePattern: 'Amor incondicional, pode se sacrificar demais. Precisa de limites saudáveis.',
        moneyPattern: 'Pode ter relação confusa com dinheiro. Generoso demais. Precisa de estrutura.',
        workPattern: 'Excelente em artes e cuidado. Precisa de ambiente acolhedor. Evite ambientes tóxicos.',
        healingKey: 'Aterrar os sonhos na realidade sem perdê-los'
    }
};

// ========== FUNÇÕES ==========

/**
 * Normaliza slug do signo
 */
function normalizeSignSlug(sign: string): string {
    const normalized = sign.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z]/g, '');

    // Mapear variações
    const mapping: Record<string, string> = {
        'aries': 'aries',
        'touro': 'touro',
        'taurus': 'touro',
        'gemeos': 'gemeos',
        'gemini': 'gemeos',
        'cancer': 'cancer',
        'leao': 'leao',
        'leo': 'leao',
        'virgem': 'virgem',
        'virgo': 'virgem',
        'libra': 'libra',
        'escorpiao': 'escorpiao',
        'scorpio': 'escorpiao',
        'sagitario': 'sagitario',
        'sagittarius': 'sagitario',
        'capricornio': 'capricornio',
        'capricorn': 'capricornio',
        'aquario': 'aquario',
        'aquarius': 'aquario',
        'peixes': 'peixes',
        'pisces': 'peixes'
    };

    return mapping[normalized] || normalized;
}

/**
 * Obtém arquétipo de um signo
 */
export function getSignArchetype(sign: string): SignArchetype {
    const slug = normalizeSignSlug(sign);
    return SIGN_ARCHETYPES[slug] || SIGN_ARCHETYPES.aries;
}

/**
 * Extrai primeiro nome
 */
function extractFirstName(fullName: string): string {
    return fullName.trim().split(/\s+/)[0] || fullName;
}

/**
 * Constrói Mapa Simbólico completo
 */
export function buildSymbolicMap(
    fullName: string,
    birthDate: string,
    sign: string,
    referenceDate?: Date
): SymbolicMap {
    const ref = referenceDate || new Date();

    return {
        identity: {
            name: fullName,
            firstName: extractFirstName(fullName),
            sign: normalizeSignSlug(sign),
            birthDate
        },
        numerology: generateNumerologyProfile(fullName, birthDate, ref),
        astronomy: getAstronomicalContext(ref),
        archetype: getSignArchetype(sign),
        generatedAt: ref.toISOString()
    };
}

/**
 * Gera resumo textual do Mapa Simbólico
 */
export function getSymbolicMapSummary(map: SymbolicMap): string {
    const { identity, numerology, astronomy, archetype } = map;

    return [
        `${identity.firstName} - ${archetype.sign} (${archetype.coreIdentity})`,
        getNumerologySummary(numerology),
        astronomy.summary
    ].join(' | ');
}

/**
 * Gera descrição textual para o prompt
 */
export function getSymbolicMapDescription(map: SymbolicMap): string {
    const { identity, numerology, astronomy, archetype } = map;
    const astroDesc = getAstronomyDescription(astronomy);

    return `
=== PERFIL DE ${identity.firstName.toUpperCase()} ===

IDENTIDADE:
- Nome: ${identity.firstName}
- Signo: ${archetype.sign} (${archetype.symbol})
- Essência: ${archetype.coreIdentity}

NUMEROLOGIA:
- Destino: ${numerology.destiny.number} - ${numerology.destiny.interpretation.title}
  ${numerology.destiny.interpretation.essence}
- Ano Pessoal: ${numerology.personalYear.number} - ${numerology.personalYear.interpretation.title}
  ${numerology.personalYear.interpretation.essence}
- Ciclo de Vida: ${numerology.lifeCycle.name}
  ${numerology.lifeCycle.description}

CONTEXTO ASTRONÔMICO:
${astroDesc}

PADRÕES EMOCIONAIS:
${archetype.emotionalPatterns.map(p => `• ${p}`).join('\n')}

FORÇAS: ${archetype.strengths.join(', ')}
DESAFIOS: ${archetype.challenges.join(', ')}

DINÂMICAS:
- Amor: ${archetype.lovePattern}
- Dinheiro: ${archetype.moneyPattern}
- Trabalho: ${archetype.workPattern}

PSICOLOGIA PROFUNDA:
- Desejo oculto: ${archetype.hiddenDesire}
- Medo profundo: ${archetype.deepFear}
- Chave de cura: ${archetype.healingKey}
`.trim();
}

// Exportar lista de signos para uso externo
export const SIGNS_LIST = Object.keys(SIGN_ARCHETYPES);
