# Séries de DevLog + 4 posts novos (Aloy #10–#12, BrigidAI #01) · Design

> **Autor:** Luís Gabriel Marchió Batista · **Data:** 2026-07-16
> **Projeto:** `8-bit-chronicles-blog-main` (Next.js 15 App Router + Tailwind v3, estética retrô 8-bit)
> **Escopo:** (1) agrupar os DevLogs em subseções por projeto + "Aleatórios"; (2) escrever 4 posts novos.
> **Fora de escopo:** páginas próprias por série (`/series/<slug>`), filtro por tag, reescrever posts
> existentes, criar imagens de capa, Markdown/MDX, CMS.

Continuação de [`2026-06-26-posts-organizacao-design.md`](2026-06-26-posts-organizacao-design.md), cujas
convenções são mantidas: um arquivo por post em `app/content/posts/`, registro no `index.ts`, `lib/posts.ts`
como única porta de entrada das páginas, fonte única de verdade para listas (`lib/categories.ts`).

## Problema

A categoria **DevLog** é uma lista plana ordenada só por data, misturando duas séries sem relação:
9 posts da **Aloy** e 4 do **Order Pipeline**. Com o BrigidAI e os 3 posts novos da Aloy, viram **17 posts
embolados** — e a home renderiza *todos* eles, sem limite, num bloco só.

Não existe hoje nenhum DevLog avulso: os 13 pertencem a uma série. A subseção "Aleatórios" nasce, portanto,
**vazia**, e só aparece quando houver um post sem série. Isso é intencional, não um bug.

## 1. Modelo de dados

### `lib/series.ts` (novo)

Espelha o padrão já estabelecido por `lib/categories.ts`. A **ordem do array é a ordem de exibição**.

```ts
import type { SeriesSlug } from "@/lib/posts"

export const SERIES: { label: string; slug: SeriesSlug }[] = [
  { label: "DevLog da Aloy", slug: "aloy" },
  { label: "Order Pipeline", slug: "pipeline" },
  { label: "BrigidAI", slug: "brigid" },
]

export const UNGROUPED_LABEL = "Aleatórios"
```

`"Order Pipeline"` é o nome real da série, tirado do título do próprio `devlog01-pipeline` — não um rótulo
inventado.

### `lib/posts.ts` (modificado)

```ts
export type SeriesSlug = "aloy" | "pipeline" | "brigid"

export type Post = {
  // ...campos atuais, inalterados
  series?: SeriesSlug   // ausente = post avulso → "Aleatórios"
}
```

Union tipada pelo mesmo motivo que `Category` é tipada: erro de compilação se digitar errado.

Query nova — **única** responsável pelo agrupamento e sua ordem:

```ts
export type SeriesGroup = { label: string; slug: SeriesSlug | null; posts: Post[] }

export function getSeriesGroups(category: Category): SeriesGroup[]
```

Contrato:
- Grupos na ordem de `SERIES`; o grupo sem série (`slug: null`, label `"Aleatórios"`) vem **sempre por último**.
- Dentro de cada grupo, a ordem é a global já ordenada por data desc (herdada de `sorted`).
- **Grupos vazios são omitidos** — a subseção só existe se tiver post.

`getAdjacentPosts` **não muda**: continua cronológico global, atravessando séries. Decisão herdada da spec
anterior (§3) e reconfirmada — prender o prev/next à série faria o Aloy #09 deixar de linkar seu vizinho de data.

**Direção dos imports (cuidado com ciclo).** `lib/posts.ts` importa `SERIES`/`UNGROUPED_LABEL` (valores) de
`lib/series.ts`, e `lib/series.ts` importa `SeriesSlug` de volta **como `import type`** — que o TypeScript
apaga na compilação, então **não há ciclo em runtime**. É o mesmo arranjo que `lib/categories.ts` já usa com
`Category`. O tipo `SeriesSlug` mora em `lib/posts.ts` (junto de `Post`); se o implementador precisar
inverter isso, mover o tipo para `lib/series.ts` e importá-lo em `posts.ts` como `import type` — nunca deixar
os dois lados com import de valor.

