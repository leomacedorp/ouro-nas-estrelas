import { createClient } from '@/lib/supabase/server';

/**
 * Busca configurações do site do banco de dados
 * @param keys - Lista opcional de chaves específicas para buscar
 * @returns Record<string, any> com os valores das configurações
 */
export async function getSettings(keys?: string[]): Promise<Record<string, any>> {
    const supabase = await createClient();

    if (!supabase) {
        console.warn('[getSettings] Supabase not available, returning empty settings');
        return {};
    }

    let query = supabase.from('site_settings').select('key, value');

    if (keys && keys.length > 0) {
        query = query.in('key', keys);
    }

    const { data, error } = await query;

    if (error) {
        console.error('[getSettings] Error fetching settings:', error);
        return {};
    }

    // Converter array para objeto { key: value }
    // JSONB já vem parseado corretamente pelo Supabase
    const settings: Record<string, any> = {};
    data?.forEach(item => {
        settings[item.key] = item.value;
    });

    return settings;
}

/**
 * Busca todas as configurações agrupadas por categoria
 * @returns Array de settings com key, value, description, category
 */
export async function getAllSettings() {
    const supabase = await createClient();

    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from('site_settings')
        .select('key, value, description, category')
        .order('category')
        .order('key');

    if (error) {
        console.error('[getAllSettings] Error:', error);
        return [];
    }

    return data || [];
}
