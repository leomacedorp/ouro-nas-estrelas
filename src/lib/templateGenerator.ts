/**
 * Gerador de Templates Locais
 * Fallback final quando todas as APIs falham
 * Usa seed (date + sign) para variar frases e manter diversidade
 */

import { ZODIAC_SIGNS } from './constants';

// Frases de abertura por elemento
const ABERTURAS: Record<string, string[]> = {
    fogo: [
        'O calor da vida pulsa forte no coração. É tempo de sentir essa energia e deixar que ela guie os passos do dia.',
        'Uma chama suave aquece o espírito. Há algo de especial pairando no ar, como um convite silencioso para agir com coragem.',
        'A energia do fogo interior pede expressão. Que este seja um dia de movimento, de fé nos próprios sonhos.'
    ],
    terra: [
        'Os pés tocam firme o chão, e esse contato traz segurança. É um dia para confiar no que já foi construído.',
        'A natureza ensina: tudo tem seu tempo. Hoje pede calma, passo a passo, raiz a raiz.',
        'Há beleza na simplicidade das coisas concretas. Um dia para valorizar o que está ao alcance das mãos.'
    ],
    ar: [
        'Os pensamentos voam leves como brisa. É um dia para deixar as ideias circularem sem pressa.',
        'O vento sopra novidades. Há espaço para conversas que ainda não aconteceram, para conexões que pedem atenção.',
        'A mente busca clareza, e ela virá aos poucos. Hoje é dia de observar, respirar e compreender.'
    ],
    agua: [
        'As emoções correm em rio silencioso. É tempo de sentir sem medo, de acolher o que o coração traz.',
        'Há profundidade nos sentimentos que emergem. Não há pressa em entender tudo, apenas em sentir.',
        'A intuição fala baixinho. Um dia para ouvir o que vem de dentro, sem julgamentos.'
    ]
};

// Frases sobre relacionamentos
const RELACIONAMENTOS: string[] = [
    'Nas relações, o momento pede delicadeza. Cada palavra carrega peso, então que sejam palavras de cuidado.',
    'Os vínculos afetivos pedem atenção gentil. Um gesto pequeno pode fazer diferença maior do que se imagina.',
    'É tempo de estar presente com quem importa. Nem sempre são grandes gestos que constroem pontes.',
    'O coração se abre para trocas verdadeiras. Há espaço para ouvir e ser ouvido com carinho.',
    'As conexões humanas ganham força quando há escuta. Hoje é dia de oferecer presença.'
];

// Frases sobre trabalho/dinheiro
const TRABALHO_DINHEIRO: string[] = [
    'No campo prático, as coisas fluem melhor com calma. Decisões importantes podem esperar um olhar mais atento.',
    'A vida material pede equilíbrio. Não é hora de grandes apostas, mas de organizar o que já existe.',
    'O trabalho rende mais quando feito com consciência. Pequenas pausas rendem mais que correria.',
    'A prosperidade vem de gestos consistentes. Um passo de cada vez constrói caminhos sólidos.',
    'O dinheiro flui melhor quando há clareza interior. Organizar os pensamentos ajuda a organizar a vida.'
];

// Frases de conselho/encerramento
const CONSELHOS: string[] = [
    'Que este dia seja vivido com gentileza consigo. Não há pressa para chegar a lugar nenhum.',
    'A melhor coisa a fazer é respirar fundo e confiar. O caminho se revela a quem caminha.',
    'Um dia de cada vez, um passo de cada vez. A vida cuida de quem cuida dela.',
    'Que a paz interior seja a prioridade. Todo o resto encontra seu lugar quando o coração está sereno.',
    'Estar presente no agora é o maior presente. O resto vem naturalmente.'
];

/**
 * Gera um número pseudo-aleatório baseado em seed
 */
function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

/**
 * Seleciona item de array baseado em seed
 */
function selectFromArray<T>(arr: T[], seed: number): T {
    const index = Math.floor(seededRandom(seed) * arr.length);
    return arr[index];
}

/**
 * Gera uma mensagem de horóscopo usando templates locais
 * Garante variação por signo e data
 */
export function generateTemplateMessage(signSlug: string, dateBr: string): string {
    // Encontra o signo
    const sign = ZODIAC_SIGNS.find(s => s.slug === signSlug);
    if (!sign) {
        return 'A energia do universo se manifesta de formas misteriosas. Que este seja um dia de paz e clareza.';
    }

    // Cria seed única baseada em data + signo
    const dateHash = dateBr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
    const signHash = signSlug.charCodeAt(0) + signSlug.length;
    const baseSeed = dateHash * 100 + signHash;

    // Mapeia signo para elemento
    const elementMap: Record<string, string> = {
        aries: 'fogo', leao: 'fogo', sagitario: 'fogo',
        touro: 'terra', virgem: 'terra', capricornio: 'terra',
        gemeos: 'ar', libra: 'ar', aquario: 'ar',
        cancer: 'agua', escorpiao: 'agua', peixes: 'agua'
    };
    const elemento = elementMap[signSlug] || 'fogo';

    // Seleciona frases com seeds diferentes
    const abertura = selectFromArray(ABERTURAS[elemento], baseSeed);
    const relacionamento = selectFromArray(RELACIONAMENTOS, baseSeed + 1);
    const trabalho = selectFromArray(TRABALHO_DINHEIRO, baseSeed + 2);
    const conselho = selectFromArray(CONSELHOS, baseSeed + 3);

    // Monta a mensagem
    return `${abertura}

${relacionamento} ${trabalho}

${conselho}`;
}

/**
 * Gera seções premium usando templates
 */
export function generateTemplateSections(signSlug: string, dateBr: string, focus: string): Record<string, string> {
    const sign = ZODIAC_SIGNS.find(s => s.slug === signSlug);
    const signName = sign?.name || 'Este signo';

    return {
        abertura: `A energia de ${signName} encontra um momento de reflexão. O universo convida a olhar para dentro e compreender o que o coração verdadeiramente deseja.`,
        energia_atual: `O momento presente pede calma e atenção. Há uma suavidade no ar que favorece decisões tomadas com consciência, sem a pressa que muitas vezes atrapalha o caminho.`,
        bloqueio: `A ansiedade pode ser uma companheira indesejada. É preciso reconhecer quando ela aparece e, com gentileza, lembrá-la de que não está no comando. Respirar fundo ajuda.`,
        oportunidade: `Há um ouro escondido na simplicidade. O dia oferece chance de valorizar o que já existe, de encontrar riqueza nos pequenos gestos e nas relações verdadeiras.`,
        orientacao: `A melhor postura é de acolhimento. Acolher a si, acolher o outro, acolher o momento como ele é. Dessa aceitação nasce a transformação genuína.`,
        encerramento: `Que ${signName} encontre neste dia a paz que busca. O caminho se ilumina para quem caminha com o coração aberto.`
    };
}