### Atribuição de série aos 13 posts existentes

Uma linha `series:` por arquivo, nada mais:

| posts | `series` |
|---|---|
| `devlog01-aloy` … `devlog09-aloy` (9) | `"aloy"` |
| `devlog01-pipeline` … `devlog04-pipeline` (4) | `"pipeline"` |
| `microservices`, `clair-obscur` | *(nenhuma — não são DevLog)* |

## 2. UI

### `app/category/[slug]/page.tsx`

Renderiza subseções via `getSeriesGroups(category.label)`: `<h3>` com o label da série + grid de `PostCard`.
Vale para qualquer categoria — Games/Tech simplesmente cairão num único grupo "Aleatórios".

Para não mostrar um cabeçalho "Aleatórios" inútil em cima de uma categoria que não tem séries: **se houver
apenas um grupo, renderiza o grid direto, sem `<h3>`**. Games e Tech ficam visualmente idênticos ao que são hoje.

### `app/page.tsx`

A home passa a mostrar, por categoria, só os **4 posts mais recentes**, mantendo o link "Ver todos os posts"
que já existe (hoje ele aponta para uma lista que a home já duplicava por inteiro). Sem subseções na home — o
agrupamento vive na página da categoria.

Games e Tech têm 1 post cada, então o limite não muda nada visualmente para eles; ele existe para matar o
paredão de 17 cards do DevLog.

## 3. Os 4 posts novos

Convenção de título confirmada nos posts existentes: `DevLog #NN – <Série>: <tema>`.
Convenção de `id`: `devlog<NN>-<série>-<slug>`. Autor: `"Luís Gabriel Marchió Batista"`.
`coverImage` é preenchido por convenção mas **não é renderizado** (as capas são procedurais por categoria).

As datas saem dos devlogs de origem (20–22/07), posteriores a hoje (16/07) — mesma convenção do `devlog09`,
já publicado com data 19/07.

### Aloy #10 — UX mobile (`2026-07-20`)

- **id:** `devlog10-aloy-ux-mobile`
- **Fonte:** `aloy-brain/DEVLOG-2026-07-20.md`
- **Conteúdo:** nav inferior (4 primárias + "⋯ Mais" abrindo o drawer, alvo de toque ≥52px), safe-area do
  notch (`env(safe-area-inset-*)`, `h-12`→`min-h-12` pro header crescer em vez de clipar), split de nav
  testável (`lib/nav.ts`, 4 testes), cockpit de sessões em painel único no mobile.
- **Ângulo:** um devlog em que parte da entrega é **verificar e não duplicar** — o cockpit mobile já tinha
  sido feito em paralelo (e melhor que o plano previa), e a varredura de overflow horizontal concluiu que
  **não havia nada a consertar**. Desktop byte-inalterado.
- **Tags:** `["mobile", "ux", "responsivo", "nextjs", "frontend"]`

### Aloy #11 — Tokens por dispositivo + HTTPS via Tailscale (`2026-07-21`)

- **id:** `devlog11-aloy-tokens-dispositivo-https`
- **Fonte:** `aloy-brain/DEVLOG-2026-07-21.md` (as três seções: tokens, HTTPS, follow-up do download)
- **Conteúdo:** sai o token único compartilhado, entra um token por dispositivo — SHA-256 no banco (o raw sai
  uma vez só, no `create`), set de hashes em memória (`authorize` O(1)), `last_seen` com throttle, painel de
  dispositivos pareados com revogar/renomear. Depois `tailscale serve` terminando TLS na 4443, origem única
  (`/` → UI, `/api`+`/ws`+… → kernel).
