/**
 * Local Template Generator - PREMIUM VERSION (V2)
 * Fallback de alta qualidade com narrativas completas e fluidas
 * Tom: Orientador Emocional (Místico moderno + psicológico + empático)
 */

// ==================== OPENERS POR SIGNO ====================
// 6 variações por signo = 72 frases
// Mantidos da versão anterior pois funcionam bem como "gancho"

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

// ==================== BODIES RICOS POR SIGNO (V2) ====================
// Textos completos que funcionam como leitura única e fluida
// Estrutura: [Energia Geral] -> [Sentimento Interno] -> [Trabalho/Relações] -> [Conselho]

const BODIES_ARIES: string[] = [
    `Há uma sensação no ar de que o ritmo do mundo está lento demais para a sua vontade de realizar. Parece que a vida decidiu testar sua paciência justamente quando você tem um tanque cheio de energia para queimar.

    Você pode perceber uma irritabilidade surgindo sem aviso prévio, não por maldade, mas por uma necessidade visceral de movimento. Tende a surgir uma vontade de chutar o balde e fazer tudo sozinho, só para não depender do tempo dos outros.

    No trabalho, a burocracia ou a indecisão de colegas pode ser o gatilho. Nas relações, você pode sentir que está falando grego quando pede objetividade. O silêncio do outro pode soar como afronta para a sua clareza direta.

    Essa inquietação não é defeito, é sua bússola apontando que você tem energia de sobra. Ao invés de brigar com o trânsito parado, use essa força para abrir um caminho lateral. É um momento de ajuste entre sua velocidade interna e a realidade externa.

    Conselho do dia:
    Ação sem direção é apenas desperdício de energia. Respire fundo, mire no alvo e só então dispare. Sua força é preciosa demais para ser gasta com o vento.`,

    `A energia de recomeço está pulsando ao seu redor, mas algo ainda te segura. É como estar com o pé no acelerador e o freio de mão puxado ao mesmo tempo. Essa tensão gera calor, e se não cuidada, gera explosão.

    Internamente, você pode estar se sentindo como um guerreiro sem guerra. Sobra coragem, falta onde aplicar. Tende a surgir uma autocobrança por resultados imediatos que nem sempre dependem só de você.

    Nas relações, cuidado para que sua honestidade não vire arma. Às vezes, a verdade dita no calor do momento queima em vez de iluminar. O desafio hoje é ser firme sem ser duro.

    Esse desconforto é crescimento. Você está aprendendo que liderar a si mesmo é a batalha mais difícil. Organizar seus impulsos antes de agir é o que separa a impulsividade da iniciativa real.

    Conselho do dia:
    Seja o pioneiro da sua própria vida, mas lembre-se que todo pioneiro precisa saber ler o terreno antes de avançar.`,

    `Você sente que poderia resolver os problemas do mundo em dez minutos se deixassem você assumir o comando. A autoconfiança está alta, mas o mundo pede colaboração, e isso te exige uma humildade que incomoda.

    É possível sentir um cansaço mental vindo de tanta espera. Sua natureza é de faísca, de início, e processos longos drenam sua vitalidade.

    No trabalho, procure tarefas curtas que você possa começar e terminar no mesmo dia. Ver o "check" na lista vai te devolver a sanidade. Nas relações, convide o outro para a ação — uma caminhada, um projeto — em vez de ficar discutindo a relação. O movimento cura tudo hoje.

    Conselho do dia:
    Não espere a aprovação de ninguém para validar sua força. Faça por você, e o reconhecimento virá como consequência natural.`
];

const BODIES_TOURO: string[] = [
    `Este é um período em que a sua necessidade de segurança pode ser confundida com estagnação, mas não se engane: você está apenas fincando raízes mais profundas. Questões que envolvem seus recursos materiais e seu valor pessoal estão no centro do palco.

    Você pode sentir uma resistência interna em aceitar mudanças de planos de última hora. Não é teimosia, é preservação. Você sabe intuitivamente que construir algo durável leva tempo, e ver os outros correndo sem direção pode te causar um cansaço mental que nem é seu.

    No trabalho, foque no tangível. Projetos abstratos demais podem te irritar agora. Você quer ver o resultado, tocar na matéria. A qualidade do que você entrega é sua maior moeda de troca quando todos estão entregando pressa.

    Nas relações, o silêncio compartilhado vale mais que mil promessas. Você está buscando lealdade prática — alguém que esteja lá quando a coisa aperta, não só na festa.

    Conselho do dia:
    Não ceda à pressão de quem vive no urgente. Seu tempo é o tempo da natureza, e ele nunca falha. Mantenha os pés no chão.`,

    `Há uma suavidade disponível para você hoje, se permitir desacelerar. O mundo cobra performance, mas seu corpo pede calma e nutrição. Não ignore seus sentidos; eles são sua tecnologia mais avançada para ler a realidade.

    Pode surgir uma preocupação com o futuro financeiro, não por falta, mas pelo desejo de garantir que nada falte aos seus. Essa prudência é sábia, desde que não vire medo paralisante.

    Nas relações, o toque físico ou um presente pensado com carinho comunicam mais que discursos. Tente trazer beleza para o seu ambiente hoje — uma flor, um cheiro bom — isso acalma seu sistema nervoso instantaneamente.

    Conselho do dia:
    O prazer é produtivo. Estar bem, comer bem e dormir bem recarrega sua bateria para as batalhas reais. Cuide do seu jardim interno.`,

    `A estabilidade que você tanto preza está sendo testada por pequenas oscilações externas. Pode parecer que o chão está tremendo, mas são apenas ajustes de acomodação. Suas fundações são sólidas.

    Você tende a sentir um desejo de simplificar a vida. "Para que tanta complicação?" é a pergunta que ronda sua mente. E você está certo. O essencial é simples.

    No trabalho, seu método consistente será a âncora no meio do caos alheio. Mantenha-se fiel ao que você sabe que funciona. Nas relações, sua paciência é um porto seguro para quem está à deriva, mas não deixe abusarem dela.

    Conselho do dia:
    Valorize o que já é seu. A gratidão pelo que já foi construído é o cimento que fortalece a próxima laje.`
];

