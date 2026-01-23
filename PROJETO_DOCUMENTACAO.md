# Documentação do Projeto: Ouro nas Estrelas

## Visão Geral
Plataforma web de astrologia premium focada em autoconhecimento e orientação diária.

---

## 🔧 Infraestrutura Configurada

| Serviço | Status | Detalhes |
|---------|--------|----------|
| **GitHub** | ✅ Ativo | Repo: `leomacedorp/ouro-nas-estrelas` |
| **Vercel** | ✅ Ativo | URL: `https://ouro-nas-estrelas-6sig.vercel.app` |
| **Supabase** | ✅ Ativo | Banco de dados PostgreSQL + Auth |
| **OpenAI** | ✅ Configurado | Chave API no `.env.local` (gpt-4o-mini) |

---

## 📁 Stack Tecnológica

- **Framework**: Next.js 15.1 (App Router) + React 19 + TypeScript
- **Estilização**: Tailwind CSS v4 + Framer Motion 12
- **Smooth Scroll**: Lenis
- **Ícones**: Lucide React
- **Banco de Dados**: Supabase (PostgreSQL)
  - Tabela `horoscopes`: Previsões astrológicas por signo/data/foco
  - Tabela `site_settings`: Configurações globais do site
  - Tabela `admin_access`: Controle de acesso ao painel admin

---

## ✅ Funcionalidades Implementadas

### Público
1. **Home Page** - Efeito cósmico (estrelas/meteoros) com frase de destaque editável
2. **Página de Signos** (`/signos/[sign]`) - Leitura completa em 6 seções:
   - Abertura, Energia Atual, Bloqueio, Oportunidade, Orientação, Encerramento
3. **Navegação** - Horóscopo, Consulta Simbólica, Clube Ouro, Produtos, Contato

### Admin Panel (`/admin/dashboard`)
1. **Login seguro** via Supabase Auth
2. **Toggles CMS** - Ligar/desligar seções do site (Produtos, Ritual Diário, Manutenção, Banner)
3. **Editor de Texto** - Campo para editar a frase da Home ("O universo sussurra...")
4. **Botão "Gerar Previsões de Hoje"** - Força a IA a criar horóscopos manualmente

### Automação
- **Cron Jobs** configurados em `vercel.json`:
  - Executa às 03:00, 03:30, 04:00, 04:30, 05:00, 05:30 UTC
  - Rota: `/api/cron/generate?mode=missing`
- **Batch Size**: 1 signo por execução (evita timeout de 10s da Vercel)

---

## 🔑 Dados Importantes

- **WhatsApp do Admin**: `5516981469121` (configurado em `src/lib/siteConfig.ts`)
- **Frase Padrão da Home**: "O universo sussurra seus segredos a quem sabe ouvir. Alinhe-se com as estrelas e assuma o comando do seu destino."

---

## 🚀 Fluxo de Deploy

1. Fazer alterações no código
2. Executar no terminal:
   ```bash
   git add .
   git commit -m "descrição da mudança"
   git push
   ```
3. A Vercel detecta automaticamente e reconstrói o site (~2-3 minutos)

---

## 🛠️ Últimas Correções (Janeiro 2026)

1. **Hydration Fix** - Corrigido erro de renderização no `CosmicBackground`
2. **ESLint Bypass** - Adicionado `ignoreDuringBuilds: true` no `next.config.ts`
3. **Batch Optimization** - Reduzido `MAX_SIGNS_PER_BATCH` para 1 em `/api/cron/generate`

---

*Última atualização: 23/01/2026*
