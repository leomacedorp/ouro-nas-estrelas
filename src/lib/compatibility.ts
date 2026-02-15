/**
 * Engine de Sinastria (Compatibilidade entre Signos)
 * Baseada principalmente nos Elementos (Fogo, Terra, Ar, Água).
 *
 * Suporta focos diferentes (amor, sexo/química, trabalho, amizade),
 * ajustando pesos e copy do resultado.
 */

export type CompatibilityFocus = 'amor' | 'quimica' | 'trabalho' | 'amizade';

export interface CompatibilityResult {
    focus: CompatibilityFocus;
    score: number; // 0 a 100
    label: string; // "Alta Compatibilidade", etc.
    description: string;
    elements: {
        a: string; // Elemento do Signo A
        b: string; // Elemento do Signo B
        interaction: string;
    };
    blocks: {
        favorable: string;
        challenging: string;
        actionToday: string;
    };
    tips: string[];
}

const ZODIAC_ELEMENTS: Record<string, 'fogo' | 'terra' | 'ar' | 'agua'> = {
    aries: 'fogo', leao: 'fogo', sagitario: 'fogo',
    touro: 'terra', virgem: 'terra', capricornio: 'terra',
    gemeos: 'ar', libra: 'ar', aquario: 'ar',
    cancer: 'agua', escorpiao: 'agua', peixes: 'agua'
};

const ELEMENT_COMPATIBILITY: Record<string, Record<string, number>> = {
    fogo: { fogo: 90, ar: 95, terra: 50, agua: 40 },
    terra: { terra: 95, agua: 90, fogo: 50, ar: 60 },
    ar: { ar: 90, fogo: 95, terra: 60, agua: 50 },
    agua: { agua: 95, terra: 90, ar: 50, fogo: 40 }
};

const INTERACTION_TEXTS: Record<string, string> = {
    'fogo-fogo': 'Explosão de criatividade e entusiasmo, mas cuidado com o ego.',
    'fogo-ar': 'O Ar alimenta o Fogo. Relação dinâmica, leve e inspiradora.',
    'fogo-terra': 'A Terra pode abafar o Fogo, ou o Fogo queimar a Terra. Exige paciência.',
    'fogo-agua': 'Vapor e emoção. A Água pode apagar o Fogo, mas também criar intimidade profunda.',

    'terra-terra': 'Segurança, estabilidade e construção mútua. Relação sólida.',
    'terra-agua': 'A Água nutre a Terra. Fertilidade, crescimento e apoio emocional.',
    'terra-fogo': 'Desafio de ritmos. A Terra pede tempo, o Fogo quer agora.',
    'terra-ar': 'A mente (Ar) versus a matéria (Terra). Podem aprender muito ou se distanciar.',

    'ar-ar': 'Troca intelectual intensa, liberdade e movimento. Podem faltar raízes.',
    'ar-fogo': 'O Ar alimenta o Fogo. Parceria cheia de ideias e aventuras.',
    'ar-terra': 'Teoria versus Prática. O Ar sonha, a Terra realiza. Podem se complementar.',
    'ar-agua': 'Emoção versus Razão. A Água sente, o Ar explica. Desafio de comunicação.',

    'agua-agua': 'Profundidade oceânica. Telepatia emocional, mas risco de afogamento mútuo.',
    'agua-terra': 'A Água nutre a Terra. Relação de cuidado, proteção e crescimento.',
    'agua-fogo': 'Emoção intensa. O Fogo ferve a Água. Paixão e drama.',
    'agua-ar': 'A Água busca fusão, o Ar busca espaço. Precisam respeitar limites.'
};

