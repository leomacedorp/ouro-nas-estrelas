# Relatório Analítico — Ouro nas Estrelas (Web)

Data: 2026-02-04

Este relatório foi gerado a partir do **código local** em:
`C:\Users\lamacedo\Desktop\Anti Gravity\Ouro nas estrelas\ouro-nas-estrelas-web`

> Nota de segurança: **nenhuma chave/segredo** é incluída aqui. Variáveis sensíveis devem ficar apenas no `.env.local` local e nas configurações da Vercel/Supabase.

---

## 1) Resumo executivo (visão de negócio)

**O que é:** plataforma web de astrologia com conteúdo diário automatizado (camada gratuita) e monetização via leitura premium (camada paga).

**Proposta de valor:**
- **Grátis:** páginas de signos com conteúdo evergreen (guia do signo) + “Mensagem do Dia” (alto SEO / recorrência)
- **Premium:** leitura aprofundada (com opção de personalização) + entrega por link + persistência (Supabase)

**O que já existe (alto nível):**
- Site em Next.js com páginas de signos, landing premium e admin.
- Automação (Vercel Cron) para geração e persistência dos horóscopos.
- Stripe: rota de checkout, validação de session e webhook.
- Captura de leads/newsletter e envio de e-mail via Resend.

**Principais riscos/pendências de produto:**
- Padronizar domínio canônico e redirecionamentos (impacto direto em SEO e links).
- Validar o “ciclo completo” de pagamento (checkout → webhook → persistência → reveal → acesso).
- Revisar segurança de segredos e permissões (evitar vazamento).

---

## 2) Identificação / Git / Repositório

- **Repositório GitHub (origin):** https://github.com/leomacedorp/ouro-nas-estrelas.git
- **Branch de trabalho deste relatório:** `docs/relatorio-analitico`

---

## 3) Stack técnica

**Framework/UI**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion

**Integrações**
- Supabase (DB/Auth)
- Stripe (checkout + webhook)
- Resend (e-mail)
- Providers de IA: OpenAI + Google Generative AI (via camada unificada)

---

## 4) Páginas e rotas (App Router)

Páginas relevantes:
- `/` → `src/app/page.tsx`
- `/signos` e `/signos/[sign]` (+ semana/mês)
- `/leitura-premium` e `/leitura-premium/sucesso`
- `/minha-leitura/[id]` (leitura persistida + token)
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/settings`

SEO:
- `src/app/layout.tsx` define `metadataBase` a partir de `NEXT_PUBLIC_APP_URL`.
- `src/app/sitemap.ts` e `src/app/robots.ts` usam a mesma base.

---

## 5) APIs (Route Handlers)

### 5.1 Stripe

**Checkout** — `POST /api/checkout`
- Cria `checkout.session`.
- Infere `mode` (payment/subscription) a partir do Price quando necessário.
- Redireciona para `/leitura-premium/sucesso?session_id=...`.

**Validação de pagamento** — `POST /api/stripe/validate-session`
- Consulta a session no Stripe e retorna `valid` quando `payment_status === paid`.

**Webhook** — `POST /api/webhooks/stripe`
- Valida assinatura.
- Em `checkout.session.completed`, faz upsert em `stripe_purchases`.
- Pode enviar e-mail com link para a página de sucesso.

### 5.2 Premium

**Reveal/Geração/Entrega** — `POST /api/premium-reading/reveal`
- Verifica pagamento no Stripe.
- Cria/retorna leitura em `premium_readings` (idempotente por session/sign/data).
- Gera `access_token` e pode enviar e-mail com link `/minha-leitura/[id]?t=...`.
- Tenta engine simbólica (`/api/premium-engine`) quando há nome + data de nascimento; cai em template local caso falhe.

### 5.3 Cron e geração automática (Vercel)

**Geração** — `GET /api/cron/generate`
- Proteção: header `x-vercel-cron=1` ou `?secret=` compatível com `CRON_SECRET`.
- Estratégia: processa **1 signo por execução** para reduzir risco de timeout.
- Persiste em `horoscopes` e salva pacote “Energia do Dia” em `site_settings`.

**E-mail semanal** — `GET /api/cron/weekly-email`

---

## 6) Automação (vercel.json)

Há agendamentos para:
- `/api/cron/generate?mode=missing` (janela diária com múltiplas execuções)
- `period=weekly` (domingo)
- `period=monthly` (dia 1)
- `/api/cron/weekly-email` (domingo)

Objetivo: completar a geração sem exceder limites de tempo.

---

## 7) Banco de dados (Supabase) — tabelas observadas

Pelo README/código, o projeto usa (no mínimo):
- `horoscopes`
- `site_settings`
- `admin_access`
- `premium_readings`
- `stripe_purchases`

---

## 8) Observações críticas (SEO/links/domínio)

O projeto usa `NEXT_PUBLIC_APP_URL` como base para URLs absolutas de SEO (canonical/sitemap/robots/metadataBase/JSON-LD).

**Implicação prática:** se o valor em produção estiver apontando para um deploy antigo, o site vai:
- gerar canônicos/OG/JSON-LD apontando para o domínio antigo;
- e ferramentas de varredura de links podem reportar 404 “fantasmas”.

**Recomendação:** padronizar o canônico (ex.: `https://ouronasestrelas.com.br`) e configurar redirect do `www` (ou vice-versa), mantendo um único padrão.

---

## 9) Checklist de validação em produção (curto)

1) **Domínio canônico**
- Vercel env: `NEXT_PUBLIC_APP_URL = https://ouronasestrelas.com.br`
- `www` → redirect 301 para o canônico (ou o inverso, mas escolher 1)

2) **Stripe**
- Checkout abre e conclui compra no modo correto (payment/subscription)
- Webhook recebe `checkout.session.completed`
- Registro em `stripe_purchases`

3) **Premium delivery**
- `/leitura-premium/sucesso` só libera fluxo quando `validate-session` retorna paid
- `premium_readings` é criado e `minha-leitura/[id]?t=...` funciona

4) **Cron**
- Crons do Vercel executando e preenchendo `horoscopes`
- “Energia do dia” em `site_settings.daily_energy_package`

---

## 10) Próximas ações recomendadas (prioridade)

1) **Fechar SEO/domínio** (env + redirect)
2) **Validar o ciclo completo Stripe → webhook → premium**
3) **Higiene de segredos** (rotacionar se necessário; evitar arquivos de chaves soltos)
4) **Observabilidade** (logs/alertas para 500 em checkout/webhook)

---

## Apêndice A — Arquivos principais (mapa)

- `src/app/layout.tsx` (metadataBase)
- `src/app/sitemap.ts`, `src/app/robots.ts`
- `src/app/api/checkout/route.ts`
- `src/app/api/webhooks/stripe/route.ts`
- `src/app/api/stripe/validate-session/route.ts`
- `src/app/api/premium-reading/reveal/route.ts`
- `src/app/api/cron/generate/route.ts`
- `vercel.json` (crons)
