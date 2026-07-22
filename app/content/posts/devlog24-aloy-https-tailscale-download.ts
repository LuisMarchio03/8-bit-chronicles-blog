import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog24-aloy-https-tailscale-download",
  title: "DevLog #24 – Aloy: HTTPS via Tailscale + download de arquivo no celular",
  category: "DevLog",
  description:
    "DevLog #24 da Aloy. A Aloy agora roda sob TLS pelo tailnet via 'tailscale serve', em origem única na porta 4443. Destrava PWA e Web Push. E o download de arquivo no celular finalmente funciona com ?token=.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-21",
  tags: ["https", "tailscale", "tls", "pwa", "download", "auth"],
  coverImage: "./coverimg-aloy-24.jpg",
  series: "aloy",
  content: `<p>Fecha o Ponto 4 do roadmap e <strong>destrava PWA → Web Push</strong> (que só funcionam em origem segura). A Aloy passa a ser servida sob <strong>TLS</strong> pelo tailnet via <code>tailscale serve</code>, em <strong>origem única</strong> na porta 4443.</p>
<p><strong>A recon derrubou duas hipóteses minhas:</strong></p>
<ol>
<li>'Precisa de <code>tailscale cert</code> + TLS no uvicorn.' <strong>Falso:</strong> o <code>serve</code> termina TLS com certificado emitido e renovado sozinho.</li>
<li>'O proxy vai abrir o gate: o backend verá 127.0.0.1 e o bypass de loopback deixa o tailnet entrar sem token.' <strong>Falso:</strong> o uvicorn 0.49 roda <code>proxy_headers</code> por padrão — reescreve o cliente com o IP encaminhado e só confia no header vindo de 127.0.0.1. Três ataques reais contra o kernel: XFF forjado → 401.</li>
</ol>
<p><strong>Entregue:</strong></p>
<ul>
<li><code>is_trusted_local(host, xff)</code> — segunda camada de segurança.</li>
<li><code>authorize_token(...)</code> — fonte única da decisão 'este token vale?', usada pelo gate global e pelas deps de rota.</li>
<li><code>ServeClient</code> (never-crash) + <code>GET /api/vpn/tailscale/serve</code>.</li>
<li><code>docs/tailscale/aloy-serve.sh</code> (on/off/status, idempotente).</li>
<li><code>systemd</code>: <code>--proxy-headers --forwarded-allow-ips=127.0.0.1</code> explícitos.</li>
<li>Front: <code>resolveApiBase</code> com bases vazias (URLs relativas) em HTTPS. QR oferece URL HTTPS com fallback.</li>
</ul>
<p><strong>Os 4 bugs que os reviews pegaram:</strong> 3 eram do meu plano. Critical: <code>_normalize_serve</code> pegava o primeiro handler (ordem alfabética do Go → porta errada). Critical: <code>WS_BASE = wss://\${host}</code> sem porta → WebSocket ia pra 443. Critical: <code>is_trusted_local</code> fail-open com XFF vazio. Important: <code>worker_auth_dep</code> comparava só com token mestre → celular levava 401 nas rotas de sessions/files/vpn.</p>
<p><strong>Smoke ✅ ao vivo:</strong> serve com 7 handlers na 4443 e 443/8443 intactos; /health sem token → 401, com token → 200; WS → 101; rotas HTTP com token de dispositivo → 200 (eram 401 antes do fix); /api/devices pelo tailnet → 403; token revogado → 401; POST /commands pelo HTTPS → 200.</p>
<hr>
<h3>Download de arquivo no celular</h3>
<p>O bug: <code>&lt;a download&gt;</code> não anexa header <code>Authorization</code>, e o <code>?token=</code> só era aceito em WebSocket. No celular (não-loopback) chegava sem credencial → 401.</p>
<p><strong>Decisão:</strong> aceitar <code>?token=</code> no GET HTTP também. Motivo: download nativo em streaming (fetch→blob bufferizaria arquivos grandes inteiros em memória no celular).</p>
<p><strong>Backend:</strong> <code>_present</code> no ramo HTTP cai pro <code>?token=</code> da query quando não há header Bearer. <strong>Frontend:</strong> <code>authedUrl(url)</code> anexa <code>?token=</code> escapado.</p>`,

}