const BODIES_GEMEOS: string[] = [
    `Sua mente está operando em alta velocidade, captando sinais que a maioria ignora. É um momento de extrema fertilidade intelectual, mas com risco de dispersão. Muitas abas abertas no navegador da sua vida podem travar o sistema se você não priorizar.

    Você pode sentir uma inquietação, como se estivesse perdendo algo importante em outro lugar. Isso é o medo de ficar de fora batendo na porta. Mas lembre-se: estar em todo lugar é não estar em lugar nenhum.

    Nas conversas, seu poder de persuasão está magnético. É um ótimo dia para negociar, escrever ou ensinar. Mas cuidado com a superficialidade nas relações íntimas; ouvir de verdade dá mais trabalho que falar, mas é o que conecta corações.

    Esse fluxo mental intenso pede canais de saída. Escreva, fale, grave áudios. Não deixe a energia estagnar na cabeça, ou ela vira ansiedade.

    Conselho do dia:
    Escolha uma única coisa para aprofundar hoje. Apenas uma. Deixe a curiosidade te guiar, mas deixe a disciplina te manter no caminho até o fim.`,

    `A dualidade é sua natureza, e hoje ela está evidente. Uma parte de você quer sair e ver gente, a outra quer silêncio para processar tanta informação. Não tente resolver esse conflito; apenas navegue entre esses dois estados com leveza.

    Pode surgir uma notícia ou mensagem inesperada que muda o tom do seu dia. Sua adaptabilidade será seu superpoder. Enquanto outros reclamam da mudança de planos, você já viu a oportunidade nela.

    No trabalho e nas relações, sua clareza vale ouro. Você consegue explicar o inexplicável. Use esse dom para deshazer mal-entendidos, não para criar novos jogos de palavras.

    Conselho do dia:
    A palavra tem poder de criação. Use sua comunicação para construir pontes, não para espalhar ruído. Fale o que constrói.`,

    `O mundo parece um quebra-cabeça interessante hoje, e você quer montar todas as peças. Sua curiosidade é um motor potente de renovação. O que estava velho e chato ganha nova cor sob seu olhar.

    Tende a surgir uma impaciência com gente lenta de raciocínio. Respire. Nem todo mundo tem o seu processador. A inteligência também se mostra na capacidade de traduzir o complexo para o simples.

    Nas relações, a diversão é o elo. Rir junto resolve tensões que mil discussões sérias não resolveriam. Traga leveza para a mesa.

    Conselho do dia:
    Troque a certeza pela pergunta. "Eu sei" fecha portas; "O que mais é possível aqui?" abre universos.`
];

const BODIES_CANCER: string[] = [
    `Este é um período em que você tende a ficar mais reservado e reflexivo. Questões ligadas à segurança emocional e às relações do dia a dia pedem mais atenção e maturidade.

    Você pode perceber uma vontade maior de se afastar de conversas vazias e situações que exigem explicações demais. Não é tristeza, nem frieza. É discernimento. Você está mais consciente de onde vale — e onde não vale — colocar sua energia.

    No ambiente profissional, o dia pode trazer pequenos atritos ou irritações. Não porque você esteja buscando conflito, mas porque sua tolerância ao desrespeito está menor. Diferente de outros momentos, você não quer agradar a todos. Quer funcionar bem, em paz, e isso já muda sua postura.

    Nas relações pessoais, você continua leal e cuidadoso com quem ama, mas menos disponível para dramas externos. Pode parecer distanciamento, mas é apenas uma forma de se proteger emocionalmente sem precisar levantar muros.

    Conselho do dia:
    Não reaja no impulso, principalmente no trabalho. Observe, filtre e responda apenas ao que realmente merece sua atenção. O silêncio, hoje, é mais poderoso do que qualquer explicação.`,

    `A maré emocional está alta, trazendo memórias e sentimentos antigos à tona. Não se assuste; é apenas o seu inconsciente fazendo uma limpeza necessária. O que dói hoje é o que está sendo curado para amanhã.

    Sua intuição está afiada como uma lâmina. Se sentir que algo está errado em um ambiente ou com uma pessoa, confie. Você tem um radar natural que a lógica não consegue explicar e que raramente falha.

    Nas relações, o desejo de nutrir e ser nutrido é forte. Mas cuidado para não dar o que você não tem. O copo precisa estar cheio para transbordar.

    Conselho do dia:
    Acolha a si mesmo como você acolheria um amigo querido. Se dê o colo que você costuma dar aos outros. Hoje, a prioridade é você.`,

    `Há uma força silenciosa em você hoje. Enquanto o mundo grita lá fora, você encontra um refúgio na sua própria casca. Isso não é fuga, é estratégia de recarga.

    Você pode sentir uma necessidade de organizar seu espaço físico — sua casa, sua mesa. Essa organização externa reflete um desejo de ordem interna. Arrumar as gavetas acalma o coração.

    No trabalho e na vida, sua memória é um trunfo. Você lembra do que foi combinado, do que foi sentido. Use isso para manter a coerência nas relações, cobrando com gentileza mas com firmeza.

    Conselho do dia:
    Suas emoções são sua bússola, não sua âncora. Deixe que elas te guiem, mas não deixe que elas te parem.`
];

const BODIES_LEAO: string[] = [
    `Há uma energia de visibilidade pairando sobre você. Não é apenas sobre ser visto, mas sobre como você escolhe iluminar o ambiente. Sua generosidade natural está amplificada, atraindo pessoas que precisam da sua força.

    Internamente, porém, cuidado com a armadilha da validação. Você pode perceber uma carência de elogios ou reconhecimento. Pergunte-se: "Estou fazendo isso porque gosto ou porque quero aplausos?". A resposta muda tudo.

    No trabalho, assuma a liderança de projetos que parecem travados. Sua confiança destravará portas que a dúvida alheia manteve fechadas. Apenas cuide para não ofuscar quem está tentando colaborar.

    Nas relações, seu calor é irresistível. Mas o dia pede reciprocidade. Veja se você não está doando sol para quem só oferece sombra. Amor próprio é saber o valor da sua entrega.

    Conselho do dia:
    Brilhe, mas brilhe para aquecer, não para cegar. A verdadeira majestade serve antes de ser servida.`,

    `Sua criatividade está pedindo passagem. Ideias que pareciam bobas ontem hoje ganham contorno de genialidade. Confie na sua intuição artística e lúdica; o mundo está sério demais e precisa da sua cor.

    Pode haver um momento de orgulho ferido em uma conversa próxima. Respire. Nem toda crítica é ataque à sua identidade. Às vezes, é apenas um ponto de vista diferente. Sua segurança não depende da concordância unânime.

    No dia a dia, a vida parece um palco, e você quer desempenhar seu papel com excelência. Isso inspira os outros. Continue performando sua melhor versão, não para a plateia, mas pela arte de viver bem.

    Conselho do dia:
    A vida é palco, mas você também precisa ser plateia de si mesmo. Apláuda suas pequenas vitórias silenciosas.`,

    `A coragem é seu estado natural, mas hoje ela pede sabedoria. Você sente que pode enfrentar qualquer leão, mas talvez não precise. Escolher qual batalha NÃO lutar é tão heroico quanto entrar na arena.

    Tende a surgir uma impaciência com a mediocridade. Você quer o melhor, o belo, o grandioso. Use esse padrão alto para elevar seus próprios projetos, mas tenha compaixão com quem ainda está aprendendo a voar.

    Nas relações, a lealdade é tudo para você. Deixe claro quem são os seus protegidos. Sua alcateia se sente segura sob sua guarda, e essa proteção retorna para você em forma de respeito.

    Conselho do dia:
    Seu coração é nobre. Não deixe que a frieza do mundo endureça sua capacidade de amar grandiosamente.`
];

