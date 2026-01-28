import { simpleHash, selectFromArray } from './localTemplate';

// Tipagem da Resposta Premium
export interface PremiumContent {
    amor: string;
    dinheiro: string;
    carreira: string;
    bloqueio: string;
    oportunidade: string;
    conselho: string;
}

// ==================== TEMPLATES PREMIUM ====================
// Cada signo terá 3 variações completas de 6 dimensões
// Total de textos únicos escritos aqui: 12 signos * 3 variações * 6 seções = 216 textos

const PREMIUM_ARIES: PremiumContent[] = [
    {
        amor: "A paixão exige vulnerabilidade, algo que seu instinto guerreiro tenta evitar. Hoje, o desafio não é conquistar, mas se deixar ser visto sem armadura. Se estiver só, alguém que admira sua autonomia pode se aproximar. Se estiver acompanhado, troque a disputa de poder pela cumplicidade.",
        dinheiro: "Sua impulsividade pode ser um ativo se usada para iniciar projetos, mas um passivo se usada para gastos emocionais. A energia de hoje favorece ganhos rápidos, desde que você não gaste antes de receber. Cuidado com o otimismo exagerado.",
        carreira: "Você está sentindo que seu ritmo é mais rápido que o da equipe ou da empresa. Em vez de se frustrar, assuma a liderança de um projeto específico onde você possa ditar a velocidade. O mundo corporativo precisa da sua iniciativa, mas não da sua impaciência.",
        bloqueio: "A crença de que 'se eu não fizer, ninguém faz'. Isso te sobrecarrega e impede que outros cresçam ao seu lado.",
        oportunidade: "Um convite para liderar algo novo pode surgir disfarçado de um problema que ninguém quer resolver. Resolva-o.",
        conselho: "A flecha só vai longe porque o arqueiro tem paciência de puxar a corda para trás. Recuar estrategicamente também é avançar."
    },
    {
        amor: "Há uma tensão entre sua necessidade de liberdade e o desejo de fusão. Você não precisa escolher um só. É possível ter vínculo sem perder identidade. Explique ao outro que seu tempo sozinho é recarga, não rejeição.",
        dinheiro: "Evite decisões financeiras baseadas na raiva ou na vontade de provar algo para alguém. O dinheiro respeita a calma. Hoje é dia de plantar, não de colher à força.",
        carreira: "Sua franqueza é sua maior arma e seu maior risco hoje. Diga a verdade, mas ajuste o tom. Alguém em posição de poder está observando como você lida com a pressão.",
        bloqueio: "A impaciência com o processo. Querer pular etapas vai te fazer tropeçar lá na frente.",
        oportunidade: "Ousadia. Onde todos estão com medo de arriscar, é ali que está seu pote de ouro.",
        conselho: "Não confunda movimento com progresso. Correr em círculos também cansa."
    },
    {
        amor: "O amor pede ação, não apenas palavras. Surpreenda. Quebre a rotina. A energia estagnada é o veneno para seu coração de fogo. Se algo não vai bem, tenha a coragem de ter a conversa difícil que cura.",
        dinheiro: "Investimentos de risco calculado estão favorecidos. Sua intuição para negócios está afiada, mas precisa de dados para se sustentar. Confie no faro, mas verifique os números.",
        carreira: "Você nasceu para abrir caminhos, não para pavimentá-los. Se sentir estagnado em tarefas repetitivas, delegue ou automatize. Sua mente precisa de novidade para brilhar.",
        bloqueio: "A competitividade desnecessária. Nem tudo é uma corrida. Às vezes, chegar junto é melhor que chegar primeiro.",
        oportunidade: "Iniciar. A energia de 'começo' está disponível. Tire aquele projeto da gaveta hoje.",
        conselho: "Sua raiva é energia vital condensada. Não a engula, nem a vomite. Use-a como combustível para realizar."
    }
];

