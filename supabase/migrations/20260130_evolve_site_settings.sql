-- ====================================
-- Migration: Evolve site_settings for CMS Phase 1
-- Date: 2026-01-30
-- ====================================

-- 1) Adicionar colunas novas (IF NOT EXISTS)
ALTER TABLE public.site_settings 
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS updated_by text;

-- 2) Garantir unique index em key (idempotente)
CREATE UNIQUE INDEX IF NOT EXISTS site_settings_key_unique 
  ON public.site_settings(key);

-- 3) Seed dos settings faltantes (hero/pricing/bonus/urgency/contact/system)
-- Usa ON CONFLICT DO NOTHING para não sobrescrever existentes
INSERT INTO public.site_settings (key, value, description, category) VALUES
  -- Hero (textos neutros, admin pode alterar depois)
  ('hero_headline', to_jsonb('Descubra o Ouro nas Estrelas'::text), 'Título principal do hero', 'hero'),
  ('hero_description', to_jsonb('Encontre o ouro escondido no seu dia a dia. Um guia prático para enxergar oportunidades.'::text), 'Descrição do hero', 'hero'),
  ('hero_cta_text', to_jsonb('Ver Meu Signo'::text), 'Texto do botão CTA principal', 'hero'),
  ('hero_cta_link', to_jsonb('#signos'::text), 'Link do botão CTA', 'hero'),
  
  -- Pricing
  ('price_current', to_jsonb(27), 'Preço atual em reais', 'pricing'),
  ('price_old', to_jsonb(47), 'Preço antigo (riscado)', 'pricing'),
  
  -- Bonus
  ('bonus_active', to_jsonb(false), 'Mostrar seção de bônus?', 'bonus'),
  ('bonus_text', to_jsonb('Ritual de Proteção Lunar'::text), 'Texto do bônus', 'bonus'),
  
  -- Urgency
  ('show_scarcity', to_jsonb(false), 'Mostrar "X vagas restantes"?', 'urgency'),
  ('scarcity_remaining', to_jsonb(5), 'Quantidade de vagas restantes', 'urgency'),
  
  -- Contact (pode já existir via siteConfig)
  ('whatsapp_number', to_jsonb('5516981469121'::text), 'Número do WhatsApp', 'contact'),
  ('whatsapp_message', to_jsonb('Olá! Gostaria de saber mais sobre o Ouro Nas Estrelas.'::text), 'Mensagem padrão WhatsApp', 'contact'),
  
  -- System
  ('maintenance_message', to_jsonb('Site em manutenção. Voltamos em breve!'::text), 'Mensagem do modo manutenção', 'system')
ON CONFLICT (key) DO NOTHING;

-- 4) Atualizar categoria dos settings existentes (se ainda não tiver)
UPDATE public.site_settings 
SET category = 'toggles' 
WHERE key IN ('show_products_tab', 'show_daily_ritual', 'show_promo_banner', 'maintenance_mode')
  AND (category IS NULL OR category = 'general');

UPDATE public.site_settings 
SET category = 'content' 
WHERE key IN ('home_hero_quote', 'frase_destaque_home')
  AND (category IS NULL OR category = 'general');

-- 5) RLS Policies (idempotente usando DO block)
DO $$ 
BEGIN
  -- Garantir RLS está ativado
  ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
  
  -- Policy: SELECT público
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_settings' 
    AND policyname = 'site_settings_select_public'
  ) THEN
    CREATE POLICY site_settings_select_public
      ON public.site_settings
      FOR SELECT
      USING (true);
  END IF;
  
  -- Policy: UPDATE apenas autenticado
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_settings' 
    AND policyname = 'site_settings_update_authenticated'
  ) THEN
    CREATE POLICY site_settings_update_authenticated
      ON public.site_settings
      FOR UPDATE
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
  
  -- Policy: INSERT apenas autenticado (para upsert funcionar)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_settings' 
    AND policyname = 'site_settings_insert_authenticated'
  ) THEN
    CREATE POLICY site_settings_insert_authenticated
      ON public.site_settings
      FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
  
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Policies already exist, skipping...';
END $$;
