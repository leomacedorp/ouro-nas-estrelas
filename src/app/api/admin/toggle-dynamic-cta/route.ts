import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Endpoint simples para ligar/desligar o CTA dinâmico SEM precisar deploy.
 *
 * Uso:
 * - /api/admin/toggle-dynamic-cta?enabled=1&secret=CRON_SECRET
 * - /api/admin/toggle-dynamic-cta?enabled=0&secret=CRON_SECRET
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const enabledParam = sp.get('enabled');
  const providedSecret = sp.get('secret');
  const expectedSecret = process.env.CRON_SECRET;

  const hasValidSecret = !!expectedSecret && !!providedSecret && providedSecret === expectedSecret;
  if (!hasValidSecret) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const enabled = enabledParam === '1' || enabledParam === 'true' || enabledParam === 'on';

  const supabase = createAdminClient();

  const { error } = await supabase
    .from('site_settings')
    .upsert({
      key: 'dynamic_cta_enabled',
      value: enabled,
      description: 'Liga/desliga CTA dinâmico nas páginas de signo',
      category: 'toggles'
    }, { onConflict: 'key' });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, dynamic_cta_enabled: enabled });
}
