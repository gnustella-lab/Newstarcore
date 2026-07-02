# Newstarcore - Personal Hub

Um site pessoal estático funcionando como um "everything app" para portfólio, blog, loja de recursos e dashboard pessoal.

## Setup Local

Como é 100% estático, você pode simplesmente abrir os arquivos no navegador. Porém, para que as requisições de Markdown e JSON funcionem sem erros de CORS, recomenda-se usar um servidor local:

```bash
# Usando Python 3
python3 -m http.server 8000

# Ou usando Node.js (http-server)
npx http-server
```

Acesse `http://localhost:8000`.

## Stack

- HTML5 semântico
- CSS3 puro com variáveis CSS, Flexbox e Grid
- JavaScript Vanilla ES6+
- JSON para dados de projetos, produtos e posts
- Markdown para blog renderizado via `marked.js`

## Como Adicionar Conteúdo

### Novo Post no Blog

1. Crie um arquivo `meu-post.md` em `/blog/posts/`.
2. Adicione o cabeçalho YAML no início do arquivo:

```md
---
title: "Título do Post"
date: "2023-10-25"
category: "Tutoriais"
tags: ["js", "css"]
excerpt: "Uma breve descrição do post."
---
Conteúdo em Markdown aqui...
```

3. Adicione a rota em `data/posts.json`.

### Novo Projeto ou Produto

Edite os arquivos `data/projects.json` e `data/products.json` adicionando o novo objeto JSON.

## Roadmap de Migração (IA Backend)

Atualmente na Fase 1 (Estático). Para a Fase 2 (IA):

1. Migrar host do GitHub Pages para Vercel ou Netlify.
2. Criar Serverless Functions, por exemplo `/api/chat.js`.
3. Integrar OpenAI API ou Anthropic API.
4. Vetorizar posts do blog usando Pinecone ou Supabase pgvector para RAG.
5. Substituir o placeholder em `/ia-preview` pelo chatbot real.

## Performance e SEO

- Mobile-first e responsivo.
- Fontes do Google Fonts com `display=swap`.
- Sem frameworks JS pesados no client.
- Meta tags básicas por página e título dinâmico no template de post.
