import { getSettings } from '@/lib/cms/getSettings';
import HomeClient from './_components/HomeClient';

// Cache de 5 minutos (ISR)
export const revalidate = 300;

export default async function Home() {
  // Buscar settings do banco (server-side)
  const settings = await getSettings([
    'hero_headline',
    'hero_description',
    'hero_cta_text',
    'hero_cta_link',
    'maintenance_mode',
    'maintenance_message',
    'bonus_active',
    'bonus_text',
    'show_scarcity',
    'scarcity_remaining',
    'daily_energy_package'
  ]);

  // Modo manutenção
  if (settings.maintenance_mode === true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mystic-950">
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🔧</div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gold-400 mb-4">
            Site em Manutenção
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            {settings.maintenance_message || 'Estamos fazendo melhorias. Voltamos em breve!'}
          </p>
        </div>
      </div>
    );
  }

  // Renderiza o client component com as settings
  return <HomeClient settings={settings} />;
}
