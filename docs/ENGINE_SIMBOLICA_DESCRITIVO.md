# Engine Simbólica - Documentação Técnica

## Visão Geral

A **Engine Simbólica** era um sistema de 4 camadas para gerar leituras astrológicas **profundamente personalizadas**, combinando:

1. **Numerologia** - Cálculos baseados no nome e data de nascimento
2. **Astronomia** - Dados astronômicos reais do dia
3. **Mapa Simbólico** - Arquétipos psicológicos dos signos
4. **Prompt Enriquecido** - Template de 7 seções para a IA

---

## Camada 1: Numerologia (`numerology.ts`)

### Propósito
Calcular números pessoais baseados no nome completo e data de nascimento do usuário.

### Funções Implementadas

| Função | Entrada | Saída | Descrição |
|--------|---------|-------|-----------|
| `calculateDestinyNumber` | Data nascimento | 1-9 ou 11/22 | Soma dos dígitos da data, reduzido |
| `calculateSoulNumber` | Nome | 1-9 | Soma das vogais do nome |
| `calculatePersonalityNumber` | Nome | 1-9 | Soma das consoantes do nome |
| `calculateExpressionNumber` | Nome | 1-9 | Soma de todas as letras |
| `calculatePersonalYear` | Data nascimento + ano atual | 1-9 | Ciclo anual pessoal |
| `calculatePersonalMonth` | Ano pessoal + mês | 1-9 | Ciclo mensal |
| `calculatePersonalDay` | Mês pessoal + dia | 1-9 | Ciclo diário |
| `calculateLifeCycle` | Idade | 1/2/3 | Fase da vida (formação/produção/colheita) |

### Interpretações por Número

Cada número (1-9, 11, 22) tinha um dicionário completo:

```typescript
{
  title: "O Visionário (Mestre)",
  essence: "Intuição elevada, inspiração e liderança espiritual",
  strength: "Capacidade de canalizar insights superiores",
  challenge: "Lidar com alta sensibilidade e nervosismo",
  mission: "Iluminar caminhos e inspirar evolução coletiva"
}
```

### Exemplo de Saída

Para **Maria da Silva, nascida em 15/05/1990**:

| Campo | Valor |
|-------|-------|
| Destino | 11 - O Visionário (Mestre) |
| Alma | 11 |
| Personalidade | 4 |
| Expressão | 6 |
| Ano Pessoal 2026 | 2 - Parcerias e Paciência |
| Ciclo de Vida | Produção (28-54 anos) |

---

## Camada 2: Astronomia (`astronomy.ts`)

### Propósito
Fornecer dados astronômicos **reais** para o dia específico da leitura.

### Funções Implementadas

| Função | Descrição |
|--------|-----------|
| `getMoonPhase(date)` | Fase da lua (8 fases) com % iluminação |
| `getMoonSign(date)` | Signo onde a Lua está (~2.5 dias por signo) |
| `getRetrogrades(date)` | Planetas retrógrados ativos |
| `isMercuryRetrograde(date)` | Check rápido para Mercúrio |
| `getAstronomicalContext(date)` | Contexto completo |

### Fases da Lua

```typescript
type MoonPhase = 
  | 'lua-nova'      // 🌑 Início, intenção
  | 'crescente'     // 🌒 Ação inicial
  | 'quarto-crescente' // 🌓 Decisão
  | 'gibosa-crescente' // 🌔 Refinamento
  | 'lua-cheia'     // 🌕 Culminação
  | 'gibosa-minguante' // 🌖 Gratidão
  | 'quarto-minguante' // 🌗 Liberação
  | 'minguante';    // 🌘 Recolhimento
```

### Retrogradações 2026 (Dados Reais)

| Planeta | Períodos |
|---------|----------|
| Mercúrio | 26/Jan-14/Fev, 19/Mai-10/Jun, 10/Set-02/Out |
| Vênus | 02/Mar-13/Abr |
| Marte | 06/Dez-23/Fev/2027 |
| Júpiter | 14/Jul-14/Nov |
| Saturno | 01/Jun-17/Out |
| Urano | 06/Set-03/Fev/2027 |
| Netuno | 05/Jul-11/Dez |
| Plutão | 04/Mai-13/Out |

### Exemplo de Saída

Para **30/01/2026**:

| Campo | Valor |
|-------|-------|
| Fase | 🌔 Lua Gibosa Crescente (93% iluminada) |
| Lua em | Sagitário (fogo, mutável) |
| Retrógrados | Mercúrio ℞ |
| Energia | Refinamento, ajuste, preparação |

---

## Camada 3: Mapa Simbólico (`symbolicMap.ts`)

