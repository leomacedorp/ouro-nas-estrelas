/**
 * Local Template Generator - PREMIUM VERSION
 * Fallback de alta qualidade com variação textual massiva
 * Tom: Místico moderno + psicológico + empático
 */

// ==================== OPENERS POR SIGNO ====================
// 6 variações por signo = 72 frases

const OPENERS: Record<string, string[]> = {
    aries: [
        'A chama interior arde com força especial. Há uma energia pedindo para ser vivida, não contida.',
        'O impulso de agir encontra espaço hoje. É tempo de confiar nessa coragem natural que habita dentro.',
        'Algo pulsa forte no peito. Uma urgência boa, daquelas que lembram que estar vivo é também estar em movimento.',
        'O fogo que queima por dentro pede expressão. Não há nada de errado em querer avançar.',
        'Hoje há vontade. Vontade verdadeira, que não precisa de permissão para existir.',
        'A inquietação que aparece não é problema — é sinal de vida pedindo passagem.'
    ],
    touro: [
        'Os pés tocam firme o chão. Há segurança em saber que tudo tem seu tempo, seu peso, sua hora.',
        'A calma que vem de dentro é força, não fraqueza. É saber esperar sem desistir.',
        'As mãos conhecem o valor das coisas. Do que é sólido, do que permanece, do que alimenta.',
        'Há beleza na simplicidade das coisas concretas. No que pode ser tocado, sentido, vivido sem pressa.',
        'A natureza ensina: raízes profundas sustentam qualquer tempestade. Hoje é dia de honrar essas raízes.',
        'O corpo sabe o que a mente às vezes esquece — que descanso também é produtivo.'
    ],
    gemeos: [
        'Os pensamentos voam rápido hoje. Há mil ideias circulando, e tudo bem não organizar todas agora.',
        'A mente busca conexões. Uma palavra leva a outra, um pensamento abre portas para dez novos.',
        'Há leveza no ar. Como se o universo estivesse convidando para soltar o controle e apenas observar.',
        'As conversas que importam são as que deixam espaço para mudança. Nada precisa ser definitivo hoje.',
        'Curiosidade é inteligência em movimento. E ela está alta, pedindo para explorar caminhos novos.',
        'A cabeça funciona melhor quando há liberdade. Hoje não é dia de forçar respostas.'
    ],
    cancer: [
        'As emoções vêm em ondas hoje. Sentir profundo não é defeito — é o jeito natural de estar no mundo.',
        'O coração pede acolhimento. Primeiro de si, depois dos outros. Nessa ordem.',
        'Há uma memória afetiva viva. Algo do passado toca o presente, e isso pode trazer tanto saudade quanto sabedoria.',
        'A intuição sussurra baixinho. É preciso silêncio interno para ouvi-la.',
        'Cuidar é dom natural, mas hoje o cuidado precisa começar em casa. Dentro de casa.',
        'Os sentimentos não mentem. Podem confundir, mas não mentem. Confiar neles é confiar em si.'
    ],
    leao: [
        'O brilho interior pede para ser visto. Não por vaidade, mas porque luz que fica escondida não ilumina nada.',
        'Há generosidade querendo se expressar. Toda vez que se compartilha calor, ele cresce.',
        'O coração pulsa forte e claro. Quando há certeza dentro, a dúvida de fora pesa menos.',
        'Liderar é também saber quando parar de tentar controlar tudo. Força verdadeira tem essa maturidade.',
        'Hoje tem espaço para grandeza, mas grandeza de verdade — a que não precisa diminuir ninguém.',
        'A alegria genuína é magnetismo puro. E ela está querendo aparecer.'
    ],
    virgem: [
        'A mente observa os detalhes que outros não veem. Esse olhar atento é presente, não peso.',
        'Há ordem sendo construída, mesmo que ainda não pareça. Organização interna transborda para fora.',
        'O corpo sabe quando algo não está alinhado. Ouvir esses sinais é sabedoria, não paranoia.',
        'Fazer bem feito não é perfeccionismo — é amor pelo processo. E isso vale a pena.',
        'Há clareza crescendo aos poucos. Como quem limpa a casa: um cômodo de cada vez.',
        'A utilidade de cada coisa fica evidente quando há presença. Hoje pede presença.'
    ],
    libra: [
        'O equilíbrio não é fixo — ele se ajusta a cada instante. E isso está ok.',
        'As relações pedem atenção gentil. Nem sempre é sobre resolver, às vezes é só sobre estar junto.',
        'A beleza das coisas importa. Não por superficialidade, mas porque harmonia externa acalma o interno.',
        'Há uma decisão pedindo espaço. Não precisa ser hoje, mas precisa ser olhada com honestidade.',
        'A justiça que vale a pena é a que nasce da compaixão, não da cobrança.',
        'Conexão verdadeira exige vulnerabilidade. E isso assusta, mas também liberta.'
    ],
    escorpiao: [
        'As profundezas chamam. Há algo ali abaixo da superfície que precisa ser visto, sentido, atravessado.',
        'Transformação não é confortável, mas é inevitável. E lutar contra ela só aumenta o sofrimento.',
        'A intensidade que vive dentro não é problema — é potência. Só precisa de direção.',
        'Os medos quando olhados de frente perdem metade do poder. A outra metade se transforma em força.',
        'Há verdade pedindo voz. Mesmo que doa, mesmo que desconforte, ela quer sair.',
        'O que morreu precisa ser enterrado para que o novo possa nascer. Hoje é dia de soltar.'
    ],
    sagitario: [
        'O horizonte chama. Há um desejo natural de expansão, de ver além do conhecido.',
        'A fé não é ingenuidade — é coragem de acreditar mesmo sem garantias.',
        'Liberdade é valor não negociável. E ela começa dentro, nunca fora.',
        'Há sabedoria sendo construída através da experiência. O caminho ensina mais que o destino.',
        'O otimismo natural é presente, mas precisa de raízes para não virar fuga.',
        'Hoje pede aventura, mesmo que seja interna. Explorar novos pensamentos também é jornada.'
    ],
    capricornio: [
        'A montanha é escalada um passo de cada vez. Pressa não constrói bases sólidas.',
        'Responsabilidade é força quando escolhida, peso quando imposta. Hoje vale revisar o que é de fato seu carregar.',
        'O tempo é aliado, não inimigo. Maturidade é saber esperar sem parar de caminhar.',
        'As estruturas que sustentam a vida precisam de manutenção. Cuidar delas é cuidar do futuro.',
        'Há ambição saudável querendo se expressar. Aquela que constrói sem destruir.',
        'O respeito que se ganha é fruto de consistência, não de performance.'
    ],
    aquario: [
        'A mente voa para territórios novos. Há genialidade em ver o que ainda não existe.',
        'Pertencer sem perder a individualidade é a dança constante. E hoje ela pede atenção.',
        'O futuro se constrói com visão, mas também com presença. Sonhar é importante, estar aqui também.',
        'Há liberdade de pensamento querendo quebrar padrões antigos. Nem todos merecem ser mantidos.',
        'A comunidade importa, mas a solidão criativa também. Saber quando buscar cada uma é sabedoria.',
        'Inovar não é sobre ser diferente por ser — é sobre criar algo que faça sentido.'
    ],
    peixes: [
        'As fronteiras entre eu e mundo ficam tênues. Há sensibilidade ampliada captando tudo ao redor.',
        'Os sonhos falam. Seja dormindo ou acordado, há mensagens querendo chegar.',
        'A compaixão natural é presente raro. Mas ela precisa incluir si próprio, não só os outros.',
        'O mundo invisível é tão real quanto o visível. Intuição, pressentimento, energia — tudo isso existe.',
        'Há arte querendo nascer. Pode ser em qualquer forma — uma conversa, um gesto, um silêncio.',
        'Dissolver-se no todo é bonito, mas voltar para si é necessário. Hoje pede esse retorno.'
    ]
};

