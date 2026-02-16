import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface Person {
  name: string;
  birthDate: string;
  sign: string;
}

interface RequestBody {
  a: Person;
  b: Person;
  focus?: 'amor' | 'quimica' | 'trabalho' | 'amizade';
}

async function callOpenAI(prompt: string): Promise<{ success: boolean; content?: string; error?: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { success: false, error: 'OPENAI_API_KEY não configurada' };

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um conselheiro simbólico (tom místico-terapêutico, com pitadas de romance). Responda APENAS com JSON válido.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '';
    return { success: true, content };
  } catch (e: unknown) {
    const err = e as { code?: string; message?: string };
    return { success: false, error: err?.code || err?.message || 'OpenAI error' };
  }
}

async function callGemini(prompt: string): Promise<{ success: boolean; content?: string; error?: string }> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return { success: false, error: 'GEMINI_API_KEY não configurada' };

  const models = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt + '\n\nRetorne APENAS JSON válido.' }] }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 2000,
              responseMimeType: 'application/json',
            },
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) return { success: true, content: text };
      }
    } catch (e) {
      console.log(`[Gemini] ${model} failed:`);
    }
  }

  return { success: false, error: 'Todos os modelos Gemini falharam' };
}

function extractJSON(text: string): any {
  let cleanText = (text || '')
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    return JSON.parse(cleanText);
  } catch {
    const m = cleanText.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        // fallthrough
      }
    }

    const unescaped = cleanText
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\\\\"/g, '"')
      .replace(/\\\"/g, '"');

    try {
      return JSON.parse(unescaped);
    } catch {
      // Heurística: extrair campos principais mesmo se o JSON estiver levemente inválido (trailing commas, etc.)
      try {
        const tituloMatch = unescaped.match(/"titulo"\s*:\s*"([\s\S]*?)"\s*,/);
        const leituraMatch = unescaped.match(/"leitura"\s*:\s*"([\s\S]*?)"\s*\}?\s*$/);

        const titulo = tituloMatch?.[1]
          ? tituloMatch[1].replace(/\\"/g, '"').replace(/\"/g, '"')
          : 'Leitura do Casal';

        const leituraRaw = leituraMatch?.[1] ? leituraMatch[1] : (cleanText || text || '');
        const leitura = leituraRaw
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\r/g, '\r')
          .replace(/\\"/g, '"')
          .replace(/\"/g, '"');

        return { titulo, leitura };
      } catch {
        return { titulo: 'Leitura do Casal', leitura: cleanText || text };
      }
    }
  }
}

function buildPrompt({ a, b, focus }: RequestBody) {
  const focusLine = focus ? `Foco: ${focus}.` : 'Foco: relacionamento (geral).';

  return `Gere uma LEITURA SIMBÓLICA DO CASAL (automática), em pt-BR, no tom místico-terapêutico com pitadas de romance.

Regras:
- Não faça previsões determinísticas de eventos.
- Seja prático (sugira ações curtas e seguras).
- Evite promessas absolutas.
- Conteúdo escaneável com títulos curtos e bullets.
- Inclua um "Ritual de 7 dias" (7 itens, um por dia, 10 min).
- Inclua "Ponto Cego do Casal" (1 parágrafo) e "Como interromper o ciclo" (bullets).

${focusLine}

Pessoa 1:
- Nome: ${a.name}
- Nascimento: ${a.birthDate}
- Signo: ${a.sign}

Pessoa 2:
- Nome: ${b.name}
- Nascimento: ${b.birthDate}
- Signo: ${b.sign}

Retorne APENAS JSON válido com este formato:
{
  "titulo": string,
  "leitura": string (markdown)
}
`;
}

