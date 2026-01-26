import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTodayBrazil } from '@/lib/dateUtils';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { generateHoroscope } from '@/lib/aiProvider';

export const dynamic = 'force-dynamic';

/**
 * Força geração para um signo específico com focus: geral
 * Deleta registros antigos e cria novo
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const signParam = searchParams.get('sign');

    if (!signParam) {
        return NextResponse.json({
            success: false,
            error: 'Parâmetro sign é obrigatório',
            example: '/api/force-generate?sign=aries'
        }, { status: 400 });
    }

    const today = getTodayBrazil();
    const sign = ZODIAC_SIGNS.find(s => s.slug === signParam);

    if (!sign) {
        return NextResponse.json({
            success: false,
            error: `Signo ${signParam} não encontrado`
        }, { status: 404 });
    }

    try {
        console.log(`[FORCE] Deletando todos os registros de ${sign.name} para ${today}...`);

        // Deleta TODOS os registros desse signo hoje (qualquer focus)
        const { error: deleteError } = await supabase
            .from('horoscopes')
            .delete()
            .eq('sign', sign.slug)
            .eq('date', today);

        if (deleteError) {
            return NextResponse.json({
                success: false,
                error: deleteError.message
            }, { status: 500 });
        }

        console.log(`[FORCE] Gerando novo registro para ${sign.name} com focus: geral...`);

        // Gera novo com focus: geral
        const result = await generateHoroscope({
            sign: sign.slug,
            signName: sign.name,
            dateBr: today,
            mode: 'short'
        });

        if (!result.success || !result.content) {
            return NextResponse.json({
                success: false,
                error: 'Falha ao gerar conteúdo',
                result
            }, { status: 500 });
        }

        const content = typeof result.content === 'string'
            ? result.content
            : JSON.stringify(result.content);

        // Salva no banco
        const { error: dbError } = await supabase
            .from('horoscopes')
            .insert({
                sign: sign.slug,
                date: today,
                focus: 'geral', // IMPORTANTE: sempre geral
                type: 'daily',
                content: content,
                layers: {
                    provider: result.provider,
                    model: result.model,
                    attempts: result.attempts,
                    errors: result.errors,
                    generatedAt: result.meta.generatedAt
                }
            });

        if (dbError) {
            return NextResponse.json({
                success: false,
                error: dbError.message
            }, { status: 500 });
        }

        console.log(`[FORCE] ✅ ${sign.name} gerado com sucesso via ${result.provider}`);

        return NextResponse.json({
            success: true,
            sign: sign.name,
            date: today,
            provider: result.provider,
            model: result.model,
            attempts: result.attempts,
            contentPreview: content.substring(0, 200) + '...',
            contentLength: content.length
        });

    } catch (error) {
        console.error('[FORCE] Erro:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
