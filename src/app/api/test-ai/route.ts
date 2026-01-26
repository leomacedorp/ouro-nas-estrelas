import { NextResponse, NextRequest } from 'next/server';
import { generateHoroscope, getProviderStatus } from '@/lib/aiProvider';
import { clearCooldown, setCooldown, getCooldownStatus } from '@/lib/circuitBreaker';

export const dynamic = 'force-dynamic';

/**
 * Rota de teste para validar sistema de fallback
 * 
 * Modos:
 * - /api/test-ai?mode=status → Status dos providers
 * - /api/test-ai?mode=generate&sign=aries → Testa geração para um signo
 * - /api/test-ai?mode=simulate-429 → Simula cooldown do OpenAI
 * - /api/test-ai?mode=clear-cooldown → Limpa todos os cooldowns
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('mode') || 'status';
    const sign = searchParams.get('sign') || 'aries';

    try {
        switch (mode) {
            case 'status':
                return NextResponse.json({
                    message: 'Status dos providers de IA',
                    providers: getProviderStatus(),
                    cooldowns: getCooldownStatus(),
                    timestamp: new Date().toISOString()
                });

            case 'generate':
                console.log(`[TEST] Testando geração para ${sign}...`);

                const signNames: Record<string, string> = {
                    aries: 'Áries', touro: 'Touro', gemeos: 'Gêmeos',
                    cancer: 'Câncer', leao: 'Leão', virgem: 'Virgem',
                    libra: 'Libra', escorpiao: 'Escorpião', sagitario: 'Sagitário',
                    capricornio: 'Capricórnio', aquario: 'Aquário', peixes: 'Peixes'
                };

                const result = await generateHoroscope({
                    sign,
                    signName: signNames[sign] || sign,
                    dateBr: new Date().toISOString().split('T')[0],
                    mode: 'short'
                });

                return NextResponse.json({
                    message: `Teste de geração para ${sign}`,
                    result,
                    providers: getProviderStatus()
                });

            case 'simulate-429':
                // Simula rate limit do OpenAI por 5 minutos (para teste)
                setCooldown('openai', 5 * 60 * 1000, 'simulated_test');

                return NextResponse.json({
                    message: 'Cooldown do OpenAI simulado por 5 minutos',
                    cooldowns: getCooldownStatus(),
                    nextStep: 'Agora teste /api/test-ai?mode=generate&sign=aries - deve usar Gemini ou Template'
                });

            case 'clear-cooldown':
                clearCooldown('openai');
                clearCooldown('gemini');

                return NextResponse.json({
                    message: 'Todos os cooldowns foram limpos',
                    cooldowns: getCooldownStatus()
                });

            case 'force-template':
                // Força ambos em cooldown para testar template
                setCooldown('openai', 5 * 60 * 1000, 'forced_test');
                setCooldown('gemini', 5 * 60 * 1000, 'forced_test');

                const templateResult = await generateHoroscope({
                    sign,
                    signName: 'Teste',
                    dateBr: new Date().toISOString().split('T')[0],
                    mode: 'short'
                });

                // Limpa cooldowns após teste
                clearCooldown('openai');
                clearCooldown('gemini');

                return NextResponse.json({
                    message: 'Teste de template forçado',
                    result: templateResult,
                    note: 'Cooldowns foram limpos após o teste'
                });

            default:
                return NextResponse.json({
                    message: 'Modo não reconhecido',
                    availableModes: [
                        'status - Ver status dos providers',
                        'generate&sign=aries - Testar geração',
                        'simulate-429 - Simular rate limit',
                        'clear-cooldown - Limpar cooldowns',
                        'force-template - Forçar uso de template'
                    ]
                });
        }

    } catch (error) {
        console.error('[TEST] Erro:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error',
            providers: getProviderStatus()
        }, { status: 500 });
    }
}
