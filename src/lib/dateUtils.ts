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

// ==================== PERÍODOS (SEMANA / MÊS) ====================
// Tudo determinístico com base em YYYY-MM-DD.
// Observação: usamos T12:00:00Z para evitar drift de timezone na conversão.

function toDateUTC(dateBr: string): Date {
    return new Date(`${dateBr}T12:00:00.000Z`);
}

function toDateBrStringUTC(d: Date): string {
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export function getWeekStartBrazil(dateBr: string): string {
    const d = toDateUTC(dateBr);
    const dow = d.getUTCDay(); // 0 dom ... 6 sáb
    // Semana começando na segunda-feira
    const diff = (dow + 6) % 7; // seg=0, ter=1... dom=6
    d.setUTCDate(d.getUTCDate() - diff);
    return toDateBrStringUTC(d);
}

export function getWeekEndBrazil(dateBr: string): string {
    const start = toDateUTC(getWeekStartBrazil(dateBr));
    start.setUTCDate(start.getUTCDate() + 6);
    return toDateBrStringUTC(start);
}

export function getMonthStartBrazil(dateBr: string): string {
    return `${dateBr.slice(0, 7)}-01`;
}

export function getMonthEndBrazil(dateBr: string): string {
    const d = toDateUTC(getMonthStartBrazil(dateBr));
    d.setUTCMonth(d.getUTCMonth() + 1);
    d.setUTCDate(0); // último dia do mês anterior
    return toDateBrStringUTC(d);
}

