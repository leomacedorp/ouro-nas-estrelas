import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface SettingUpdate {
    key: string;
    value: any;
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        if (!supabase) {
            return NextResponse.json(
                { error: 'Database not available' },
                { status: 503 }
            );
        }

        // Verificar autenticação
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verificar se é admin
        const { data: access } = await supabase
            .from('admin_access')
            .select('role')
            .eq('email', user.email)
            .single();

        if (!access) {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        // Ler body
        const { settings } = await request.json() as { settings: SettingUpdate[] };

        if (!settings || !Array.isArray(settings)) {
            return NextResponse.json(
                { error: 'Invalid payload - settings array required' },
                { status: 400 }
            );
        }

        // Upsert em batch
        const { error } = await supabase
            .from('site_settings')
            .upsert(
                settings.map(s => ({
                    key: s.key,
                    value: s.value,
                    updated_by: user.email
                })),
                { onConflict: 'key' }
            );

        if (error) {
            console.error('[save-settings] Upsert error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        // Revalidar cache da home e dashboard
        revalidatePath('/');
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/settings');

        return NextResponse.json({
            success: true,
            message: 'Settings saved successfully',
            count: settings.length
        });

    } catch (error: any) {
        console.error('[save-settings] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET para buscar todas as settings (para o admin)
export async function GET() {
    try {
        const supabase = await createClient();

        if (!supabase) {
            return NextResponse.json(
                { error: 'Database not available' },
                { status: 503 }
            );
        }

        // Verificar autenticação
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { data, error } = await supabase
            .from('site_settings')
            .select('key, value, description, category')
            .order('category')
            .order('key');

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ settings: data });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
