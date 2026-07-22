# Séries de DevLog + 4 posts novos · Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agrupar os DevLogs em subseções por projeto (+ "Aleatórios") e publicar 4 posts novos — Aloy #10–#12 e BrigidAI #01.

**Architecture:** Um registro de séries (`lib/series.ts`) espelhando o `lib/categories.ts` já existente, um campo opcional `series` no tipo `Post`, e uma query `getSeriesGroups()` em `lib/posts.ts` que é a única dona da ordem dos grupos. As páginas consomem só a query. Os posts continuam sendo um arquivo `.ts` por post com HTML cru.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind v3, date-fns.

**Spec:** [`docs/superpowers/specs/2026-07-16-devlogs-series-e-novos-posts-design.md`](../specs/2026-07-16-devlogs-series-e-novos-posts-design.md)

## Global Constraints

- **Este repo NÃO é um repositório git.** `git rev-parse` falha. **Não há passo de commit** nas Tasks 1–9; a Task 10 (outro repo) é a única que commita. Não rodar `git init` — não foi autorizado.
- **Não há test runner** (sem vitest/jest, zero arquivos de teste). Decisão do autor: seguir a convenção do projeto. A verificação de toda task é `npx tsc --noEmit` + `npm run build` + smoke manual.
- **`npx tsc --noEmit` é obrigatório e não é opcional:** o `next.config.mjs` liga `typescript.ignoreBuildErrors` e `eslint.ignoreDuringBuilds`, então **o build não pega erro de tipo**. Um `npm run build` verde não prova nada sobre tipos.
- **Autor de todos os posts:** `"Luís Gabriel Marchió Batista"` (exato, com acentos).
- **`coverImage`** é preenchido por convenção mas **não é renderizado** (as capas são procedurais por categoria no `PostCard`). Não gastar tempo com imagem.
- **Não escrever `id` nos `<h3>`** dos posts: o `buildToc` deriva os `id` sozinho. Seguir o HTML dos posts existentes como referência de estilo.
- **Nunca reordenar** o array de `posts` no `index.ts` de forma a mudar a ordem relativa dos posts existentes: o sort por data é estável e o `index.ts` resolve empates.

---

### Task 1: Registro de séries + query de agrupamento

**Files:**
- Create: `lib/series.ts`
- Modify: `lib/posts.ts`

**Interfaces:**
- Consumes: `Category`, `Post`, `sorted` (já existem em `lib/posts.ts`).
- Produces: `SeriesSlug` (tipo, de `lib/posts.ts`), `SERIES` e `UNGROUPED_LABEL` (de `lib/series.ts`), `SeriesGroup` e `getSeriesGroups(category: Category): SeriesGroup[]` (de `lib/posts.ts`). A **Task 3** consome `getSeriesGroups`; a **Task 2** consome `SeriesSlug` (via o campo `series` do `Post`). A Task 4 (home) **não** usa `getSeriesGroups` — a home não tem subseções, ela segue com `getPostsByCategory`.

**Cuidado com ciclo de import:** `lib/posts.ts` importa **valores** (`SERIES`, `UNGROUPED_LABEL`) de `lib/series.ts`, e `lib/series.ts` importa `SeriesSlug` de volta com **`import type`** — que o TypeScript apaga na compilação, então não há ciclo em runtime. É o mesmo arranjo que `lib/categories.ts` já usa com `Category`. Não trocar esse `import type` por import de valor.

- [ ] **Step 1: Criar `lib/series.ts`**

```ts
import type { SeriesSlug } from "@/lib/posts"

// A ordem deste array é a ordem de exibição das subseções.
export const SERIES: { label: string; slug: SeriesSlug }[] = [
  { label: "DevLog da Aloy", slug: "aloy" },
  { label: "Order Pipeline", slug: "pipeline" },
  { label: "BrigidAI", slug: "brigid" },
]

export const UNGROUPED_LABEL = "Aleatórios"
```

- [ ] **Step 2: Adicionar o tipo `SeriesSlug` e o campo `series` em `lib/posts.ts`**

Adicionar o import no topo (junto dos outros):

```ts
import { SERIES, UNGROUPED_LABEL } from "@/lib/series"
```

Adicionar o tipo logo acima de `export type Post`:

```ts
export type SeriesSlug = "aloy" | "pipeline" | "brigid"
```

E o campo dentro de `export type Post`, logo depois de `coverImage?: string`:

```ts
  series?: SeriesSlug // ausente = post avulso → "Aleatórios"
```

- [ ] **Step 3: Adicionar `SeriesGroup` + `getSeriesGroups` no fim de `lib/posts.ts`**

Colocar depois de `getPostsByCategory` (mantém as queries juntas, antes de `getAdjacentPosts`):

