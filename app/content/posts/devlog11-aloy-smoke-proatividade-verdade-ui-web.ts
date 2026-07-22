import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog11-aloy-smoke-proatividade-verdade-ui-web",
  title: "DevLog #11 – Aloy: Smoke da Proatividade + Verdade na UI + Versão Web",
  category: "DevLog",
  description:
    "DevLog #11 da Aloy. Primeiro smoke ao vivo de qualquer subprojeto (Proatividade, canal desktop = PASS). Depois: 'Verdade na UI' (nenhum pixel mente) e versão web + QR para acesso no celular.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-02",
  tags: ["smoke-test", "frontend", "ux", "web", "qr-code"],
  coverImage: "./coverimg-aloy-16.jpg",
  series: "aloy",
  content: `<h3>Smoke ao vivo #7a Proatividade (canal desktop) — PASS</h3>
<p>Primeiro smoke ao vivo de qualquer subprojeto. Escopo: agendamento → push proativo no desktop, de ponta a ponta contra o backend real.</p>
<p><strong>Resultados (todos verdes):</strong></p>
<ul>
<li><strong>interval</strong> (every_seconds:5): disparou 2× com ~5s de intervalo e reagendou atomaticamente.</li>
<li><strong>once</strong> (fire_at = now+8s): disparou 1× e auto-desligou.</li>
<li><strong>Push WS pro desktop:</strong> os 3 disparos chegaram no envelope exato <code>{"event":"notification","source":"schedule","text":...}</code>.</li>
<li><strong>Never-5xx:</strong> body sem kind → 422; spec ruim → 200 <code>enabled:false</code>.</li>
</ul>
<p>✅ <strong>Canal desktop aprovado ao vivo.</strong></p>
<hr>
<h3>Verdade na UI (Fatia A do alinhamento Front×Back)</h3>
<p>Objetivo: nenhum pixel da UI mostra dado falso. <strong>Ligado ao real:</strong> barra API Status com chips honestos (LLM/Google/Discord), rodapé do chat com dots de status reais, card LLM com modelo + ollama up/down. <strong>Removido (mock puro):</strong> painéis Integrations e Config, abas AI Models e Prompts, linhas Notion/WhatsApp.</p>
<hr>
<h3>Fatia B: versão web + QR (acesso no celular)</h3>
<p>Front: <code>resolveBackendHost</code> deriva API_BASE do <code>window.location.hostname</code> — do celular, bate no IP do PC. Modal com QR code + URL + 'abrir no navegador'. O backend só precisou de 1 flag: <code>ALOY_SERVER_HOST=0.0.0.0</code>.</p>
<p><strong>Smoke headless:</strong> backend em 0.0.0.0 confirmado, front carregado pelo IP da LAN simulando celular → health OK, chip LLM verde, QR gerado com URL correta.</p>`,
}
