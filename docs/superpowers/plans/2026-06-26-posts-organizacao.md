# Reorganização de Posts — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganizar a forma de lidar com posts: um arquivo por post, datas ISO ordenáveis, `category` tipada, campos `author`/`tags`, e uma camada única de queries — preservando o HTML e a estética retrô.

**Architecture:** Cada post vira `app/content/posts/<id>.ts` (objeto `Post` tipado). Um `index.ts` agrega todos num array. `lib/posts.ts` define os tipos e expõe a camada de queries (ordenação por data, busca, vizinhos cronológicos, formatação pt-BR) — única porta de entrada das páginas. `lib/categories.ts` é a fonte única da lista de categorias. O `app/data/posts.ts` é removido.

**Tech Stack:** Next.js 15 (App Router), TypeScript (strict, `isolatedModules`), Tailwind v3, `date-fns` v3 (+ locale `ptBR`), lucide-react. Sem dependências novas.

## Global Constraints

- **Sem dependências novas.** `date-fns` (^3.6.0) já está no `package.json`; nada além disso.
- **Sem test runner no projeto.** Gate de verificação de cada tarefa: `npx tsc --noEmit` (limpo) + `npm run build` (passa quando indicado) + `grep` + smoke manual. Refactor preserva comportamento; tipos + build cobrem o grosso.
- **Projeto NÃO é repositório git.** Os passos "Commit" são checkpoints. Para commits reais, rode `git init` antes; caso contrário, trate cada "Commit" como ponto de revisão/parada e pule o comando.
- **Next.js 15:** `params` chega como `Promise` — sempre `await params` nas páginas.
- **`isolatedModules: true`:** todo import só-de-tipo usa `import type { ... }`.
- **Path alias:** `@/*` → raiz do projeto.
- **Estética retrô preservada.** Nenhum texto de post reescrito além de remover as linhas redundantes de data/autor/título indicadas.
- **Autor de todos os posts:** `"Luís Gabriel Marchió Batista"`.
- **`prev`/`next` seguem a ordem da lista (newest-first):** `prev` = vizinho mais novo (índice − 1), `next` = vizinho mais antigo (índice + 1).

---

### Task 1: Esqueleto — tipos, camada de queries, categorias e índice vazio

Cria a fundação. O índice começa vazio para tudo compilar antes da migração dos dados.

**Files:**
- Create: `lib/posts.ts`
- Create: `lib/categories.ts`
- Create: `app/content/posts/index.ts`

**Interfaces:**
- Consumes: array `posts: Post[]` de `@/app/content/posts` (criado aqui, vazio por ora).
- Produces:
  - `type Category = "Games" | "Tech" | "DevLog"`
  - `type Post = { id: string; title: string; category: Category; description: string; author: string; date: string; tags: string[]; coverImage?: string; content: string }`
  - `getAllPosts(): Post[]`
  - `getPostById(id: string): Post | undefined`
  - `getPostsByCategory(category: Category): Post[]`
  - `getAdjacentPosts(id: string): { prev?: Post; next?: Post }`
  - `formatDate(iso: string): string`
  - `CATEGORIES: { label: Category; slug: string }[]` (em `lib/categories.ts`)

- [ ] **Step 1: Criar `lib/posts.ts`**

```ts
import { format, isValid, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { posts } from "@/app/content/posts"

export type Category = "Games" | "Tech" | "DevLog"

export type Post = {
  id: string
  title: string
  category: Category
  description: string
  author: string
  date: string // ISO "YYYY-MM-DD"
  tags: string[]
  coverImage?: string
  content: string // HTML cru
}

// Ordenado por data desc (mais novo primeiro). Fonte única da ordem.
const sorted: Post[] = [...posts].sort((a, b) => b.date.localeCompare(a.date))

export function getAllPosts(): Post[] {
  return sorted
}

export function getPostById(id: string): Post | undefined {
  return sorted.find((p) => p.id === id)
}

export function getPostsByCategory(category: Category): Post[] {
  return sorted.filter((p) => p.category === category)
}

export function getAdjacentPosts(id: string): { prev?: Post; next?: Post } {
  const i = sorted.findIndex((p) => p.id === id)
  if (i === -1) return {}
  // prev = vizinho mais novo (acima na lista); next = vizinho mais antigo (abaixo).
  return { prev: sorted[i - 1], next: sorted[i + 1] }
}

export function formatDate(iso: string): string {
  const d = parseISO(iso)
  if (!isValid(d)) return iso // fallback: não quebra a página
  return format(d, "dd 'de' MMM 'de' yyyy", { locale: ptBR })
}
```

