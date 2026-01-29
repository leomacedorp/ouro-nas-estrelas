"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleSetting(key: string, currentValue: boolean) {
    const supabase = await createClient();

    if (!supabase) {
        throw new Error("Database connection unavailable");
    }

    // Verifica permissão (Dupla checagem além do middleware)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: access } = await supabase
        .from('admin_access')
        .select('role')
        .eq('email', user.email)
        .single();

    if (!access) throw new Error("Forbidden");

    // Atualiza
    const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value: !currentValue });

    if (error) throw new Error(error.message);

    revalidatePath('/'); // Revalida o cache do site todo
    revalidatePath('/admin/dashboard');
}

export async function updateTextSetting(key: string, value: string) {
    const supabase = await createClient();

    if (!supabase) {
        throw new Error("Database connection unavailable");
    }

    // Verifica permissão
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: access } = await supabase
        .from('admin_access')
        .select('role')
        .eq('email', user.email)
        .single();

    if (!access) throw new Error("Forbidden");

    // IMPORTANTE: Supabase JSONB precisa receber string entre aspas duplas
    const jsonValue = JSON.stringify(value); // Converte "texto" para "\"texto\""

    // Persiste valor como JSONB
    const { error } = await supabase
        .from('site_settings')
        .upsert({
            key,
            value: jsonValue
        }, {
            onConflict: 'key' // Especifica qual coluna é a constraint
        });

    if (error) {
        console.error('[updateTextSetting] Erro:', error);
        throw new Error(error.message);
    }

    revalidatePath('/');
    revalidatePath('/admin/dashboard');

    return { success: true };
}

export async function signOut() {
    const supabase = await createClient();
    if (supabase) {
        await supabase.auth.signOut();
    }
}
