"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleSetting(key: string, currentValue: boolean) {
    const supabase = await createClient();

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

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
}
