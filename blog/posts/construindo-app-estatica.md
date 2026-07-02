---
title: "Construindo Apps Estáticas em 2023"
date: "2023-10-25"
category: "Tutoriais"
tags: ["js", "github-pages"]
excerpt: "Como criar um everything app sem backend."
---

# Construindo Apps Estáticas em 2023

Aplicações estáticas continuam sendo uma das formas mais eficientes de publicar produtos pequenos, portfólios e hubs pessoais. O segredo é separar conteúdo, interface e dados sem depender de um backend para cada interação.

## Arquitetura

Neste projeto, a estrutura é simples:

- HTML para as páginas principais.
- CSS puro para identidade visual e responsividade.
- JSON para projetos, produtos e metadados de posts.
- Markdown para conteúdo longo do blog.

## Renderização de Markdown

O template `blog/post.html` recebe o `slug` pela URL e carrega o arquivo correspondente em `/blog/posts/`.

```javascript
const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');
const markdown = await fetch(`/blog/posts/${slug}.md`).then((res) => res.text());
```

Essa abordagem mantém o deploy compatível com GitHub Pages e ainda permite editar posts como arquivos de texto versionados.

## Quando migrar

Migre para um backend apenas quando precisar de autenticação, pagamentos reais, banco de dados ou IA com chaves privadas.