const BODIES_VIRGEM: string[] = [
    `Sua mente analítica está afiada como nunca. Você enxerga os detalhes que 99% das pessoas deixam passar, e isso é um superpoder. Use essa clareza para organizar o caos ao seu redor, seja na mesa de trabalho ou nos pensamentos.

    Porém, cuidado para que a análise não vire paralisia. Existe um ponto ótimo entre o "feito" e o "perfeito", e hoje o universo pede que você entregue o "feito". A crítica interna pode estar falando alto demais; baixe o volume dela.

    No trabalho, sua eficiência será notada, mesmo que não seja verbalizada. Você é a engrenagem que faz a máquina funcionar. Mas não deixe que a competência vire carga excessiva. Saber dizer "não" também é organização.

    Nas relações, gestos de serviço são sua linguagem de amor. Mas observe se o outro entende essa língua. Às vezes, um abraço desajeitado vale mais que uma vida inteira organizada.

    Conselho do dia:
    Abrace a imperfeição como parte do processo. O mundo é bagunçado, e tentar controlar cada poeira só vai te exaustar. Solte um pouco.`,

    `Há uma necessidade de purificação no ar. Seja na alimentação, na rotina ou nas energias que você permite entrar. Seu corpo é seu templo e ele está pedindo cuidado sagrado. Ouça os sinais físicos; eles são mensageiros da sua intuição prática.

    A utilidade é seu guia hoje. Se algo não tem função ou propósito claro, elimine. Isso vale para objetos, tarefas e até conversas circulares. Sua paz mental depende dessa limpeza e simplificação.

    Você pode sentir uma irritação com a desordem alheia. Lembre-se que o caos do outro é do outro. Organize seu metro quadrado e deixe que seu exemplo fale mais que sua crítica.

    Conselho do dia:
    Menos é mais. Simplifique sua agenda, simplifique suas expectativas. A clareza mora no simples.`,

    `O dia pede terra, pé no chão e realismo. Enquanto outros sonham, você planeja. Essa capacidade de ver o passo a passo é o que vai transformar intenções em realidade.

    Tende a surgir uma preocupação com a saúde ou o bem-estar diário. É um ótimo momento para iniciar aquele hábito saudável que você vem adiando. Pequenos ajustes na rotina terão impacto gigante a longo prazo.

    Nas relações, sua honestidade é um bálsamo, mas precisa vir embrulhada em gentileza. A verdade cirúrgica cura, mas também corta. Seja o médico que cura, não o que fere.

    Conselho do dia:
    Servir é nobre, mas servidão não. Saiba a hora de parar de trabalhar pelos outros e fazer algo apenas pelo seu prazer.`
];

const BODIES_LIBRA: string[] = [
    `O equilíbrio não é um estado estático, é um movimento constante de ajuste. Hoje, você pode sentir os pratos da balança oscilando. Relações, trabalho, desejos pessoais — tudo parece pedir atenção ao mesmo tempo e na mesma medida.

    A tendência de evitar conflitos para manter a paz pode ser uma armadilha hoje. Paz a qualquer custo não é paz, é submissão. Se algo te incomoda, fale. Sua diplomacia natural garantirá que a mensagem chegue sem destruir pontes.

    No campo afetivo, o charme está alto, mas cuidado com a indecisão. Ficar em cima do muro pode fazer você perder a vista de ambos os lados. Escolher é também renunciar, e isso faz parte de crescer.

    A beleza é nutrição para sua alma. Tire um momento para apreciar algo esteticamente agradável — uma música, uma flor, uma arte. Isso recalibra seu sistema nervoso instantaneamente.

    Conselho do dia:
    Não se diminua para caber no mundo de ninguém. Sua harmonia interna vale mais do que a aprovação externa de quem não vive sua vida.`,

    `Parcerias estão em foco. Sozinho você vai rápido, mas acompanhado você vai mais longe e se diverte mais. Olhe ao redor e veja quem soma com sua energia. Colaboração é a palavra-chave do seu sucesso hoje.

    Justiça é um tema sensível agora. Você pode se ver mediando uma situação ou defendendo um ponto de vista ético. Confie no seu senso de imparcialidade; ele é raro e necessário em tempos de extremos.

    Nas relações, o espelhamento é forte. O que te irrita no outro pode ser algo que você precisa olhar em si mesmo. Use o encontro como ferramenta de autoconhecimento.

    Conselho do dia:
    Seja o espelho que reflete o melhor do outro, mas não esqueça de olhar sua própria imagem com carinho e aprovação.`,

    `A vida social chama, mas uma parte sua pede recolhimento para reencontrar o próprio eixo. É difícil dizer não quando se quer agradar, mas hoje o "não" para o outro pode ser o "sim" para você.

    Você pode perceber uma clareza mental maior quando está em ambientes harmoniosos. Se o caos reinar ao redor, retire-se. Sua mente precisa de estética e silêncio para funcionar bem.

    No amor e nas parcerias, o idealismo pode se chocar com a realidade. As pessoas têm defeitos. Aceitar a humanidade do outro (e a sua) é o verdadeiro romance maduro.

    Conselho do dia:
    A verdadeira elegância é ser gentil consigo mesmo quando ninguém está vendo.`
];

const BODIES_ESCORPIAO: string[] = [
    `As profundezas te chamam. Você não tem paciência para o raso hoje. Conversas superficiais, sorrisos amarelos e protocolos sociais podem te causar uma irritação quase física. Você quer verdade, doa a quem doer.

    Sua intuição está operando em frequência máxima. Você sente o que não foi dito, lê as entrelinhas. Use esse raio-X emocional para proteger seus interesses, mas cuidado para não criar fantasmas ondem eles não existem. Nem todo silêncio é uma conspiração.

    Transformação é seu sobrenome. Algo que estava estagnado pode finalmente morrer hoje para dar lugar ao novo. Não segure o que quer ir embora. Deixe ir. O vácuo que fica é o espaço onde a nova vida vai crescer.

    Nas relações, a intensidade é alta. O desejo de fusão emocional é belo, mas lembre-se de manter sua individualidade. Amar não é desaparecer no outro.

    Conselho do dia:
    O que você resiste, persiste. Olhe no olho dos seus medos hoje; você vai descobrir que eles são menores do que a sua sombra projetava.`,

    `Poder pessoal e controle estão em pauta. Você sabe o que quer e tem a força de vontade para conseguir. Mas a estratégia silenciosa funciona melhor que o confronto direto. Mova-se nas sombras hoje; deixe que os resultados façam o barulho.

    A cura emocional está disponível. Feridas antigas podem latejar, não para doer, mas para lembrar que precisam ser limpas definitivamente. Não tenha medo de sentir tudo; você é feito de material resistente.

    Nas relações, a confiança é o tema. Se ela foi quebrada, avalie se vale o reparo. Se está intacta, aprofunde o laço. Você não sabe amar pela metade, e isso é sua virtude.

    Conselho do dia:
    Sua vulnerabilidade é sua maior força, desde que mostrada para quem merece. Confie desconfiando, mas confie na vida.`,

    `Há um magnetismo natural emanando de você. As pessoas se sentem atraídas pelo seu mistério sem saberem por quê. Use essa influência com responsabilidade para liderar ou transformar uma situação difícil.

    Você pode sentir uma necessidade de investigar, de saber o "porquê" das coisas. Essa mente investigativa é ótima para resolver problemas complexos no trabalho, mas péssima para a paz nos relacionamentos. Às vezes, não há segredo nenhum.

    A regeneração é possível. Se você se sente cansado, saiba que tem uma bateria reserva que poucos signos têm. Um momento de introspecção profunda te devolve a força total.

    Conselho do dia:
    Solte o controle. A vida sabe o que faz. Às vezes, deixar o barco correr a correnteza leva a lugares melhores do que o remo forçado.`
];