- [ ] **Step 2: Criar `lib/categories.ts`**

```ts
import type { Category } from "@/lib/posts"

export const CATEGORIES: { label: Category; slug: string }[] = [
  { label: "Games", slug: "games" },
  { label: "Tech", slug: "tech" },
  { label: "DevLog", slug: "devlog" },
]
```

- [ ] **Step 3: Criar `app/content/posts/index.ts` (vazio por ora)**

```ts
import type { Post } from "@/lib/posts"

export const posts: Post[] = []
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: sem erros. (`@/app/data/posts` ainda existe e é usado pelas páginas; nada quebrou.)

- [ ] **Step 5: Commit (checkpoint)**

```bash
git add lib/posts.ts lib/categories.ts app/content/posts/index.ts
git commit -m "feat(posts): add Post type, query layer and categories source"
```

---

### Task 2: Migrar os 2 posts sem limpeza de HTML (Tech + Games)

`microservices` e `clair-obscur` não têm bloco de data/autor/título no topo → conteúdo copiado **verbatim**.

**Files:**
- Create: `app/content/posts/microservices-scalability-operational-costs-cloud-native.ts`
- Create: `app/content/posts/clair-obscur-expedition-33-review-sem-spoilers.ts`
- Modify: `app/content/posts/index.ts`

**Interfaces:**
- Consumes: `type Post` de `@/lib/posts`.
- Produces: `export const post: Post` em cada arquivo; entradas no array de `index.ts`.

- [ ] **Step 1: Criar `app/content/posts/microservices-scalability-operational-costs-cloud-native.ts`**

Estrutura do arquivo (campos novos preenchidos; o `content` é **copiado verbatim** do valor atual em `app/data/posts.ts` para o id `microservices-scalability-operational-costs-cloud-native`, sem qualquer alteração):

```ts
import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "microservices-scalability-operational-costs-cloud-native",
  title:
    "IMPACTO DOS MICROSSERVIÇOS NA ESCALABILIDADE E NO CUSTO OPERACIONAL EM AMBIENTES CLOUD-NATIVE",
  category: "Tech",
  description:
    "Descubra como microsserviços impactam a escalabilidade e reduzem custos operacionais em ambientes cloud-native. Casos reais, estratégias e soluções para otimização na nuvem.",
  author: "Luís Gabriel Marchió Batista",
  date: "2025-03-27",
  tags: ["microsserviços", "cloud-native", "escalabilidade", "kubernetes"],
  coverImage: "./coverimg-01.jpg",
  content: `<!-- COLAR AQUI, VERBATIM, o valor de content do post "microservices-scalability-operational-costs-cloud-native" de app/data/posts.ts (começa em "<p>Você já ouviu...") -->`,
}
```

- [ ] **Step 2: Criar `app/content/posts/clair-obscur-expedition-33-review-sem-spoilers.ts`**

`content` copiado **verbatim** (inclui o wrapper `<div class="post-content">` — mantido). `date` ajustada de `"2026"` (só ano) para o padrão `2026-01-01`.

```ts
import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "clair-obscur-expedition-33-review-sem-spoilers",
  title: "CLAIR OBSCUR: EXPEDITION 33 - POR QUE JOGAR AGORA (SEM SPOILERS)",
  category: "Games",
  description:
    "RPG por turnos revolucionário que combina combate em tempo real com narrativa existencial. Análise técnica completa, recepção crítica e atualizações recentes de 2026.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-01-01",
  tags: ["rpg", "review", "jrpg", "games"],
  coverImage: "./coverimg-clair-obscur-expedition-33.jpg",
  content: `<!-- COLAR AQUI, VERBATIM, o valor de content do post "clair-obscur-expedition-33-review-sem-spoilers" de app/data/posts.ts (começa em "<div class=\"post-content\">") -->`,
}
```

- [ ] **Step 3: Registrar os dois posts em `app/content/posts/index.ts`**

```ts
import type { Post } from "@/lib/posts"
import { post as microservices } from "./microservices-scalability-operational-costs-cloud-native"
import { post as clairObscur } from "./clair-obscur-expedition-33-review-sem-spoilers"