const PREMIUM_TOURO: PremiumContent[] = [
    {
        amor: "A segurança emocional é seu afrodisíaco hoje. Não busque emoções baratas; busque quem te traz paz. Se estiver em relação, cozinhe, toque, esteja presente fisicamente. O amor entra pelos sentidos.",
        dinheiro: "Você tem um dom natural para multiplicar recursos, mas o medo da escassez pode te travar. Solte um pouco a mão. O dinheiro precisa circular para voltar multiplicado. Um pequeno investimento em conforto fará bem.",
        carreira: "Sua consistência é notada, mas cuidado para não virar teimosia. Uma nova ferramenta ou método pode parecer ameaçador a princípio, mas trará a estabilidade que você tanto preza a longo prazo.",
        bloqueio: "A resistência à mudança. O novo não vem para destruir o que você construiu, mas para expandir.",
        oportunidade: "Reavaliar o valor do seu trabalho. É provável que você esteja cobrando (ou recebendo) menos do que entrega.",
        conselho: "A árvore mais forte é a que tem raízes profundas, mas galhos flexíveis ao vento. Seja bambu, não carvalho rígido."
    },
    {
        amor: "Possessividade não é cuidado. Hoje, pratique o desapego amoroso. Deixe o outro livre para ser quem é, e veja como ele volta mais inteiro para você. A confiança é o cimento da relação.",
        dinheiro: "Analise seus gastos fixos. Touro tende a acumular assinaturas e custos por inércia. Cortar o supérfluo hoje garantirá o luxo de amanhã.",
        carreira: "Trabalho duro você já faz. O convite hoje é para o trabalho inteligente. Como produzir o mesmo com menos esforço físico? Use sua praticidade para otimizar processos.",
        bloqueio: "A zona de conforto. Ela é quentinha, mas nada cresce lá.",
        oportunidade: "Algo tangível e de longo prazo. Imóveis, terra ou bens duráveis estão favorecidos.",
        conselho: "Não confunda valor com preço. Há coisas baratas que custam caro, e coisas caras que valem cada centavo."
    },
    {
        amor: "Sensualidade à flor da pele. Permita-se sentir prazer sem culpa. O corpo é seu templo e seu instrumento de conexão. Não intellectualize o amor hoje; sinta-o.",
        dinheiro: "A prosperidade vem da paciência. Não ceda a promessas de ganho rápido. Continue construindo tijolo por tijolo. Sua montanha de ouro está crescendo, mesmo que invisível agora.",
        carreira: "Alguém precisa da sua visão realista. Enquanto todos sonham, você vê a viabilidade. Sua opinião 'pé no chão' salvará um projeto de ser um desastre.",
        bloqueio: "O medo de perder o que já tem. Esse medo te impede de ganhar mais.",
        oportunidade: "Consolidar. Transformar uma ideia volátil em um produto sólido e vendável.",
        conselho: "A pressa é inimiga da perfeição, e você ama a perfeição. Respeite seu próprio ritmo, mesmo que o mundo corra."
    }
];

const PREMIUM_GEMEOS: PremiumContent[] = [
    {
        amor: "A comunicação é a chave, mas hoje ela precisa ser profunda, não apenas informativa. Fale sobre o que sente, não só sobre o que pensa. Se está só, alguém intelectualmente estimulante vai cruzar seu caminho.",
        dinheiro: "Diversificação é sua força, dispersão é sua fraqueza. Ter múltiplas fontes de renda é ótimo, desde que você consiga gerenciar todas. Hoje, foque em uma. A que dá mais retorno com menos esforço mental.",
        carreira: "Sua adaptabilidade será testada. Uma mudança de planos repentina pode te irritar ou te dar uma vantagem competitiva. Escolha ver como vantagem. Use sua rede de contatos para resolver o problema.",
        bloqueio: "A superficialidade. Querer saber um pouco de tudo e não dominar nada pode te impedir de ser reconhecido como expert.",
        oportunidade: "Conectar pessoas. Você é a ponte. Apresente A para B e veja a mágica (e o lucro) acontecer.",
        conselho: "A mente mente. Às vezes ela cria cenários que nunca vão acontecer só para se entreter. Volte para o agora."
    },
    {
        amor: "O tédio é o inimigo. Se a relação caiu na rotina, não troque de parceiro, troque a rotina. Proponha algo inédito. A curiosidade compartilhada reacende a chama.",
        dinheiro: "Cuidado com letras miúdas e promessas verbais. Mercúrio pede atenção aos detalhes contratuais hoje. O que é combinado não sai caro, mas precisa ser muito bem combinado.",
        carreira: "Você está falando demais e ouvindo de menos. Hoje, a sabedoria está no silêncio. Observe as dinâmicas de poder ao seu redor antes de dar sua opinião.",
        bloqueio: "A indecisão. Ficar em cima do muro só te dá dor na virilha. Escolha um lado, mesmo que erre.",
        oportunidade: "Vendas e negociação. Sua lábia está magnética. Use-a para fechar aquele acordo travado.",
        conselho: "Você não é seus pensamentos. Você é a consciência que observa eles. Aprenda a trocar o canal do rádio mental."
    },
    {
        amor: "Dualidade em alta. Uma parte quer compromisso, a outra quer voar. Não se julgue. Aceite sua complexidade. Busque alguém que ame suas duas faces, não alguém que tente te consertar.",
        dinheiro: "Ideias valem ouro, mas execução vale diamante. Você tem a ideia milionária na cabeça. Tire ela de lá e coloque no papel hoje. O primeiro passo prático é o que falta.",
        carreira: "Multitarefa não é produtividade. É ansiedade gourmet. Escolha 3 prioridades e mate-as antes do almoço. A sensação de dever cumprido vai acalmar seu sistema nervoso.",
        bloqueio: "A fofoca ou informação inútil. Filtre o que entra na sua mente como filtra o que come.",
        oportunidade: "Aprendizado rápido. Hoje você absorve informação como uma esponja. Estude algo que aumente seu valor de mercado.",
        conselho: "Leveza não é irresponsabilidade. É a arte de navegar o caos sem afundar."
    }
];

