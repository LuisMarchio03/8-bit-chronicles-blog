import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog13-aloy-sessoes-multi-ia",
  title: "DevLog #13 – Aloy: Sessões multi-IA e orquestrador de sessões",
  category: "DevLog",
  description:
    "DevLog #13 da Aloy. O orquestrador de sessões que dirige Claude, opencode e RemoteWorker. Smoke ao vivo pegou 2 bugs reais + 1 pendência de infra. A Aloy deixa de ser single-IA e vira um hub de agentes.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-06-29",
  tags: ["sessoes", "orquestrador", "claude", "opencode", "multi-ia"],
  coverImage: "./coverimg-aloy-13.jpg",
  series: "aloy",
  content: `<p>Smoke ponta-a-ponta do orquestrador de sessões dirigindo sessões Claude reais via WS <code>/ws/sessions</code>. O smoke (não os 251 testes com fakes) pegou 2 bugs reais + fechou 1 pendência.</p>
<p><strong>Bug A — o <code>task</code> da criação nunca rodava.</strong> <code>manager.create</code> só fazia broadcast de <code>session.created</code>; o driver (<code>session._run</code>) setava IDLE e ficava bloqueado no <code>queue.get()</code>. O front também só faz <code>POST /api/sessions</code>, sem <code>send</code>. Resultado: criar sessão com um task → ela ficava idle pra sempre, o task virava só um rótulo. <strong>Fix:</strong> <code>manager.create</code> agora enfileira <code>spec.task</code> como primeiro turno.</p>
<p><strong>Bug B — <code>tool.use</code>/<code>files.touched</code> nunca eram emitidos.</strong> <code>normalize.py</code> checava <code>block.type == "tool_use"</code>, mas o <code>ToolUseBlock</code> do <code>claude_agent_sdk</code> não tem <code>.type</code>. Toda detecção falhava → os chips de tool e o painel de arquivos do cockpit ficavam vazios no uso real. <strong>Fix:</strong> detectar por <code>type(block).__name__ == "ToolUseBlock"</code>.</p>
<p><strong>Pendência C — websockets permanente.</strong> O <code>pyproject</code> não declarava lib de WebSocket; um <code>uv sync</code> limpo prunava o <code>websockets</code> instalado à mão e quebrava todo <code>/ws/*</code>. <strong>Fix:</strong> <code>websockets>=12</code> nas <code>dependencies</code>.</p>
<p><strong>TDD:</strong> RED (5 testes falhando) → GREEN. Suíte: <strong>258 passed, 1 skipped.</strong> Smoke ao vivo re-rodado contra backend reiniciado: task auto-roda, <code>tool.use</code> e <code>files.touched</code> streamando, <code>interrupt</code>→<code>session.ended</code>, <code>delete</code>→<code>session.removed</code>, custo ~$0.47/turno.</p>`,
}