```ts
export type SeriesGroup = { label: string; slug: SeriesSlug | null; posts: Post[] }

// Grupos na ordem de SERIES; os posts sem série vêm sempre por último, em "Aleatórios".
// Grupos vazios são omitidos. A ordem dentro de cada grupo é a global (data desc).
export function getSeriesGroups(category: Category): SeriesGroup[] {
  const inCategory = getPostsByCategory(category)

  const groups: SeriesGroup[] = SERIES.map(({ label, slug }) => ({
    label,
    slug,
    posts: inCategory.filter((p) => p.series === slug),
  }))

  groups.push({
    label: UNGROUPED_LABEL,
    slug: null,
    posts: inCategory.filter((p) => !p.series),
  })

  return groups.filter((g) => g.posts.length > 0)
}
```

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem saída (limpo). Se acusar ciclo ou `SeriesSlug` não encontrado, revisar o `import type` do Step 1.

---

### Task 2: Atribuir série aos 13 posts de DevLog existentes

**Files:**
- Modify: `app/content/posts/devlog01-aloy-introducao-ao-projeto-aloy.ts`, `devlog02-aloy-kernel-agente-local.ts`, `devlog03-aloy-voz-stt-tts.ts`, `devlog04-aloy-hardware-monitor.ts`, `devlog05-aloy-calendar-discord.ts`, `devlog06-aloy-memoria-longo-prazo.ts`, `devlog07-aloy-proatividade-n8n.ts`, `devlog08-aloy-sessoes-multi-ia.ts`, `devlog09-aloy-rede-vpn-acesso-remoto.ts` (→ `"aloy"`)
- Modify: `app/content/posts/devlog01-pipeline-observability-jan-2026.ts`, `devlog02-pipeline-observability-instrumentation.ts`, `devlog03-pipeline-resilience-patterns.ts`, `devlog04-pipeline-testing-validation.ts` (→ `"pipeline"`)
- **Não tocar:** `microservices-scalability-operational-costs-cloud-native.ts` e `clair-obscur-expedition-33-review-sem-spoilers.ts` (não são DevLog; ficam sem `series` de propósito).

**Interfaces:**
- Consumes: `SeriesSlug` (Task 1).
- Produces: nada — só dados.

- [ ] **Step 1: Adicionar `series` nos 9 posts da Aloy**

Em cada arquivo, inserir a linha logo **depois** da linha `coverImage:` (e antes de `content:`):

```ts
  series: "aloy",
```

- [ ] **Step 2: Adicionar `series` nos 4 posts do Order Pipeline**

Mesma posição, em cada um dos 4 arquivos:

```ts
  series: "pipeline",
```

Se algum desses arquivos não tiver `coverImage`, inserir a linha logo depois de `tags:`. A posição exata não importa para o TypeScript — importa a consistência.

- [ ] **Step 3: Conferir que os 13 pegaram e que os 2 não-DevLog ficaram de fora**

Run: `cd app/content/posts && grep -L 'series:' devlog*.ts; echo "---"; grep -c 'series:' microservices-scalability-operational-costs-cloud-native.ts clair-obscur-expedition-33-review-sem-spoilers.ts`
Expected: a primeira lista sai **vazia** (todo `devlog*.ts` tem `series`); a segunda imprime `...:0` para os dois arquivos.

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: limpo. Um typo como `series: "aloi"` falha aqui — é o ponto da union tipada.

---

### Task 3: Subseções por série na página de categoria

**Files:**
- Modify: `app/category/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getSeriesGroups` (Task 1), `CATEGORIES` (já existe), `PostCard` (já existe).
- Produces: nada.

**Regra:** se a categoria tem **um único grupo**, renderizar o grid direto **sem `<h3>`** — assim Games e Tech (1 post cada, sem série) ficam visualmente idênticos ao que são hoje, sem um cabeçalho "Aleatórios" inútil.

- [ ] **Step 1: Trocar o import da query**

Trocar `import { getPostsByCategory } from "@/lib/posts"` por:

```ts
import { getSeriesGroups } from "@/lib/posts"
```

- [ ] **Step 2: Trocar a listagem plana pelos grupos**

Substituir o `const categoryPosts = getPostsByCategory(category.label)` e o bloco `<div className="grid ...">` do JSX por:

```tsx
  const groups = getSeriesGroups(category.label)

  if (groups.length === 0) {
    notFound()
  }

  const showHeadings = groups.length > 1
```

E o corpo do return (mantendo o `<Link>` de voltar e o `<h2>` como estão):

```tsx
      {groups.map((group) => (
        <section key={group.slug ?? "ungrouped"} className={showHeadings ? "mb-10" : undefined}>
          {showHeadings && (
            <h3 className="text-lg sm:text-xl font-pixel mb-5 text-purple-400">{group.label}</h3>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            {group.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ))}
```