const PREMIUM_CANCER: PremiumContent[] = [
    {
        amor: "Sua casca é proteção, mas hoje pode virar prisão. Deixe alguém entrar. A vulnerabilidade é sua maior força magnética agora. Se o passado bater à porta, não abra; ele não tem nada novo a oferecer.",
        dinheiro: "Segurança financeira é emocional para você. Guardar é bom, mas investir no seu bem-estar também é lucro. Compre algo que faça sua casa ser mais acolhedora; isso vai recarregar sua energia para ganhar mais.",
        carreira: "Sua intuição nos negócios está afiada. Se sentir que algo está errado num acordo, provavelmente está. Confie no estômago, não só na planilha. Liderar com empatia trará resultados surpreendentes.",
        bloqueio: "O excesso de cautela. O medo de se machucar te impede de viver a glória da conquista.",
        oportunidade: "Cuidar de pessoas ou processos. Onde há caos humano, sua habilidade de acolher vale ouro.",
        conselho: "Você não precisa carregar o mundo nas costas para justificar sua existência. Solte o peso."
    },
    {
        amor: "Cuidado para não virar 'mãe' ou 'pai' do parceiro. Cuidar é lindo, infantilizar o outro mata o desejo. Busque equilíbrio entre dar e receber. Você merece ser cuidado também.",
        dinheiro: "Flutuações financeiras podem gerar ansiedade. Respire. A maré sobe e desce; é da natureza. Foque no longo prazo e não no extrato de hoje. Sua intuição financeira trará a solução em breve.",
        carreira: "O ambiente de trabalho afeta sua produtividade. Se puder, melhore seu espaço físico ou trabalhe de casa. Estar confortável emocionalmente fara você produzir o dobro.",
        bloqueio: "O rancor. Guardar mágoa é tomar veneno esperando que o outro morra. Limpe seu porão emocional.",
        oportunidade: "Memória e história. Trabalhos que envolvam passado, raízes ou restauração estão favorecidos.",
        conselho: "Honre suas emoções, mas não se afogue nelas. Seja o surfista, não a onda."
    },
    {
        amor: "A lua te deixa magnético hoje. Use esse poder para atrair o que realmente nutre sua alma. Relações superficiais não vão te sustentar. É tudo ou nada, e está tudo bem exigir profundidade.",
        dinheiro: "Intuição para imóveis, casa e família. Talvez seja hora de investir no lar ou negociar algo relacionado a propriedade. O dinheiro flui quando você sente que está construindo um ninho seguro.",
        carreira: "Não tenha vergonha de sua sensibilidade no trabalho. Em um mundo de robôs, quem sente é rei. Sua capacidade de ler o ambiente vale mais que um MBA hoje.",
        bloqueio: "A vitimização. 'Tudo acontece comigo'. Mude para 'Tudo acontece PARA mim' e veja o jogo virar.",
        oportunidade: "Nutrição (física ou emocional). Projetos que alimentam pessoas têm sua assinatura de sucesso.",
        conselho: "Proteger-se é sábio. Isolar-se é perigoso. Saiba a diferença."
    }
];

