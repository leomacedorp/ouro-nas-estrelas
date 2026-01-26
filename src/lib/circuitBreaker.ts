/**
 * Circuit Breaker para gerenciamento de cooldown de APIs
 * Evita chamadas desnecessárias quando provider está em rate limit
 */

interface CooldownInfo {
    provider: string;
    until: number;
    reason: string;
    setAt: number;
}

// Cache em memória (global) - persiste durante o runtime da função serverless
const cooldowns: Map<string, CooldownInfo> = new Map();

// Duração padrão do cooldown: 3 horas
const DEFAULT_COOLDOWN_MS = 3 * 60 * 60 * 1000;

/**
 * Verifica se um provider está em cooldown
 */
export function isInCooldown(provider: string): boolean {
    const info = cooldowns.get(provider);
    if (!info) return false;

    if (Date.now() > info.until) {
        // Cooldown expirou, limpar
        cooldowns.delete(provider);
        console.log(`[CIRCUIT] ✅ Cooldown de ${provider} expirou`);
        return false;
    }

    const remainingMin = Math.ceil((info.until - Date.now()) / 60000);
    console.log(`[CIRCUIT] ⏸️ ${provider} em cooldown por mais ${remainingMin} minutos`);
    return true;
}

/**
 * Define cooldown para um provider
 * @param provider - Nome do provider (openai, gemini)
 * @param durationMs - Duração em ms (default: 3 horas)
 * @param reason - Motivo do cooldown
 */
export function setCooldown(
    provider: string,
    durationMs: number = DEFAULT_COOLDOWN_MS,
    reason: string = 'rate_limit'
): void {
    const until = Date.now() + durationMs;

    cooldowns.set(provider, {
        provider,
        until,
        reason,
        setAt: Date.now()
    });

    const durationMin = Math.ceil(durationMs / 60000);
    console.log(`[CIRCUIT] 🔴 ${provider} em cooldown por ${durationMin} minutos (${reason})`);
}

/**
 * Remove cooldown manualmente (para testes)
 */
export function clearCooldown(provider: string): void {
    cooldowns.delete(provider);
    console.log(`[CIRCUIT] ✅ Cooldown de ${provider} removido manualmente`);
}

/**
 * Retorna informações de todos os cooldowns ativos
 */
export function getCooldownStatus(): Record<string, { active: boolean; remainingMinutes: number; reason: string }> {
    const status: Record<string, { active: boolean; remainingMinutes: number; reason: string }> = {};

    for (const [provider, info] of cooldowns.entries()) {
        const remaining = info.until - Date.now();
        status[provider] = {
            active: remaining > 0,
            remainingMinutes: Math.max(0, Math.ceil(remaining / 60000)),
            reason: info.reason
        };
    }

    return status;
}

/**
 * Parsea o tempo de retry do erro 429 da OpenAI
 * Exemplo: "Please try again in 3h35m34.08s"
 */
export function parseRetryAfter(errorMessage: string): number | null {
    const match = errorMessage.match(/try again in (\d+)h(\d+)m/i);
    if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        return (hours * 60 + minutes) * 60 * 1000;
    }

    // Fallback: procura por segundos
    const secMatch = errorMessage.match(/try again in (\d+)s/i);
    if (secMatch) {
        return parseInt(secMatch[1], 10) * 1000;
    }

    return null;
}

/**
 * Processa erro de rate limit e configura cooldown apropriado
 */
export function handleRateLimitError(provider: string, errorMessage: string): void {
    const retryAfter = parseRetryAfter(errorMessage);
    const duration = retryAfter || DEFAULT_COOLDOWN_MS;

    setCooldown(provider, duration, 'rate_limit_exceeded');
}
