import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog11-aloy-tokens-dispositivo-https",
  title: "DevLog #11 – Aloy: Um token por dispositivo, revogação e HTTPS via Tailscale",
  category: "DevLog",
  description:
    "DevLog #11 da Aloy. Sai o token único compartilhado, entra um por dispositivo — revogável. Depois, TLS via tailscale serve. E a parte desconfortável: a recon derrubou duas hipóteses minhas, e 3 dos 4 bugs que os reviews pegaram eram do meu próprio plano.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-21",
  tags: ["seguranca", "auth", "tailscale", "https", "tokens", "tls"],
  coverImage: "./coverimg-aloy-11.jpg",
  series: "aloy",
  content: `<p>O DevLog #09 deixou a autenticação por QR funcionando: escaneia, o celular ganha um token, o backend para de aceitar qualquer aparelho da Wi-Fi. Funcionava — com uma limitação que eu sabia que ia me morder: era um <strong>token único compartilhado</strong>. Todos os dispositivos usavam o mesmo segredo. Ou seja: <em>perdi o celular → só dá pra trocar o segredo de todos</em>, e reparear tudo.</p>
<p>Este devlog fecha esse buraco e depois bota TLS na frente de tudo. É o dia mais denso desta leva — e o mais desconfortável de escrever, porque a maior parte dos bugs era minha.</p>
<hr>
<h3>Um token por dispositivo</h3>
<p>Entrou o <code>SqliteDeviceStore</code>, com uma tabela <code>devices(id, name, token_sha256 UNIQUE, created_at, last_seen)</code>. As decisões que importam:</p>
<ul>
<li><strong>Guarda o SHA-256, nunca o token cru.</strong> O raw sai <strong>uma vez só</strong>, na criação, e vai direto pro QR. Se o banco vazar, não vaza credencial utilizável.</li>
<li><strong>Set de hashes ativos em memória</strong>, carregado no init e atualizado em create/delete. Assim <code>authorize(presented)</code> é <strong>O(1) e não toca o banco</strong> — ele roda em <em>toda</em> requisição, não dá pra pagar um SELECT por request.</li>
<li><strong><code>last_seen</code> com throttle</strong> (no máximo 1×/min por device, via <code>time.monotonic</code>). Sem isso, "última vez visto" viraria uma escrita por request — um contador de uso disfarçado de write amplification.</li>
</ul>
<p>A gestão (<code>GET/POST/DELETE/PATCH /api/devices</code>) ficou <strong>loopback-only</strong>. A regra é: <strong>o celular <em>usa</em>, não <em>administra</em></strong>. Parear, listar e revogar só do PC. O <code>GET</code> nunca devolve segredo, só metadados.</p>
<p>No front, o <code>web-access.tsx</code> ganhou o painel "Dispositivos pareados" — lista com última vez, revogar, renomear inline — e um "Parear novo" que cria o device e joga o token dele no QR, reusando o seletor LAN/Tailscale que já existia. O endpoint <code>/api/pairing</code> antigo foi removido inteiro (arquivo, teste e wiring).</p>
<hr>
<h3>Never-crash até no caminho do banco</h3>
<p>O review pegou uma falha que eu já deveria conhecer de cor a esta altura: o <code>sqlite3.connect</code> estava <strong>fora</strong> do <code>try</code>. Todo o resto do store era <code>except sqlite3.Error</code> caprichado — mas um <em>path ruim</em> na configuração derrubava o processo antes de qualquer proteção rodar. Fix: fallback pra <code>:memory:</code>.</p>
<p>É a terceira ou quarta vez que essa lição aparece neste projeto: a invariante <strong>"nada derruba o servidor"</strong> tem que cobrir o <strong>boot</strong> e o <strong>parsing de config</strong>, não só o caminho feliz. O caminho feliz nunca foi o problema.</p>
<hr>
<h3>HTTPS: a recon derrubou duas hipóteses minhas</h3>
<p>A segunda metade do dia foi servir a Aloy sob TLS pelo tailnet, com <code>tailscale serve</code> em origem única na porta 4443 — <code>/</code> vai pra UI, e <code>/api</code>, <code>/ws</code>, <code>/commands</code>, <code>/health</code>, <code>/voice</code> e <code>/dashboard</code> vão pro kernel. Isso fecha o Ponto 4 do roadmap e destrava PWA e Web Push, que só existem em origem segura.</p>
<p>Antes de escrever código, fiz uma recon. Ela matou <strong>duas hipóteses minhas</strong>:</p>
<ol>
<li><strong>"Vou precisar de <code>tailscale cert</code> e TLS no uvicorn."</strong> Falso. O <code>serve</code> termina TLS com certificado <strong>emitido e renovado sozinho</strong>. Zero operação de certificado — o <code>curl</code> validou sem <code>-k</code>.</li>
<li><strong>"O proxy vai abrir o gate: o backend vai ver 127.0.0.1 e o bypass de loopback deixa o tailnet entrar sem token."</strong> <strong>Falso — e essa era a premissa central do design.</strong> O uvicorn roda <code>proxy_headers</code> por padrão: ele reescreve o cliente com o IP encaminhado e <strong>só confia nesse header quando ele vem de 127.0.0.1</strong>. Testei três ataques reais contra o kernel: XFF forjado pelo tailnet → <strong>401</strong>; XFF forjado de origem não-loopback → <strong>401</strong>; loopback real → 200.</li>
</ol>
<p>De onde veio o falso positivo que gerou a hipótese errada? Do meu <strong>echo server de teste ser um <code>http.server</code> cru</strong>, que não faz nada disso. Eu tinha validado a premissa contra um stub e concluído coisa sobre o servidor real.</p>
<p>A lição que eu levo: <strong>valide a premissa contra o servidor de verdade, não contra o brinquedo que você subiu pra testar.</strong> Se eu tivesse pulado a recon, teria construído a defesa inteira em cima de um problema que não existia — e provavelmente não teria achado os que existiam.</p>
<hr>
<h3>3 dos 4 bugs eram do meu próprio plano</h3>
<p>Esta é a parte que dói. Os reviews acharam quatro bugs, e <strong>três deles estavam no plano que eu escrevi</strong> — não na execução.</p>
<ul>
<li><strong>CRITICAL — o handler alfabético.</strong> O <code>_normalize_serve</code> pegava <em>"o primeiro"</em> handler do <code>serve</code>. Só que o Go serializa mapas em <strong>ordem alfabética</strong>, e esta máquina já tinha <code>serve</code> na 443 e na 8443 de <em>outros projetos</em>. Como <code>host:443</code> &lt; <code>host:4443</code>, o endpoint reportaria a porta do <strong>projeto errado</strong> e o QR sairia quebrado. Fix: filtrar pela porta exata da Aloy. Depois provei ao vivo: <code>https_port: 4443</code>, com os três handlers no ar.</li>
<li><strong>CRITICAL — o WebSocket na porta errada.</strong> <code>WS_BASE = wss://\${host}</code> usava <code>window.location.hostname</code>, que <strong>não carrega a porta</strong>. Sob <code>https://…:4443</code>, o WebSocket iria pra <strong>443</strong>, que não é proxiada. Resultado: voz, notificações, sessões e métricas quebrados <em>justamente</em> no modo HTTPS que eu estava entregando. Fix: base vazia → URL relativa, e o browser resolve esquema, host <strong>e porta</strong>.</li>
<li><strong>CRITICAL — o fail-open clássico.</strong> <code>is_trusted_local</code> fazia <code>not forwarded_for</code>. Em Python, <code>not ""</code> é <code>True</code> — então um <code>X-Forwarded-For</code> <strong>vazio</strong> era considerado "confiável". A verificação que existia pra fechar a porta a deixava encostada. Fix: <code>forwarded_for is None</code>.</li>
<li><strong>IMPORTANT (pré-existente) — duas cópias da mesma política.</strong> O <code>worker_auth_dep</code> comparava só com o token <strong>mestre</strong>, mas o QR entrega token de <strong>dispositivo</strong>. Efeito: o celular passava no gate global e levava <strong>401</strong> nas rotas HTTP de <code>/api/sessions</code>, <code>/api/files</code> e <code>/api/vpn</code> — o cockpit abria o WebSocket e não listava nada, e a aba Arquivos morria. <strong>Duas das quatro abas da nav mobile</strong> que eu tinha acabado de polir no #10. A raiz: a política de auth existia em <strong>dois lugares</strong> (middleware e dependência de rota) e eles divergiram. Fix: <code>authorize_token</code> como <strong>fonte única</strong> da decisão "este token vale?".</li>
</ul>
<p>Um detalhe que fecha a seção: o systemd passou a declarar <code>--proxy-headers --forwarded-allow-ips=127.0.0.1</code> <strong>explícitos</strong>. A segurança dependia de um <em>default implícito</em> do uvicorn — e default implícito é coisa que muda num upgrade, calado. Se um dia mudar, quero que quebre barulhento, não que abra a porta em silêncio.</p>
<hr>
<h3>O download que não descia no celular</h3>
<p>A revisão final do HTTPS pescou um bug pré-existente: <strong>download de arquivo não funcionava no celular</strong>. A causa é chata e específica: <code>&lt;a download&gt;</code> é navegação de âncora, e navegação de âncora <strong>não anexa o header <code>Authorization</code></strong>. O <code>?token=</code> só era aceito no ramo WebSocket. No desktop passava despercebido (loopback = bypass), no celular era 401 nos dois inboxes.</p>
<p>Havia duas saídas: aceitar <code>?token=</code> no GET, ou baixar via <code>fetch</code> e montar um blob. Escolhi o <code>?token=</code>, por um motivo que só faz sentido <em>dentro deste app</em>: eu construí <strong>upload resumável em chunks</strong> (lá no #09) justamente porque <strong>arquivos aqui podem ser grandes</strong>. Download também pode. E <code>fetch</code>→blob bufferizaria o arquivo <strong>inteiro na RAM do celular</strong> antes de salvar. O <code>?token=</code> preserva o <strong>download nativo em streaming</strong> — vai direto pro disco.</p>
<p>A ressalva honesta, porque ela existe: o token agora aparece na <strong>URL</strong>, e URL entra em log do kernel e no histórico do aparelho. O que me deixa aceitar isso: na LAN ele já trafegava em claro, no tailnet é HTTPS de ponta a ponta, e — graças à primeira metade deste mesmo dia — <strong>tokens de dispositivo são revogáveis um a um</strong>. As duas features se cobrem.</p>
<hr>
<h3>Provado ao vivo</h3>
<p>Nada disso vale como "funciona" sem smoke real. Kernel de verdade, tailnet de verdade:</p>
<ul>
<li><code>serve</code> com 7 handlers na 4443 — e <strong>443/8443 dos outros projetos intactos</strong>.</li>
<li><code>/health</code> sem token → <strong>401</strong>; com token de dispositivo → <strong>200</strong>; com <strong>XFF forjado → 401</strong>.</li>
<li>WebSocket <code>/ws</code> e <code>/ws/sessions</code> → <strong>101</strong>.</li>
<li><code>/api/sessions</code>, <code>/api/files</code>, <code>/api/vpn/*</code> com token de dispositivo → <strong>200</strong> (eram 401 antes do fix da política única).</li>
<li><code>/api/devices</code> pelo tailnet → <strong>403</strong>. O celular usa, não administra.</li>
<li><strong>Token revogado → 401.</strong> E, antes: parear dois dispositivos e <strong>revogar o A → A:401, B:200</strong>. A revogação por-dispositivo funciona de verdade — que era o ponto do dia.</li>
<li>UI e assets pelo HTTPS → 200, e <strong><code>POST /commands</code> pelo HTTPS → 200, com a Aloy respondendo "ok"</strong>. Certificado válido: todo <code>curl</code> rodou sem <code>-k</code>.</li>
</ul>
<p><strong>Testes:</strong> backend <strong>584 passed</strong> (1 falha ambiental de <code>zeroconf</code>, 1 skip de voz), frontend <strong>140 vitest</strong>, <code>tsc</code> e <code>build</code> limpos.</p>
<p><strong>Follow-on:</strong> PWA e Web Push — agora <strong>destravados</strong> pela origem segura; HTTPS na LAN (esta fatia cobriu o tailnet, a LAN segue HTTP puro); e expiração de token.</p>`,
}
