# Reorganizar a forma de lidar com posts · Design

> **Autor:** Luís Gabriel Marchió Batista · **Data:** 2026-06-26
> **Projeto:** `8-bit-chronicles-blog-main` (Next.js 15 App Router + Tailwind v3, estética retrô 8-bit)
> **Escopo escolhido:** Organização de dados e estrutura dos posts (mantendo HTML como formato de conteúdo).
> **Fora de escopo:** Markdown/MDX, CMS/admin, flag de draft, reescrever o texto dos posts, criar imagens de capa.

## Princípio

Migração **só de estrutura**, com uma limpeza pontual de linhas redundantes dentro do HTML.
A identidade retrô (Press Start 2P, VT323, roxo no preto, capas procedurais) é 100% preservada.
O conteúdo continua sendo HTML cru renderizado via `PostBody` (`dangerouslySetInnerHTML`).

## Problema atual

- Todos os posts vivem em `app/data/posts.ts` (~440 linhas e crescendo) — um único array onde o
  `content` de cada post é uma string gigante de HTML embutida no `.ts`.
- Datas são strings livres e inconsistentes (`"2026"`, `"27 Mar 2025"`, `"06 Jan 2026"`) → não
  ordenáveis.
- `category` é `string` solta; a lista de categorias está hardcoded em 4 lugares
  (`page.tsx`, `category/[slug]/page.tsx`, `NavMenu.tsx`, `PostCard.tsx`).
- Autor e data aparecem repetidos **dentro** do HTML de vários posts (`📅 Data:`, `✍️ Autor:`, e um
  `<h2>` que repete o título).
- Navegação anterior/próximo (`getAdjacent`) usa a ordem do arquivo, que é semi-aleatória.

## 1. Arquitetura de arquivos

```
app/content/posts/
  microservices-scalability-operational-costs-cloud-native.ts
  clair-obscur-expedition-33-review-sem-spoilers.ts
  devlog01-aloy-introducao-ao-projeto-aloy.ts
  devlog01-pipeline-observability-jan-2026.ts
  devlog02-pipeline-observability-instrumentation.ts
  devlog03-pipeline-resilience-patterns.ts
  devlog04-pipeline-testing-validation.ts
  index.ts          → importa todos os posts e exporta um array (sem ordenação aqui)
lib/posts.ts        → tipo Post + camada de queries (única porta de entrada das páginas)
lib/categories.ts   → fonte única de verdade das categorias (label + slug)
```

- Cada `<id>.ts` exporta `export const post: Post = { ... }` tipado.
- **Adicionar um post = criar 1 arquivo novo** em `app/content/posts/` e adicioná-lo ao `index.ts`
  (uma linha de import + entrada no array). O `index.ts` é o único ponto que lista os arquivos.
- `app/data/posts.ts` **deixa de existir**. Todos os imports atuais (`@/app/data/posts`,
  `./data/posts`, `../../data/posts`) são reapontados para `@/lib/posts`.

## 2. Modelo de dados (`lib/posts.ts`)

```ts
export type Category = "Games" | "Tech" | "DevLog"

export type Post = {
  id: string
  title: string
  category: Category        // tipada — erro de compilação se digitar errado
  description: string
  author: string            // novo, estruturado
  date: string              // ISO "YYYY-MM-DD", ordenável
  tags: string[]            // novo
  coverImage?: string       // opcional; capas são procedurais hoje, fica para OG futuro
  content: string           // HTML cru
}
```

## 3. Camada de queries (`lib/posts.ts`)

Toda página importa daqui, nunca do array cru:

- `getAllPosts(): Post[]` — ordenados por `date` desc (mais novo primeiro).
- `getPostById(id: string): Post | undefined`
- `getPostsByCategory(category: Category): Post[]` — já ordenados por data desc.
- `getAdjacentPosts(id: string): { prev?: Post; next?: Post }` — vizinhos **cronológicos** dentro do
  array global ordenado por data.
- `formatDate(iso: string): string` — exibição pt-BR (ex.: `27 de mar de 2025`) via `date-fns` +
  locale `ptBR` (dependência já presente no projeto).

A ordenação por data vive nesta camada (não no `index.ts`), para haver um único ponto de verdade da
ordem.

## 4. Categorias (`lib/categories.ts`)

```ts
import type { Category } from "@/lib/posts"

export const CATEGORIES: { label: Category; slug: string }[] = [
  { label: "Games", slug: "games" },
  { label: "Tech", slug: "tech" },
  { label: "DevLog", slug: "devlog" },
]
```

- `app/page.tsx`, `app/category/[slug]/page.tsx` e `NavMenu.tsx` passam a iterar/derivar a partir
  de `CATEGORIES` em vez de listas hardcoded.
