# Ouro nas Estrelas (Web)

Plataforma web de astrologia com geração automática diária de horóscopos.

## Stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- IA (camada unificada em `src/lib/aiProvider`)
- Deploy: Vercel

## Rodar local
1) Instale dependências
```bash
npm install
```

2) Crie o arquivo `.env.local` com as variáveis do Supabase e do provider de IA (conforme seu ambiente).

3) Rode
```bash
npm run dev
```
Abra: http://localhost:3000

## Rotas principais
- **Home**: `/`
- **Signos**: `/signos/[sign]`
- **Admin**: `/admin/dashboard`

## Automação (Cron na Vercel)
O arquivo `vercel.json` agenda chamadas para:
- `/api/cron/generate?mode=missing`

### Modo A (confiável)
- **1 signo por execução** (`MAX_SIGNS_PER_BATCH = 1`)
- O cron roda várias vezes (ex.: 03:00–05:30 UTC) até completar os signos faltantes do dia

## Banco de dados (Supabase)
Tabelas usadas (visão geral):
- `horoscopes`
- `site_settings`
- `admin_access`

## Observações
- Arquivo `CHAVES_VERCEL.txt` é segredo e está no `.gitignore`.
