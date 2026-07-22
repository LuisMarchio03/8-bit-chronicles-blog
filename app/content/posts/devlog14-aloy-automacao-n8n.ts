import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog14-aloy-automacao-n8n",
  title: "DevLog #14 – Aloy: Automação N8N bidirecional",
  category: "DevLog",
  description:
    "DevLog #14 da Aloy. A Aloy agora conversa com o N8N nos dois sentidos: dispara workflows por comando de voz/chat e recebe webhooks com deliver ou prompt. Ciclo completo de brainstorming a review final.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-06-30",
  tags: ["n8n", "automacao", "workflows", "webhook", "integracao"],
  coverImage: "./coverimg-aloy-14.jpg",
  series: "aloy",
  content: `<p>Subprojeto <strong>#5</strong> implementado: a Aloy conversa com o N8N nos dois sentidos. Ciclo completo <code>brainstorming → spec → plano → execução por subagentes (TDD) → review final</code>.</p>
<p><strong>Saída (Aloy → N8N):</strong> módulo <code>aloy_brain/n8n/</code> com <code>parse_scenes</code> (mapa cena→URL via <code>ALOY_N8N_SCENES</code>), <code>N8nClient.trigger</code> never-raise, e a tool <code>trigger_n8n_workflow(scene, note)</code> pra disparar por voz ou chat.</p>
<p><strong>Entrada (N8N → Aloy):</strong> router <code>POST /api/n8n/inbound</code> protegido por token (<code>X-Aloy-Token</code>), com dois modos: <code>deliver</code> (empurra texto pronto) ou <code>prompt</code> (roda um turno do agente e empurra a resposta), degradando sem 5xx se o agente falhar.</p>
<p><strong>Push pro desktop:</strong> <code>ConnectionManager.broadcast</code> reusa as conexões WS existentes pra enviar notificações com <code>{"event":"notification","source":"n8n","text":...}</code>.</p>
<p><strong>TDD:</strong> 8 tasks com implementador + revisor por task + revisão final opus. Suíte: <strong>260 → 294 passed, 1 skipped</strong> (+34 testes). Review final: <strong>READY TO MERGE</strong>.</p>`,
}
