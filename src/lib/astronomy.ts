/**
 * Astronomia - Dados astronômicos reais para leituras personalizadas
 * Parte da Engine Simbólica para leituras premium
 */

// ========== TIPOS ==========

export interface MoonPhaseInfo {
    phase: string;
    name: string;
    emoji: string;
    illumination: number;
    energy: string;
    advice: string;
}

export interface MoonSignInfo {
    sign: string;
    signName: string;
    element: 'fogo' | 'terra' | 'ar' | 'água';
    quality: 'cardinal' | 'fixo' | 'mutável';
    emotionalEnergy: string;
}

export interface RetrogradeInfo {
    planet: string;
    symbol: string;
    startDate: string;
    endDate: string;
    theme: string;
    advice: string;
}

export interface AstronomicalContext {
    date: string;
    moonPhase: MoonPhaseInfo;
    moonSign: MoonSignInfo;
    retrogrades: RetrogradeInfo[];
    isMercuryRetrograde: boolean;
    summary: string;
}

// ========== FASES DA LUA ==========

const MOON_PHASES: MoonPhaseInfo[] = [
    {
        phase: 'nova',
        name: 'Lua Nova',
        emoji: '🌑',
        illumination: 0,
        energy: 'Início, intenção, semente',
        advice: 'Momento de plantar intenções, não de colher resultados'
    },
    {
        phase: 'crescente',
        name: 'Lua Crescente',
        emoji: '🌒',
        illumination: 25,
        energy: 'Ação inicial, impulso, movimento',
        advice: 'Hora de dar os primeiros passos concretos'
    },
    {
        phase: 'quarto-crescente',
        name: 'Quarto Crescente',
        emoji: '🌓',
        illumination: 50,
        energy: 'Decisão, ajuste, tensão criativa',
        advice: 'Supere obstáculos e tome decisões importantes'
    },
    {
        phase: 'gibosa-crescente',
        name: 'Lua Gibosa Crescente',
        emoji: '🌔',
        illumination: 75,
        energy: 'Refinamento, preparação, ajuste fino',
        advice: 'Aperfeiçoe o que começou, prepare a colheita'
    },
    {
        phase: 'cheia',
        name: 'Lua Cheia',
        emoji: '🌕',
        illumination: 100,
        energy: 'Culminação, revelação, plenitude',
        advice: 'Observe o que se manifesta, celebre conquistas'
    },
    {
        phase: 'gibosa-minguante',
        name: 'Lua Gibosa Minguante',
        emoji: '🌖',
        illumination: 75,
        energy: 'Gratidão, compartilhamento, distribuição',
        advice: 'Compartilhe o que colheu, agradeça o processo'
    },
    {
        phase: 'quarto-minguante',
        name: 'Quarto Minguante',
        emoji: '🌗',
        illumination: 50,
        energy: 'Liberação, desapego, fechamento',
        advice: 'Solte o que não serve mais, perdoe e libere'
    },
    {
        phase: 'minguante',
        name: 'Lua Minguante',
        emoji: '🌘',
        illumination: 25,
        energy: 'Recolhimento, descanso, preparação interior',
        advice: 'Descanse, medite, prepare-se para novo ciclo'
    }
];

// ========== SIGNOS LUNARES ==========

