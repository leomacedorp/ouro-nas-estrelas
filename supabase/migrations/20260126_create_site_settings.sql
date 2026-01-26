-- Migration: Criar tabela site_settings para CMS
-- Data: 2026-01-26

-- Criar tabela se não existir
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL, -- Suporta boolean, string, object
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice para busca rápida por key
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Inserir configurações padrão (se não existirem)
INSERT INTO site_settings (key, value)
VALUES 
    ('show_products_menu', 'false'::jsonb),
    ('maintenance_mode', 'false'::jsonb),
    ('show_ritual_diario', 'true'::jsonb),
    ('show_banner_promocional', 'false'::jsonb),
    ('frase_destaque_home', '"O universo sussurra seus segredos a quem sabe ouvir"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Função para auto-update do updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "Allow public read access"
ON site_settings FOR SELECT
USING (true);

-- Apenas admin pode modificar
CREATE POLICY "Allow admin write access"
ON site_settings FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM admin_access
        WHERE email = auth.jwt() ->> 'email'
    )
);
