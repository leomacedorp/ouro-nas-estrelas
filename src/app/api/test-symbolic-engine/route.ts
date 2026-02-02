import { NextResponse } from 'next/server';
import { buildSymbolicMap, getSymbolicMapSummary, getSymbolicMapDescription } from '@/lib/symbolicMap';

export const dynamic = 'force-dynamic';

/**
 * Endpoint de teste da Engine Simbólica
 * 
 * GET /api/test-symbolic-engine?name=Maria&birth=1990-05-15&sign=cancer
 * 
 * Retorna:
 * - Mapa simbólico completo
 * - Resumo textual
 * - Descrição formatada para prompt
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name') || 'Maria da Silva';
        const birth = searchParams.get('birth') || '1990-05-15';
        const sign = searchParams.get('sign') || 'cancer';
        const dateStr = searchParams.get('date'); // opcional

        const referenceDate = dateStr ? new Date(dateStr) : new Date();

        console.log('[test-symbolic-engine] Building map for:', { name, birth, sign });

        // Construir mapa simbólico
        const map = buildSymbolicMap(name, birth, sign, referenceDate);

        // Gerar resumo e descrição
        const summary = getSymbolicMapSummary(map);
        const description = getSymbolicMapDescription(map);

        return NextResponse.json({
            success: true,
            input: { name, birthDate: birth, sign, referenceDate: referenceDate.toISOString() },

            // Resumo rápido
            summary,

            // Mapa completo
            symbolicMap: {
                identity: map.identity,
                numerology: {
                    destiny: map.numerology.destiny,
                    soul: map.numerology.soul,
                    personalYear: map.numerology.personalYear,
                    lifeCycle: map.numerology.lifeCycle
                },
                astronomy: map.astronomy,
                archetype: {
                    sign: map.archetype.sign,
                    element: map.archetype.element,
                    coreIdentity: map.archetype.coreIdentity,
                    hiddenDesire: map.archetype.hiddenDesire,
                    deepFear: map.archetype.deepFear,
                    healingKey: map.archetype.healingKey
                }
            },

            // Descrição completa para prompt
            promptDescription: description,

            // Metadados
            generatedAt: map.generatedAt,
            descriptionLength: description.length
        });

    } catch (error) {
        console.error('[test-symbolic-engine] Error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
