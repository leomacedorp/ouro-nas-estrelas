/**
 * Engine de Sinastria (Compatibilidade entre Signos)
 * Baseada nos Elementos (Fogo, Terra, Ar, Água) e Modalidades.
 */

export interface CompatibilityResult {
    score: number; // 0 a 100
    label: string; // "Alma Gêmea", "Desafiador", etc.
    description: string;
    elements: {
        a: string; // Elemento do Signo A
        b: string; // Elemento do Signo B
        interaction: string; // "Fogo expande o Ar", etc.
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

export function calculateCompatibility(signA: string, signB: string): CompatibilityResult {
    const normA = signA.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normB = signB.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const elemA = ZODIAC_ELEMENTS[normA];
    const elemB = ZODIAC_ELEMENTS[normB];

    if (!elemA || !elemB) {
        throw new Error('Signo inválido');
    }

    let score = ELEMENT_COMPATIBILITY[elemA][elemB];

    // Ajuste fino para opostos complementares (ex: Áries e Libra)
    // Se quiser adicionar lógica específica de signos, pode ser aqui.
    // Ex: Áries (Fogo) + Libra (Ar) = 100 (Oposto Complementar)

    let label = '';
    if (score >= 90) label = 'Combinação Cósmica ✨';
    else if (score >= 70) label = 'Alta Compatibilidade ❤️';
    else if (score >= 50) label = 'Desafio Estimulante 🔥';
    else label = 'Aprendizado Intenso 🌪️';

    const key = [elemA, elemB].sort().join('-');
    const description = INTERACTION_TEXTS[key] || 'Uma combinação única.';

    return {
        score,
        label,
        description,
        elements: {
            a: elemA,
            b: elemB,
            interaction: description
        },
        tips: getTips(elemA, elemB)
    };
}

function getTips(elemA: string, elemB: string): string[] {
    // Retorna dicas genéricas baseadas nos elementos
    if (elemA === elemB) return ['Vocês falam a mesma língua.', 'Cuidado para não estagnarem na mesma energia.'];
    if ((elemA === 'fogo' && elemB === 'ar') || (elemA === 'ar' && elemB === 'fogo')) return ['Mantenham a chama da novidade acesa.', 'Respeitem a liberdade um do outro.'];
    if ((elemA === 'terra' && elemB === 'agua') || (elemA === 'agua' && elemB === 'terra')) return ['Construam um lar seguro juntos.', 'Expressem o afeto fisicamente.'];
    return ['A comunicação clara é a chave.', 'Aceitem que são diferentes e aprendam com isso.'];
}