const BODIES_SAGITARIO: string[] = [
    `O horizonte te chama como um canto de sereia. Há um desejo pulsante de expansão, de ir além do conhecido. A rotina pequena te sufoca hoje. Mas cuidado: a verdadeira viagem pode ser para dentro, não para fora.

    Sua fé natural é seu combustível, mas ela precisa de rodas para andar na terra. Sonhar alto é ótimo, desde que você tenha um plano para construir a escada até lá. O otimismo sem ação é apenas imaginação fértil.

    No trabalho, sua visão macro é valiosa. Enquanto todos olham para o buraco na estrada, você vê onde a estrada vai dar. Compartilhe essa visão, mas tenha paciência com quem precisa olhar para o buraco para consertá-lo.

    Nas relações, a liberdade é inegociável. Mas lembre-se que liberdade não é ausência de compromisso, é escolher onde ficar. Quem te ama entende suas asas, desde que você volte para o ninho de vez em quando.

    Conselho do dia:
    A sabedoria não está apenas nos livros ou nas viagens, está na capacidade de encontrar sentido no cotidiano. Seja o filósofo da sua própria rotina.`,

    `A verdade é seu valor supremo, e hoje ela quer sair da sua boca sem filtro. Cuidado. A honestidade brutal pode ser apenas brutalidade disfarçada de virtude. A verdade dita sem amor é uma arma, não um presente. Use seu arco para apontar caminhos, não para ferir.

    Há uma energia de entusiasmo que contagia. Use isso para levantar o astral de quem está ao seu redor. Você tem o dom de fazer a vida parecer uma aventura digna de ser vivida, mesmo numa terça-feira comum.

    O aprendizado chama. Pode ser um livro, um curso ou uma conversa com um estranho. Alimente sua mente com algo novo e sua alma agradecerá.

    Conselho do dia:
    Mire nas estrelas, mas mantenha os pés na lama se for preciso. A flecha só voa longe se o arqueiro estiver firme no chão.`,

    `O sentido da vida é o tema que ronda seus pensamentos. Você quer propósito, quer missão. Trabalhar só pelo dinheiro parece pouco hoje. Busque conectar o que você faz com algo maior que você.

    Você pode sentir uma vontade de exagerar — na comida, nos gastos, nas promessas. Júpiter expande tudo que toca, inclusive os problemas. Moderação não é sua palavra favorita, mas hoje ela é sua amiga necessária.

    Nas relações, busque parceiros de aventura. Alguém que tope suas ideias loucas e ainda acrescente mais uma. A vida a dois tem que ser divertida, senão não vale o ticket.

    Conselho do dia:
    Sua alegria é medicina. Não deixe ninguém apagar seu sorriso, ele é a prova de que a vida vale a pena.`
];

const BODIES_CAPRICORNIO: string[] = [
    `A montanha parece alta hoje, mas você nasceu para escalar. Sua ambição não é vaidade, é necessidade de construção. Você olha para o topo e sabe que vai chegar lá, não importa quanto tempo leve. A persistência é seu talento natural.

    Internamente, a cobrança pode estar excessiva. Você é seu pior chefe. Dê uma folga para si mesmo. O mundo não vai desabar se você descansar por algumas horas. Pelo contrário, estruturas precisam de manutenção para não ruir.

    No trabalho, sua competência é inquestionável. Mas cuidado para não centralizar tudo por achar que "só você faz direito". Delegar é a prova máxima de liderança madura. Confie no processo que você mesmo criou.

    Nas relações, você demonstra amor com atos, não com palavras. Mas saiba que às vezes as pessoas precisam ouvir. Um "eu te amo" falado tem um poder que nenhuma conta paga consegue substituir. Aqueça um pouco essa fachada séria.

    Conselho do dia:
    O tempo é seu aliado, não seu inimigo. Tudo que é sólido leva tempo para curar. Respeite o ritmo das estações, inclusive as internas.`,

    `A responsabilidade pesa, mas também enobrece. Você sente o peso do mundo nas costas, e estranhamente, isso te dá força. Hoje é dia de revisar suas estruturas: o que é essencial fica, o que é supérfluo vai. Otimização é a palavra.

    Sua autoridade natural está em evidência. As pessoas vão te procurar buscando direção e segurança. Ofereça sua sabedoria pragmática, mas não carregue a mochila de ninguém. Cada um precisa aprender a subir sua própria ladeira.

    Pode haver um sentimento de solidão no topo. Lembre-se que construir impérios sozinho é possível, mas sem graça. Abra espaço para quem quer somar tijolos com você.

    Conselho do dia:
    O sucesso é uma maratona, não um sprint. Beba água, ajuste o passo e continue. A vista lá de cima vai valer a pena a caminhada.`,

    `O mundo material pede ordem. Planilhas, metas, prazos — hoje você nada de braçada nesse mar. Use essa eficiência para resolver pendências antigas que estavam drenando sua energia mental.

    Cuidado com o pessimismo disfarçado de realismo. Ver os defeitos é útil para consertar, mas focar só neles impede de ver as oportunidades. Permita-se um pouco de otimismo calculado.

    Nas relações, a maturidade é exigida. Jogos infantis te cansam. Você quer o real, o concreto, o preto no branco. Expresse essa necessidade de clareza, o outro agradecerá a honestidade.

    Conselho do dia:
    Sua reputação é construída no que você faz quando está cansado. Descanse, mas não desista. Você está quase lá.`
];