export const posts: Post[] = [microservices, clairObscur]
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 5: Verificar contagem de posts carregados**

Run: `node -e "console.log(require('fs').readFileSync('app/content/posts/index.ts','utf8').match(/post as /g)?.length ?? 0)"`
Expected: `2`

- [ ] **Step 6: Commit (checkpoint)**

```bash
git add app/content/posts/
git commit -m "feat(posts): migrate Tech and Games posts to per-file format"
```

---

### Task 3: Migrar devlog-aloy e devlog01-pipeline (com limpeza de HTML)

Estes dois iniciam o conteúdo com um bloco redundante: um heading repetindo o título, `📅 Data:`, `✍️ Autor:` e um `<hr>`. Remover **apenas** esse bloco.

**Files:**
- Create: `app/content/posts/devlog01-aloy-introducao-ao-projeto-aloy.ts`
- Create: `app/content/posts/devlog01-pipeline-observability-jan-2026.ts`
- Modify: `app/content/posts/index.ts`

**Interfaces:**
- Consumes: `type Post` de `@/lib/posts`.
- Produces: `export const post: Post` em cada arquivo; entradas no array de `index.ts`.

- [ ] **Step 1: Criar `app/content/posts/devlog01-aloy-introducao-ao-projeto-aloy.ts`**

Copiar o `content` do id correspondente em `app/data/posts.ts` e **remover do começo** exatamente estes 4 elementos (o resto começa em `<p>Fala pessoal, tudo certo?</p>`):
1. `<h2 id="devlog-01-aloy-introdu-o-ao-projeto-aloy">DevLog #01 – Aloy: Introdução ao projeto Aloy</h2>`
2. `<p>📅 Data: 23 de Abril de 2025</p>`
3. `<p>✍️ Autor: Luís Gabriel Marchió Batista</p>`
4. `<hr>`

```ts
import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog01-aloy-introducao-ao-projeto-aloy",
  title: "DevLog #01 – Aloy: Introdução ao projeto Aloy",
  category: "DevLog",
  description:
    "DevLog #01 da Aloy – uma assistente pessoal local, privada e modular. Neste post explico por que decidi criar minha própria IA, o que já está funcionando, e como pretendo abrir o projeto como open source futuramente.",
  author: "Luís Gabriel Marchió Batista",
  date: "2025-04-23",
  tags: ["ia", "assistente", "electron", "microservices", "open-source"],
  coverImage: "./coverimg-01.jpg",
  content: `<!-- COLAR o content de "devlog01-aloy-introducao-ao-projeto-aloy" SEM os 4 elementos iniciais listados acima; deve começar em "<p>Fala pessoal, tudo certo?</p>" -->`,
}
```

- [ ] **Step 2: Criar `app/content/posts/devlog01-pipeline-observability-jan-2026.ts`**

Remover do começo do `content`: `<h2>DevLog #01 – Order Pipeline: Arquitetura Event-Driven Serverless</h2>`, `<p>📅 Data: 06 de Janeiro de 2026</p>`, `<p>✍️ Autor: Luís Gabriel Marchió Batista</p>`, `<hr>`. O conteúdo deve começar em `<h3>Introdução</h3>`.

```ts
import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog01-pipeline-observability-jan-2026",
  title: "DevLog #01 – Order Pipeline: Arquitetura Event-Driven Serverless",
  category: "DevLog",
  description:
    "Iniciando o DEVLOG sobre observabilidade e resiliência em arquiteturas event-driven serverless com C#/.NET. Discutindo a estrutura geral do projeto Order Pipeline.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-01-06",
  tags: ["dotnet", "event-driven", "serverless", "observabilidade"],
  coverImage: "./coverimg-order-pipeline-01.jpg",
  content: `<!-- COLAR o content de "devlog01-pipeline-observability-jan-2026" SEM os 4 elementos iniciais; deve começar em "<h3>Introdução</h3>" -->`,
}
```

- [ ] **Step 3: Registrar no `app/content/posts/index.ts`**

