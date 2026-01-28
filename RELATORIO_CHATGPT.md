# 🚀 Dossiê do Projeto: Ouro nas Estrelas
**Data:** 28/01/2026
**Status:** MVP Validado & Pronto para Monetização

---

## 1. Contexto Geral
O projeto é um **SaaS de Astrologia** ("Orientador Emocional") focado em entregar leituras diárias com tom psicológico e místico, fugindo das previsões genéricas de jornal.

### Arquitetura Atual (O "Pulo do Gato")
Adotamos uma **Arquitetura Híbrida** para escalar com custo zero:

1.  **Camada Gratuita (Front):**
    *   **Engine:** Geração 100% Local (Client-side/Server-side sem banco).
    *   **Lógica:** Determinística (`Hash(Data + Signo)`) selecionando templates de um array gigante (`localTemplate.ts`).
    *   **Custo:** Zero. Sem chamadas de API de IA, sem leitura de banco. Rápido e imune a quedas.
    *   **Bypass:** Desconectamos a leitura do Supabase na rota `/signos/[sign]` para evitar problemas de cache/RLS antigos.

2.  **Camada Premium (Back):**
    *   **Engine:** `localPremiumTemplate.ts` (já criado).
    *   **Produto:** Leitura de 6 Dimensões (Amor, Dinheiro, Carreira, Bloqueio, Oportunidade, Conselho).
    *   **Persistência:** Aqui sim usaremos o **Supabase** para salvar a leitura comprada vinculada ao usuário (futuro).
    *   **Pagamento:** Landing Page criada, linkando para WhatsApp (MVP). Próximo passo: Stripe.

---

## 2. O Que Já Fizemos (Checklist Técnico)

### ✅ Frontend & Visual
*   **Next.js 15 (App Router):** Estrutura moderna e performática.
*   **Cosmic Background Global:** Implementado no `layout.tsx` (Canvas/WebGL) para fundo de meteoros persistente entres páginas.
*   **Design System:** Cores `mystic-950` (fundo) e `gold-500` (destaque). Fontes `Cinzel` (títulos) e `Inter` (texto).
*   **Landing Page de Venda:** `/leitura-premium` criada com copy persuasiva, ancoragem de preço e breakdown do produto.

### ✅ Backend & Lógica
*   **Bypass de Banco:** Rota `/signos/[sign]` blindada contra erros de conexão.
*   **Motor de Texto V2:** Criamos 36 variações ricas de texto para todos os 12 signos (Grátis).
*   **Motor Premium:** Criamos templates profundos para as 6 dimensões de todos os 12 signos.

---

## 3. Sugestões de Próximos Passos (Para o ChatGPT)

*Caro ChatGPT, este projeto está no ponto de virada entre "Projeto Legal" e "Negócio Lucrativo". Aqui está onde precisamos da sua ajuda:*

### 🎯 Prioridade 1: Checkout Automatizado (Stripe)
*   Atualmente, os botões de compra levam para o WhatsApp.
*   **Necessidade:** Criar integração com Stripe Checkout ou Link de Pagamento.
*   **Flow:** Usuário Clica -> Paga no Stripe -> Webhook recebe -> Libera acesso à leitura Premium gerada na hora.

### 🎯 Prioridade 2: Área de Entrega (A "Unboxing Experience")
*   Não temos a página onde o usuário VÊ a leitura premium que comprou.
*   **Necessidade:** Criar `/leitura-premium/resultado/[id]`.
*   Esta página deve ser visualmente impactante ("Mágica acontecendo"), mostrar as 6 dimnesões e permitir gerar PDF.

### 🎯 Prioridade 3: Gestão de Usuários (Auth Light)
*   Precisamos decidir: O usuário cria conta antes de pagar ou recebe um "magic link" no email?
*   Sugestão: Magic Link é mais fácil e converte mais.

### 🚫 O que NÃO fazer (Armadilhas Evitadas)
*   Não tentar religar o banco de dados para a versão grátis (custo desnecessário).
*   Não usar IA em tempo real (OpenAI/Gemini) para o fluxo grátis (latência e custo). Manter templates locais ricos.

---

## 4. Prompt de Contexto (Copie e Cole)
*"Estou desenvolvendo o 'Ouro nas Estrelas', um SaaS de astrologia Next.js. Atualmente temos um sistema híbrido: horóscopo grátis gerado localmente (templates estáticos) e uma engine premium pronta (templates de 6 dimensões). A Landing Page de vendas está pronta (/leitura-premium), mas o checkout é manual via WhatsApp. O objetivo agora é automatizar a venda com Stripe e criar a página de entrega da leitura premium."*