const BODIES_AQUARIO: string[] = [
    `Sua mente está anos-luz à frente, habitando um futuro que os outros ainda nem imaginam. Isso traz genialidade, mas também solidão. Hoje, o desafio é traduzir suas visões para a língua dos mortais sem perder a paciência.

    Você sente uma necessidade quase física de quebrar padrões. A rotina te sufoca, as regras sem sentido te irritam. Use essa energia rebelde para inovar, não apenas para contestar. Criar o novo é mais poderoso do que apenas destruir o velho.

    No coletivo, você brilha. Sua turma, sua comunidade, seus amigos — é aí que você recarrega. Mas não esqueça das relações um a um. A intimidade exige um tipo de presença olho no olho que o grupo não supre.

    A frieza que às vezes te acusam de ter é apenas sua forma de ver as coisas com clareza, sem o drama emocional. Mas hoje, tente descer da torre de controle e sentir junto. A empatia é a inteligência do coração.

    Conselho do dia:
    Ser diferente é sua natureza, mas conectar é sua necessidade. Encontre a tribo que entende seu idioma estranho e celebre o pertencimento.`,

    `A eletricidade mental está alta. Insights caem como raios sobre sua cabeça. Anote tudo. O que parece loucura hoje será o óbvio uluante de amanhã. Você é o canal por onde o novo entra no mundo.

    Cuidado com a teimosia intelectual. Só porque você vê o futuro, não significa que os métodos do passado não tenham valor. Integre a tradição com a inovação para criar algo sustentável.

    Você pode sentir um distanciamento das questões emocionais "pegajosas". É sua defesa. Mas lembre-se que somos seres biológicos que precisam de abraço. Não vire um robô por medo de sentir.

    Conselho do dia:
    A liberdade que você tanto preza começa na mente. Liberte-se da necessidade de ser "o do contra" e apenas seja quem você é.`,

    `O senso de humanidade pulsa em você. Você se importa com causas, com o todo, com o futuro. Use essa visão ampla para resolver conflitos pequenos — olhe de cima e veja como eles são insignificantes no grande esquema.

    A imprevisibilidade é sua companheira. Planos podem mudar do nada, e você adora isso. Ensine aos outros a beleza de fluir com o inesperado. Onde todos veem caos, você vê possibilidade.

    Nas relações, a amizade é a base de tudo. Se não for seu amigo antes de ser seu amor, não funciona. Valorize quem estimula seu cérebro tanto quanto seu coração.

    Conselho do dia:
    Sua mente é vasta como o céu. Deixe as nuvens passarem sem se apegar a nenhuma delas. A clareza sempre volta.`
];

const BODIES_PEIXES: string[] = [
    `As fronteiras entre você e o mundo estão tênues hoje. Você sente o que o outro sente, chora a dor que não é sua, sonha sonhos coletivos. É um dom lindo, mas exaustivo. Proteja seu campo energético.

    A realidade prática pode parecer dura e cinza demais para sua alma colorida. A tentação de escapar — seja dormindo, sonhando ou se distraindo — é grande. Mas a magia precisa ser trazida para a terra. Use sua sensibilidade para embelezar o cotidiano, não para fugir dele.

    Sua intuição não está gritando, está cantando. Siga a melodia. Se algo não "soa" bem, não vá. A lógica pode falhar, mas seu radar invisível raramente erra.

    Nas relações, sua compaixão é cura pura. Mas lembre-se que salvar a todos não é sua missão. Às vezes, o maior ato de amor é deixar o outro caminhar com as próprias pernas e aprender suas próprias lições.

    Conselho do dia:
    Você é o oceano, não a onda. Deixe as emoções passarem pela superfície sem perturbar sua profundeza. O silêncio é seu melhor refúgio hoje.`,

    `Há poesia querendo nascer em tudo que você faz. Uma conversa, um relatório, um jantar — tudo pode ser arte se você colocar sua alma. O mundo está sedente dessa delicadeza que só você tem para oferecer.

    O caos pode estar reinando lá fora, mas dentro de você existe um santuário intocável. Visite-o sempre que a barulheira do mundo ficar insuportável. A paz é uma escolha interna, não uma condição externa.

    Você pode se sentir incompreendido, falando uma língua de sentimentos num mundo de números. Não tente explicar o inexplicável. Apenas emane sua luz, quem tiver sensibilidade vai captar.

    Conselho do dia:
    Confie no fluxo. O rio sabe o caminho para o mar, e você também sabe, mesmo que não tenha o mapa. Solte o controle e flutue.`,

    `Sua empatia é um imã para todo tipo de energia. Hoje é dia de filtrar quem chega perto do seu coração. Aprender a fechar a porta energética não é egoísmo, é sobrevivência espiritual.

    Os sonhos noturnos ou devaneios diurnos trazem recados importantes. Preste atenção nas coincidências, nas sincronicidades. O universo está conversando com você através de sinais sutis.

    Nas relações, busque a fusão, mas não perca a identidade. Você é uma gota no oceano, mas ainda é uma gota única. Valorize suas bordas tanto quanto seu conteúdo.

    Conselho do dia:
    A bondade é sua força, não sua fraqueza. Mas lembre-se: ser bom não é ser bobo. Tenha compaixão com olhos abertos.`
];

// Mapeamento de corpos por signo para acesso dinâmico
const BODIES_BY_SIGN: Record<string, string[]> = {
    aries: BODIES_ARIES,
    touro: BODIES_TOURO,
    gemeos: BODIES_GEMEOS,
    cancer: BODIES_CANCER,
    leao: BODIES_LEAO,
    virgem: BODIES_VIRGEM,
    libra: BODIES_LIBRA,
    escorpiao: BODIES_ESCORPIAO,
    sagitario: BODIES_SAGITARIO,
    capricornio: BODIES_CAPRICORNIO,
    aquario: BODIES_AQUARIO,
    peixes: BODIES_PEIXES
};

// ==================== CLOSERS / MICRO-VARIAÇÕES ====================
// Para evitar sensação de repetição, combinamos:
// - fechamentos por signo (identidade)
// - + fechamentos por elemento (variação extra)

