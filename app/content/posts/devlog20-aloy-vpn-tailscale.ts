import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog20-aloy-vpn-tailscale",
  title: "DevLog #20 – Aloy: VPN Tailscale (CLI + API + exit-node)",
  category: "DevLog",
  description:
    "DevLog #20 da Aloy. Integração com Tailscale: CLI local (status/up/down), REST API do tailnet (lista de dispositivos), e controle de exit-node. Tudo pela UI, com confirmação para ações consequentes.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-14",
  tags: ["vpn", "tailscale", "rede", "exit-node", "tailnet"],
  coverImage: "./coverimg-aloy-20.jpg",
  series: "aloy",
  content: `<h3>VPN-2 Parte A: CLI local (Tailscale)</h3>
<p>Tailscale já estava de pé na máquina. Módulo novo <code>vpn/</code>:</p>
<p><strong>Backend:</strong> <code>TailscaleClient(bin, runner)</code> com <code>status</code>/<code>up</code>/<code>down</code>. <code>runner</code> injetável, <code>_default_runner</code> never-crash. API <code>GET /api/vpn/tailscale/status</code>, <code>POST up</code>, <code>POST down</code> — todas com <code>worker_auth_dep</code> + <code>asyncio.to_thread</code>.</p>
<p><strong>Frontend:</strong> seção 'VPN' com estado (backend/tailnet), este dispositivo (online, IPs), lista de peers, Conectar / Desconectar com confirmação inline.</p>
<p><strong>Smoke ao vivo (só leitura):</strong> <code>TailscaleClient</code> real → Running, self online (<code>100.64.0.10</code>), 2 peers detectados.</p>
<hr>
<h3>VPN-2 Parte B: REST API do tailnet</h3>
<p>Usuário forneceu API key (<code>tskey-api-...</code>), destravando listar todos os dispositivos do tailnet.</p>
<p><strong>Segredo:</strong> a API key ficou só no <code>.env</code> (gitignored) como <code>ALOY_VPN_TAILSCALE_API_KEY</code> — nunca em código, doc ou memória.</p>
<p><strong>Backend:</strong> <code>TailnetApiClient</code> com <code>normalize_device</code> (whitelist de campos — chaves sensíveis omitidas). Never-crash: sem key → <code>{available:false}</code>.</p>
<p><strong>Smoke ao vivo:</strong> 3 dispositivos reais listados (cachyos online+update, nobara offline, S24 online), nenhuma chave sensível vazou.</p>
<hr>
<h3>VPN-2 follow-on: exit-node do Tailscale</h3>
<p>Escolher/desativar um exit-node do tailnet direto pela UI. Ativar sempre com <code>--exit-node-allow-lan-access=true</code> (não derruba acesso aos outros dispositivos na LAN local). Confirmação inline.</p>
<p><strong>Backend:</strong> <code>set_exit_node(node)</code> / <code>clear_exit_node()</code> via <code>tailscale set</code>. Never-crash.</p>
<p><strong>Ressalva:</strong> nenhum peer do tailnet anuncia exit-node hoje, então ativação bem-sucedida não foi smoke-testada — validei o wiring da rota, o caminho de erro contido e o clear.</p>`,
}