const MOON_SIGNS: Record<string, Omit<MoonSignInfo, 'sign'>> = {
    aries: { signName: 'Áries', element: 'fogo', quality: 'cardinal', emotionalEnergy: 'Impulso, coragem, impaciência' },
    touro: { signName: 'Touro', element: 'terra', quality: 'fixo', emotionalEnergy: 'Estabilidade, conforto, teimosia' },
    gemeos: { signName: 'Gêmeos', element: 'ar', quality: 'mutável', emotionalEnergy: 'Curiosidade, comunicação, dispersão' },
    cancer: { signName: 'Câncer', element: 'água', quality: 'cardinal', emotionalEnergy: 'Sensibilidade, proteção, nostalgia' },
    leao: { signName: 'Leão', element: 'fogo', quality: 'fixo', emotionalEnergy: 'Expressão, generosidade, orgulho' },
    virgem: { signName: 'Virgem', element: 'terra', quality: 'mutável', emotionalEnergy: 'Análise, serviço, autocrítica' },
    libra: { signName: 'Libra', element: 'ar', quality: 'cardinal', emotionalEnergy: 'Harmonia, parceria, indecisão' },
    escorpiao: { signName: 'Escorpião', element: 'água', quality: 'fixo', emotionalEnergy: 'Intensidade, transformação, controle' },
    sagitario: { signName: 'Sagitário', element: 'fogo', quality: 'mutável', emotionalEnergy: 'Expansão, otimismo, inquietude' },
    capricornio: { signName: 'Capricórnio', element: 'terra', quality: 'cardinal', emotionalEnergy: 'Responsabilidade, ambição, rigidez' },
    aquario: { signName: 'Aquário', element: 'ar', quality: 'fixo', emotionalEnergy: 'Liberdade, originalidade, distanciamento' },
    peixes: { signName: 'Peixes', element: 'água', quality: 'mutável', emotionalEnergy: 'Intuição, compaixão, escapismo' }
};

// ========== RETROGRADAÇÕES 2026 ==========

const RETROGRADES_2026: RetrogradeInfo[] = [
    // Mercúrio
    { planet: 'Mercúrio', symbol: '☿', startDate: '2026-01-26', endDate: '2026-02-14', theme: 'Comunicação e decisões', advice: 'Revise antes de decidir, cuidado com mal-entendidos' },
    { planet: 'Mercúrio', symbol: '☿', startDate: '2026-05-19', endDate: '2026-06-10', theme: 'Comunicação e decisões', advice: 'Revise antes de decidir, cuidado com mal-entendidos' },
    { planet: 'Mercúrio', symbol: '☿', startDate: '2026-09-10', endDate: '2026-10-02', theme: 'Comunicação e decisões', advice: 'Revise antes de decidir, cuidado com mal-entendidos' },
    // Vênus
    { planet: 'Vênus', symbol: '♀', startDate: '2026-03-02', endDate: '2026-04-13', theme: 'Relacionamentos e valores', advice: 'Reavalie o que você valoriza no amor e nas finanças' },
    // Marte
    { planet: 'Marte', symbol: '♂', startDate: '2025-12-06', endDate: '2026-02-23', theme: 'Ação e energia', advice: 'Evite conflitos, redirecione a energia para dentro' },
    // Júpiter
    { planet: 'Júpiter', symbol: '♃', startDate: '2026-07-14', endDate: '2026-11-14', theme: 'Expansão e crenças', advice: 'Revisite suas crenças e planos de crescimento' },
    // Saturno
    { planet: 'Saturno', symbol: '♄', startDate: '2026-06-01', endDate: '2026-10-17', theme: 'Responsabilidades e estruturas', advice: 'Reavalie compromissos e limites' },
    // Urano
    { planet: 'Urano', symbol: '♅', startDate: '2026-09-06', endDate: '2027-02-03', theme: 'Mudanças e liberdade', advice: 'Integre mudanças internas antes de agir' },
    // Netuno
    { planet: 'Netuno', symbol: '♆', startDate: '2026-07-05', endDate: '2026-12-11', theme: 'Sonhos e ilusões', advice: 'Clarifique sua visão, cuidado com ilusões' },
    // Plutão
    { planet: 'Plutão', symbol: '♇', startDate: '2026-05-04', endDate: '2026-10-13', theme: 'Transformação profunda', advice: 'Processe transformações internas' }
];

// ========== FUNÇÕES ==========

/**
 * Calcula fase da lua para uma data
 * Usando ciclo sinódico de 29.53 dias
 */