const SIGN_CLOSERS: Record<string, string[]> = {
    aries: [
        'Que a coragem seja bússola. O resto se resolve no caminho.',
        'Que a chama encontre direção. A pressa vira força quando tem alvo.',
        'Que a iniciativa venha com presença. Um passo firme vale por dez impulsos.',
        'Que a coragem seja calma por dentro. Força real não precisa gritar.',
        'Que o coração avance sem se perder. Movimento também pode ser consciente.',
        'Que o impulso encontre foco. A energia certa move montanhas.',
        'Que a ação venha com clareza. Coragem é também escolha.',
        'Que a vontade não vire guerra. Liderar começa dentro.',
        'Que a força seja gentil. Firmeza pode ser serena.',
        'Que o dia termine com paz. O que importa permanece.'
    ],
    touro: [
        'Que as raízes permaneçam firmes. Tempestade passa, base fica.',
        'Que a calma proteja o que importa. O tempo trabalha a seu favor.',
        'Que o corpo guie o ritmo. Descanso também é construção.',
        'Que o simples seja suficiente. O essencial sempre sustenta.',
        'Que a segurança venha de dentro. O mundo muda, a base permanece.',
        'Que a paciência seja aliada. O que é sólido cresce devagar.',
        'Que o prazer seja permitido. Bem-estar também é caminho.',
        'Que a constância vença a ansiedade. Um passo de cada vez.',
        'Que a vida seja mais leve. Menos peso, mais presença.',
        'Que o dia feche com serenidade. O coração agradece.'
    ],
    gemeos: [
        'Que a mente descanse quando cansar. Pensamento também precisa de silêncio.',
        'Que as ideias encontrem chão. Clareza nasce quando se escolhe um foco.',
        'Que a curiosidade seja leve. Nem tudo precisa virar urgência.',
        'Que a palavra cure, não confunda. Dizer menos pode dizer melhor.',
        'Que o agora seja âncora. A mente viaja melhor quando sabe voltar.',
        'Que a dúvida vire pergunta boa. Perguntar é sabedoria em movimento.',
        'Que a conversa traga paz. O que é claro não pesa.',
        'Que o dia tenha espaço. Silêncio também organiza a cabeça.',
        'Que a leveza seja guia. Nem tudo precisa ser resolvido hoje.',
        'Que a mente se acalme. Uma coisa por vez basta.'
    ],
    cancer: [
        'Que o coração encontre porto seguro. Primeiro dentro, depois fora.',
        'Que a sensibilidade seja abrigo, não peso. Cuidar de si é prioridade.',
        'Que a intuição fale mais alto que o medo. Silêncio também é resposta.',
        'Que o afeto seja mútuo. Reciprocidade é paz emocional.',
        'Que o passado ensine sem prender. O presente merece espaço.',
        'Que o cuidado não vire excesso. Limite também é amor.',
        'Que o coração descanse. Nem tudo precisa de resposta agora.',
        'Que a casa interna fique em ordem. Paz começa por dentro.',
        'Que a saudade vire sabedoria. O agora pede presença.',
        'Que o dia termine com acolhimento. Você merece gentileza.'
    ],
    leao: [
        'Que o brilho seja generoso. Luz compartilhada multiplica.',
        'Que a autoestima seja quieta. Quem sabe do próprio valor não implora aplauso.',
        'Que o coração lidere com ternura. Grandeza de verdade acolhe.',
        'Que a alegria seja guia. O que é autêntico ilumina sem esforço.',
        'Que a coragem de amar seja maior que o orgulho. O afeto também é força.',
        'Que o brilho não pese. Você não precisa provar nada.',
        'Que o dia tenha beleza. O simples também pode ser grandioso.',
        'Que a presença fale. Silêncio seguro vale mais que performance.',
        'Que o amor-próprio seja base. Quando a base é forte, tudo cresce.',
        'Que a luz seja calma. Brilhar também é descansar.'
    ],
    virgem: [
        'Que o olhar atento também saiba descansar. Nem tudo precisa ser consertado hoje.',
        'Que o “feito” traga paz. Perfeição não é requisito para seguir.',
        'Que a rotina seja aliada, não prisão. Ajustes pequenos mudam o dia.',
        'Que a gentileza com si mesmo vença a cobrança. Você já está tentando.',
        'Que a clareza venha do simples. Menos peso, mais presença.',
        'Que o detalhe não roube o todo. Visão ampla também é sabedoria.',
        'Que a ordem traga leveza. Organização é cuidado consigo.',
        'Que o dia feche em paz. Você não precisa fazer tudo.',
        'Que o coração respire. Nem tudo é problema para resolver.',
        'Que o progresso seja constante. Um ajuste hoje já muda amanhã.'
    ],
    libra: [
        'Que o equilíbrio seja dinâmico. Harmonia é movimento, não estátua.',
        'Que a escolha seja leve. Decidir é também cuidar do próprio caminho.',
        'Que a gentileza não esconda a verdade. Honestidade também é amor.',
        'Que a paz não seja silêncio forçado. Conversa limpa o ar.',
        'Que a beleza acalme por dentro. Harmonia começa no coração.',
        'Que a presença valha mais que a aprovação. Você não precisa agradar tudo.',
        'Que o dia tenha doçura. O que é simples também cura.',
        'Que a balança encontre centro. Um “não” também é cuidado.',
        'Que a verdade venha com respeito. Limite é carinho.',
        'Que o coração escolha paz. Sem perder a própria voz.'
    ],
    escorpiao: [
        'Que a profundidade revele tesouros. O que desce sempre volta transformado.',
        'Que a verdade seja cura, não guerra. Firmeza também pode ser delicada.',
        'Que o controle ceda espaço à confiança. Soltar é renascer.',
        'Que a intensidade tenha direção. Potência sem rumo vira desgaste.',
        'Que o medo seja atravessado. Coragem emocional muda destinos internos.',
        'Que a transformação seja leve. Mudança não precisa ser dor.',
        'Que o silêncio organize o coração. Nem tudo precisa ser dito agora.',
        'Que a força seja limpa. Sem rancor, sem peso extra.',
        'Que o dia feche com clareza. Verdade também acalma.',
        'Que a coragem seja interna. O resto acompanha.'
    ],
    sagitario: [
        'Que o horizonte continue chamando. Mas que os pés toquem o chão também.',
        'Que a liberdade venha com responsabilidade. Expandir também é sustentar.',
        'Que a fé seja prática. Um passo pequeno abre grandes estradas.',
        'Que o entusiasmo não vire fuga. Presença também é aventura.',
        'Que o riso alivie o peso. Leveza é inteligência em movimento.',
        'Que o dia traga sentido. Propósito é bússola silenciosa.',
        'Que o novo seja bem-vindo. Mas sem esquecer o que sustenta.',
        'Que a alegria seja coragem. Viver bem também é escolha.',
        'Que a visão se transforme em ação. Ideia boa vira caminho.',
        'Que o coração respire livre. E que a mente volte pro agora.'
    ],
    capricornio: [
        'Que a montanha seja escalada com presença. O topo importa, mas o caminho também.',
        'Que a constância vença a pressa. O que é sólido não nasce correndo.',
        'Que o descanso seja estratégia. Nenhuma obra dura sem manutenção.',
        'Que a disciplina venha com humanidade. Você não precisa carregar tudo.',
        'Que o futuro seja construído sem esquecer o agora. Vida é também hoje.',
        'Que o dia feche com paz. Você já fez o suficiente.',
        'Que a meta não vire peso. Caminho também é vida.',
        'Que a responsabilidade tenha limites. Limite também é maturidade.',
        'Que o esforço seja reconhecido. Inclusive por você.',
        'Que a firmeza seja suave. Consistência é um abraço no tempo.'
    ],
    aquario: [
        'Que a visão inovadora encontre raízes. Futuro se constrói no presente.',
        'Que a liberdade seja ponte, não distância. Conectar também é força.',
        'Que o diferente encontre utilidade. Ideia boa vira mundo quando vira prática.',
        'Que a mente ampla lembre do coração. Humanidade também é tecnologia.',
        'Que o novo nasça com calma. Inovar é escolher melhor, não apenas mudar.',
        'Que a mudança tenha propósito. Revolução sem rumo vira ruído.',
        'Que o dia traga clareza. Nem todo caos é necessário.',
        'Que a comunidade some. Mas que você não se perca de si.',
        'Que o futuro seja leve. O presente é a base.',
        'Que a ideia vire ação. Um passo concreto muda o jogo.'
    ],
    peixes: [
        'Que os sonhos ganhem forma. Mas que a realidade também tenha espaço.',
        'Que a sensibilidade encontre limites. Cuidar de si é proteger a luz.',
        'Que a intuição seja guia. E que o corpo seja chão.',
        'Que a compaixão não vire sacrifício. Amor também é dizer não.',
        'Que a poesia do dia traga calma. O silêncio também cura.',
        'Que a gentileza seja consigo. Você não precisa salvar tudo.',
        'Que o dia feche em paz. Leveza também é sabedoria.',
        'Que a imaginação encontre rotina. Um passo por vez.',
        'Que o coração descanse. Limite também é amor.',
        'Que a alma respire. Presença é abrigo.'
    ]
};

