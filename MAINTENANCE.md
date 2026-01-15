# Guia de Manutenção - Ouro Nas Estrelas 🌟

Este documento explica como gerenciar o projeto finalizado.

## 📱 WhatsApp e Contato

O número oficial configurado é: **5516981469121**

Para mudar o número ou as mensagens padrão, edite **apenas**:
`src/lib/siteConfig.ts`

## 📝 Editando Textos

Não é necessário editar código complexo.
- **Menu e Rodapé**: `src/lib/siteConfig.ts`
- **Página Inicial**: `src/lib/content/home.ts`
- **Páginas de Texto**: `src/app/termos/page.tsx`, `src/app/privacidade/page.tsx`

## 🚀 Publicando Alterações

1. Teste no seu computador:
   `npm run dev`

2. Publique na Vercel:
   `npx vercel --prod`

## 💾 Banco de Dados (Supabase/MongoDB)

Atualmente o sistema opera em modo **Resiliente**:
- A Newsletter aceita inscrições e salva no navegador do usuário (LocalStorage) e mostra sucesso.
- O Backend apenas loga o email.
- Para conectar um banco real futuramente, edite `/src/app/api/newsletter/route.ts`.

## ⚠️ Regras de Ouro

1. **Nunca quebre o Build**: Se algo der errado, reverta.
2. **WhatsApp é o Foco**: Mantenha os botões de CTA testados.
3. **Imagens**: Use links externos ou coloque na pasta `public`.

---
*Projeto Finalizado em Jan/2026*