// ==================== BODIES POR FOCO ====================
// 10 variações por foco = 30 frases

const BODIES: Record<string, string[]> = {
    amor: [
        'Nos vínculos afetivos, há convite para presença verdadeira. Não basta estar junto — é preciso estar inteiro.',
        'As relações pedem escuta. Daquelas que ouvem além das palavras, que captam o não dito.',
        'O amor que cura é o que aceita imperfeições. Tanto as próprias quanto as alheias.',
        'Há espaço para vulnerabilidade hoje. Mostrar-se como se é, sem máscaras, sem defesas.',
        'Os laços se fortalecem quando há verdade circulando entre as pessoas.',
        'Cuidar do outro começa em cuidar de si. Amor não é sacrifício, é troca.',
        'As conversas importantes são as que deixam espaço para silêncio também.',
        'Há diferença entre estar sozinho e sentir-se só. Hoje convida a sentir essa diferença.',
        'O coração sabe quando uma conexão é genuína. Confiar nessa certeza vale a pena.',
        'Relacionar-se é arte de equilibrar proximidade e autonomia. Nem muito perto que sufoca, nem muito longe que esfria.'
    ],
    dinheiro: [
        'No campo material, clareza é poder. Saber exatamente onde se está já é meio caminho andado.',
        'A prosperidade flui através de canais limpos. Vale revisar onde há bloqueio, onde há vazamento.',
        'O dinheiro é energia. E como toda energia, responde à intenção com que é movimentado.',
        'Há diferença entre ganhar e acumular. Às vezes é preciso organizar primeiro, ampliar depois.',
        'Os recursos disponíveis são suficientes quando há criatividade na gestão.',
        'Investir em si — em conhecimento, em saúde, em equilíbrio — é sempre retorno garantido.',
        'A segurança financeira nasce de escolhas consistentes, não de golpes de sorte.',
        'Vale olhar para os gastos com honestidade. Nem julgamento, nem negação — apenas clareza.',
        'O trabalho rende mais quando há alinhamento entre o que se faz e o que se acredita.',
        'Pequenos ajustes somados criam grandes mudanças. Nada precisa ser revolucionado de uma vez.'
    ],
    carreira: [
        'No trabalho, competência se constrói com repetição consciente. É fazer de novo, mas aprendendo sempre.',
        'Há espaço para contribuir com o que só você tem para oferecer. Singularidade é valor.',
        'As metas fazem sentido quando conectadas com propósito maior. Senão vira só lista de tarefas.',
        'Vale pausar para avaliar: o caminho ainda serve? Ou é hora de ajustar rota?',
        'O reconhecimento virá, mas não pode ser a única motivação. Fazer bem feito já vale por si.',
        'Colaborar é mais produtivo que competir. Especialmente consigo mesmo.',
        'Há sabedoria em pedir ajuda quando necessário. Ninguém constrói nada sozinho.',
        'O cansaço quando ignorado vira esgotamento. Descanso estratégico é eficiência.',
        'As oportunidades aparecem para quem está atento, mas também para quem está preparado.',
        'Construir carreira sustentável exige paciência com o processo. O atalho geralmente cobra depois.'
    ]
};

