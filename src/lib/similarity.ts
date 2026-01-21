/**
 * Utilitário de similaridade de texto usando coeficiente de Jaccard
 * Leve, sem dependências externas
 */

/**
 * Tokeniza texto em palavras normalizadas
 */
function tokenize(text: string): Set<string> {
    return new Set(
        text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^\w\s]/g, '') // Remove pontuação
            .split(/\s+/)
            .filter(word => word.length > 2) // Ignora palavras muito curtas
    );
}

/**
 * Calcula o coeficiente de Jaccard entre dois textos
 * @returns Valor entre 0 (totalmente diferentes) e 1 (idênticos)
 */
export function calculateSimilarity(text1: string, text2: string): number {
    const set1 = tokenize(text1);
    const set2 = tokenize(text2);

    if (set1.size === 0 || set2.size === 0) return 0;

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
}

/**
 * Verifica se um novo conteúdo é muito similar a conteúdos existentes
 * @param newContent - Texto a ser verificado
 * @param existingContents - Array de textos existentes
 * @param threshold - Limite de similaridade (0-1), padrão 0.65
 * @returns true se for muito similar (deve regenerar)
 */
export function isContentTooSimilar(
    newContent: string,
    existingContents: string[],
    threshold: number = 0.65
): boolean {
    for (const existing of existingContents) {
        const similarity = calculateSimilarity(newContent, existing);
        if (similarity >= threshold) {
            console.log(`[SIMILARITY] Score: ${(similarity * 100).toFixed(1)}% (threshold: ${threshold * 100}%)`);
            return true;
        }
    }
    return false;
}

/**
 * Encontra a maior similaridade entre um texto e uma lista de textos
 */
export function getMaxSimilarity(newContent: string, existingContents: string[]): number {
    if (existingContents.length === 0) return 0;

    return Math.max(
        ...existingContents.map(existing => calculateSimilarity(newContent, existing))
    );
}