- **Ângulos (os dois melhores da leva):**
  1. **A recon derrubou duas hipóteses antes de escrever código** — a premissa central do design ("o proxy
     vai abrir o gate de loopback") era **falsa**: o uvicorn roda `proxy_headers` por padrão e só confia no
     header vindo de 127.0.0.1. O falso positivo tinha vindo do echo server de teste ser um `http.server` cru.
  2. **3 dos 4 bugs que os reviews pegaram eram do próprio plano** — `_normalize_serve` pegando "o primeiro"
     handler (o Go serializa mapas em ordem alfabética, e a máquina já tinha `serve` na 443/8443 de outros
     projetos → o QR sairia quebrado); `wss://${hostname}` sem porta → WebSocket indo pra 443 não-proxiada,
     quebrando voz/notificações/sessões/métricas justo no modo HTTPS; e um fail-open clássico —
     `not forwarded_for` com `not ""` sendo `True`. O 4º: duas cópias divergentes da política de auth
     (middleware vs dep de rota), resolvido com `authorize_token` como fonte única.
- **Fecho:** o follow-up do download no celular — `<a download>` não manda `Authorization`; escolheu-se
  `?token=` em vez de `fetch`→blob **porque este app já assumiu que arquivos são grandes** (o upload é
  resumável em chunks), e blob bufferizaria o arquivo inteiro na RAM do aparelho. Com a ressalva honesta:
  o token passa a aparecer na URL.
- **Prova ao vivo:** revogar A → A:401, B:200; XFF forjado → 401; token revogado → 401.
- **Tags:** `["seguranca", "auth", "tailscale", "https", "tokens", "tls"]`

### Aloy #12 — Painel de Sistema do celular (`2026-07-22`)

- **id:** `devlog12-aloy-painel-sistema-celular`
- **Fonte:** `aloy-brain/DEVLOG-2026-07-22.md`
- **Conteúdo:** o celular é um **navegador**, não roda o binário Go `sysmetrics` — então as métricas do
  aparelho só podem vir de Web APIs (bateria, rede, memória aprox., núcleos, storage, modelo), e
  CPU%/temperatura/disco/processos são **impossíveis** ali. Exibição só local (nada trafega ao kernel);
  `isPairedDevice()` (= tem token) como primitivo de identidade; `GET /api/devices/me` como único toque no
  backend.
- **Ângulos:** o **CRITICAL do review** — fontes como `navigator.connection`/`getBattery` podem lançar
  **sincronamente** em browsers anti-fingerprint, o que faria `subscribeDeviceMetrics` dar throw síncrono
  dentro do `useEffect`: exatamente a classe de bug de **nav-freeze** que o projeto já tinha sofrido, e uma
  violação do contrato "nunca rejeita" do próprio plano. E o **efeito-chave** de arquitetura: no celular o
  `PcHardwareCard` não monta → `useMetrics` não é chamado → o `/ws/metrics` do PC **nem abre**.
- **Tags:** `["mobile", "web-apis", "metricas", "bateria", "frontend"]`

### BrigidAI #01 — Voltando ao TCC (`2026-07-15`)

- **id:** `devlog01-brigid-voltando-ao-tcc`
- **Título:** `DevLog #01 – BrigidAI: Voltando ao TCC — o que a concepção original errou`
- **Fonte:** `BrigidAI/README.md`, `docs/01-visao-e-contribuicao.md`, `docs/02-decomposicao.md`,
  `docs/03-decisoes-arquiteturais.md`; git log (concepção em 14–15/07/2026, P0 em andamento).
- **Enquadramento (confirmado com o autor):** o projeto **nasceu como TCC**, está sendo **retomado e
  melhorado agora**, e **mestrado é um plano futuro** — não um fato presente.
- **Conteúdo:**
  1. *O que o TCC prometia:* detectar degeneração neuronal precoce na substância nigra em RM, com uma
     ResNet50 adaptada ("ParkinsonCNN"), stack inteiro em C#/.NET + ML.NET.
  2. *Os três problemas* — **a substância nigra é invisível em T1** (quem detecta degeneração nigral usa
     NM-MRI ou SWI/QSM; a alegação não é sustentada pela física da imagem); **"detecção antes dos sintomas"
     exigiria coorte prodrômica** (RBD/hiposmia) e desfecho de conversão, com N pequeno e rótulo fraco;
     **ML.NET não é framework de pesquisa**.
  3. *A virada:* a contribuição passa a ser a **plataforma** — .NET-nativa, reprodutível, auditável, plugável
     em PACS via DICOM — com DP como estudo de caso, e **generalização entre centros/fabricantes** como núcleo
     científico (treinar num conjunto de sites, testar em outros nunca vistos, e quantificar a queda com
     honestidade). Joga a favor da competência real do autor em vez de virar "mais um 97% que ninguém reproduz".
  4. *As regras que não se negociam:* um sujeito/um volume (split por sujeito, com teste de CI que falha se
     um `subject_id` cair em dois splits); estatística de normalização só vê o treino; exclusão sempre
     contabilizada com causa (fluxograma CONSORT/STARD **gerado** do log); nunca reportar acurácia crua
     (PPMI tem 2–3 PD por controle); e a regra-título — **AUC > 0,90 é bug presumido até prova em contrário**,
     porque a literatura séria fica em 0,70–0,80.
  5. *Estado real:* P0 (ingestão/inventário) com o `brigid inventory` já rodando sobre dados do PPMI.
- **Tags:** `["parkinson", "ia-medica", "dotnet", "pesquisa", "mri", "dicom"]`

## 4. Registro no `index.ts`

Import + entrada no array para os 4 posts. A ordem no array resolve empates de data (o sort é estável), e
o bloco da Aloy já é mantido em ordem reversa por marco — os novos entram **no topo desse bloco**
(#12, #11, #10, #09…). O BrigidAI ganha um bloco próprio.

## 5. Ajuste fora deste repo (autorizado à parte)

`BrigidAI/README.md` afirma **"Contexto: dissertação de mestrado"** e **"Fase de concepção. Nenhum código
escrito ainda"**. Ambos divergem da realidade: o enquadramento correto é *TCC retomado, mestrado como plano
futuro*, e o P0 já tem código (`brigid_data`, CLI `brigid inventory`). Corrigir os dois pontos, em commit
próprio, no repo do BrigidAI.

## 6. Estrutura de arquivos (resumo)

- **Novos:** `lib/series.ts`; `app/content/posts/devlog10-aloy-ux-mobile.ts`,
  `devlog11-aloy-tokens-dispositivo-https.ts`, `devlog12-aloy-painel-sistema-celular.ts`,
  `devlog01-brigid-voltando-ao-tcc.ts`.
- **Modificados:** `lib/posts.ts` (tipo + `getSeriesGroups`), `app/content/posts/index.ts`,
  `app/page.tsx` (limite de 4), `app/category/[slug]/page.tsx` (subseções), os 13 posts existentes de
  DevLog (uma linha `series:` cada).
- **Sem dependências novas.**

## 7. Verificação

- `npx tsc --noEmit` limpo — obrigatório checar à parte, porque o `next.config.mjs` ignora erros de TS e de
  ESLint no build (`ignoreBuildErrors`), então o build **não** é rede de segurança de tipo.
- `npm run build` passa.
- Smoke:
  - `/category/devlog` → subseções na ordem Aloy → Order Pipeline → BrigidAI; **sem** cabeçalho "Aleatórios"
    (nenhum post avulso hoje).
  - `/category/games` e `/category/tech` → grid direto, sem `<h3>` de série (grupo único).
  - Home → seção DevLog com 4 cards + "Ver todos os posts".
  - Os 4 posts novos abrem, com TOC gerada (`buildToc` deriva os `id` dos `<h3>` sozinho) e prev/next
    cronológico atravessando séries.

## Nota de processo

**Este repo não é um repositório git** (`git rev-parse` falha). A convenção do fluxo pede commit da spec;
aqui isso não é possível. A spec fica versionada em disco junto das anteriores em
`docs/superpowers/specs/`.