Nota: o `notFound()` para categoria vazia é **mantido** (comportamento herdado da spec anterior §7); `groups.length === 0` só acontece quando a categoria não tem post nenhum, porque grupos vazios já são omitidos pela query.

- [ ] **Step 3: Verificar tipos e build**

Run: `npx tsc --noEmit && npm run build`
Expected: tsc limpo; build completa com as rotas `/category/games`, `/category/tech`, `/category/devlog` geradas.

---

### Task 4: Limitar a home aos 4 posts mais recentes por categoria

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `getPostsByCategory` (já existe), `CATEGORIES` (já existe).
- Produces: nada.

**Por quê:** hoje a home renderiza **todos** os posts de cada categoria e ainda oferece um link "Ver todos os posts" para a mesma lista. Com 17 DevLogs isso vira um paredão. Sem subseções aqui — o agrupamento vive na página da categoria.

- [ ] **Step 1: Adicionar a constante e fatiar a lista**

Acima do `export default function Home()`:

```tsx
const HOME_POSTS_PER_CATEGORY = 4
```

Dentro do `.map`, trocar:

```tsx
        const categoryPosts = getPostsByCategory(label)
        if (categoryPosts.length === 0) return null
```

por:

```tsx
        const categoryPosts = getPostsByCategory(label)
        if (categoryPosts.length === 0) return null
        const recentPosts = categoryPosts.slice(0, HOME_POSTS_PER_CATEGORY)
```

E no JSX, iterar sobre `recentPosts` em vez de `categoryPosts`:

```tsx
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
```

O `<Link>` "Ver todos os posts" fica **como está** — agora ele finalmente tem razão de existir.

- [ ] **Step 2: Verificar tipos e build**

Run: `npx tsc --noEmit && npm run build`
Expected: limpo.

---

### Task 5: Post Aloy #10 — UX mobile

**Files:**
- Create: `app/content/posts/devlog10-aloy-ux-mobile.ts`
- Modify: `app/content/posts/index.ts`
- **Fonte (ler antes de escrever):** `/home/luis_promedico/Documentos/Softwares/LuisMarchio03/Projects/aloy/aloy-brain/DEVLOG-2026-07-20.md`

**Interfaces:**
- Consumes: tipo `Post` (`@/lib/posts`).
- Produces: `export const post: Post` — importado pelo `index.ts` como `devlogAloy10`.

**Metadados exatos:**

```ts
  id: "devlog10-aloy-ux-mobile",
  title: "DevLog #10 – Aloy: UX mobile — nav inferior, safe-area e painel único",
  category: "DevLog",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-20",
  tags: ["mobile", "ux", "responsivo", "nextjs", "frontend"],
  coverImage: "./coverimg-aloy-10.jpg",
  series: "aloy",
```

- [ ] **Step 1: Escrever o post**

Estrutura (`<h3>` como no `devlog09`, separados por `<hr>`), escrito em primeira pessoa, PT-BR, tom da série:

1. **Abertura** (`<p>`, sem `<h3>`): o #09 fechou o acesso remoto; agora a Aloy é alcançável do celular, mas *usável* é outra história. Escopo: só frontend.
2. `<h3>` **A nav que cabe no polegar** — `lib/nav.ts` com `PRIMARY_NAV_IDS` (chat, sessions, files, system) + `primaryNavItems()`/`overflowNavItems()`; barra inferior com as 4 primárias + "⋯ Mais" abrindo o drawer com o resto; alvo de toque ≥52px; `pb-[env(safe-area-inset-bottom)]`; renderizada **abaixo do `<main>`** só quando `sidebar.isMobile`, empilhada pra não cobrir o input do chat. Desktop inalterado.
3. `<h3>` **O notch** — `pt-[env(safe-area-inset-top)]` e a troca `h-12` → `min-h-12`, pro header **crescer** com o inset em vez de clipar o conteúdo.
4. `<h3>` **Metade do trabalho já estava feita** — o cockpit de sessões em painel único já tinha sido implementado em paralelo, e **melhor do que o plano previa**: `lib/cockpit-pane.ts` com `cockpitPane({isMobile, selectedId}) → list|detail|split`, com teste. Só verifiquei, não dupliquei. Este é o ângulo do post: **parte da entrega foi não escrever código.**
5. `<h3>` **A varredura que não achou nada** — procurei overflow horizontal nas seções primárias e as achei já responsivas (`flex-wrap`, larguras em `%`, `max-w`+`truncate`); o único `min-w-[10rem]` vive num container `flex-wrap`, então quebra em vez de estourar. Conclusão honesta: **nada a envolver em `overflow-x-auto`**. Uma varredura que termina em "não faça nada" é resultado, não desperdício.
6. `<h3>` **O que ficou de fora** — gestos/swipe, redesign denso por-seção, redesign mobile completo. Testes: vitest 122 passed (24 arquivos, +4 do split de nav), `tsc` limpo, build compila; smoke visual manual pendente no aparelho real.

