/**
 * Numerologia - Cálculos baseados em nome e data de nascimento
 * Parte da Engine Simbólica para leituras premium personalizadas
 */

// Tabela Pitagórica
const PYTHAGOREAN_TABLE: Record<string, number> = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

// Interpretações por número
export const NUMBER_INTERPRETATIONS: Record<number, {
    title: string;
    essence: string;
    strength: string;
    challenge: string;
    mission: string;
}> = {
    1: {
        title: 'O Pioneiro',
        essence: 'Liderança, independência, originalidade',
        strength: 'Capacidade de iniciar projetos e abrir caminhos',
        challenge: 'Aprender a colaborar sem perder a identidade',
        mission: 'Liderar pelo exemplo e inspirar novos começos'
    },
    2: {
        title: 'O Diplomata',
        essence: 'Parceria, sensibilidade, cooperação',
        strength: 'Habilidade de mediar conflitos e criar harmonia',
        challenge: 'Não se anular para agradar os outros',
        mission: 'Construir pontes e unir opostos com sabedoria'
    },
    3: {
        title: 'O Comunicador',
        essence: 'Criatividade, expressão, alegria',
        strength: 'Dom de se expressar e inspirar através das palavras',
        challenge: 'Focar energia sem dispersar em muitas direções',
        mission: 'Trazer leveza e beleza ao mundo através da expressão'
    },
    4: {
        title: 'O Construtor',
        essence: 'Estabilidade, trabalho, método',
        strength: 'Capacidade de construir bases sólidas e duradouras',
        challenge: 'Flexibilizar sem perder a estrutura',
        mission: 'Materializar sonhos através de esforço consistente'
    },
    5: {
        title: 'O Aventureiro',
        essence: 'Liberdade, mudança, versatilidade',
        strength: 'Adaptabilidade e sede de experiências',
        challenge: 'Criar raízes sem se sentir preso',
        mission: 'Ensinar que a vida é movimento e transformação'
    },
    6: {
        title: 'O Cuidador',
        essence: 'Responsabilidade, amor, harmonia familiar',
        strength: 'Capacidade de nutrir e cuidar de outros',
        challenge: 'Cuidar de si com a mesma dedicação que cuida dos outros',
        mission: 'Criar ambientes de amor e acolhimento'
    },
    7: {
        title: 'O Sábio',
        essence: 'Introspecção, busca espiritual, análise',
        strength: 'Profundidade de pensamento e intuição refinada',
        challenge: 'Conectar-se emocionalmente sem perder a essência',
        mission: 'Buscar e compartilhar verdades profundas'
    },
    8: {
        title: 'O Realizador',
        essence: 'Poder, abundância, conquista material',
        strength: 'Visão estratégica e capacidade de manifestar',
        challenge: 'Equilibrar sucesso material com realização interior',
        mission: 'Demonstrar que prosperidade e ética caminham juntas'
    },
    9: {
        title: 'O Humanitário',
        essence: 'Compaixão, sabedoria, conclusão',
        strength: 'Visão ampla e amor incondicional pela humanidade',
        challenge: 'Desapegar sem se tornar distante',
        mission: 'Servir ao bem maior e inspirar transformação coletiva'
    },
    11: {
        title: 'O Visionário (Mestre)',
        essence: 'Intuição elevada, inspiração, liderança espiritual',
        strength: 'Capacidade de canalizar insights superiores',
        challenge: 'Lidar com alta sensibilidade e nervosismo',
        mission: 'Iluminar caminhos e inspirar evolução coletiva'
    },
    22: {
        title: 'O Construtor Mestre',
        essence: 'Manifestação grandiosa, visão prática universal',
        strength: 'Capacidade de materializar grandes sonhos',
        challenge: 'Suportar o peso da responsabilidade sem se quebrar',
        mission: 'Construir legados que beneficiem a humanidade'
    }
};

/**
 * Normaliza nome removendo acentos e caracteres especiais
 */
function normalizeName(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z]/g, '');
}

/**
 * Reduz número para dígito único (preservando mestres 11, 22)
 */