const PREMIUM_LEAO: PremiumContent[] = [
    {
        amor: "Seu coração é um palco, mas nem todo mundo merece ingresso VIP. Pare de performar para ser amado. Quem te ama de verdade quer ver os bastidores, inclusive a bagunça. Deixe a máscara cair.",
        dinheiro: "Generosidade é sua marca, mas cuidado para não comprar o afeto das pessoas. O dinheiro deve servir para financiar sua criatividade, não seu ego. Invista em algo que projeite sua imagem profissional.",
        carreira: "Liderança nata. Se não estiver no comando, estará frustrado. Se não puder ser o chefe hoje, seja o 'dono' do projeto. Assuma responsabilidade total e os holofotes virão naturalmente.",
        bloqueio: "A necessidade de aplauso constante. O silêncio da plateia não significa fracasso, significa atenção.",
        oportunidade: "Artes e expressão pública. Falar, apresentar, criar. O mundo quer te ouvir.",
        conselho: "Você é o Sol. O Sol não pede para brilhar, ele apenas brilha. Não mendigue reconhecimento."
    },
    {
        amor: "Orgulho pode ser charmoso ou destrutivo. Hoje, escolha ser humilde. Pedir desculpas não é fraqueza, é realeza. Se estiver só, procure alguém que não compita com sua luz, mas que tenha luz própria.",
        dinheiro: "Sorte favorece os audazes. Hoje é dia de pedir aquele aumento ou cobrar mais caro. Você vale. Se você não acreditar no seu preço, ninguém vai.",
        carreira: "Criatividade desbloqueada. A solução para o problema chato do trabalho virá de uma ideia lúdica. Brinque mais. A seriedade excessiva está matando sua genialidade.",
        bloqueio: "O drama. Transformar um copo d'água em tempestade só cansa sua beleza.",
        oportunidade: "Networking de alto nível. Circule entre quem tem poder de decisão.",
        conselho: "Seja leal a quem te apoiou quando você era apenas um filhote."
    },
    {
        amor: "Paixão ardente ou nada. O morno te enjoa. Hoje, coloque pimenta. Se a relação está chata, a responsabilidade de animar é sua. Crie o momento mágico que você tanto espera receber.",
        dinheiro: "Gastos com luxo ou estética podem surgir. Se for para melhorar sua autoestima, é investimento. Se for para impressionar vizinho, é prejuízo. Saiba a diferença.",
        carreira: "Sua autoridade está sendo testada. Não grite. A verdadeira autoridade fala baixo e é ouvida. Mantenha a postura régia diante do caos.",
        bloqueio: "A arrogância sutil de achar que sabe o que é melhor para todo mundo.",
        oportunidade: "Lançar algo autoral. Um projeto com seu nome e sua cara.",
        conselho: "Mantenha o coração aberto, mesmo que já tenha sido arranhado. Um coração fechado vira pedra, e pedras não brilham."
    }
];

const PREMIUM_VIRGEM: PremiumContent[] = [
    {
        amor: "Você quer consertar o parceiro, mas ele não é um projeto de reforma. Ame a imperfeição hoje. A crítica, mesmo construtiva, pode ferir. Troque a lupa pelo abraço.",
        dinheiro: "Sua habilidade de economizar nos detalhes trará lucro. Revise planilhas, contratos e custos pequenos. O diabo (e a riqueza) mora nos detalhes.",
        carreira: "O caos ao redor te incomoda, mas é sua chance de brilhar. Organize o que está bagunçado. Sua ordem trará paz para a equipe e reconhecimento para você. Servir é reinar.",
        bloqueio: "O perfeccionismo paralisante. O feito é melhor que o perfeito não feito.",
        oportunidade: "Análise de dados ou revisão. Seu olho de águia vai pegar um erro que custaria caro.",
        conselho: "Seja gentil com você mesmo. A voz na sua cabeça não precisa ser tão dura."
    },
    {
        amor: "A mente analítica atrapalha o sentir. Desligue o checklist do 'parceiro ideal' e sinta a conexão real. Às vezes, o amor vem numa embalagem que você não aprovou previamente.",
        dinheiro: "Investimento em saúde é prioridade. Um corpo funcionando bem é sua maior máquina de fazer dinheiro. Não economize na comida de qualidade.",
        carreira: "Eficiência máxima. Hoje você faz o trabalho de três em metade do tempo. Use o tempo livre para descansar, não para pegar mais trabalho. Respeite seu limite.",
        bloqueio: "A preocupação excessiva com o futuro. Sofrer por antecipação é pagar juros de uma dívida que nem existe.",
        oportunidade: "Sistematização. Criar um método ou processo que pode ser replicado (e vendido).",
        conselho: "A pureza está na intenção, não no resultado. Faça o seu melhor e solte."
    },
    {
        amor: "Servir é sua linguagem de amor. Fazer um café, arrumar a cama, ajudar com um problema. Isso é lindo, mas certifique-se de que está sendo valorizado. Não vire capacho por amor.",
        dinheiro: "Prudência. Hoje não é dia de riscos. Mantenha o conservadorismo financeiro. Revise suas metas de longo prazo e ajuste a rota.",
        carreira: "Alguém vai pedir sua opinião técnica. Dê com precisão cirúrgica. Sua reputação de 'quem sabe o que fala' está crescendo.",
        bloqueio: "A autocrítica. Você se bate por erros que ninguém mais notou.",
        oportunidade: "Consultoria ou especialização. Seu conhecimento específico vale dinheiro.",
        conselho: "A vida não é uma planilha. Deixe uma margem de erro para o imprevisto (e para a alegria)."
    }
];

