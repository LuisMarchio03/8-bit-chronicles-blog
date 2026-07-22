import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog12-aloy-desktop-redesign-shell",
  title: "DevLog #12 – Aloy: Redesign do shell do desktop",
  category: "DevLog",
  description:
    "DevLog #12 da Aloy. Shell full-bleed sem bordas, sidebar colapsável com drawer off-canvas no mobile, navegação por seções extraídas, e código caindo de 1188 para 7 linhas no page.tsx.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-02",
  tags: ["desktop", "redesign", "shell", "sidebar", "frontend"],
  coverImage: "./coverimg-aloy-26.jpg",
  series: "aloy",
  content: `<p>Primeira fatia do redesign geral do desktop, direção híbrida (mantém a alma dark/HUD/roxo, repensa a estrutura).</p>
<p><strong>Causa raiz do 'janela pequena / bordas pretas':</strong> Electron criava a janela 800×600 fixa sem maximizar, e o container era um card <code>max-w-4xl mx-auto my-8 h-[85vh]</code> (fundo preto em volta).</p>
<p><strong>Novo (TDD):</strong> <code>lib/nav.ts</code> (fonte única de 7 seções) + <code>lib/sidebar-state.ts</code> (reducer puro) + <code>hooks/use-sidebar.ts</code>. +6 testes → suíte front 44 → 50 passed.</p>
<p><strong>Estrutura nova:</strong></p>
<ul>
<li><code>main.js</code> maximiza a janela.</li>
<li><code>html/body</code> altura cheia.</li>
<li><code>app-shell.tsx</code> (frame <code>flex h-screen w-screen</code>, <code>activeSection</code>) compõe <code>sidebar.tsx</code> (colapsável rail↔expandida, drawer off-canvas no mobile) + <code>topbar.tsx</code> (título + ApiStatus).</li>
<li><code>page.tsx</code> de 705 → <strong>7 linhas</strong> (<code>&lt;AppShell/&gt;</code>).</li>
<li>Seções extraídas: <code>app/sections/{chat,discord,calendar}.tsx</code>.</li>
</ul>
<p><strong>Preserva 100% a 'Verdade na UI':</strong> ApiStatus honesto, seções reais funcionais, zero mock reintroduzido.</p>
<p><strong>SDD sem-git:</strong> 10 tasks (impl+revisor cada, extração incremental mantendo o app rodável, review final opus). Revisão final: <strong>READY TO MERGE</strong>.</p>`,
}
