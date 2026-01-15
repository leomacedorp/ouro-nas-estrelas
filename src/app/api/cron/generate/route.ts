import { NextResponse } from 'next/server';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


export const dynamic = 'force-dynamic';

// This would be protected by a secret in production
export async function GET() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const generated = [];

        for (const sign of ZODIAC_SIGNS) {
            // 1. Check if horoscope exists in Supabase
            const { data: existing } = await supabase
                .from('horoscopes')
                .select('id')
                .eq('sign', sign.slug)
                .eq('date', today)
                .eq('type', 'daily')
                .single();

            if (!existing) {
                // 2. Generate content with OpenAI
                let completion;
                try {
                    completion = await openai.chat.completions.create({
                        model: "gpt-4o-mini", // Cost-effective and capable
                        messages: [
                            {
                                role: "system",
                                content: `Você é o Oráculo do Ouro nas Estrelas.
                                Sua missão é gerar horóscopos com tom místico, elegante e empoderador.
                                
                                ESTRUTURA DE RESPOSTA (JSON):
                                {
                                  "content": "Uma frase de impacto, curta e poética (máx 15 palavras).",
                                  "layers": {
                                    "active": "Conselho de ação e energia (foco em Marte/Sol)",
                                    "influence": "Conselho sobre relações e trocas (foco em Vênus/Mercúrio)",
                                    "hidden": "Conselho sobre intuição e o oculto (foco em Lua/Plutão)"
                                  }
                                }`
                            },
                            {
                                role: "user",
                                content: `Gere o horóscopo para o signo de ${sign.name} para o dia ${today}.`
                            }
                        ],
                        response_format: { type: "json_object" }
                    });
                } catch (apiError) {
                    console.error('OpenAI Error:', apiError);
                    continue;
                }

                const rawContent = completion.choices[0].message.content;
                const mockContent = rawContent ? JSON.parse(rawContent) : null;

                if (!mockContent) {
                    console.error('Failed to parse AI response');
                    continue;
                }

                // 3. Save to Supabase
                const { error: insertError } = await supabase
                    .from('horoscopes')
                    .insert({
                        sign: sign.slug,
                        date: today,
                        type: 'daily',
                        content: mockContent.content,
                        layers: mockContent.layers
                    });

                if (insertError) {
                    console.error(`Failed to insert for ${sign.name}:`, insertError);
                    continue;
                }

                generated.push(sign.name);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Generated horoscopes for: ${generated.join(', ') || 'None (all existed)'}`
        });

    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json({ success: false, error: 'Failed to generate' }, { status: 500 });
    }
}