const PREMIUM_LIBRA: PremiumContent[] = [
    {
        amor: "A harmonia a qualquer custo é falsa. Se algo te incomoda, fale. O conflito é necessário para a intimidade real. Não sorria se quiser chorar. A autenticidade é mais atraente que a polidez.",
        dinheiro: "Parcerias financeiras favorecidas. Dividir para multiplicar. Talvez seja hora de chamar aquele sócio ou dividir custos com alguém.",
        carreira: "Diplomacia é sua espada. Você resolverá uma briga no trabalho apenas com sua presença equilibrada. Use seu charme para negociar melhores condições.",
        bloqueio: "A indecisão eterna. Esperar a escolha perfeita pode te fazer perder a escolha boa.",
        oportunidade: "Estética e design. Tudo que envolve beleza e harmonia visual pode gerar lucro hoje.",
        conselho: "Dizer 'não' também é um ato de equilíbrio."
    },
    {
        amor: "O espelho do relacionamento reflete o que você precisa trabalhar em si. Se o outro te irrita, olhe para dentro. A projeção é forte hoje. Ame o outro, cure a si mesmo.",
        dinheiro: "Gastar para preencher vazio emocional? Cuidado. O belo atrai, mas o extrato cobra. Busque a beleza que é de graça: um pôr do sol, uma música.",
        carreira: "Trabalho em equipe flui. Você é a cola que une o grupo. Promova a cooperação, mas não carregue o peso de quem não faz nada.",
        bloqueio: "A necessidade de aprovação. Você não é pizza para agradar todo mundo.",
        oportunidade: "Mediação e acordos. Sua imparcialidade vale ouro em negociações tensas.",
        conselho: "Justiça não é dar igual para todos, é dar o que cada um precisa (inclusive você)."
    },
    {
        amor: "Romance no ar. Pequenos gestos gentis criarão grandes ondas de afeto. Flores, bilhetes, elogios. O clichê funciona porque é bom.",
        dinheiro: "Equilíbrio entre entrada e saída. Use sua balança interna para ajustar o orçamento. Talvez seja hora de cortar um gasto social para investir num sonho pessoal.",
        carreira: "Decisões precisam ser tomadas. Pare de pesar os prós e contras infinitamente. Jogue a moeda se precisar, mas decida. A ação cura o medo.",
        bloqueio: "A preguiça disfarçada de 'estou pensando'. Mova-se.",
        oportunidade: "Relações Públicas. Sua imagem pessoal abrirá portas hoje.",
        conselho: "A paz verdadeira não é a ausência de guerra, é a paz no meio da guerra."
    }
];