- [ ] **Step 2: Registrar no `index.ts`**

Import junto dos outros da Aloy:

```ts
import { post as devlogAloy10 } from "./devlog10-aloy-ux-mobile"
```

E a entrada **no topo do bloco da Aloy** (o comentário do bloco explica que a ordem reversa resolve empates de data):

```ts
  devlogAloy10,
  devlogAloy09,
```

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit && npm run build`
Expected: limpo; o build gera a rota `/post/devlog10-aloy-ux-mobile`.

---

### Task 6: Post Aloy #11 — Tokens por dispositivo + HTTPS via Tailscale

**Files:**
- Create: `app/content/posts/devlog11-aloy-tokens-dispositivo-https.ts`
- Modify: `app/content/posts/index.ts`
- **Fonte (ler antes de escrever):** `/home/luis_promedico/Documentos/Softwares/LuisMarchio03/Projects/aloy/aloy-brain/DEVLOG-2026-07-21.md` (as três seções do arquivo: tokens, HTTPS, follow-up do download)

**Interfaces:**
- Consumes: tipo `Post`.
- Produces: `export const post: Post` — importado como `devlogAloy11`.

**Metadados exatos:**

```ts
  id: "devlog11-aloy-tokens-dispositivo-https",
  title: "DevLog #11 – Aloy: Um token por dispositivo, revogação e HTTPS via Tailscale",
  category: "DevLog",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-21",
  tags: ["seguranca", "auth", "tailscale", "https", "tokens", "tls"],
  coverImage: "./coverimg-aloy-11.jpg",
  series: "aloy",
```

**Este é o post mais denso da leva.** Mira em ~2× o tamanho do #10.

- [ ] **Step 1: Escrever o post**

1. **Abertura**: o #09 deixou a auth por QR funcionando com um **token único compartilhado** — e uma limitação óbvia: *perdi o celular → só dá pra trocar o segredo de todos*. Este post fecha isso e depois bota TLS na frente.
2. `<h3>` **Um token por dispositivo** — `SqliteDeviceStore`, tabela `devices(id, name, token_sha256 UNIQUE, created_at, last_seen)`; guarda o **SHA-256**, nunca o raw (o raw sai **uma vez só**, no `create`); set de hashes ativos em memória → `authorize()` é **O(1) sem tocar o DB**; `last_seen` com throttle (≤1×/min por device). Gestão (`GET/POST/DELETE/PATCH /api/devices`) é **loopback-only**: o celular *usa*, não *administra*. Front: painel "Dispositivos pareados" com última vez, revogar e renomear inline.
3. `<h3>` **Never-crash até no caminho do banco** — o review pegou: o `sqlite3.connect` estava **fora** do try, então um path ruim derrubava tudo; fix = fallback pra `:memory:`. É o padrão que se repete no projeto: a invariante "nada derruba o servidor" tem que cobrir o **boot** e a **config**, não só o caminho feliz.
4. `<h3>` **HTTPS: a recon derrubou duas hipóteses minhas** — antes de escrever código. (1) *"Precisa de `tailscale cert` + TLS no uvicorn"*: **falso**, o `serve` termina TLS com cert emitido e renovado sozinho — zero ops de certificado (`curl` validou sem `-k`). (2) *"O proxy vai abrir o gate: o backend verá 127.0.0.1 e o tailnet entra sem token"* — **falso, e essa era a premissa central do design**: o uvicorn roda `proxy_headers` por padrão, reescreve o cliente com o IP encaminhado e **só confia no header vindo de 127.0.0.1**. O falso positivo tinha vindo do meu echo server de teste ser um `http.server` cru, que não faz nada disso. **Lição: valide a premissa contra o servidor real, não contra um stub.**
5. `<h3>` **3 dos 4 bugs eram do meu próprio plano** — o coração do post:
   - **CRITICAL:** `_normalize_serve` pegava *"o primeiro"* handler. O Go serializa mapas em **ordem alfabética**, e esta máquina já tinha `serve` na 443 e 8443 de outros projetos → `host:443 < host:4443` → **o endpoint reportaria a porta do projeto errado e o QR sairia quebrado.** Fix: filtrar pela porta exata da Aloy.
   - **CRITICAL:** `WS_BASE = wss://${host}` usava `window.location.hostname`, que **não carrega a porta** → sob `https://…:4443` o WebSocket iria pra **443 não-proxiada** → voz, notificações, sessões e métricas quebrados **justamente no modo HTTPS**. Fix: base vazia → URL relativa, e o browser resolve esquema, host **e porta**.
   - **CRITICAL:** `is_trusted_local` fazia `not forwarded_for` — **fail-open**, porque `not ""` é `True`: um XFF vazio devolvia "confiável". Fix: `forwarded_for is None`.
   - **IMPORTANT (pré-existente):** `worker_auth_dep` comparava só com o token **mestre**, mas o QR entrega token de **dispositivo** → o celular passava no gate global e levava **401** nas rotas HTTP de `/api/sessions`, `/api/files` e `/api/vpn` — duas das quatro abas da nav mobile morriam. Raiz: **duas cópias da política de auth** (middleware vs dep de rota) que divergiram. Fix: `authorize_token` como **fonte única**.
   - Fecho da seção: o systemd passou a declarar `--proxy-headers --forwarded-allow-ips=127.0.0.1` **explícitos** — a segurança dependia de um *default implícito* do uvicorn, e um upgrade que mudasse o default abriria o gate calado.
