# Checklist de Produção — Ouro nas Estrelas

## 1) Domínio e SEO
- [ ] Definir canônico: `https://ouronasestrelas.com.br` (ou `https://www.ouronasestrelas.com.br`) — escolher 1
- [ ] Configurar redirect 301 do outro (www↔apex) para o canônico
- [ ] Vercel (Production env): `NEXT_PUBLIC_APP_URL` = URL canônica
- [ ] Verificar sitemap: `/sitemap.xml`
- [ ] Verificar robots: `/robots.txt`

## 2) Stripe (pagamento)
- [ ] `POST /api/checkout` abre sessão Stripe
- [ ] `POST /api/stripe/validate-session` retorna `valid=true` após pagamento
- [ ] Webhook: `POST /api/webhooks/stripe` recebe `checkout.session.completed`
- [ ] Tabela `stripe_purchases` recebe upsert por `session_id`

## 3) Premium (entrega)
- [ ] Página `/leitura-premium/sucesso` valida `session_id` antes de liberar
- [ ] `POST /api/premium-reading/reveal` cria registro em `premium_readings`
- [ ] Link `/minha-leitura/[id]?t=token` funciona
- [ ] E-mail (Resend) envia link após compra (se habilitado)

## 4) Cron / Conteúdo diário
- [ ] Crons do Vercel rodando conforme `vercel.json`
- [ ] Tabela `horoscopes` preenchida para daily/weekly/monthly
- [ ] `site_settings.daily_energy_package` preenchido 1x/dia

## 5) Segurança
- [ ] Segredos apenas na Vercel/Supabase e `.env.local` local
- [ ] Rotacionar chaves se tiverem sido expostas