// ==================== CLOSERS POR SIGNO ====================
// Fechamento personalizado para dar identidade única

const CLOSERS: Record<string, string[]> = {
    aries: ['Que a coragem seja bússola. O resto se resolve no caminho.'],
    touro: ['Que as raízes permaneçam firmes. Tempestade passa, base fica.'],
    gemeos: ['Que a mente descanse quando cansar. Pensamento também precisa de silêncio.'],
    cancer: ['Que o coração encontre porto seguro. Primeiro dentro, depois fora.'],
    leao: ['Que o brilho seja generoso. Luz compartilhada multiplica.'],
    virgem: ['Que o olhar atento também saiba descansar. Nem tudo precisa ser consertado hoje.'],
    libra: ['Que o equilíbrio seja dinâmico. Harmonia é movimento, não estátua.'],
    escorpiao: ['Que a profundidade revele tesouros. O que desce sempre volta transformado.'],
    sagitario: ['Que o horizonte continue chamando. Mas que os pés toquem o chão também.'],
    capricornio: ['Que a montanha seja escalada com presença. O topo importa, mas o caminho também.'],
    aquario: ['Que a visão inovadora encontre raízes. Futuro se constrói no presente.'],
    peixes: ['Que os sonhos ganhem forma. Mas que a realidade também tenha espaço.']
};

// ==================== FUNÇÃO DE HASH ====================

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function selectFromArray<T>(arr: T[], seed: number): T {
    return arr[seed % arr.length];
}

// ==================== GERAÇÃO ====================

export interface LocalTemplateOptions {
    sign: string;      // slug: aries, touro, etc
    focus: string;     // amor, dinheiro, carreira
    dateBr: string;    // YYYY-MM-DD
}

export function generateLocalHoroscope(options: LocalTemplateOptions): { message: string } {
    const { sign, focus, dateBr } = options;

    // Cria seed única
    const seed = simpleHash(`${dateBr}-${sign}-${focus}`);

    // Seleciona componentes
    const openers = OPENERS[sign] || OPENERS['aries'];
    const bodies = BODIES[focus] || BODIES['amor'];
    const closers = CLOSERS[sign] || CLOSERS['aries'];

    const opener = selectFromArray(openers, seed);
    const body = selectFromArray(bodies, seed + 1);
    const closer = selectFromArray(closers, seed + 2);

    // Monta mensagem
    const message = `${opener}

${body}

${closer}`;

    return { message };
}