6. `<h3>` **O download que não descia no celular** — `<a download>` **não manda header `Authorization`**, e o `?token=` só era aceito no ramo WebSocket → no desktop funcionava (loopback), no celular dava 401. Das duas opções, escolhi **`?token=` no GET** e **não** `fetch`→blob — motivo específico deste app: o upload já é **resumável em chunks** justamente porque arquivos podem ser grandes, e blob bufferizaria o arquivo **inteiro na RAM do aparelho**; o `?token=` preserva o **download nativo em streaming**. Ressalva honesta: o token agora aparece na URL (logs do kernel, histórico do aparelho) — na LAN já trafegava em claro, no tailnet é HTTPS, e tokens de dispositivo são revogáveis.
7. `<h3>` **Provado ao vivo** — tailnet real: `serve` com 7 handlers na 4443, **443/8443 intactos**; `/health` sem token → 401, com token de dispositivo → 200, **XFF forjado → 401**; WS → 101; `/api/devices` pelo tailnet → 403; **token revogado → 401**; `POST /commands` pelo HTTPS → 200 e a Aloy respondeu "ok". Certificado válido de verdade (todo `curl` sem `-k`). Antes: parear 2 dispositivos e **revogar o A → A:401, B:200**. Backend 584 passed. Follow-on: PWA + Web Push (agora **destravados** pela origem segura), HTTPS na LAN, expiração de token.

- [ ] **Step 2: Registrar no `index.ts`**

```ts
import { post as devlogAloy11 } from "./devlog11-aloy-tokens-dispositivo-https"
```

Entrada acima do `devlogAloy10`:

```ts
  devlogAloy11,
  devlogAloy10,
```

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit && npm run build`
Expected: limpo.

---

### Task 7: Post Aloy #12 — Painel de Sistema do celular

**Files:**
- Create: `app/content/posts/devlog12-aloy-painel-sistema-celular.ts`
- Modify: `app/content/posts/index.ts`
- **Fonte (ler antes de escrever):** `/home/luis_promedico/Documentos/Softwares/LuisMarchio03/Projects/aloy/aloy-brain/DEVLOG-2026-07-22.md`

**Interfaces:**
- Consumes: tipo `Post`.
- Produces: `export const post: Post` — importado como `devlogAloy12`.

**Metadados exatos:**

```ts
  id: "devlog12-aloy-painel-sistema-celular",
  title: "DevLog #12 – Aloy: O Painel de Sistema do celular",
  category: "DevLog",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-22",
  tags: ["mobile", "web-apis", "metricas", "bateria", "frontend"],
  coverImage: "./coverimg-aloy-12.jpg",
  series: "aloy",