const ELEMENT_CLOSERS: Record<'fogo' | 'terra' | 'ar' | 'agua', string[]> = {
    fogo: [
        'Que o impulso vire direção. Uma escolha consciente vale ouro.',
        'Que a coragem seja serena. Força que se controla é força real.',
        'Que o dia termine leve. Nem toda batalha é sua.',
        'Que a energia encontre um alvo. O resto é ruído.',
        'Que a vontade seja guia. Com calma por dentro.',
        'Que o movimento seja limpo. Sem pressa, sem culpa.',
        'Que a chama aqueça, não queime. Presença é proteção.',
        'Que a iniciativa seja madura. Começar também é sustentar.',
        'Que a ação cure. Mas que a pausa também cure.',
        'Que o coração avance com respeito ao próprio tempo.',
        'Que o entusiasmo se transforme em prática.',
        'Que a força seja usada com sabedoria.',
        'Que o impulso encontre estratégia.',
        'Que o dia feche com paz e coragem.',
        'Que a energia do começo abra um caminho bom.',
        'Que a coragem não vire pressa. O alvo é o que importa.',
        'Que o corpo acompanhe a mente. Respire e siga.',
        'Que a ação seja gentil. A vida responde melhor assim.',
        'Que a chama permaneça acesa. Sem consumir você.',
        'Que a intenção seja clara. O resto se alinha.'
    ],
    terra: [
        'Que o simples sustente. O essencial nunca falha.',
        'Que a calma organize tudo. Um passo de cada vez.',
        'Que o tempo seja aliado. Constância constrói.',
        'Que o corpo seja bússola. Ritmo é sabedoria.',
        'Que a estabilidade venha de dentro. E o resto se ajeita.',
        'Que a vida fique leve. Sem perder o chão.',
        'Que o dia feche com serenidade. Você merece descanso.',
        'Que a paciência renda frutos. O que é sólido fica.',
        'Que a rotina seja cuidado. E não prisão.',
        'Que a segurança seja presença. Não controle.',
        'Que o coração tenha tempo. Sem pressa, sem culpa.',
        'Que a consistência faça o trabalho silencioso.',
        'Que o passo seja firme. Mesmo pequeno.',
        'Que o hoje seja suficiente. O amanhã vem.',
        'Que a base esteja forte. O topo vem depois.',
        'Que a ordem traga paz. Sem rigidez.',
        'Que o corpo descanse. E a mente também.',
        'Que a vida seja simples. E bonita.',
        'Que o essencial guie o resto.',
        'Que o dia termine com chão e calma.'
    ],
    ar: [
        'Que a mente encontre foco. Um assunto por vez.',
        'Que a palavra traga clareza. Sem excesso, sem ruído.',
        'Que o silêncio organize. Nem tudo precisa de resposta.',
        'Que o agora seja âncora. A mente agradece.',
        'Que as ideias encontrem forma. E virem ação.',
        'Que a conversa seja limpa. O que é claro não pesa.',
        'Que a curiosidade seja leve. E não ansiedade.',
        'Que o dia feche com simplicidade. Respire.',
        'Que a mente desacelere. O coração acompanha.',
        'Que a dúvida vire direção. Perguntas certas curam.',
        'Que as ideias sejam boas companhias. Sem te levar embora.',
        'Que o pensamento seja ferramenta. Não prisão.',
        'Que a leveza seja escolha. E não fuga.',
        'Que a presença vença a pressa mental.',
        'Que a palavra seja ponte. Não muro.',
        'Que a mente descanse. O mundo espera.',
        'Que a clareza chegue devagar. E fique.',
        'Que a curiosidade encontre propósito.',
        'Que o foco seja gentil. Sem cobrança.',
        'Que o dia termine com paz na cabeça.'
    ],
    agua: [
        'Que o coração se acolha. Sem julgamento.',
        'Que a sensibilidade seja força. E não peso.',
        'Que a intuição guie com calma. O corpo sabe.',
        'Que o afeto seja mútuo. E simples.',
        'Que o dia feche com ternura. Você merece.',
        'Que o passado ensine sem prender.',
        'Que a emoção passe. E deixe clareza.',
        'Que o silêncio seja abrigo. E não fuga.',
        'Que a delicadeza proteja você.',
        'Que a paz comece dentro. E se espalhe.',
        'Que a onda não te leve. Você sabe voltar.',
        'Que a saudade vire sabedoria.',
        'Que o cuidado comece em você.',
        'Que a emoção vire direção. Sem excesso.',
        'Que o coração respire. Sem medo.',
        'Que a ternura seja prática hoje.',
        'Que o limite seja carinho.',
        'Que o afeto não pese. Que nutra.',
        'Que o dia termine com colo interno.',
        'Que a calma emocional te encontre.'
    ]
};

const ELEMENT_BRIDGES: Record<'fogo' | 'terra' | 'ar' | 'agua', string[]> = {
    fogo: [
        'O dia pede atitude com consciência, sem virar pressa.',
        'Há energia de decisão no ar, mas vale escolher o que realmente importa.',
        'Quando a vontade cresce, a direção precisa crescer junto.',
        'O impulso é bom — desde que tenha um alvo claro.',
        'Coragem hoje é também saber pausar antes de agir.'
    ],
    terra: [
        'O dia pede constância e um ritmo que você consiga sustentar.',
        'O que é simples funciona melhor quando feito com presença.',
        'Há força em manter o básico bem cuidado.',
        'O tempo é aliado quando você respeita o passo.',
        'Organizar por dentro costuma organizar por fora.'
    ],
    ar: [
        'O dia pede clareza: menos ruído, mais intenção.',
        'Quando a mente corre, o foco vira remédio.',
        'Conversas certas podem destravar o que estava pesado.',
        'Ideias boas pedem espaço para amadurecer.',
        'Às vezes, o melhor movimento é simplificar.'
    ],
    agua: [
        'O dia pede acolhimento: sentir sem se afogar.',
        'Quando a emoção sobe, respirar vira sabedoria.',
        'Intuição funciona melhor quando o coração está em paz.',
        'Cuidar do próprio limite muda tudo.',
        'Afeto hoje é mais sobre presença do que sobre explicação.'
    ]
};

const ELEMENT_INSIGHTS: Record<'fogo' | 'terra' | 'ar' | 'agua', string[]> = {
    fogo: [
        'Escolher uma prioridade hoje vale mais do que tentar vencer todas as frentes.',
        'Quando a energia fica alta, o corpo precisa de descarga — movimento ajuda.',
        'O “sim” certo hoje é mais poderoso do que mil “talvez”.',
        'O que é urgente nem sempre é importante. Dê nome ao alvo.',
        'Você não precisa provar nada. Faça por você.'
    ],
    terra: [
        'Pequenos ajustes hoje geram grande estabilidade amanhã.',
        'Rotina simples é um tipo de liberdade.',
        'Cuidar do básico é um ato de amor-próprio.',
        'O que é consistente vira confiança.',
        'A pressa é cara. O passo firme é rico.'
    ],
    ar: [
        'Uma conversa honesta vale por horas de pensamento em loop.',
        'Menos abas abertas, mais presença.',
        'Clareza nasce quando você escolhe um foco.',
        'Nem todo pensamento merece atenção.',
        'Escrever o que sente pode acalmar a mente.'
    ],
    agua: [
        'Sentir não é fraqueza. É informação.',
        'O limite protege o afeto — não o destrói.',
        'O coração se acalma quando você se trata com gentileza.',
        'Nem tudo precisa ser resolvido hoje. Às vezes, só acolhido.',
        'O passado ensina, mas o presente pede espaço.'
    ]
};

