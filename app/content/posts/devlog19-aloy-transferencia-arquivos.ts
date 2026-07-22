import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog19-aloy-transferencia-arquivos",
  title: "DevLog #19 – Aloy: Transferência de arquivos entre dispositivos",
  category: "DevLog",
  description:
    "DevLog #19 da Aloy. Envio de arquivos entre aloy-brains na LAN/VPN, reaproveitando a infra de sessões remotas. FT-1 (envio), FT-2 (browse/download remoto) e FT-3 (upload resumável em chunks com progresso).",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-10",
  tags: ["arquivos", "transferencia", "inbox", "upload", "chunks"],
  coverImage: "./coverimg-aloy-19.jpg",
  series: "aloy",
  content: `<p>Primeiro item do <strong>Ponto 3</strong> do roadmap (rede). Enviar arquivos entre aloy-brains na LAN/VPN, reaproveitando a infra do #8e-2 (comms aloy↔aloy + token de worker + ServerRegistry).</p>
<p><strong>Modelo:</strong> cada aloy-brain tem um <strong>inbox</strong> (dir). O front do PC-A não fala direto com o PC-B — manda pro próprio aloy local, que <strong>proxia</strong> o upload pro PC-B com o token do servidor.</p>
<h3>FT-1: Transferência de arquivos</h3>
<p><strong>Backend:</strong> <code>FileInbox</code> (save/list/resolve/delete, path-safe, never-crash) + <code>RemoteFilesClient</code> (upload multipart + Bearer) + API REST (<code>POST/GET/DELETE /api/files</code>, <code>POST /api/files/send/{server_id}</code>).</p>
<p><strong>Frontend:</strong> seção 'Arquivos' com escolher dispositivo + arquivo → enviar, lista do recebido com download/excluir.</p>
<p><strong>Smoke ao vivo (2 kernels):</strong> PC-A enviou arquivo → caiu no inbox do PC-B, download devolveu conteúdo exato.</p>
<hr>
<h3>FT-2: Browse/download/delete do inbox remoto</h3>
<p>A UI já enviava arquivos e listava o inbox local — faltava ver, baixar e excluir o inbox de um dispositivo remoto.</p>
<p><strong>Backend:</strong> rotas proxy <code>GET /api/files/remote/{server_id}[/{name}]</code> e <code>DELETE</code>. Never-crash/never-hang: alvo desconhecido→404, não-aloy→400, PC-B down→502 contido.</p>
<p><strong>Frontend:</strong> painel 'Inbox de outro dispositivo' com seletor, lista, Baixar e Excluir.</p>
<hr>
<h3>FT-3: Upload resumável em chunks + progresso</h3>
<p>Protocolo <strong>tus-lite</strong> (sem dep nova): <code>POST /api/files/upload</code> (cria sessão), <code>HEAD</code> (consulta offset), <code>PATCH</code> (append chunk, 409 se offset errado). Resume sobrevive a blip de rede e até restart.</p>
<p><strong>Frontend:</strong> <code>resumableSendToDevice</code> com <code>onProgress</code>, barra de progresso na UI.</p>
<p><strong>Smoke ao vivo:</strong> upload de 10 bytes A→B em chunks de 4, forçando chunk duplicado → 409 → HEAD → retomou → finalizou. Bytes idênticos.</p>`,
}