- O mapa **visual** de ícone + gradiente por categoria (lucide `Gamepad2/Monitor/Terminal`) continua
  onde já está (`PostCard.tsx` / `NavMenu.tsx`), pois é responsabilidade de UI. Apenas a *lista* de
  categorias passa a ter origem única.

## 5. Migração de conteúdo (a parte que toca o HTML)

Para cada post: extrair data/autor para os campos novos e **remover do HTML** apenas as linhas
redundantes — `📅 Data: ...`, `✍️ Autor: ...`, o `<h2>`/`<h1>` que repete o `title`, e o `<hr>`
órfão que sobra logo após. **Nenhuma outra alteração no texto.**

Posts afetados pela limpeza (têm o bloco data/autor/título no topo):
`devlog01-aloy`, `devlog01-pipeline`, `devlog02`, `devlog03`, `devlog04`.
Posts sem esse bloco (só normalização de campos, HTML intacto): `microservices`, `clair-obscur`.

Datas normalizadas:

| post | antes | depois (ISO) |
|---|---|---|
| microservices-scalability... | `27 Mar 2025` | `2025-03-27` |
| devlog01-aloy... | `23 Abr 2025` | `2025-04-23` |
| devlog01-pipeline... | `06 Jan 2026` | `2026-01-06` |
| devlog02-pipeline... | `13 Jan 2026` | `2026-01-13` |
| devlog03-pipeline... | `20 Jan 2026` | `2026-01-20` |
| devlog04-pipeline... | `27 Jan 2026` | `2026-01-27` |
| clair-obscur-expedition-33... | `2026` (só ano) | `2026-01-01` (padrão; ajustar se houver data real) |

Autor de todos os posts: `"Luís Gabriel Marchió Batista"`.

Tags propostas (ponto de partida; ajustáveis):

- microservices: `["microsserviços", "cloud-native", "escalabilidade", "kubernetes"]`
- clair-obscur: `["rpg", "review", "jrpg", "games"]`
- devlog01-aloy: `["ia", "assistente", "electron", "microservices", "open-source"]`
- devlog01-pipeline: `["dotnet", "event-driven", "serverless", "observabilidade"]`
- devlog02-pipeline: `["observabilidade", "opentelemetry", "jaeger", "serilog", "prometheus"]`
- devlog03-pipeline: `["resiliência", "polly", "circuit-breaker", "dotnet"]`
- devlog04-pipeline: `["testes", "xunit", "testcontainers", "k6", "chaos-engineering"]`

## 6. Páginas e componentes afetados

- `app/page.tsx` — importa de `@/lib/posts` e `@/lib/categories`; usa `getPostsByCategory`.
- `app/category/[slug]/page.tsx` — `getPostsByCategory`; `generateStaticParams` a partir de
  `CATEGORIES`.
- `app/post/[id]/page.tsx` — `getPostById` + `getAdjacentPosts`; exibe `formatDate(post.date)`,
  `post.author` e badges de `post.tags` no cabeçalho.
- `app/components/PostCard.tsx` — `import type { Post }` de `@/lib/posts`; data via `formatDate`.
- `app/components/PostNav.tsx` — `import type { Post }` de `@/lib/posts`.
- `app/components/NavMenu.tsx` — itera sobre `CATEGORIES`.

**Tags:** armazenadas agora e renderizadas como badges pequenas no cabeçalho do post (barato,
on-theme). **Sem** páginas de tag nem filtro por tag (fora de escopo, fica para depois).

## 7. Erros e estados

- Post inexistente → `notFound()` (mantido).
- Categoria sem posts → `notFound()` (mantido).
- `getAdjacentPosts` no primeiro/último post → `prev`/`next` `undefined` (mantido o comportamento do
  `PostNav`, que já trata ausência).
- Data ISO inválida em `formatDate` → fallback para a string original (não quebra a página).

## 8. Estrutura de arquivos (resumo)

- **Novos:** `app/content/posts/<id>.ts` (7 arquivos), `app/content/posts/index.ts`,
  `lib/posts.ts`, `lib/categories.ts`.
- **Modificados:** `app/page.tsx`, `app/category/[slug]/page.tsx`, `app/post/[id]/page.tsx`,
  `app/components/PostCard.tsx`, `app/components/PostNav.tsx`, `app/components/NavMenu.tsx`.
- **Removido:** `app/data/posts.ts`.
- Sem dependências novas (`date-fns` já está no `package.json`).

## 9. Verificação

- `npx tsc --noEmit` limpo (o build do Next ignora erros de TS via `ignoreBuildErrors`, então checar
  à parte).
- `npm run build` passa.
- Smoke test:
  - Home: posts agrupados por categoria, ordenação por data (mais novo primeiro).
  - Um DevLog: cabeçalho mostra data em pt-BR, autor e tags; **sem** duplicação de data/autor/título
    no corpo; syntax highlight e TOC seguem funcionando.
  - Página de categoria: lista correta.
  - Post: navegação anterior/próximo agora é cronológica.