// ==================== ENERGIA DO DIA (GLOBAL) ====================
// Varia com o dia da semana + seed do dia, para dar sensação de "clima" atual.
// Importante: não é previsão de eventos — é linguagem simbólica de ritmo interno.

const WEEKDAY_ENERGIES: Record<number, string[]> = {
    // 0 = Domingo
    0: [
        'A energia do dia tem um tom de recolhimento e reorganização interna.',
        'Hoje o clima favorece descanso consciente e reconexão com o que é simples.',
        'A energia de hoje pede menos cobrança e mais gentileza com o próprio ritmo.',
        'O dia parece convidar a desacelerar para ouvir melhor o que você sente.',
        'A energia de hoje é de pausa boa: aquela que devolve clareza.'
    ],
    // 1 = Segunda
    1: [
        'A energia do dia tem um tom de reinício: foco, intenção e direção.',
        'Hoje o clima favorece colocar ordem no que estava solto.',
        'A energia de hoje pede planejamento leve: um passo de cada vez, mas com alvo.',
        'O dia cobra presença no básico — e o básico sustenta o resto.',
        'A energia do dia é de recomeço silencioso: ajuste fino e retomada.'
    ],
    // 2 = Terça
    2: [
        'A energia do dia favorece movimento: decisões pequenas, mas concretas.',
        'Hoje o clima tende a pedir ação sem pressa, como quem alinha e segue.',
        'A energia de hoje é direta: cortar excesso, priorizar e avançar.',
        'O dia convida a transformar intenção em atitude prática.',
        'A energia do dia é de coragem tranquila: firme por dentro, simples por fora.'
    ],
    // 3 = Quarta
    3: [
        'A energia do dia favorece clareza mental e conversas que destravam.',
        'Hoje o clima pede organização de pensamentos: menos ruído, mais foco.',
        'A energia de hoje é boa para revisar planos e ajustar rotas.',
        'O dia convida a olhar o meio do caminho com honestidade e leveza.',
        'A energia do dia é de alinhamento: o que não serve fica óbvio.'
    ],
    // 4 = Quinta
    4: [
        'A energia do dia favorece expansão responsável: crescer sem se perder.',
        'Hoje o clima tende a abrir perspectivas e trazer visão de longo prazo.',
        'A energia de hoje pede maturidade emocional para sustentar o que você quer.',
        'O dia convida a confiar mais na própria experiência do que na pressa.',
        'A energia do dia é de crescimento: firmeza no passo e amplitude no olhar.'
    ],
    // 5 = Sexta
    5: [
        'A energia do dia favorece conexão: relações, trocas e presença afetiva.',
        'Hoje o clima tende a pedir mais verdade nas conversas e menos máscara.',
        'A energia de hoje é boa para reconciliar: por dentro e por fora.',
        'O dia convida a celebrar pequenas vitórias sem exagero nem cobrança.',
        'A energia do dia é de leveza com responsabilidade: prazer sem fuga.'
    ],
    // 6 = Sábado
    6: [
        'A energia do dia favorece aterramento: corpo, rotina leve e descanso.',
        'Hoje o clima pede presença no concreto: cuidar do que sustenta.',
        'A energia de hoje é boa para simplificar e limpar excessos.',
        'O dia convida a desacelerar sem culpa e recuperar energia.',
        'A energia do dia é de reparo: fechar ciclos pequenos e respirar.'
    ]
};

// ==================== FUNÇÃO DE HASH ====================

// ==================== FUNÇÃO DE HASH ====================

export function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

export function selectFromArray<T>(arr: T[], seed: number): T {
    return arr[seed % arr.length];
}

// ==================== GERAÇÃO ====================

export interface LocalTemplateOptions {
    sign: string;      // slug: aries, touro, etc
    focus: string;     // amor, dinheiro, carreira
    dateBr: string;    // YYYY-MM-DD
}

export function generateLocalHoroscope(options: LocalTemplateOptions): { message: string } {
    const { sign, dateBr } = options;

    // Cria seed única baseada em data + signo
    const seed = simpleHash(`${dateBr}-${sign}`);

    // Dia da semana (UTC, para consistência em build)
    const d = new Date(`${dateBr}T12:00:00.000Z`);
    const weekday = d.getUTCDay();

    // Seleciona componentes
    // 1. Abertura (Breve introdução climática)
    const openers = OPENERS[sign] || OPENERS['aries'];
    const opener = selectFromArray(openers, seed);

    // 1.0 Energia do dia (global)
    const energies = WEEKDAY_ENERGIES[weekday] || WEEKDAY_ENERGIES[1];
    const dayEnergy = selectFromArray(energies, seed + 5);

    // Elemento (para micro-variações consistentes)
    const elementMap: Record<string, 'fogo' | 'terra' | 'ar' | 'agua'> = {
        aries: 'fogo', leao: 'fogo', sagitario: 'fogo',
        touro: 'terra', virgem: 'terra', capricornio: 'terra',
        gemeos: 'ar', libra: 'ar', aquario: 'ar',
        cancer: 'agua', escorpiao: 'agua', peixes: 'agua'
    };
    const element = elementMap[sign] || 'fogo';

    // 1.1 Ponte (varia o "ritmo" do texto sem perder o tom)
    const bridges = ELEMENT_BRIDGES[element] || ELEMENT_BRIDGES.fogo;
    const bridge = selectFromArray(bridges, seed + 7);

    // 2. CORPO RICO (V2) - O texto principal fluido e completo
    const bodies = BODIES_BY_SIGN[sign] || BODIES_BY_SIGN['aries'];
    const body = selectFromArray(bodies, seed + 1);

    // 2.1 Insight extra (micro-variação dentro do corpo)
    const insights = ELEMENT_INSIGHTS[element] || ELEMENT_INSIGHTS.fogo;
    const insight = selectFromArray(insights, seed + 11);

    // 3. Fechamento (Frase de efeito) — 30+ variações por combinação signo+elemento
    const signClosers = SIGN_CLOSERS[sign] || SIGN_CLOSERS['aries'];
    const elementClosers = ELEMENT_CLOSERS[element] || ELEMENT_CLOSERS.fogo;
    const closers = [...signClosers, ...elementClosers];
    const closer = selectFromArray(closers, seed + 2);

    // Monta mensagem
    const message = `${opener}

${dayEnergy}

${bridge}

${body}

${insight}

${closer}`;

    return { message };
}