export function getMoonPhase(date: Date = new Date()): MoonPhaseInfo {
    // Lua nova de referência: 6 de janeiro de 2000
    const knownNewMoon = new Date('2000-01-06T18:14:00Z');
    const synodicMonth = 29.53058867;

    const daysSinceKnown = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const lunarAge = daysSinceKnown % synodicMonth;
    const normalizedAge = lunarAge < 0 ? lunarAge + synodicMonth : lunarAge;

    // Dividir em 8 fases
    const phaseIndex = Math.floor((normalizedAge / synodicMonth) * 8) % 8;
    const phase = { ...MOON_PHASES[phaseIndex] };

    // Calcular iluminação mais precisa
    const illuminationAngle = (normalizedAge / synodicMonth) * 2 * Math.PI;
    phase.illumination = Math.round((1 - Math.cos(illuminationAngle)) * 50);

    return phase;
}

/**
 * Calcula signo da lua para uma data
 * A Lua passa ~2.5 dias em cada signo
 */
export function getMoonSign(date: Date = new Date()): MoonSignInfo {
    // Referência: Lua em Áries em 1 de janeiro de 2026 às 00:00 UTC
    const reference = new Date('2026-01-01T00:00:00Z');
    const lunarMonthDays = 27.32; // Mês sideral
    const daysPerSign = lunarMonthDays / 12;

    const daysSinceRef = (date.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24);
    const signOffset = 0; // Áries no dia de referência

    const signIndex = Math.floor((daysSinceRef / daysPerSign + signOffset) % 12);
    const signs = ['aries', 'touro', 'gemeos', 'cancer', 'leao', 'virgem', 'libra', 'escorpiao', 'sagitario', 'capricornio', 'aquario', 'peixes'];
    const sign = signs[signIndex < 0 ? signIndex + 12 : signIndex];

    return {
        sign,
        ...MOON_SIGNS[sign]
    };
}

/**
 * Retorna retrogradações ativas para uma data
 */
export function getRetrogrades(date: Date = new Date()): RetrogradeInfo[] {
    const dateStr = date.toISOString().split('T')[0];

    return RETROGRADES_2026.filter(retro => {
        return dateStr >= retro.startDate && dateStr <= retro.endDate;
    });
}

/**
 * Verifica se Mercúrio está retrógrado
 */
export function isMercuryRetrograde(date: Date = new Date()): boolean {
    const retros = getRetrogrades(date);
    return retros.some(r => r.planet === 'Mercúrio');
}

/**
 * Gera contexto astronômico completo
 */
export function getAstronomicalContext(date: Date = new Date()): AstronomicalContext {
    const dateStr = date.toISOString().split('T')[0];
    const moonPhase = getMoonPhase(date);
    const moonSign = getMoonSign(date);
    const retrogrades = getRetrogrades(date);
    const mercuryRetro = isMercuryRetrograde(date);

    // Gerar resumo
    const retroNames = retrogrades.map(r => r.planet).join(', ');
    const summary = `${moonPhase.name} (${moonPhase.illumination}%) em ${moonSign.signName}${retrogrades.length > 0 ? `. Retrógrados: ${retroNames}` : ''
        }`;

    return {
        date: dateStr,
        moonPhase,
        moonSign,
        retrogrades,
        isMercuryRetrograde: mercuryRetro,
        summary
    };
}

/**
 * Gera texto descritivo do contexto astronômico
 */
export function getAstronomyDescription(context: AstronomicalContext): string {
    const { moonPhase, moonSign, retrogrades, isMercuryRetrograde } = context;

    let desc = `A ${moonPhase.name} ilumina o céu com ${moonPhase.illumination}% de luz, trazendo energia de ${moonPhase.energy.toLowerCase()}. `;
    desc += `Com a Lua transitando por ${moonSign.signName}, o clima emocional favorece ${moonSign.emotionalEnergy.toLowerCase()}. `;

    if (isMercuryRetrograde) {
        desc += `Mercúrio retrógrado pede atenção redobrada com comunicação e decisões importantes. `;
    }

    if (retrogrades.length > 1) {
        const others = retrogrades.filter(r => r.planet !== 'Mercúrio');
        if (others.length > 0) {
            desc += `Outros planetas em revisão (${others.map(r => r.planet).join(', ')}) intensificam o clima de introspecção.`;
        }
    }

    return desc.trim();
}