const PREMIUM_ESCORPIAO: PremiumContent[] = [
    {
        amor: "Intensidade não é amor, é vício. Busque a profundidade calma. O ciúme pode surgir como um monstro; olhe nos olhos dele e veja que é apenas medo de perder. Confie mais.",
        dinheiro: "Dinheiro de terceiros em pauta. Heranças, empréstimos, investimentos conjuntos. Sua intuição para 'dinheiro escondido' está alta. Investigue.",
        carreira: "Você vê o que ninguém vê. Os segredos da empresa, as intenções ocultas. Use isso com ética. Saber é poder, mas calar é sabedoria.",
        bloqueio: "O controle excessivo. Tentar controlar o incontrolável só te esgota.",
        oportunidade: "Transformação drástica. Jogar fora todo o projeto e começar do zero, melhor.",
        conselho: "Para renascer, é preciso morrer um pouco. Deixe ir o que já foi."
    },
    {
        amor: "Fusão de almas. O sexo e o amor estão intrincados hoje. A entrega total assusta, mas é a única via para você. Mergulhe, mas saiba nadar de volta para a superfície.",
        dinheiro: "Corte gastos implacavelmente. Você é o cirurgião das finanças hoje. Se não é vital, elimine. Essa limpeza trará abundância.",
        carreira: "Foco obsessivo. Quando você cisma com uma meta, nada te para. Use essa visão de raio laser para terminar a tarefa mais difícil do mês hoje.",
        bloqueio: "A vingança ou ressentimento. Energia gasta com inimigos é energia roubada dos seus sonhos.",
        oportunidade: "Investigação e pesquisa. Cavar fundo trará diamantes.",
        conselho: "Sua picada é fatal, mas seu remédio também. Escolha curar hoje."
    },
    {
        amor: "Mistério atrai. Não revele tudo de cara. Mantenha um pouco de segredo para manter o interesse vivo. A sedução está no não-dito.",
        dinheiro: "Poder e dinheiro andam juntos. Hoje, busque o poder (influência, reputação) e o dinheiro virá atrás. Não se venda por pouco.",
        carreira: "Crise é oportunidade. Onde todos veem problema, você vê chance de mudança. Lidere a gestão da crise e vire herói.",
        bloqueio: "A paranoia. Nem todo mundo está conspirando contra você.",
        oportunidade: "Psicologia e compreensão humana. Entender a mente do cliente é sua mina de ouro.",
        conselho: "Águas paradas apodrecem. Mova suas emoções, chore, grite, sue. Flua."
    }
];

const PREMIUM_SAGITARIO: PremiumContent[] = [
    {
        amor: "A liberdade é negociável, a honestidade não. Hoje, a verdade cruel pode salvar a relação. Diga o que precisa ser dito, mas sem crueldade desnecessária. O outro vai agradecer a clareza.",
        dinheiro: "Aposte no conhecimento. Livros, cursos, viagens culturais. O dinheiro gasto para expandir a mente tem ROI infinito para você. Cuidado apenas com a generosidade excessiva com amigos.",
        carreira: "Você não cabe numa caixa. Se sentir preso, vai explodir. Busque projetos que permitam autonomia e movimento. Vender ideias ou ensinar é seu forte hoje.",
        bloqueio: "O dogmatismo. Achar que é dono da verdade afasta aliados.",
        oportunidade: "Ensino ou publicação. Compartilhe o que sabe e monetize isso.",
        conselho: "A flecha precisa de um alvo. Energia sem direção é apenas desperdício."
    },
    {
        amor: "Aventura a dois. Leve o parceiro para fora da zona de conforto. Uma viagem, um passeio, uma comida exótica. O amor precisa de oxigênio novo para sobreviver.",
        dinheiro: "Otimismo financeiro é bom, mas tenha um plano B. A sorte sorri, mas a competência garante. Aposte na expansão internacional ou em produtos digitais.",
        carreira: "Visão estratégica. Enquanto todos olham o hoje, você vê o ano que vem. Comunique essa visão para a liderança. Você é o farol do time.",
        bloqueio: "A falta de tato. Sinceridade sem empatia é apenas grosseria.",
        oportunidade: "Turismo, línguas ou comércio exterior. O mundo é seu quintal.",
        conselho: "Ria de si mesmo. O humor é a salvação para dias pesados."
    },
    {
        amor: "Independência é sexy. Não tente prender Sagitário, e Sagitário não prenda ninguém. O amor livre (de amarras mentais) é o único que dura. Respeite o espaço do outro.",
        dinheiro: "Ganhos inesperados podem vir de longe. Internet, e-commerce ou contatos distantes. Mantenha o passaporte (e o PayPal) em dia.",
        carreira: "Mentoria. Você tem sabedoria para passar adiante. Assuma o papel de guia para alguém mais jovem e aprenda ensinando.",
        bloqueio: "A inconsistência. Começar mil coisas e não terminar nenhuma.",
        oportunidade: "Filosofia de vida. Vender um estilo de vida ou uma crença.",
        conselho: "A vida é uma festa, mas alguém tem que limpar o salão depois. Ajude na limpeza."
    }
];