export function calculateCompatibility(signA: string, signB: string, focus: CompatibilityFocus = 'amor'): CompatibilityResult {
    const normA = signA.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normB = signB.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const elemA = ZODIAC_ELEMENTS[normA];
    const elemB = ZODIAC_ELEMENTS[normB];

    if (!elemA || !elemB) throw new Error('Signo inválido');

    // Base score por elemento
    let score = ELEMENT_COMPATIBILITY[elemA][elemB];

    // Pequenos ajustes por foco (heurística simples e previsível)
    score = applyFocusTuning(score, elemA, elemB, focus);
    score = clamp(score, 0, 100);

    const label = scoreToLabel(score, focus);

    const key = [elemA, elemB].sort().join('-');
    const description = INTERACTION_TEXTS[key] || 'Uma combinação única.';

    const blocks = getFocusBlocks(elemA, elemB, focus);

    return {
        focus,
        score,
        label,
        description,
        elements: {
            a: elemA,
            b: elemB,
            interaction: description
        },
        blocks,
        tips: getTips(elemA, elemB, focus)
    };
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function scoreToLabel(score: number, focus: CompatibilityFocus): string {
    const prefix = focus === 'quimica' ? 'Química' : focus === 'trabalho' ? 'Parceria' : focus === 'amizade' ? 'Amizade' : 'Amor';
    if (score >= 90) return `${prefix} em alta ✨`;
    if (score >= 70) return `${prefix} forte ❤️`;
    if (score >= 50) return `${prefix} com ajustes 🔥`;
    return `${prefix} desafiador 🌪️`;
}

function applyFocusTuning(baseScore: number, elemA: string, elemB: string, focus: CompatibilityFocus): number {
    // Ajustes pequenos (não mudar totalmente o mapa de compatibilidade)
    if (focus === 'trabalho') {
        // Trabalho tolera mais "diferença" se houver complementaridade
        if ((elemA === 'ar' && elemB === 'terra') || (elemA === 'terra' && elemB === 'ar')) return baseScore + 8;
        if ((elemA === 'fogo' && elemB === 'terra') || (elemA === 'terra' && elemB === 'fogo')) return baseScore + 5;
        return baseScore;
    }

    if (focus === 'amizade') {
        // Amizade favorece leveza e comunicação
        if ((elemA === 'ar' && elemB === 'ar') || (elemA === 'ar' && elemB === 'fogo') || (elemA === 'fogo' && elemB === 'ar')) return baseScore + 6;
        return baseScore;
    }

    if (focus === 'quimica') {
        // Química tende a amplificar combinações intensas
        if ((elemA === 'fogo' && elemB === 'fogo') || (elemA === 'agua' && elemB === 'agua')) return baseScore + 6;
        if ((elemA === 'fogo' && elemB === 'agua') || (elemA === 'agua' && elemB === 'fogo')) return baseScore + 10; // tensão/atração
        return baseScore;
    }

    // amor (default)
    return baseScore;
}

function getFocusBlocks(elemA: string, elemB: string, focus: CompatibilityFocus) {
    // Textos curtos, escaneáveis. Sem promessas absolutas.
    if (focus === 'quimica') {
        const favorable = 'A atração cresce quando vocês mantêm novidade e presença. O corpo responde ao clima que vocês constroem juntos.';
        const challenging = 'O que vira "tesão" também pode virar atrito: ciúme, impulsividade ou intensidade demais. Se pesar, esfria.';
        const actionToday = 'Hoje, alinhem o ritmo: uma conversa direta sobre o que cada um gosta e um gesto de iniciativa (sem pressão).';
        return { favorable, challenging, actionToday };
    }

    if (focus === 'trabalho') {
        const favorable = 'Vocês podem se complementar: um puxa visão/ideias e o outro organiza/entrega. Isso dá performance.';
        const challenging = 'O risco é conflito de ritmo e tomada de decisão. Se não tiver regra, vira disputa ou retrabalho.';
        const actionToday = 'Definam papéis claros: quem decide o quê, prazos e um canal único de comunicação (uma lista simples já resolve).';
        return { favorable, challenging, actionToday };
    }

    if (focus === 'amizade') {
        const favorable = 'A convivência flui quando vocês respeitam espaço e mantêm trocas leves — humor, conversa e apoio sem cobrança.';
        const challenging = 'Diferenças de sensibilidade podem gerar ruído. Quando um quer intensidade, o outro pode querer distância.';
        const actionToday = 'Combine um check-in simples: "como você está de verdade?" e depois façam algo divertido (sem clima pesado).';
        return { favorable, challenging, actionToday };
    }

    // amor
    const favorable = 'Quando vocês alinham expectativas, existe carinho real e crescimento mútuo. A relação se fortalece no cotidiano.';
    const challenging = 'O desafio é não reagir no impulso. Se um fecha, o outro pressiona — e a conexão oscila.';
    const actionToday = 'Hoje, troquem um pedido claro (não uma cobrança) e um gesto de cuidado. Pequeno, mas constante.';
    return { favorable, challenging, actionToday };
}

function getTips(elemA: string, elemB: string, focus: CompatibilityFocus): string[] {
    const base: string[] = [];

    if (elemA === elemB) base.push('Vocês falam a mesma língua (energia parecida).');

    if ((elemA === 'fogo' && elemB === 'ar') || (elemA === 'ar' && elemB === 'fogo')) base.push('Dinâmica leve: ideias + ação funcionam bem juntos.');

    if ((elemA === 'terra' && elemB === 'agua') || (elemA === 'agua' && elemB === 'terra')) base.push('Cuidado + estabilidade: bom para criar segurança.');

    if (focus === 'quimica') {
        base.push('Química melhora com curiosidade e presença (não com cobrança).');
        base.push('Respeito e consentimento sempre: ritmo combinado é o segredo.');
        return base;
    }

    if (focus === 'trabalho') {
        base.push('Documente decisões (um checklist simples evita desgaste).');
        base.push('Prazos claros > boa intenção.');
        return base;
    }

    if (focus === 'amizade') {
        base.push('Leveza e constância vencem intensidade e sumiço.');
        base.push('Respeite o tempo do outro sem interpretar como rejeição.');
        return base;
    }

    // amor
    base.push('Comunicação direta e gentil evita 80% dos ruídos.');
    base.push('Carinho cotidiano vale mais que drama.');
    return base;
}