```

- [ ] **Step 1: Escrever o post**

1. **Abertura**: o pedido — *"meu celular e o desktop deveriam ser máquinas distintas: quero ver o monitoramento **do celular**, não do PC"*. O brainstorming decompôs em duas features independentes; esta é a **2/2** (monitoramento). A 1 (inbox por dispositivo) fica pro ciclo dela.
2. `<h3>` **A restrição que desenhou tudo** — o celular é um **navegador** falando com o kernel do PC; ele **não roda** o binário Go `sysmetrics`. Então as métricas do aparelho só podem vir de **Web APIs** (bateria, rede, memória aproximada, núcleos, storage, modelo) — e CPU%, temperatura, disco e processos são **impossíveis** ali. Não é limitação de esforço, é da plataforma. Alvo: Android/Chrome (iOS expõe quase nada → degrada). Duas decisões: **exibição só local** (cada aparelho mostra o seu; nada trafega ao kernel) e **troca só do card de hardware** (os cards de assistente seguem nos dois).
3. `<h3>` **"Quem sou eu?" em uma linha** — `isPairedDevice()` = `getToken() != null`. Sem token (loopback/desktop) = "sou o PC"; pareado por QR = "sou um device". O primitivo de identidade que a Feature 1 vai reusar. E `GET /api/devices/me` como **único** toque no backend: read-only, never-crash, resolve o token → `{id,name}` do **próprio** caller, sem param `id` — não dá pra perguntar pelo nome de outro dispositivo.
4. `<h3>` **Todo campo anulável, degradando 1-a-1** — helpers puros (`formatBattery`/`describeConnection`/`formatStorage`/`parseModel`), `readDeviceMetrics()` que **nunca rejeita** e `subscribeDeviceMetrics()` pra bateria/rede ao vivo.
5. `<h3>` **O CRITICAL: uma API que lança *sincronamente*** — o review pegou que nem todas as fontes estavam envolvidas em try/catch. `navigator.connection`/`getBattery` podem **lançar de forma síncrona** em browsers com proteção anti-fingerprint → `readDeviceMetrics` **rejeitaria** e `subscribeDeviceMetrics` daria **throw síncrono dentro do `useEffect`**: exatamente a classe do bug de **nav-freeze** que este projeto **já tinha sofrido**, e uma violação do contrato "nunca rejeita" do meu próprio plano. Fix: as 8 fontes envolvidas + 4 testes de caminho-perigoso (fail-before/pass-after). A lição: *"o navegador vai me dar `undefined`"* é otimismo — ele pode **explodir na sua cara**.
6. `<h3>` **O efeito colateral mais elegante** — o card "PC SERVER" saiu pra `pc-hardware-card.tsx` (dono do `useMetrics`) e a seção troca por `isPairedDevice()`. Consequência: **no celular o `PcHardwareCard` nem monta** → `useMetrics` não é chamado → o `/ws/metrics` do PC **nem abre**. A separação certa de componente matou um WebSocket inútil de graça.
7. `<h3>` **O flash que o review final pescou** — `metrics` inicia `null`, então todo mount piscava "não expõe métricas" antes dos dados chegarem. Fix: `hasDisplayMetrics()` + render **três-vias** distinguindo *loading* de *não-suportado*. Testes: backend 589 passed, front vitest 159. Follow-on: visão cruzada (o PC ver o celular), riqueza no iOS, e a Feature 1.

- [ ] **Step 2: Registrar no `index.ts`**

```ts
import { post as devlogAloy12 } from "./devlog12-aloy-painel-sistema-celular"
```

Entrada no topo do bloco da Aloy:

```ts
  devlogAloy12,
  devlogAloy11,
```

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit && npm run build`
Expected: limpo.

---

### Task 8: Post BrigidAI #01 — Voltando ao TCC

**Files:**
- Create: `app/content/posts/devlog01-brigid-voltando-ao-tcc.ts`
- Modify: `app/content/posts/index.ts`
- **Fontes (ler antes de escrever):** `/home/luis_promedico/Documentos/Softwares/LuisMarchio03/Projects/BrigidAI/README.md`, `docs/01-visao-e-contribuicao.md`, `docs/02-decomposicao.md`, `docs/03-decisoes-arquiteturais.md`

**Interfaces:**
- Consumes: tipo `Post`.
- Produces: `export const post: Post` — importado como `devlogBrigid01`.

**Metadados exatos:**

```ts
  id: "devlog01-brigid-voltando-ao-tcc",
  title: "DevLog #01 – BrigidAI: Voltando ao TCC — o que a concepção original errou",
  category: "DevLog",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-15",
  tags: ["parkinson", "ia-medica", "dotnet", "pesquisa", "mri", "dicom"],
  coverImage: "./coverimg-brigid-01.jpg",
  series: "brigid",
```

**ENQUADRAMENTO — confirmado com o autor, não inferir do repo:** o projeto **nasceu como TCC**, está sendo **retomado e melhorado agora**, e **mestrado é um plano futuro**. O `README.md` do repo diz "dissertação de mestrado" no presente — isso é **impreciso** e será corrigido na Task 10. **Não escrever o post como se fosse uma dissertação de mestrado em andamento.**

- [ ] **Step 1: Escrever o post**

Este é o **#01 de uma série nova** — precisa apresentar o projeto do zero, sem assumir contexto.

1. **Abertura**: estou voltando a um projeto que nasceu como meu TCC — o BrigidAI, apoio ao diagnóstico de Parkinson a partir de ressonância magnética. Só que voltar não foi continuar de onde parei: a primeira coisa que fiz foi uma **autópsia da própria concepção**. E ela não sobreviveu inteira.
2. `<h3>` **O que o TCC prometia** — detectar degeneração neuronal **precoce** na substância nigra a partir de RM, com uma ResNet50 adaptada ("ParkinsonCNN"), stack inteiro em C#/.NET + ML.NET.
3. `<h3>` **Três problemas, cada um fatal numa banca**:
   - **A substância nigra é invisível em T1.** Quem de fato detecta degeneração nigral usa **NM-MRI** (neuromelanina) ou **SWI/QSM** (nigrossomo-1, o *swallow tail sign*). Uma CNN rodando sobre T1 convencional e alegando ver degeneração da SN **faz uma afirmação que a física da imagem não sustenta**. Ou muda a modalidade, ou muda a alegação.
   - **"Detecção antes dos sintomas" não é o que um classificador DP × controle responde.** Isso exigiria coorte prodrômica (RBD, hiposmia) e desfecho de conversão. O PPMI tem a coorte, mas o N é pequeno e o rótulo é fraco — numa pesquisa com prazo, é uma aposta que pode terminar sem resultado nenhum.
   - **ML.NET não é framework de pesquisa.** Treinar CNN 3D nele custaria meses e não renderia crédito acadêmico nenhum.
