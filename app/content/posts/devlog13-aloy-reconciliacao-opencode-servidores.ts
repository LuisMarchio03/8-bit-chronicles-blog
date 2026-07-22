import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog13-aloy-reconciliacao-opencode-servidores",
  title: "DevLog #13 – Aloy: Reconciliação ao vivo do opencode + servidores remotos",
  category: "DevLog",
  description:
    "DevLog #13 da Aloy. A API real do opencode era diferente da doc — 3 bugs corrigidos. Depois: servidores remotos (8e-1/8e-2) permitem rodar sessões em outros PCs da LAN. Tudo validado ao vivo.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-03",
  tags: ["opencode", "reconciliacao", "servidores", "remoto", "api"],
  coverImage: "./coverimg-aloy-17.jpg",
  series: "aloy",
  content: `<p>Fechei o <strong>Step 7</strong> do #8d: a reconciliação do adapter contra um <code>opencode serve</code> real. A API real era diferente do que a doc assumia — o adapter estava quebrado ao vivo.</p>
<p><strong>3 bugs reais achados e corrigidos:</strong></p>
<ol>
<li><code>send_message</code>: <code>model</code> tem que ser objeto <code>{providerID, modelID}</code> — string dá HTTP 400. Fix: helper <code>_model_object</code>.</li>
<li><code>normalize</code> <code>message.part.delta</code>: shape real é <code>{field:"text", delta}</code>, não <code>{part:{text}}</code> — todo texto transmitido era descartado.</li>
<li><code>directory</code>/cwd: o opencode roda o turno no <code>?directory=</code> da requisição, não no cwd do processo. Fix: <code>directory</code> no construtor do client.</li>
</ol>
<p><strong>Validação:</strong> Suíte: <strong>107 passed</strong> (sessões). Ao vivo: 3/3 runs do client Python real contra <code>opencode serve</code> — texto transmitido, turno completado, cwd correto.</p>
<hr>
<h3>#8e-1: Servidores + opencode remoto</h3>
<p>Eixo novo <code>server</code> (ortogonal a <code>platform</code>) — permite N servidores opencode (incl. outros PCs da LAN) escolhidos na criação da sessão.</p>
<p><strong>Backend:</strong> <code>ServerRegistry</code> com <code>probe_health</code>, <code>server</code> em <code>SessionSpec</code>/<code>SessionState</code>, API <code>GET /api/sessions/servers</code>. <strong>Frontend:</strong> seletor 'Servidor' no dialog de criação, badge <code>@servidor</code> no card.</p>
<p><strong>Smoke ao vivo:</strong> 2 servidores opencode reais (local + remoto simulado) — probe health, factory resolvendo server, turno real transmitindo.</p>
<hr>
<h3>#8e-2: RemoteWorker (Claude/sessões em outro PC)</h3>
<p>O aloy-brain do PC-B já é o daemon — expõe <code>/api/sessions</code> + <code>/ws/sessions</code>. O <code>RemoteWorker</code> no PC-A é só um cliente HTTP+WS do PC-B.</p>
<p><strong>Smoke ao vivo (kernel remoto REAL):</strong> subi um 2º aloy-brain em :8090 + opencode serve e dirigi pelo RemoteWorker real. Eventos voltaram pelo relay com session_id reescrito, texto transmitido, turn completed.</p>`,
}
