/**
 * Utilitário de data unificada para timezone Brasil (America/Sao_Paulo)
 * Garante consistência entre servidor, cliente e banco de dados
 */

const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Retorna a data de hoje no formato YYYY-MM-DD no timezone do Brasil
 * Usar para queries no Supabase e geração de conteúdo
 */
export function getTodayBrazil(): string {
    const now = new Date();
    const brazilDate = new Date(now.toLocaleString('en-US', { timeZone: BRAZIL_TIMEZONE }));

    const year = brazilDate.getFullYear();
    const month = String(brazilDate.getMonth() + 1).padStart(2, '0');
    const day = String(brazilDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Formata uma data para exibição em português do Brasil
 * @param date - String no formato YYYY-MM-DD ou objeto Date
 * @param style - 'full' | 'long' | 'medium' | 'short'
 */
export function formatDateBrazil(
    date: string | Date,
    style: 'full' | 'long' | 'medium' | 'short' = 'long'
): string {
    const dateObj = typeof date === 'string' ? new Date(date + 'T12:00:00') : date;

    return dateObj.toLocaleDateString('pt-BR', {
        timeZone: BRAZIL_TIMEZONE,
        dateStyle: style
    });
}

/**
 * Retorna a data de hoje formatada para exibição
 */
export function getTodayBrazilFormatted(style: 'full' | 'long' | 'medium' | 'short' = 'long'): string {
    return formatDateBrazil(getTodayBrazil(), style);
}
