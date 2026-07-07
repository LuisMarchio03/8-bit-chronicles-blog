# Status da execução — Reorganização de Posts

> Última atualização: 2026-06-26 · ✅ **CONCLUÍDO** — todas as 7 tarefas implementadas e verificadas (tsc no baseline + `npm run build` OK + smoke automatizado sobre o HTML estático gerado).

## Documentos de referência
- **Spec/design:** `docs/superpowers/specs/2026-06-26-posts-organizacao-design.md`
- **Plano (7 tarefas):** `docs/superpowers/plans/2026-06-26-posts-organizacao.md`
- **Ledger de progresso:** `…/scratchpad/sdd/progress.md` (no diretório de scratchpad da sessão; é efêmero)
- **Briefs/reports por tarefa:** `…/scratchpad/sdd/task-N-brief.md` e `task-N-report.md`

## Como está sendo executado
- Método: **subagent-driven** (1 implementador por tarefa) — mas **SEM git** (escolha do usuário).
  - Logo: **nenhum commit**; os passos "Commit" do plano são no-op.
  - Revisão de cada tarefa = controlador lê os arquivos / faz diff byte-a-byte via Python (não há diff git).

## ⚠️ Aprendizados críticos (valem para as próximas tarefas)
1. **Baseline do `tsc`:** o projeto JÁ tem **exatamente 2 erros pré-existentes** em
   `components/ui/calendar.tsx` (API antiga do react-day-picker, componente shadcn não usado).
   → O gate de qualquer tarefa é: `npx tsc --noEmit` sem **nenhum erro novo além desses 2**.
2. **A ferramenta Write corrompe aspas curvas Unicode** (U+201C/U+201D “ ”) ao gravar HTML.
   → Para criar/editar arquivos com **conteúdo HTML de post**, escrever via **Python com UTF-8 explícito**
   (`open(path,"w",encoding="utf-8").write(...)`), nunca o Write puro. (Arquivos só de código TS/TSX
   podem usar o editor normal.)
3. `node_modules` precisou de `npm install` (feito na Task 1).
4. `isolatedModules: true` → imports só-de-tipo usam `import type`.

## Progresso

### ✅ Task 1 — Esqueleto (COMPLETA, verificada)
- Criados: `lib/posts.ts` (tipos `Post`/`Category` + `getAllPosts`/`getPostById`/`getPostsByCategory`/`getAdjacentPosts`/`formatDate`), `lib/categories.ts` (`CATEGORIES`), `app/content/posts/index.ts`.
- tsc limpo (fora do baseline). Arquivos batem com o plano.

### ✅ Task 2 — Migrar 2 posts sem cleanup (COMPLETA, verificada)
- `app/content/posts/microservices-...ts` (Tech) e `clair-obscur-...ts` (Games).
- Conteúdo **byte-idêntico** à fonte (confirmado por diff Python do controlador). Clair Obscur date = `2026-01-01`.
- index com 2 posts.

### ✅ Task 3 — devlog-aloy + devlog01-pipeline (COMPLETA, verificada)
- Bloco redundante (h2 título + 📅 Data + ✍️ Autor + `<hr>`) removido; cauda intacta (`source.endswith(new)=True`).
- index com 4 posts.

### ✅ Task 4 — devlog02/03/04 (COMPLETA, verificada)
- Mesmo cleanup, byte-verificado. `app/content/posts/index.ts` agora registra **os 7 posts** na ordem:
  microservices, clairObscur, devlogAloy, devlog01Pipeline, devlog02Pipeline, devlog03Pipeline, devlog04Pipeline.
- `grep "📅 Data:"` em `app/content/posts/` → nada. tsc no baseline.
- **A migração de dados (Tasks 1–4) está 100% concluída e verificada.**

### ✅ Task 5 — Reapontar componentes (COMPLETA, verificada)
- `PostCard.tsx`: importa `type Post` + `formatDate` de `@/lib/posts`; data renderiza via `{formatDate(post.date)}`.
- `PostNav.tsx`: import do tipo trocado para `@/lib/posts`.
- `NavMenu.tsx`: itens derivados de `CATEGORIES` (+ mapa `ICONS` por label).
- Nota: aplicar só a Task 5 deixou `tsc` com 4 erros transitórios nas páginas (ainda usavam o `Post` antigo sem `author`/`tags`) — resolvidos pela Task 6.

### ✅ Task 6 — Reapontar páginas (COMPLETA, verificada)
- `app/page.tsx`, `app/category/[slug]/page.tsx`, `app/post/[id]/page.tsx` reescritas para usar a camada de queries (`getPostsByCategory`/`getPostById`/`getAdjacentPosts`/`getAllPosts`/`formatDate`) e `CATEGORIES`.
- Cabeçalho do post agora mostra `formatDate(date)`, `por {author}` e badges de `tags`.
- `tsc` voltou ao baseline (só os 2 erros do `calendar.tsx`). `npm run build` OK: 14 páginas estáticas (`/`, `/_not-found`, 3 categorias, 7 posts).

### ✅ Task 7 — Remover legado + verificação final (COMPLETA, verificada)
- `grep -rn "data/posts" app components lib` → vazio. `app/data/posts.ts` removido; pasta `app/data/` (vazia) removida também.
- `tsc` no baseline + `npm run build` OK.
- Smoke automatizado sobre o HTML estático gerado (`.next/server/app/...`):
  - `/post/devlog01-pipeline-...`: header com "06 de jan de 2026", "por Luís Gabriel Marchió Batista" e `#serverless`; corpo com **0** ocorrências de `📅 Data:`/`✍️ Autor:`.
  - `/category/devlog`: 5 posts na ordem 04→03→02→01-pipeline→aloy (mais novo→antigo).
  - `/`: seções Games/Tech/DevLog presentes; datas em pt-BR ("27 de mar de 2025").

## Resultado
Refatoração de posts **100% concluída**. Único passo não-executado é o `npm run dev` interativo no navegador (substituído por smoke automatizado sobre o build estático). Sem git por escolha do usuário → nenhum commit foi feito.
