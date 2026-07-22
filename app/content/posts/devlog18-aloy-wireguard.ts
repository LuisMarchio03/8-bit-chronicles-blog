import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog18-aloy-wireguard",
  title: "DevLog #18 – Aloy: WireGuard (leitura + up/down)",
  category: "DevLog",
  description:
    "DevLog #18 da Aloy. Módulo WireGuard para a Aloy: leitura de status, subir/descer túneis, parser seguro de 'wg show all dump' com omissão de chaves privadas. Estratégia de sudo via sudoers NOPASSWD específico.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-17",
  tags: ["wireguard", "vpn", "sudo", "rede", "tunel"],
  coverImage: "./coverimg-aloy-21.jpg",
  series: "aloy",
  content: `<p>Destrava o item que ficou bloqueado em decisão: <strong>VPN-1 WireGuard</strong>.</p>
<p><strong>Decisões (brainstorm):</strong></p>
<ul>
<li><strong>Estratégia de sudo:</strong> <code>sudoers</code> NOPASSWD específico para os binários exatos <code>wg</code>/<code>wg-quick</code>. Kernel monta comandos com prefixo <code>sudo</code> configurável (<code>ALOY_VPN_WIREGUARD_SUDO</code>).</li>
<li><strong>DRY com Tailscale:</strong> <code>vpn/wireguard.py</code> importa <code>_default_runner</code> de <code>vpn/tailscale.py</code> — mesmo padrão de shell-out.</li>
<li><strong>Opt-in independente:</strong> <code>ALOY_VPN_WIREGUARD_ENABLED</code> (default false) — gates separados.</li>
</ul>
<p><strong>Entregue:</strong></p>
<ul>
<li><code>WireGuardClient</code>: <code>status()</code> roda <code>wg show all dump</code>, <code>up(name)</code>/<code>down(name)</code> via <code>wg-quick</code>.</li>
<li><code>normalize_dump</code>: parser tab-separated que <strong>omite a private-key e preshared-key</strong> — nunca entram no dict/API/tool/log/front.</li>
<li><code>_valid_name</code>: allowlist <code>^[A-Za-z0-9_.-]{1,32}$</code> — anti-injeção, comandos sempre em lista de args.</li>
<li>Tool <code>wireguard_status</code> (só leitura — mesma convenção do Tailscale).</li>
<li>Painel WireGuard na UI ao lado do Tailscale.</li>
</ul>
<p><strong>Testes:</strong> backend <strong>507 passed</strong>. Frontend <strong>vitest 100 passed</strong>.</p>
<p><strong>Smoke ao vivo: ⏳ PENDENTE</strong> — precisa da senha de sudo do usuário para aplicar o sudoers e criar túnel de teste descartável.</p>`,
}