4. `<h3>` **A virada: a plataforma é a contribuição** — a tese não é *"minha CNN acerta X%"*. É que **modelos de IA médica morrem no caminho do laboratório pro hospital**, e a contribuição é uma plataforma reprodutível, auditável e integrável a **PACS via DICOM**, com Parkinson como estudo de caso. O núcleo científico dentro dela é a **generalização entre centros e fabricantes**: treinar num conjunto de sites, testar em outros **nunca vistos**, e quantificar a queda com honestidade (+ mitigação: harmonização ComBat, *domain adaptation*). E o .NET deixa de ser desculpa e vira o **ponto**: hospitais rodam Windows, .NET e PACS; o mundo da pesquisa é 100% Python. A lacuna é real. Registrar também o que foi **descartado**: o paper clássico DP × controle ("treinamos uma ResNet50 no PPMI e obtivemos 92%" já foi feito dezenas de vezes e não é contribuição em 2026).
5. `<h3>` **As regras que não se negociam** — cada uma, violada, invalida o trabalho inteiro:
   - **Um sujeito, um volume.** Vazamento por sujeito é a causa nº 1 das acurácias de 97–99% na literatura: fatias ou visitas do mesmo paciente em treino e teste, e a rede aprende a reconhecer **a pessoa**, não a doença. Mitigação **estrutural**: split sempre por sujeito + teste no CI que **falha** se um `subject_id` aparecer em dois splits.
   - **A estatística de normalização só vê o treino.** Calcular média/desvio sobre o dataset inteiro antes do split é vazamento **invisível**. Imposto pelo código, não por disciplina.
   - **AUC > 0,90 é bug presumido.** O sinal de DP em T1 estrutural é genuinamente fraco: a literatura séria reporta **0,70–0,80**. Número alto demais é **sintoma, não conquista** — procure vazamento antes de comemorar.
   - **Nada de exclusão silenciosa.** Todo sujeito excluído é contabilizado com causa, e o fluxograma (CONSORT/STARD) é **gerado do log**, nunca escrito à mão.
   - **Nunca reportar acurácia crua.** O PPMI tem 2–3 PD por controle; chutar "PD" sempre acerta ~70%. Reportar AUC, AUPRC e acurácia balanceada.
6. `<h3>` **Onde estou agora** — fase P0 (ingestão e inventário): o CLI `brigid inventory` já roda sobre os dados do PPMI, fiando a fonte, aplicando o gate de elegibilidade T1 3D volumétrico (que **sinaliza, não descarta**) e cuspindo o relatório de contagens e sinalizados por causa — que é, por construção, a Tabela 1. Mestrado é plano pro futuro; por ora é retomar direito o que o TCC deixou pela metade.

- [ ] **Step 2: Registrar no `index.ts`**

Import (bloco próprio, depois dos da Aloy):

```ts
import { post as devlogBrigid01 } from "./devlog01-brigid-voltando-ao-tcc"
```

