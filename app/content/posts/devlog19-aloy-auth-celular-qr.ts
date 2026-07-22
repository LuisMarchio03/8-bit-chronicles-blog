import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog19-aloy-auth-celular-qr",
  title: "DevLog #19 – Aloy: Auth do celular via QR + acesso remoto Tailscale",
  category: "DevLog",
  description:
    "DevLog #19 da Aloy. Segurança na LAN: WorkerAuthMiddleware global, pareamento por QR com token único, e acesso remoto via Tailscale no QR. O celular agora autentica antes de falar com o backend.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-18",
  tags: ["auth", "qr-code", "seguranca", "tailscale", "pareamento"],
  coverImage: "./coverimg-aloy-22.jpg",
  series: "aloy",
  content: `<p>A UI já era servida na LAN pro celular, mas sem nenhuma auth — qualquer aparelho na mesma Wi-Fi conseguia bater direto no backend.</p>
<p><strong>Token único compartilhado:</strong> o mesmo worker-token que protegia drivers remotos (#8e-2/FT-1/VPN) passa a valer também pro celular. Zero segredo novo por feature.</p>
<p><strong>Gate global:</strong> <code>WorkerAuthMiddleware</code> ASGI barra qualquer acesso não-loopback (HTTP e WS) já na entrada do app — fail-closed por padrão. Loopback sempre passa; HTTP exige <code>Authorization: Bearer</code>; WS exige <code>?token=</code>.</p>
<p><strong>Auto-geração:</strong> <code>resolve_worker_token</code> — token vindo de env → arquivo persistido (<code>0o600</code>) → auto-gera <code>secrets.token_urlsafe(32)</code>. Never-crash com fallback a token efêmero.</p>
<p><strong>Rota de pairing:</strong> <code>GET /api/pairing</code> devolve o token <strong>só</strong> para loopback (o próprio desktop) — nunca por WS, nunca logada.</p>
<p><strong>Frontend:</strong> <code>apiFetch</code> injeta <code>Authorization: Bearer</code> em toda chamada; <code>wsUrl</code> anexa <code>?token=</code>; <code>captureTokenFromUrl</code> lê <code>?token=</code> no boot e limpa do histórico.</p>
<p><strong>Smoke do gate ✅:</strong> loopback /api/pairing devolve token; LAN /health sem token → 401, com Bearer → 200; LAN /api/pairing sem token → 401.</p>
<hr>
<h3>Acesso remoto via Tailscale no QR</h3>
<p>O QR agora oferece também uma URL do tailnet (<code>http://100.x:3000/?token=</code>) pro celular alcançar o kernel de fora da Wi-Fi. Seletor 'Rede local | Tailscale' no modal.</p>
<p>Frontend only — reusa VPN-2 + auth por QR.</p>`,
}