function generateLocalFallback(body: RequestBody) {
  const a = body.a;
  const b = body.b;

  const ZODIAC_ELEMENTS: Record<string, 'fogo' | 'terra' | 'ar' | 'agua'> = {
    aries: 'fogo', leao: 'fogo', sagitario: 'fogo',
    touro: 'terra', virgem: 'terra', capricornio: 'terra',
    gemeos: 'ar', libra: 'ar', aquario: 'ar',
    cancer: 'agua', escorpiao: 'agua', peixes: 'agua'
  };

  const elemA = ZODIAC_ELEMENTS[(a.sign || '').toLowerCase()] || null;
  const elemB = ZODIAC_ELEMENTS[(b.sign || '').toLowerCase()] || null;

  const pair = elemA && elemB ? `${elemA}/${elemB}` : '';

  const titulo = `A Dança das Almas: ${a.sign} e ${b.sign}`;

  const leitura = `## Arquétipo do Encontro\n\n${a.name} (**${a.sign}**) e ${b.name} (**${b.sign}**) se encontram num eixo de contraste e complemento${pair ? ` (**${pair}**)` : ''}. Um tende a buscar **movimento/curiosidade**, o outro tende a buscar **cuidado/segurança** — e é justamente essa diferença que pode virar *parceria* quando vocês fazem acordos claros.\n\n## O que favorece vocês\n- **Curiosidade + escuta**: quando existe espaço para perguntar (sem ironia) e responder (sem defesa), a relação cresce rápido.\n- **Humor e leveza**: vocês destravam muita coisa quando lembram que estão no mesmo time.\n- **Rotina com respiros**: combinações mistas funcionam melhor com previsibilidade mínima + liberdade combinada.\n\n## O que pode atrapalhar\n- **Ritmos diferentes**: um quer resolver falando agora; o outro precisa sentir/assimilar antes.\n- **Leitura mental**: supor intenção (“você fez de propósito”) cria ruído desnecessário.\n- **Proteção disfarçada**: silêncio, sarcasmo ou controle podem ser só medo — mas o outro lê como rejeição.\n\n## Ponto Cego do Casal\n\nO ponto cego aparece quando um busca segurança no **controle** e o outro busca liberdade no **silêncio**. A tentativa de proteger a relação vira exatamente o que machuca: cobrança de um lado, afastamento do outro.\n\n## Como interromper o ciclo (na prática)\n- Troque **acusação por pedido**: “eu preciso de X” em vez de “você nunca…”.\n- Transforme suposição em pergunta: “o que você quis dizer com isso?”\n- Use a regra **pausa + retorno**: 20 min para esfriar + 1 horário para retomar (no mesmo dia).\n\n## Tradução de linguagem (como cada um ama)\n- **${a.name}** tende a amar por **presença mental**: conversa, atenção, interesse, novidade.\n- **${b.name}** tende a amar por **presença emocional**: cuidado, acolhimento, constância, proteção.\n\n**Código de paz:** ${a.name} sinaliza quando quer falar (sem pressionar). ${b.name} sinaliza quando precisa de tempo (sem sumir).\n\n## Química (com elegância)\n\nA química cresce quando vocês combinam **ritmo + segurança**: iniciativa sem pressão e carinho sem cobrança. O que acende é curiosidade, elogio específico e um convite simples (“vem comigo?”). O que esfria é teste, indireta e disputa de poder.\n\n## Dinheiro & projeto de vida\n- Antes de decidir, alinhem **risco vs. segurança**: o que é “essencial” e o que é “desejo”.\n- Façam 1 acordo: **um responsável** pelo plano e **um responsável** por revisar (sem virar tribunal).\n- Evitem conversas de grana no auge do conflito: primeiro regulem o clima, depois negociem.\n\n## Ritual de 7 dias (10 min/dia)\n1. **Dia 1:** 3 elogios específicos (um para atitude, um para caráter, um para cuidado).\n2. **Dia 2:** 1 pedido claro + 1 gesto (pequeno, mas real).\n3. **Dia 3:** conversa de limites: “o que é inegociável pra mim?”\n4. **Dia 4:** plano de diversão leve (sem DR).\n5. **Dia 5:** alinhar expectativas do mês (agenda + prioridades).\n6. **Dia 6:** reparar algo pequeno (um pedido de desculpa objetivo).\n7. **Dia 7:** visão do próximo mês: “o que a gente quer construir juntos?”\n\n## Conselho do ciclo\n\nO destino não exige perfeição — exige **presença**. Se vocês escolherem clareza em vez de teste, e cuidado em vez de disputa, essa relação vira lugar de crescimento e não de desgaste.`;

  return { titulo, leitura };
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as RequestBody;
    const { a, b, focus } = body;

    if (!a?.name || !a?.birthDate || !a?.sign || !b?.name || !b?.birthDate || !b?.sign) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios: a{name,birthDate,sign}, b{name,birthDate,sign}' }, { status: 400 });
    }

    // Evitar logar PII
    console.log('[couple-engine] Gerando leitura do casal', { focus: focus || 'geral' });

    const prompt = buildPrompt({ a, b, focus });

    let provider = '';
    let aiContent = '';

    const openaiRes = await callOpenAI(prompt);
    if (openaiRes.success && openaiRes.content) {
      provider = 'OpenAI gpt-4o-mini';
      aiContent = openaiRes.content;
    } else {
      const geminiRes = await callGemini(prompt);
      if (geminiRes.success && geminiRes.content) {
        provider = 'Gemini';
        aiContent = geminiRes.content;
      }
    }

    let result = aiContent ? extractJSON(aiContent) : generateLocalFallback({ a, b, focus });

    // Se a IA devolver curto demais, não serve como produto. Garante um mínimo usando fallback local.
    const leituraText = typeof result?.leitura === 'string' ? result.leitura.trim() : '';
    if (leituraText.length < 800) {
      console.log('[couple-engine] Conteúdo curto, usando fallback local', { length: leituraText.length, provider: provider || 'none' });
      result = generateLocalFallback({ a, b, focus });
      provider = provider ? `${provider} (fallback)` : 'Template Local';
    }

    return NextResponse.json({
      success: true,
      provider: provider || 'Template Local',
      titulo: result.titulo || 'Leitura do Casal',
      leitura: (typeof result.leitura === 'string' ? result.leitura : '') || '',
    });
  } catch (e) {
    console.error('[couple-engine] Erro', e);
    return NextResponse.json({ success: false, error: 'Erro desconhecido' }, { status: 500 });
  }
}
