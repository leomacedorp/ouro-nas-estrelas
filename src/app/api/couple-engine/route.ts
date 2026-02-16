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

  const titulo = `Leitura do Casal: ${a.sign} + ${b.sign}`;
  const leitura = `## Essência do Encontro\n\nExiste um encontro aqui que mistura curiosidade e cuidado. Quando vocês respeitam o ritmo um do outro, a relação cresce.\n\n## Ponto Cego do Casal\n\nO ponto cego aparece quando um busca segurança no controle e o outro busca liberdade no silêncio. Isso cria ruído.\n\n## Como interromper o ciclo\n- Transforme suposição em pergunta\n- Faça pedidos claros (não cobranças)\n- Combine 1 regra simples para conflitos (pausa + retorno)\n\n## Ritual de 7 dias (10 min/dia)\n1. Dia 1: 3 elogios específicos\n2. Dia 2: 1 pedido claro + 1 gesto\n3. Dia 3: conversa sobre limites\n4. Dia 4: plano de diversão (leve)\n5. Dia 5: alinhar expectativas\n6. Dia 6: reparar algo pequeno\n7. Dia 7: visão do próximo mês\n\n## Conselho do ciclo\n\nO destino não exige perfeição — exige presença. Voltem ao que é simples e verdadeiro.`;

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
