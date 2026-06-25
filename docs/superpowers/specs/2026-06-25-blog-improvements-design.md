# Blog 8-bit-chronicles — Melhorias (Bloco B) · Design

> **Autor:** Luís Gabriel Marchió Batista · **Data:** 2026-06-25
> **Projeto:** `8-bit-chronicles-blog-main` (Next.js 15 App Router + Tailwind v3, estética retrô)
> **Domínio canônico:** `https://8-bit-chronicles-blog.vercel.app`
> **Escopo escolhido:** Bugs & SEO · UX home/post · Experiência de leitura.
> **Fora de escopo (não pedido):** reescrever texto de posts, migrar paper Grafana, criar assets de capa.

## Princípio
Preservar 100% a identidade retrô (Press Start 2P, VT323, roxo no preto, pixels). Toda melhoria
respeita esse visual. Não inventar imagens — capas viram **procedurais por categoria**.

## 1. Bugs & SEO
- **`app/post/[id]/page.tsx`**: remover `next/head` (não funciona no App Router) → `generateMetadata`
  (title, description, canonical, OpenGraph, Twitter). Tornar a página `async` e `await params`
  (Next 15 entrega `params` como Promise). Add `generateStaticParams`.
- **`app/layout.tsx`**: `lang="pt-BR"`; metadata real (`metadataBase`, title template, description PT,
  openGraph); remover `generator: 'v0.dev'` e o `import './globals.css'` duplicado; footer "© 2026"
  com frase corrigida.
- **`app/components/SocialShare.tsx`**: share real (X/Twitter, WhatsApp, LinkedIn share, copiar link)
  usando a URL canônica do post (hoje os props `url`/`title` são ignorados).
- **`next-sitemap.config.js`**: `siteUrl` → domínio canônico.
- **`lib/site.ts`** (novo): `export const SITE_URL`.

## 2. UX home & post
- **`app/data/posts.ts`**: add campo `date: string` ao tipo `Post` + valor em cada post
  (extraído das datas já presentes no conteúdo). Não altera o texto dos posts.
- **`app/components/PostCard.tsx`** (novo): card reutilizável com capa procedural por categoria
  (gradiente + grid de pixels + ícone lucide Games/Tech/DevLog), título, descrição, data, badge,
  hover lift. Usado em `page.tsx` e `category/[slug]/page.tsx`.
- **`app/category/[slug]/page.tsx`**: usar `description` (corrige o `content.slice(0,100)` que quebra
  HTML); `await params`; usar `PostCard`.
- **`app/page.tsx`**: usar `PostCard`.
- **`app/post/[id]/page.tsx`**: link "← Voltar", navegação **anterior/próximo** (`PostNav`),
  data + tempo de leitura no cabeçalho.
- **`app/components/NavMenu.tsx`**: tiles responsivos (encolhem no mobile, sem overflow).

## 3. Experiência de leitura
- **`lib/post-utils.ts`** (novo): `stripHtml`, `readingTime(content)` (~200 ppm), `buildToc(html)`
  → injeta `id` em h2/h3 (respeitando ids existentes) e retorna `{ html, toc }`.
- **`app/components/PostBody.tsx`** (novo, client): renderiza o HTML e aplica **syntax highlight**
  (highlight.js) nos `pre code` via `useEffect`; importa tema escuro.
- **`app/components/TableOfContents.tsx`** (novo): sumário a partir do `toc` com âncoras.
- **`globals.css`**: ajustes do tema do highlight.js pro roxo + estilos do TOC.

## Estrutura de arquivos
- Novos: `lib/site.ts`, `lib/post-utils.ts`, `app/components/PostCard.tsx`,
  `app/components/PostBody.tsx`, `app/components/TableOfContents.tsx`, `app/components/PostNav.tsx`.
- Modificados: `app/layout.tsx`, `app/page.tsx`, `app/post/[id]/page.tsx`,
  `app/category/[slug]/page.tsx`, `app/components/SocialShare.tsx`, `app/components/NavMenu.tsx`,
  `app/data/posts.ts`, `next-sitemap.config.js`, `app/globals.css`.
- Dependência nova: `highlight.js`.

## Erros & estados
- Post inexistente → `notFound()` (mantido).
- Heading sem texto → ignora no TOC. Post sem code block → highlight no-op.
- Capa sempre procedural (nenhuma dependência de arquivo de imagem que possa faltar).

## Verificação
- `tsc --noEmit` limpo (o build do Next ignora erros de TS via `ignoreBuildErrors`, então checar à parte).
- `pnpm build` (ou npm) passa. Smoke test: home, um post DevLog (highlight + TOC), página de categoria.
