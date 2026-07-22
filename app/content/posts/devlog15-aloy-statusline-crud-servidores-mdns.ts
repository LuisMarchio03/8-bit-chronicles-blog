import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog15-aloy-statusline-crud-servidores-mdns",
  title: "DevLog #15 – Aloy: Statusline, CRUD de servidores e descoberta mDNS",
  category: "DevLog",
  description:
    "DevLog #15 da Aloy. Statusline por sessão, CRUD de servidores em runtime pela UI, descoberta automática de servidores na LAN via mDNS, e barra agregada por servidor.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-06",
  tags: ["statusline", "servidores", "mdns", "crud", "descoberta"],
  coverImage: "./coverimg-aloy-18.jpg",
  series: "aloy",
  content: `<h3>#8f / 2d: Statusline por sessão (frontend)</h3>
<p>Uma faixa fina estilo statusline de editor no <code>SessionDetail</code>: <code>plataforma · @servidor · modelo · ● estado · $custo · N arq · «atividade»</code>.</p>
<p><strong>Unidades:</strong> <code>describeActivity</code> pura (+8 testes), <code>SessionStatusline</code> presentacional, integrado no <code>SessionDetail</code>. Frontend only — o backend já entregava todo o sinal.</p>
<hr>
<h3>#8h / 2g: CRUD de servidores em runtime</h3>
<p>Antes os servidores vinham só de config (editar .env + restart). Agora: <strong>adicionar/editar/remover/testar pela UI</strong>, persistindo em SQLite, refletindo sem restart.</p>
<p><strong>Modelo de coexistência (3 origens):</strong> <code>local</code> (builtin) · config (read-only) · db (CRUD). Em colisão de id, o db vence.</p>
<p><strong>Smoke ao vivo:</strong> adicionar 'PC B' → test (offline, never-crash) → deletar → volta ao local. Persistência via <code>SqliteServerStore</code> real.</p>
<hr>
<h3>#8f Parte B — barra agregada por servidor</h3>
<p>Chips compactos no topo da lista de sessões: dot online + nome + <code>Ns · $custo</code>. Some quando não há sessões.</p>
<hr>
<h3>#8e-3 / 2e: Descoberta de servidores via mDNS</h3>
<p>Cada kernel se anuncia via <code>_aloy._tcp</code> e um browser mDNS descobre os outros, injetando-os no <code>ServerRegistry</code> como fonte dinâmica (<code>source='mdns'</code>).</p>
<p><strong>Decisões:</strong> dep <code>zeroconf</code> opcional (extra <code>discovery</code>), gated por <code>ALOY_SESSIONS_MDNS_ENABLED</code> (default false), never-crash.</p>
<p><strong>Smoke ao vivo:</strong> um <code>MdnsService</code> anunciou 'aloy-a' + browser; um 2º serviço 'aloy-b' foi descoberto → URL real, self ignorado. Fluxo anúncio→browser→resolve→registro provado ponta a ponta.</p>
<p><strong>Fix latente:</strong> <code>MdnsService.start()</code> era chamado dentro do <code>lifespan</code> async — zeroconf (sync) bloqueava o event loop. Fix: <code>await asyncio.to_thread(mdns.start)</code>.</p>
<hr>
<h3>Descoberta de servidores opencode via mDNS</h3>
<p>Agora também acha servidores opencode na LAN. O opencode anuncia sob <code>_http._tcp</code> como <code>opencode-&lt;porta&gt;</code>. <strong>Problema:</strong> os endereços anunciados vinham com o IP da bridge do docker ANTES do IP real → <code>_pick_address</code> resolve preferindo IPv4 na mesma /24.</p>`,
}