Entrada no array — a data (2026-07-15) o coloca entre `devlogAloy09` (07-19) e `devlog01Pipeline` (2026-01-06). Como o sort é por data, a posição no array só resolveria empates; para manter a leitura do arquivo coerente com a spec, adicionar **um bloco próprio** logo depois de `devlogAloy` (o #01 da Aloy):

```ts
  devlogAloy,
  // Série BrigidAI
  devlogBrigid01,
  devlog01Pipeline,
```

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit && npm run build`
Expected: limpo; rota `/post/devlog01-brigid-voltando-ao-tcc` gerada.

---

### Task 9: Verificação final do blog

**Files:** nenhum (só verificação).

- [ ] **Step 1: Tipos e build limpos**

Run: `npx tsc --noEmit && npm run build`
Expected: tsc sem saída; build sem erro, com 17 rotas `/post/*`.

- [ ] **Step 2: Conferir o agrupamento sem subir o servidor**

Run: `cd app/content/posts && grep -c 'series: "aloy"' devlog*aloy*.ts | grep -c ':1'; grep -l 'series: "brigid"' *.ts`
Expected: `12` (os 12 posts da Aloy, #01–#12); e `devlog01-brigid-voltando-ao-tcc.ts`.

- [ ] **Step 3: Smoke manual**

Run: `npm run dev` e abrir:
- `/category/devlog` → subseções na ordem **DevLog da Aloy** (12) → **Order Pipeline** (4) → **BrigidAI** (1). **Sem** cabeçalho "Aleatórios" (nenhum post avulso hoje).
- `/category/games` e `/category/tech` → grid direto, **sem** `<h3>` de série.
- `/` → seção DevLog com **4 cards** + "Ver todos os posts".
- Os 4 posts novos → abrem, TOC gerada a partir dos `<h3>`, prev/next cronológico atravessando séries (ex.: o BrigidAI #01, de 15/07, cai entre posts da Aloy).

---

### Task 10: Corrigir o README do BrigidAI

**Files:**
- Modify: `/home/luis_promedico/Documentos/Softwares/LuisMarchio03/Projects/BrigidAI/README.md`

**Este é outro repositório, e ele TEM git** — esta é a única task que commita.

**Duas imprecisões a corrigir** (autorizadas explicitamente pelo autor):
1. `Contexto: dissertação de mestrado.` → o enquadramento correto é **TCC retomado, mestrado como plano futuro**.
2. `Fase de concepção. Nenhum código escrito ainda.` → **desatualizado**: o P0 tem código (`brigid_data`, CLI `brigid inventory`), como o próprio git log mostra (`feat(p0): CLI 'brigid inventory' fiando source + relatório`).

- [ ] **Step 1: Ler o README e confirmar que os dois trechos ainda estão lá**

Run: `cd /home/luis_promedico/Documentos/Softwares/LuisMarchio03/Projects/BrigidAI && grep -n "dissertação de mestrado\|Nenhum código escrito ainda" README.md`
Expected: duas linhas (13 e ~19). Se não baterem, **parar e reportar** em vez de editar às cegas.

- [ ] **Step 2: Corrigir o contexto**

Trocar `Contexto: dissertação de mestrado.` por:

```markdown
Contexto: projeto que nasceu como TCC e está sendo retomado e reformulado.
Um mestrado é um desdobramento possível, não um fato — o que está em jogo agora
é refazer as fundações que a concepção original errou (ver
[`docs/01-visao-e-contribuicao.md`](docs/01-visao-e-contribuicao.md)).
```

- [ ] **Step 3: Corrigir o estado atual**

Trocar a seção `## Estado atual` (`Fase de concepção. Nenhum código escrito ainda. / Toda a decisão de projeto tomada até aqui está documentada em docs/.`) por:

```markdown
## Estado atual

**P0 (ingestão e inventário) em construção.** O CLI `brigid inventory` já percorre uma
árvore PPMI, aplica o gate de elegibilidade T1 3D volumétrico (que sinaliza, não descarta)
e emite o relatório de contagens e sinalizados por causa.

As decisões de projeto que sustentam o resto estão documentadas em `docs/`.
```

**Nota:** os outros usos de "dissertação" espalhados por `docs/` (ex.: `docs/02-decomposicao.md`, `docs/03-decisoes-arquiteturais.md`) **não** estão no escopo desta task — o autor autorizou só o README. Se o enquadramento tiver que mudar nos docs também, é decisão dele, num passo à parte.

- [ ] **Step 4: Commitar**

```bash
cd /home/luis_promedico/Documentos/Softwares/LuisMarchio03/Projects/BrigidAI
git add README.md
git commit -m "docs: corrige contexto (TCC retomado, não dissertação) e estado do P0

O README afirmava 'Contexto: dissertação de mestrado' e 'Nenhum código escrito
ainda'. O enquadramento correto é um TCC sendo retomado, com mestrado como
desdobramento possível; e o P0 já tem código (brigid_data + CLI 'brigid inventory').

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: Conferir**

Run: `git -C /home/luis_promedico/Documentos/Softwares/LuisMarchio03/Projects/BrigidAI log --oneline -1 && git -C /home/luis_promedico/Documentos/Softwares/LuisMarchio03/Projects/BrigidAI status --short`
Expected: o commit novo no topo; `status` sem `README.md` pendente.

---

## Notas de execução

- **Ordem:** Tasks 1–4 são a infraestrutura e devem vir primeiro e em ordem (a 2 depende do tipo da 1; a 3 e a 4 dependem da query da 1). Tasks 5–8 (posts) são independentes entre si **exceto pelo `index.ts`**, que todas as quatro modificam — se forem paralelizadas, o `index.ts` conflita. **Executar 5–8 em série.**
- **Task 10 é de outro repositório** e independe de tudo — pode rodar a qualquer momento.
- **Sem commits nas Tasks 1–9** (o blog não é repo git).
