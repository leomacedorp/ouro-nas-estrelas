'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Settings, Check } from 'lucide-react';

interface Setting {
    key: string;
    value: any;
    description: string | null;
    category: string | null;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Carregar settings do servidor
    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const res = await fetch('/api/admin/save-settings');
            if (!res.ok) throw new Error('Falha ao carregar configurações');
            const data = await res.json();
            setSettings(data.settings || []);
        } catch (error) {
            console.error('Erro ao carregar:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar configurações' });
        } finally {
            setLoading(false);
        }
    }

    // Atualizar valor local
    function updateValue(key: string, newValue: any) {
        setSettings(prev =>
            prev.map(s => (s.key === key ? { ...s, value: newValue } : s))
        );
    }

    // Salvar todas as configurações
    async function handleSave() {
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/save-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    settings: settings.map(s => ({
                        key: s.key,
                        value: s.value
                    }))
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao salvar');
            }

            setMessage({ type: 'success', text: '✅ Configurações salvas com sucesso!' });

        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            setMessage({ type: 'error', text: error.message || 'Erro ao salvar configurações' });
        } finally {
            setSaving(false);
        }
    }

    // Agrupar por categoria
    const grouped = settings.reduce((acc, setting) => {
        const cat = setting.category || 'general';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(setting);
        return acc;
    }, {} as Record<string, Setting[]>);

    // Labels amigáveis para categorias
    const categoryLabels: Record<string, string> = {
        hero: '🏠 Hero (Seção Principal)',
        pricing: '💰 Preços',
        bonus: '🎁 Bônus',
        urgency: '⏰ Urgência/Escassez',
        contact: '📱 Contato',
        system: '⚙️ Sistema',
        toggles: '🔘 Toggles (Ligar/Desligar)',
        content: '📝 Conteúdo',
        general: '📋 Geral'
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gold-400" />
                            <span className="font-serif font-bold text-slate-900">Configurações do Site</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saving ? 'Salvando...' : 'Salvar Tudo'}
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Mensagem de feedback */}
                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                        : 'bg-red-50 border border-red-200 text-red-900'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Info */}
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-sm mb-8">
                    💡 As alterações são aplicadas na home em até 5 minutos (cache ISR).
                </div>

                {/* Settings por categoria */}
                <div className="space-y-8">
                    {Object.entries(grouped).map(([category, categorySettings]) => (
                        <section
                            key={category}
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-6"
                        >
                            <h2 className="text-xl font-serif font-bold text-gold-400 mb-6">
                                {categoryLabels[category] || category}
                            </h2>

                            <div className="space-y-4">
                                {categorySettings.map(setting => (
                                    <div key={setting.key} className="p-4 bg-white border border-slate-200 rounded-xl">
                                        <label className="block text-sm text-slate-700 mb-2">
                                            {setting.description || setting.key}
                                            <span className="text-xs text-slate-600 ml-2">({setting.key})</span>
                                        </label>

                                        {/* Boolean → Checkbox */}
                                        {typeof setting.value === 'boolean' && (
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={setting.value}
                                                    onChange={(e) => updateValue(setting.key, e.target.checked)}
                                                    className="w-5 h-5 rounded bg-white border-slate-300 text-gold-600 focus:ring-gold-500"
                                                />
                                                <span className={`text-sm font-medium ${setting.value ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                    {setting.value ? '✓ Ativo' : '✗ Inativo'}
                                                </span>
                                            </label>
                                        )}

                                        {/* Number → Input number */}
                                        {typeof setting.value === 'number' && (
                                            <input
                                                type="number"
                                                value={setting.value}
                                                onChange={(e) => updateValue(setting.key, Number(e.target.value))}
                                                className="w-full max-w-xs px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-gold-500/70 focus:outline-none"
                                            />
                                        )}

                                        {/* String curta → Input text */}
                                        {typeof setting.value === 'string' && setting.value.length < 100 && (
                                            <input
                                                type="text"
                                                value={setting.value}
                                                onChange={(e) => updateValue(setting.key, e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-gold-500/70 focus:outline-none"
                                            />
                                        )}

                                        {/* String longa → Textarea */}
                                        {typeof setting.value === 'string' && setting.value.length >= 100 && (
                                            <textarea
                                                value={setting.value}
                                                onChange={(e) => updateValue(setting.key, e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-gold-500/70 focus:outline-none resize-y"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Botão salvar no final também */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Check className="w-5 h-5" />
                        )}
                        {saving ? 'Salvando...' : 'Salvar Todas as Configurações'}
                    </button>
                </div>
            </main>
        </div>
    );
}