```ts
import type { Post } from "@/lib/posts"
import { post as microservices } from "./microservices-scalability-operational-costs-cloud-native"
import { post as clairObscur } from "./clair-obscur-expedition-33-review-sem-spoilers"
import { post as devlogAloy } from "./devlog01-aloy-introducao-ao-projeto-aloy"
import { post as devlog01Pipeline } from "./devlog01-pipeline-observability-jan-2026"

export const posts: Post[] = [microservices, clairObscur, devlogAloy, devlog01Pipeline]
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 5: Conferir que as linhas redundantes sumiram destes posts**

Run: `grep -l "📅 Data:" app/content/posts/devlog01-aloy-introducao-ao-projeto-aloy.ts app/content/posts/devlog01-pipeline-observability-jan-2026.ts`
Expected: nenhuma saída (nenhum arquivo contém "📅 Data:").

- [ ] **Step 6: Commit (checkpoint)**

```bash
git add app/content/posts/
git commit -m "feat(posts): migrate devlog-aloy and devlog01-pipeline with header cleanup"
```

---

### Task 4: Migrar devlog02, devlog03 e devlog04 (com limpeza de HTML)

Mesmo padrão de limpeza da Task 3 (heading do título + `📅 Data:` + `✍️ Autor:` + `<hr>`), aplicado aos três posts restantes do Order Pipeline.

**Files:**
- Create: `app/content/posts/devlog02-pipeline-observability-instrumentation.ts`
- Create: `app/content/posts/devlog03-pipeline-resilience-patterns.ts`
- Create: `app/content/posts/devlog04-pipeline-testing-validation.ts`
- Modify: `app/content/posts/index.ts`

**Interfaces:**
- Consumes: `type Post` de `@/lib/posts`.
- Produces: `export const post: Post` em cada arquivo; entradas no array de `index.ts` (índice completo com 7 posts ao fim).

- [ ] **Step 1: Criar `app/content/posts/devlog02-pipeline-observability-instrumentation.ts`**

Remover do começo: `<h2>DevLog #02 – Instrumentando Observabilidade: Traces, Logs e Métricas</h2>`, `<p>📅 Data: 13 de Janeiro de 2026</p>`, `<p>✍️ Autor: Luís Gabriel Marchió Batista</p>`, `<hr>`. Começa em `<h3>Os Três Pilares da Observabilidade</h3>`.

```ts
import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog02-pipeline-observability-instrumentation",
  title: "DevLog #02 – Instrumentando Observabilidade: Traces, Logs e Métricas",
  category: "DevLog",
  description:
    "Explorando os três pilares da observabilidade: traces distribuídos, logs estruturados e métricas. Implementação prática com Application Insights e Jaeger.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-01-13",
  tags: ["observabilidade", "opentelemetry", "jaeger", "serilog", "prometheus"],
  coverImage: "./coverimg-order-pipeline-02.jpg",
  content: `<!-- COLAR o content de "devlog02-pipeline-observability-instrumentation" SEM os 4 elementos iniciais; começa em "<h3>Os Três Pilares da Observabilidade</h3>" -->`,
}
```

- [ ] **Step 2: Criar `app/content/posts/devlog03-pipeline-resilience-patterns.ts`**

Remover do começo: `<h2>DevLog #03 – Padrões de Resiliência: Retry, Circuit Breaker e Bulkhead</h2>`, `<p>📅 Data: 20 de Janeiro de 2026</p>`, `<p>✍️ Autor: Luís Gabriel Marchió Batista</p>`, `<hr>`. Começa em `<h3>Por que Resiliência é Crítica</h3>`.

```ts
import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog03-pipeline-resilience-patterns",
  title: "DevLog #03 – Padrões de Resiliência: Retry, Circuit Breaker e Bulkhead",
  category: "DevLog",
  description:
    "Implementando padrões avançados de resiliência no Order Pipeline. Exploramos Retry com exponential backoff, Circuit Breaker patterns e Bulkhead isolation.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-01-20",
  tags: ["resiliência", "polly", "circuit-breaker", "dotnet"],
  coverImage: "./coverimg-order-pipeline-03.jpg",
  content: `<!-- COLAR o content de "devlog03-pipeline-resilience-patterns" SEM os 4 elementos iniciais; começa em "<h3>Por que Resiliência é Crítica</h3>" -->`,
}
```

- [ ] **Step 3: Criar `app/content/posts/devlog04-pipeline-testing-validation.ts`**