function reduceToCore(n: number, preserveMasters = true): number {
    if (preserveMasters && (n === 11 || n === 22)) return n;

    while (n > 9) {
        n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
        if (preserveMasters && (n === 11 || n === 22)) break;
    }
    return n;
}

/**
 * Calcula Número do Destino (soma da data de nascimento)
 */
export function calculateDestinyNumber(birthDate: string): number {
    // birthDate: YYYY-MM-DD
    const digits = birthDate.replace(/-/g, '').split('');
    const sum = digits.reduce((acc, d) => acc + parseInt(d, 10), 0);
    return reduceToCore(sum, true);
}

/**
 * Calcula Número da Alma (soma das vogais do nome)
 */
export function calculateSoulNumber(fullName: string): number {
    const normalized = normalizeName(fullName);
    let sum = 0;
    for (const char of normalized) {
        if (VOWELS.has(char) && PYTHAGOREAN_TABLE[char]) {
            sum += PYTHAGOREAN_TABLE[char];
        }
    }
    return reduceToCore(sum, true);
}

/**
 * Calcula Número da Personalidade (soma das consoantes do nome)
 */
export function calculatePersonalityNumber(fullName: string): number {
    const normalized = normalizeName(fullName);
    let sum = 0;
    for (const char of normalized) {
        if (!VOWELS.has(char) && PYTHAGOREAN_TABLE[char]) {
            sum += PYTHAGOREAN_TABLE[char];
        }
    }
    return reduceToCore(sum, true);
}

/**
 * Calcula Número da Expressão (soma de todas as letras do nome)
 */
export function calculateExpressionNumber(fullName: string): number {
    const normalized = normalizeName(fullName);
    let sum = 0;
    for (const char of normalized) {
        if (PYTHAGOREAN_TABLE[char]) {
            sum += PYTHAGOREAN_TABLE[char];
        }
    }
    return reduceToCore(sum, true);
}

/**
 * Calcula Ano Pessoal
 */
export function calculatePersonalYear(birthDate: string, referenceYear?: number): number {
    const [, month, day] = birthDate.split('-').map(Number);
    const year = referenceYear || new Date().getFullYear();

    const sum = day + month + year;
    return reduceToCore(sum, false);
}

/**
 * Calcula Mês Pessoal
 */
export function calculatePersonalMonth(birthDate: string, referenceDate?: Date): number {
    const ref = referenceDate || new Date();
    const personalYear = calculatePersonalYear(birthDate, ref.getFullYear());
    const month = ref.getMonth() + 1;

    return reduceToCore(personalYear + month, false);
}

/**
 * Calcula Dia Pessoal
 */
export function calculatePersonalDay(birthDate: string, referenceDate?: Date): number {
    const ref = referenceDate || new Date();
    const personalMonth = calculatePersonalMonth(birthDate, ref);
    const day = ref.getDate();

    return reduceToCore(personalMonth + day, false);
}

/**
 * Calcula Ciclo de Vida baseado na idade
 */
export function calculateLifeCycle(birthDate: string, referenceDate?: Date): {
    cycle: number;
    name: string;
    description: string;
    ageRange: string;
} {
    const ref = referenceDate || new Date();
    const birthYear = parseInt(birthDate.split('-')[0], 10);
    const age = ref.getFullYear() - birthYear;

    if (age < 28) {
        return {
            cycle: 1,
            name: 'Formação',
            description: 'Fase de aprendizado, descoberta de identidade e construção de bases',
            ageRange: '0-27 anos'
        };
    } else if (age < 55) {
        return {
            cycle: 2,
            name: 'Produção',
            description: 'Fase de realização, construção de carreira e família',
            ageRange: '28-54 anos'
        };
    } else {
        return {
            cycle: 3,
            name: 'Colheita',
            description: 'Fase de sabedoria, contribuição e legado',
            ageRange: '55+ anos'
        };
    }
}

/**
 * Obtém interpretação de um número
 */
export function getNumberInterpretation(n: number) {
    return NUMBER_INTERPRETATIONS[n] || NUMBER_INTERPRETATIONS[reduceToCore(n, false)];
}

/**
 * Interface do perfil numerológico completo
 */
