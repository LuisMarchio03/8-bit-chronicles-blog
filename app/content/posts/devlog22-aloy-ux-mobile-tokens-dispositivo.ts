import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog22-aloy-ux-mobile-tokens-dispositivo",
  title: "DevLog #22 – Aloy: UX Mobile e Tokens por dispositivo",
  category: "DevLog",
  description:
    "DevLog #22 da Aloy. UX mobile polida: nav inferior, safe-area, split de navegação testável. E tokens por-dispositivo com revogação individual — cada aparelho tem seu próprio segredo.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-20",
  tags: ["mobile", "ux", "nav", "tokens", "dispositivos"],
  coverImage: "./coverimg-aloy-23.jpg",
  series: "aloy",
  content: `<h3>UX mobile — polir os fluxos principais</h3>
<p>Fechar a linha 'versão web / celular' pro lado da experiência no aparelho. Só frontend.</p>
<p><strong>Split de nav testável:</strong> <code>PRIMARY_NAV_IDS = [chat, sessions, files, system]</code> + <code>primaryNavItems()</code>/<code>overflowNavItems()</code>. 4 testes.</p>
<p><strong>Barra de navegação inferior:</strong> 4 primárias (ícone + label) + botão '⋯/Mais' que abre o drawer com o resto. Alvo de toque ≥52px, safe-area, ativo destacado. Desktop inalterado.</p>
<p><strong>Safe-area no topbar:</strong> <code>pt-[env(safe-area-inset-top)]</code> no mobile para o header crescer com o notch.</p>
<p><strong>Cockpit de sessões em painel único no mobile:</strong> já estava implementado — alterna lista/transcript com '← Sessões'.</p>
<p><strong>Testes:</strong> vitest <strong>122 passed</strong>.</p>
<hr>
<h3>Tokens por-dispositivo + revogação</h3>
<p>Sai o token único compartilhado, entra <strong>um token por dispositivo pareado</strong>, revogável individualmente. Fecha a limitação 'perdi o celular → só dá pra trocar o segredo de todos'.</p>
<p><strong>Backend:</strong></p>
<ul>
<li><code>SqliteDeviceStore</code>: guarda SHA-256 do token (nunca o raw). Set de hashes ativos em memória → authorize é O(1).</li>
<li><code>WorkerAuthMiddleware</code> refatorado: autoriza com <code>compare_digest(present, mestre)</code> OU <code>store.authorize(present)</code>.</li>
<li><code>GET/POST/DELETE/PATCH /api/devices</code> — loopback-only. <code>POST</code> devolve o token raw uma vez. <code>/api/pairing</code> removido.</li>
</ul>
<p><strong>Frontend:</strong> painel 'Dispositivos pareados' (lista com última vez, revogar, renomear inline) + 'Parear novo' → token no QR.</p>
<p><strong>Smoke ✅ ao vivo:</strong> parear 2 dispositivos → lista sem vazar token → ambos autenticam → revogar A → A:401, B:200.</p>`,
}