Remover do começo: `<h2>DevLog #04 – Testing e Validação: Garantindo Confiabilidade</h2>`, `<p>📅 Data: 27 de Janeiro de 2026</p>`, `<p>✍️ Autor: Luís Gabriel Marchió Batista</p>`, `<hr>`. Começa em `<h3>Uma Arquitetura Robusta Precisa de Testes Robustos</h3>`.

```ts
import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog04-pipeline-testing-validation",
  title: "DevLog #04 – Testing e Validação: Garantindo Confiabilidade",
  category: "DevLog",
  description:
    "Finalizando o DEVLOG com estratégias de testes end-to-end, unit tests, integration tests e chaos engineering para garantir a confiabilidade do Order Pipeline.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-01-27",
  tags: ["testes", "xunit", "testcontainers", "k6", "chaos-engineering"],
  coverImage: "./coverimg-order-pipeline-04.jpg",
  content: `<!-- COLAR o content de "devlog04-pipeline-testing-validation" SEM os 4 elementos iniciais; começa em "<h3>Uma Arquitetura Robusta Precisa de Testes Robustos</h3>" -->`,
}
```

- [ ] **Step 4: Completar `app/content/posts/index.ts` (7 posts)**

```ts
import type { Post } from "@/lib/posts"
import { post as microservices } from "./microservices-scalability-operational-costs-cloud-native"
import { post as clairObscur } from "./clair-obscur-expedition-33-review-sem-spoilers"
import { post as devlogAloy } from "./devlog01-aloy-introducao-ao-projeto-aloy"
import { post as devlog01Pipeline } from "./devlog01-pipeline-observability-jan-2026"
import { post as devlog02Pipeline } from "./devlog02-pipeline-observability-instrumentation"
import { post as devlog03Pipeline } from "./devlog03-pipeline-resilience-patterns"
import { post as devlog04Pipeline } from "./devlog04-pipeline-testing-validation"

export const posts: Post[] = [
  microservices,
  clairObscur,
  devlogAloy,
  devlog01Pipeline,
  devlog02Pipeline,
  devlog03Pipeline,
  devlog04Pipeline,
]
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 6: Conferir limpeza e contagem**

Run: `grep -rl "📅 Data:" app/content/posts/ ; echo "---" ; grep -c "post as " app/content/posts/index.ts`
Expected: nenhuma linha antes do `---` (zero ocorrências de "📅 Data:") e `7` depois.

- [ ] **Step 7: Commit (checkpoint)**

```bash
git add app/content/posts/
git commit -m "feat(posts): migrate devlog02-04 with header cleanup; index has all 7 posts"
```

---

### Task 5: Reapontar componentes (PostCard, PostNav, NavMenu)

Trocar a origem do tipo `Post`, formatar a data e derivar categorias da fonte única.

**Files:**
- Modify: `app/components/PostCard.tsx`
- Modify: `app/components/PostNav.tsx`
- Modify: `app/components/NavMenu.tsx`

**Interfaces:**
- Consumes: `type Post`, `formatDate` de `@/lib/posts`; `CATEGORIES` de `@/lib/categories`.

- [ ] **Step 1: `PostCard.tsx` — importar `Post` e `formatDate` de `@/lib/posts` e formatar a data**

Trocar o import do tipo (linha 3):

```tsx
import type { Post } from "@/lib/posts"
import { formatDate } from "@/lib/posts"
import { readingTime } from "@/lib/post-utils"
```

E na linha da data (atual `<Calendar className="w-4 h-4" /> {post.date}`):

```tsx
<Calendar className="w-4 h-4" /> {formatDate(post.date)}
```

- [ ] **Step 2: `PostNav.tsx` — importar `Post` de `@/lib/posts`**

Trocar a linha 3:

```tsx
import type { Post } from "@/lib/posts"
```

(Resto do componente inalterado — já recebe `prev?`/`next?`.)

- [ ] **Step 3: `NavMenu.tsx` — derivar os itens de `CATEGORIES`**

Substituir o conteúdo por:

```tsx
import Link from "next/link"
import { Gamepad2, Monitor, Terminal } from "lucide-react"
import { CATEGORIES } from "@/lib/categories"
import type { Category } from "@/lib/posts"

const ICONS: Record<Category, typeof Monitor> = {
  Games: Gamepad2,
  Tech: Monitor,
  DevLog: Terminal,
}