### Propósito
Criar um **retrato psicológico profundo** do signo, com padrões emocionais, medos e desejos ocultos.

### Estrutura do Arquétipo

```typescript
interface SignArchetype {
  sign: string;
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
}
```

### Exemplo: Câncer

```typescript
{
  sign: 'Câncer',
  element: 'água',
  quality: 'cardinal',
  ruler: 'Lua',
  symbol: '♋',
  coreIdentity: 'O Protetor que nutre, cuida e preserva memórias',
  emotionalPatterns: [
    'Sensibilidade extrema ao ambiente',
    'Dificuldade em soltar o passado',
    'Necessidade de segurança emocional',
    'Tendência a se fechar quando ferido'
  ],
  strengths: ['Intuição', 'Cuidado', 'Memória emocional', 'Proteção'],
  challenges: ['Apego', 'Mágoa guardada', 'Manipulação emocional', 'Dependência'],
  hiddenDesire: 'Criar um lar seguro onde todos são amados',
  deepFear: 'Abandono, não ter para onde voltar'
}
```

### Todos os 12 Signos Documentados

Cada signo tinha arquétipo completo com:
- Essência central
- 4 padrões emocionais típicos
- 4 forças naturais
- 4 desafios recorrentes
- 1 desejo oculto
- 1 medo profundo

---

## Camada 4: Prompt Enriquecido

### Função `getPremiumSymbolicPrompt(map: SymbolicMap)`

Gerava um prompt de ~2000 caracteres para a IA com **todos os dados** do Mapa Simbólico.

### Estrutura das 7 Seções

| Seção | Palavras | Foco |
|-------|----------|------|
| 1. Abertura Emocional | 60-80 | Nome da pessoa, identificação imediata |
| 2. Leitura Psicológica | 100-120 | Conflitos internos, padrões |
| 3. Ciclo Pessoal | 80-100 | Ano Pessoal + Fase da Lua |
| 4. Padrões Recorrentes | 80-100 | Medo profundo, perspectiva de cura |
| 5. Integração | 100-120 | Amor, Trabalho, Dinheiro conectados |
| 6. Direcionamento | 60-80 | UMA ação prática e clara |
| 7. Encerramento | 40-60 | Frase marcante, empoderamento |

### Exemplo de Prompt Gerado

```
=== DADOS DA PESSOA ===

IDENTIDADE:
- Nome: Maria
- Signo Solar: Câncer
- Data: 1990-05-15

NUMEROLOGIA PESSOAL:
- Destino: 11 (O Visionário)
- Alma: 11
- Ano Pessoal 2026: 2 (Parcerias e Paciência)
- Ciclo de Vida: produção

ASTRONOMIA DO MOMENTO:
- Fase da Lua: Lua Gibosa Crescente
- Lua em: Sagitário
- Mercúrio retrógrado ⚠️

ARQUÉTIPO DO SIGNO:
- Essência: O Protetor que nutre...
- Medo profundo: Abandono
- Desejo oculto: Criar um lar seguro...

=== INSTRUÇÕES ===
- Use o nome "Maria" pelo menos 3 vezes
- 600-900 palavras
- Texto corrido, sem títulos
```

---

## Interface Unificada

### `buildSymbolicMap(name, birthDate, sign)`

Retornava um objeto completo:

```typescript
interface SymbolicMap {
  identity: { name, sign, birthDate };
  numerology: NumerologyProfile;
  astronomy: AstronomicalContext;
  archetype: SignArchetype;
  generatedAt: string;
}
```

---

## APIs de Teste Criadas

| Endpoint | Função |
|----------|--------|
| `/api/test-numerology` | Testava cálculos numerológicos |
| `/api/test-astronomy` | Testava dados astronômicos |
| `/api/test-symbolic-map` | Testava mapa completo |
| `/api/test-premium-gen` | Testava geração com IA |

---

## Custo Operacional

| Camada | Custo |
|--------|-------|
| Numerologia | Zero (cálculo local) |
| Astronomia | Zero (cálculo local + dados 2026) |
| Mapa Simbólico | Zero (dados estáticos) |
| Geração IA | ~$0.002 por leitura (gpt-4o-mini) |

---

## Diferencial Competitivo

A Engine Simbólica permitia criar leituras que:

1. **Usavam o nome da pessoa** - Não era genérico
2. **Refletiam o momento exato** - Lua, retrogradações
3. **Tocavam medos reais** - Arquétipo psicológico
4. **Davam direção prática** - Ano pessoal, ciclo
5. **Pareciam escritas por astrólogo humano** - Prompt elaborado

Isso era o diferencial para justificar o preço premium (R$29).
