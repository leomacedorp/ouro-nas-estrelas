import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogOut, LayoutDashboard, FileText, Settings, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';
import { toggleSetting, signOut, updateTextSetting } from '../actions';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { GenerateButton } from './GenerateButton';

// Componente de Toggle (Client Side Logic wrapper in form)
function SettingToggle({ settingKey, label, value }: { settingKey: string, label: string, value: boolean }) {
    const toggleAction = toggleSetting.bind(null, settingKey, value);

    return (
        <form action={toggleAction} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${value ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-slate-600'}`} />
                <span className="font-medium text-slate-200">{label}</span>
            </div>
            <button type="submit" className={`text-2xl transition-colors ${value ? 'text-emerald-400' : 'text-slate-500'}`}>
                {value ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
        </form>
    );
}

// Componente de Texto (Client Side Logic wrapper in form)
function SettingTextInput({ settingKey, label, defaultValue }: { settingKey: string, label: string, defaultValue: string }) {
    // Componente client-side inline para evitar criar arquivo novo. Em prod idealmente separaria.
    return (
        <form
            action={async (formData) => {
                "use server";
                const val = formData.get('value') as string;
                await updateTextSetting(settingKey, val);
            }}
            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors space-y-3"
        >
            <label className="block font-medium text-slate-200">{label}</label>
            <div className="flex gap-2">
                <input
                    name="value"
                    defaultValue={defaultValue}
                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/50"
                />
                <button type="submit" className="px-4 py-2 bg-gold-600 hover:bg-gold-500 text-black text-sm font-bold rounded-lg transition-colors">
                    Salvar
                </button>
            </div>
        </form>
    );
}

export default async function DashboardPage() {
    const supabase = await createClient();

    if (!supabase) {
        redirect('/admin/login');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/admin/login');

    // Buscar Settings
    const { data: settings } = await supabase.from('site_settings').select('*');

    // Helper para ler settings
    const getSetting = (key: string) => {
        const s = settings?.find(s => s.key === key);
        return s ? s.value : false;
    };

    // Helper para ler settings de texto
    const getTextSetting = (key: string) => {
        const s = settings?.find(s => s.key === key);
        return typeof s?.value === 'string' ? s.value : null;
    };

    return (
        <div className="min-h-screen bg-mystic-950 text-slate-200">

            {/* Top Bar */}
            <header className="border-b border-white/10 bg-mystic-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-gold-400" />
                        <span className="font-serif font-bold text-white">Ouro Admin</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 ml-2">
                            v1.0
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400 hidden md:block">{user.email}</span>
                        <form action={signOut}>
                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">

                <div className="grid md:grid-cols-3 gap-8">

                    {/* Coluna 1: Visão Geral e Ações Rápidas */}
                    <div className="space-y-6">
                        <section className="bg-mystic-900/40 border border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-400" /> Conteúdo
                            </h2>
                            <div className="space-y-4">
                                <Link href="/admin/editor" className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 border border-transparent transition-all group">
                                    <span className="text-slate-300 group-hover:text-indigo-300">Editor de Horóscopo</span>
                                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                                </Link>

                                {/* Botão de Geração Manual */}
                                <GenerateButton />

                                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 mt-4">
                                    <p className="text-xs text-amber-400/80">
                                        Dica: O sistema atualiza automaticamente às 04:00 AM. Use o botão acima apenas se precisar forçar uma atualização agora.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Configurações de Texto / Conteúdo */}
                        <section className="bg-mystic-900/40 border border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-serif font-bold text-white mb-6 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gold-400" /> Mensagens e Textos
                            </h2>
                            <div className="space-y-4">
                                <SettingTextInput
                                    settingKey="home_hero_quote"
                                    label="Frase de Destaque (Home)"
                                    defaultValue={getTextSetting('home_hero_quote') || "O universo sussurra seus segredos a quem sabe ouvir. Alinhe-se com as estrelas e assuma o comando do seu destino."}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Coluna 2: CMS / Configurações Globais */}
                    <div className="md:col-span-2 space-y-6">
                        <section className="bg-mystic-900/40 border border-white/5 rounded-2xl p-6">
                            <h2 className="text-lg font-serif font-bold text-white mb-6 flex items-center gap-2">
                                <Settings className="w-4 h-4 text-emerald-400" /> Controle do Site (CMS)
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <SettingToggle
                                    settingKey="show_products_tab"
                                    label="Menu: Produtos"
                                    value={getSetting('show_products_tab')}
                                />
                                <SettingToggle
                                    settingKey="show_daily_ritual"
                                    label="Home: Ritual Diário"
                                    value={getSetting('show_daily_ritual')}
                                />
                                <SettingToggle
                                    settingKey="maintenance_mode"
                                    label="⚠️ Modo Manutenção"
                                    value={getSetting('maintenance_mode')}
                                />
                                <SettingToggle
                                    settingKey="show_promo_banner"
                                    label="Banner Promocional"
                                    value={getSetting('show_promo_banner')}
                                />
                            </div>
                        </section>

                        <section className="bg-mystic-900/40 border border-white/5 rounded-2xl p-6 opacity-50 pointer-events-none">
                            <h2 className="text-lg font-serif font-bold text-white mb-2">Estatísticas de Acesso</h2>
                            <p className="text-sm text-slate-500">Em desenvolvimento...</p>
                        </section>
                    </div>

                </div>

            </main>
        </div>
    );
}