const NavMenu = () => {
  return (
    <nav className="flex flex-wrap justify-center gap-3 sm:gap-4 my-6">
      {CATEGORIES.map(({ label, slug }) => {
        const Icon = ICONS[label]
        return (
          <Link
            key={slug}
            href={`/category/${slug}`}
            className="flex flex-col items-center justify-center gap-2 p-2 bg-gray-900 rounded pixelated-border hover:bg-gray-800 transition-colors w-24 h-24 sm:w-32 sm:h-32"
          >
            <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="font-pixel text-[10px] sm:text-xs">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default NavMenu
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 5: Commit (checkpoint)**

```bash
git add app/components/PostCard.tsx app/components/PostNav.tsx app/components/NavMenu.tsx
git commit -m "refactor(posts): point components to lib/posts and format dates"
```

---

### Task 6: Reapontar páginas (home, categoria, post)

Páginas passam a usar a camada de queries e a fonte única de categorias; o cabeçalho do post ganha autor e badges de tags.

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/category/[slug]/page.tsx`
- Modify: `app/post/[id]/page.tsx`

**Interfaces:**
- Consumes: `getPostsByCategory`, `getPostById`, `getAdjacentPosts`, `formatDate` de `@/lib/posts`; `CATEGORIES` de `@/lib/categories`.

- [ ] **Step 1: Reescrever `app/page.tsx`**

```tsx
import Link from "next/link"
import { getPostsByCategory } from "@/lib/posts"
import { CATEGORIES } from "@/lib/categories"
import PostCard from "./components/PostCard"

export default function Home() {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-pixel mb-8">Últimas aventuras 8-Bit</h2>
      {CATEGORIES.map(({ label, slug }) => {
        const categoryPosts = getPostsByCategory(label)
        if (categoryPosts.length === 0) return null

        return (
          <section key={slug} className="mb-12">
            <h3 className="text-lg sm:text-xl font-pixel mb-5">{label}</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {categoryPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Link
              href={`/category/${slug}`}
              className="inline-block mt-5 font-pixel text-sm underline text-purple-400 hover:text-purple-300"
            >
              Ver todos os posts
            </Link>
          </section>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Reescrever `app/category/[slug]/page.tsx`**

```tsx
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getPostsByCategory } from "@/lib/posts"
import { CATEGORIES } from "@/lib/categories"
import PostCard from "../../components/PostCard"

export function generateStaticParams() {
  return CATEGORIES.map(({ slug }) => ({ slug }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  const categoryPosts = getPostsByCategory(category.label)

  if (categoryPosts.length === 0) {
    notFound()
  }

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-lg text-purple-400 hover:text-purple-200 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      <h2 className="text-xl sm:text-2xl font-pixel mb-8">Posts · {category.label}</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {categoryPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Reescrever `app/post/[id]/page.tsx`**

Usa `getPostById` + `getAdjacentPosts`, exibe `formatDate(post.date)`, `post.author` e badges de `post.tags`.

```tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import { getPostById, getAdjacentPosts, getAllPosts, formatDate } from "@/lib/posts"
import { SITE_URL, SITE_NAME } from "@/lib/site"
import { buildToc, readingTime } from "@/lib/post-utils"
import PostBody from "@/app/components/PostBody"
import TableOfContents from "@/app/components/TableOfContents"
import PostNav from "@/app/components/PostNav"
import SocialShare from "@/app/components/SocialShare"

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = getPostById(id)
  if (!post) return { title: "Post não encontrado" }

  const url = `${SITE_URL}/post/${post.id}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = getPostById(id)

  if (!post) {
    notFound()
  }

  const { html, toc } = buildToc(post.content)
  const minutes = readingTime(post.content)
  const { prev, next } = getAdjacentPosts(post.id)
  const url = `${SITE_URL}/post/${post.id}`

  return (
    <article>
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-lg text-purple-400 hover:text-purple-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <header className="mt-5 mb-8">
        <h1 className="font-pixel leading-[1.7] text-xl md:text-2xl mb-5">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 font-mono text-lg text-purple-400/80">
          <span className="px-2 py-1 bg-purple-600 text-black rounded">{post.category}</span>
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>•</span>
          <span>por {post.author}</span>
          <span aria-hidden>•</span>
          <span>{minutes} min de leitura</span>
        </div>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-sm px-2 py-0.5 rounded bg-gray-900 text-purple-300/80 pixelated-border"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <TableOfContents toc={toc} />

      <div className="prose prose-invert prose-purple max-w-none">
        <PostBody html={html} />
      </div>

      <SocialShare url={url} title={post.title} />
      <PostNav prev={prev} next={next} />
    </article>
  )
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build passa; rotas estáticas geradas para `/`, `/category/[slug]` (games/tech/devlog) e `/post/[id]` (7 ids).

- [ ] **Step 6: Commit (checkpoint)**

```bash
git add app/page.tsx "app/category/[slug]/page.tsx" "app/post/[id]/page.tsx"
git commit -m "refactor(posts): pages use query layer; post header shows author and tags"
```

---

### Task 7: Remover `app/data/posts.ts` e verificação final

Com todos os consumidores reapontados, o arquivo antigo deixa de ser usado.

**Files:**
- Delete: `app/data/posts.ts`

**Interfaces:** nenhuma nova.

- [ ] **Step 1: Confirmar que ninguém mais importa do caminho antigo**

Run: `grep -rn "data/posts" app components lib`
Expected: nenhuma saída.

- [ ] **Step 2: Remover o arquivo**

```bash
rm app/data/posts.ts
```

(Se a pasta `app/data/` ficar vazia, remover também: `rmdir app/data 2>/dev/null || true`.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 4: Build final**

Run: `npm run build`
Expected: build passa.

- [ ] **Step 5: Smoke test manual**

Run: `npm run dev` e verificar:
- `/` — posts agrupados por categoria; datas em pt-BR (ex.: "27 de mar de 2025"); ordem mais novo→mais antigo dentro de cada categoria.
- `/post/devlog01-pipeline-observability-jan-2026` — cabeçalho mostra data pt-BR, "por Luís Gabriel Marchió Batista" e badges de tags; o corpo **não** repete data/autor/título; syntax highlight (bloco C#) e TOC funcionando.
- `/category/devlog` — lista os 5 DevLogs.
- Navegação anterior/próximo num post — leva a vizinhos por data.

- [ ] **Step 6: Commit (checkpoint)**

```bash
git add -A
git commit -m "refactor(posts): remove legacy app/data/posts.ts"
```

---

## Self-Review

**Spec coverage:**
- §1 Arquitetura de arquivos → Tasks 1–4 (per-file + index) ✓
- §2 Modelo de dados (`Post`/`Category`) → Task 1 ✓
- §3 Camada de queries (`getAllPosts`/`getPostById`/`getPostsByCategory`/`getAdjacentPosts`/`formatDate`) → Task 1 ✓
- §4 Categorias (fonte única) → Task 1 (`lib/categories.ts`) + uso em Tasks 5–6 ✓
- §5 Migração de conteúdo (datas ISO, autor, tags, limpeza de HTML) → Tasks 2–4 ✓ (data Clair Obscur = `2026-01-01`; cleanup nos 5 devlogs)
- §6 Páginas/componentes (formatDate, getAdjacentPosts, getPostsByCategory, CATEGORIES, tags badges) → Tasks 5–6 ✓
- §7 Erros/estados (`notFound`, prev/next undefined, fallback de data) → Tasks 1 e 6 ✓
- §8 Estrutura (novos/modificados/removido) → Tasks 1–7; remoção do `app/data/posts.ts` em Task 7 ✓
- §9 Verificação (tsc + build + smoke) → gates em todas as tasks; smoke em Task 7 ✓

**Placeholder scan:** os `<!-- COLAR ... -->` em Tasks 2–4 são instruções de cópia verbatim de conteúdo HTML grande que já existe em `app/data/posts.ts` (re-inliná-lo aqui duplicaria KBs sem ganho). Cada um especifica o id de origem e, quando há limpeza, os elementos exatos a remover e onde o conteúdo deve começar. Não são TODOs de lógica.

**Type consistency:** `Post`/`Category` definidos em Task 1 e usados consistentemente; `post as <alias>` nos imports do `index.ts` casa com `export const post` de cada arquivo; assinaturas de `getPostsByCategory(category: Category)`, `getAdjacentPosts(id): { prev?, next? }`, `formatDate(iso): string` idênticas entre definição (Task 1) e uso (Tasks 5–6).