const PREMIUM_CAPRICORNIO: PremiumContent[] = [
    {
        amor: "Amor é construção diária, não mágica de cinema. Valorize quem está lá na segunda-feira de manhã, não só no sábado à noite. A lealdade é sua linguagem de amor; exija o mesmo.",
        dinheiro: "Ambição não é pecado. Hoje, trace a meta financeira mais ousada que conseguir e divida em 100 passos pequenos. O primeiro passo você dá hoje. O topo da montanha te espera.",
        carreira: "Sua autoridade natural está brilhando. Assuma responsabilidades pesadas; você aguenta e será recompensado por isso. O mundo corporativo ama Capricórnio.",
        bloqueio: "A solidão no topo. Não se isole por achar que ninguém é competente o suficiente.",
        oportunidade: "Gestão e estrutura. Organizar o caos alheio é lucrativo.",
        conselho: "Descanse. A máquina (você) precisa de manutenção para não pifar."
    },
    {
        amor: "Não leve a frieza para a cama. Lá fora você é o general, em casa, permita-se ser o humano. Um pouco de vulnerabilidade não vai derrubar seu império.",
        dinheiro: "Investimentos conservadores e tangíveis. Terra, tijolo, ouro. Nada de criptomoedas voláteis hoje. Você precisa ver onde pisa.",
        carreira: "Reconhecimento vem pelo resultado, não pela promessa. Entregue antes do prazo. Surpreenda pela excelência técnica. Sua reputação é seu maior ativo.",
        bloqueio: "O pessimismo. Ver problemas onde só existem desafios.",
        oportunidade: "Longo prazo. Plantar algo que vai colher daqui a 10 anos.",
        conselho: "O tempo é seu aliado. Não tenha pressa, tenha constância."
    },
    {
        amor: "Compromisso sério. Se não for para construir futuro, nem comece. Deixe claro suas intenções. O outro vai respeitar sua seriedade.",
        dinheiro: "Corte custos operacionais. Seja na empresa ou em casa, há vazamentos pequenos que somam muito. Feche a torneira hoje.",
        carreira: "Status importa para você, admita. Trabalhe para chegar na cadeira que deseja. Networking com gente mais velha ou experiente abrirá atalhos.",
        bloqueio: "A rigidez. Se não dobrar, quebra.",
        oportunidade: "Tradição. Restaurar algo antigo ou valorizar o clássico.",
        conselho: "Você já é suficiente. Não precisa provar nada para ninguém além de si mesmo."
    }
];

const PREMIUM_AQUARIO: PremiumContent[] = [
    {
        amor: "Amizade é a base. Se não for seu melhor amigo, não serve. Conexão mental vem antes da física. Converse sobre alienígenas, política ou tecnologia; isso é preliminar para você.",
        dinheiro: "Inovação traz lucro. Aquela ideia 'louca' que ninguém botou fé? É lá que está o dinheiro. Aposte no diferente, no tecnológico, no futuro.",
        carreira: "Trabalho em grupo, mas com autonomia individual. Você não serve para hierarquia rígida. Busque ambientes horizontais ou crie o seu próprio. A liberdade criativa é inegociável.",
        bloqueio: "A rebeldia sem causa. Ser do contra só para ser diferente é chato.",
        oportunidade: "Tecnologia e social. Apps, comunidades ou causas humanitárias.",
        conselho: "Você vive no futuro, mas seu corpo está no presente. Cuide dele."
    },
    {
        amor: "Espaço. Você precisa de ar. Se a relação sufoca, você foge. Explique isso antes de sumir. A liberdade compartilhada é a maior prova de amor aquariana.",
        dinheiro: "Cripto, digital, crowdfunding. O dinheiro virtual flui melhor para você que o físico. Estude novas economias.",
        carreira: "Visionário. Você enxerga tendências antes da massa. Venda essa visão. Consultoria de inovação ou trendhunting.",
        bloqueio: "A frieza emocional. Tratar gente como conceito machuca.",
        oportunidade: "O inédito. Se nunca foi feito, é para você fazer.",
        conselho: "Pertencer a um grupo não significa perder sua identidade. Somos um, mas somos muitos."
    },
    {
        amor: "Surpresa. O previsível mata sua libido. Faça algo inusitado hoje. Mude o roteiro. O amor precisa ser uma revolução constante.",
        dinheiro: "Gastar com tecnologia é investimento. Um computador melhor, um software novo. Tudo que agiliza seu raciocínio traz retorno.",
        carreira: "Quebrar regras. Se o processo é burro, mude o processo (com jeito). Sua função é evoluir o sistema, não obedecê-lo.",
        bloqueio: "O isolamento intelectual. Achar que ninguém te entende é solitário.",
        oportunidade: "Redes e comunidades. Liderar um movimento online.",
        conselho: "A humanidade vale a pena, apesar dos humanos."
    }
];