export interface NumerologyProfile {
    destiny: { number: number; interpretation: typeof NUMBER_INTERPRETATIONS[1] };
    soul: { number: number; interpretation: typeof NUMBER_INTERPRETATIONS[1] };
    personality: { number: number; interpretation: typeof NUMBER_INTERPRETATIONS[1] };
    expression: { number: number; interpretation: typeof NUMBER_INTERPRETATIONS[1] };
    personalYear: { number: number; interpretation: typeof NUMBER_INTERPRETATIONS[1] };
    personalMonth: { number: number };
    personalDay: { number: number };
    lifeCycle: ReturnType<typeof calculateLifeCycle>;
}

/**
 * Gera perfil numerológico completo
 */
export function generateNumerologyProfile(
    fullName: string,
    birthDate: string,
    referenceDate?: Date
): NumerologyProfile {
    const destiny = calculateDestinyNumber(birthDate);
    const soul = calculateSoulNumber(fullName);
    const personality = calculatePersonalityNumber(fullName);
    const expression = calculateExpressionNumber(fullName);
    const personalYear = calculatePersonalYear(birthDate, referenceDate?.getFullYear());
    const personalMonth = calculatePersonalMonth(birthDate, referenceDate);
    const personalDay = calculatePersonalDay(birthDate, referenceDate);
    const lifeCycle = calculateLifeCycle(birthDate, referenceDate);

    return {
        destiny: { number: destiny, interpretation: getNumberInterpretation(destiny) },
        soul: { number: soul, interpretation: getNumberInterpretation(soul) },
        personality: { number: personality, interpretation: getNumberInterpretation(personality) },
        expression: { number: expression, interpretation: getNumberInterpretation(expression) },
        personalYear: { number: personalYear, interpretation: getNumberInterpretation(personalYear) },
        personalMonth: { number: personalMonth },
        personalDay: { number: personalDay },
        lifeCycle
    };
}

/**
 * Gera resumo textual do perfil
 */
export function getNumerologySummary(profile: NumerologyProfile): string {
    const { destiny, personalYear, lifeCycle } = profile;
    return `Destino ${destiny.number} (${destiny.interpretation.title}), Ano Pessoal ${personalYear.number}, Ciclo de ${lifeCycle.name}`;
}

/**
 * Calcula o Número Universal do Dia (soma da data atual)
 * Não precisa de dados do usuário - válido para todos
 */
export function calculateUniversalDayNumber(date?: Date): number {
    const d = date || new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    const sum = day + month + year;
    return reduceToCore(sum, false);
}

/**
 * Retorna interpretação resumida para o Número Universal do Dia
 */
export function getUniversalDayMessage(date?: Date): {
    number: number;
    title: string;
    theme: string;
    advice: string;
} {
    const num = calculateUniversalDayNumber(date);
    const interp = getNumberInterpretation(num);

    const DAILY_THEMES: Record<number, { theme: string; advice: string }> = {
        1: { theme: 'Novos começos e iniciativa', advice: 'Tome a frente. Hoje favorece quem age primeiro.' },
        2: { theme: 'Parcerias e diplomacia', advice: 'Coopere. Os melhores resultados virão de alianças.' },
        3: { theme: 'Expressão e criatividade', advice: 'Comunique suas ideias. Sua voz tem poder hoje.' },
        4: { theme: 'Estrutura e trabalho focado', advice: 'Construa bases sólidas. Disciplina gera resultados.' },
        5: { theme: 'Mudança e adaptação', advice: 'Seja flexível. Oportunidades surgem do inesperado.' },
        6: { theme: 'Família e responsabilidades', advice: 'Cuide dos vínculos. Harmonia nos relacionamentos.' },
        7: { theme: 'Introspecção e sabedoria', advice: 'Reflita antes de agir. Respostas estão dentro de você.' },
        8: { theme: 'Poder e realizações', advice: 'Foque em resultados. Seu esforço será recompensado.' },
        9: { theme: 'Conclusões e generosidade', advice: 'Finalize pendências. Desapegue do que não serve mais.' }
    };

    return {
        number: num,
        title: interp?.title || `Número ${num}`,
        theme: DAILY_THEMES[num]?.theme || interp?.essence || '',
        advice: DAILY_THEMES[num]?.advice || ''
    };
}