const PREMIUM_PEIXES: PremiumContent[] = [
    {
        amor: "Fusão espiritual. Você busca alma, não só corpo. Hoje, medite com o parceiro ou tenham uma conversa sobre sonhos. A conexão psíquica estará fortíssima.",
        dinheiro: "O dinheiro é energia. Se você trata o dinheiro como 'sujo' ou 'difícil', ele foge. Cure sua relação espiritual com a abundância. Você merece prosperar para ajudar o mundo.",
        carreira: "Artes, cura, empatia. Trabalhos onde a lógica não reina são seu palco. Confie na intuição para tomar decisões de negócios. Ela sabe mais que o Excel.",
        bloqueio: "A fuga da realidade. Netflix e vinho não resolvem boleto.",
        oportunidade: "O invisível. Astrologia, terapia, arte, música. O que toca a alma vende.",
        conselho: "Defina limites. Sua empatia sem bordas vira esponja de problemas alheios."
    },
    {
        amor: "Sacrifício não é amor. Pare de tentar salvar o outro. Ame-o como ele é, ou deixe-o ir. Você é parceiro, não salvador.",
        dinheiro: "Caridade traz retorno, mas pague suas contas primeiro. Organize o caos financeiro. Contrate alguém para cuidar da parte chata se precisar.",
        carreira: "Criatividade fluida. Hoje as ideias virão em sonhos ou insights súbitos. Tenha um caderno por perto. O universo está te ditando o próximo passo.",
        bloqueio: "A vitimização ou o martírio. Sofrer não te faz santo.",
        oportunidade: "Água. Mar, bebidas, emoções fluidas. Tudo que flui.",
        conselho: "Você é o oceano. Imensos, profundos e misteriosos. Não aceite viver no raso."
    },
    {
        amor: "Romance de cinema. Crie a fantasia. Velas, música, poesia. O mundo real é duro demais; traga a magia para dentro de casa.",
        dinheiro: "Cuidado com golpes. Sua bondade atrai oportunistas. Não empreste dinheiro hoje e não assine nada sem ler 3 vezes.",
        carreira: "Adaptação. Como água, você contorna obstáculos. Se fecharem a porta, entre pela fresta. Sua flexibilidade é sua maior competência.",
        bloqueio: "A falta de foco. Sonhar é bom, realizar é melhor.",
        oportunidade: "Imagem e ilusão. Fotografia, cinema, moda.",
        conselho: "Confie no fluxo. O rio sabe o caminho para o mar."
    }
];

// ... (Adicionarei Sagitário a Peixes nos próximos passos)

export function generatePremiumHoroscope(sign: string, dateBr: string): PremiumContent {
    const seed = simpleHash(`${dateBr}-${sign}-premium`);

    // Mapa de signos
    const map: Record<string, PremiumContent[]> = {
        aries: PREMIUM_ARIES,
        touro: PREMIUM_TOURO,
        gemeos: PREMIUM_GEMEOS,
        cancer: PREMIUM_CANCER,
        leao: PREMIUM_LEAO,
        virgem: PREMIUM_VIRGEM,
        libra: PREMIUM_LIBRA,
        escorpiao: PREMIUM_ESCORPIAO,
        sagitario: PREMIUM_SAGITARIO,
        capricornio: PREMIUM_CAPRICORNIO,
        aquario: PREMIUM_AQUARIO,
        peixes: PREMIUM_PEIXES
    };

    const contents = map[sign] || PREMIUM_ARIES; // Fallback
    return selectFromArray(contents, seed);
}
