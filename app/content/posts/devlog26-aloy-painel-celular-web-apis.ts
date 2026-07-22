import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog26-aloy-painel-celular-web-apis",
  title: "DevLog #26 – Aloy: Painel de Sistema do celular",
  category: "DevLog",
  description:
    "DevLog #26 da Aloy. O celular deixa de ser uma janela pro PC e vira um dispositivo com métricas próprias. Web APIs de bateria, rede, memória e storage. E o CRITICAL: uma Web API que lança sincronamente e congela a navegação.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-22",
  tags: ["mobile", "web-apis", "metricas", "bateria", "navegador"],
  coverImage: "./coverimg-aloy-25.jpg",
  series: "aloy",
  content: `<p>O pedido foi direto: 'meu celular e o desktop deveriam ser máquinas distintas — quero compartilhar arquivos entre eles e ver o monitoramento <strong>do celular</strong>, não do PC'. Este é o devlog da Feature 2 de 2 — o monitoramento.</p>
<p><strong>A restrição que desenhou tudo:</strong> o celular é um navegador falando com o kernel do PC. Ele <strong>não roda</strong> o binário Go <code>sysmetrics</code>. Então as métricas do celular só podem vir das <strong>Web APIs</strong>: bateria, rede, memória aproximada, núcleos, storage e modelo. CPU%, temperatura, disco e processos são impossíveis no navegador.</p>
<p>Alvo confirmado: <strong>Android/Chrome</strong>. O iOS expõe quase nada e vai degradar — decisão consciente.</p>
<p><strong>Decisões de design:</strong></p>
<ul>
<li><strong>Exibição só local.</strong> Cada aparelho mostra o seu; nada trafega ao kernel.</li>
<li><strong>Troca só do card de hardware.</strong> Os cards de assistente continuam nos dois.</li>
</ul>
<p><strong>'Quem sou eu?' em uma linha:</strong> <code>isPairedDevice()</code> = <code>getToken() != null</code>. Sem token = loopback = PC. Com token = device pareado.</p>
<p><strong>Único toque no backend:</strong> <code>GET /api/devices/me</code> — read-only, never-crash, resolve o token → <code>{id, name}</code> do próprio caller. Não aceita parâmetro <code>id</code> — não dá pra perguntar o nome de outro dispositivo.</p>
<p><strong>Todo campo anulável, degradando um a um:</strong> helpers puros + <code>readDeviceMetrics()</code> (snapshot que nunca rejeita, cada fonte no seu try/catch) + <code>subscribeDeviceMetrics()</code> (bateria e rede ao vivo por eventos).</p>
<p><strong>O CRITICAL: uma API que lança sincronamente.</strong> <code>navigator.connection</code> e <code>getBattery</code> podem lançar de forma síncrona em browsers com proteção anti-fingerprint. O efeito: <code>readDeviceMetrics</code> rejeitaria e <code>subscribeDeviceMetrics</code> daria throw síncrono dentro do <code>useEffect</code> — exatamente a classe do bug de <strong>nav-freeze</strong> que este projeto já sofreu. Fix: todas as 8 fontes envolvidas + 4 testes de caminho-perigoso.</p>
<p><strong>Efeito colateral elegante:</strong> o card 'PC SERVER' virou <code>pc-hardware-card.tsx</code> (dono do <code>useMetrics</code>). No celular o <code>PcHardwareCard</code> nem monta → <code>useMetrics</code> nunca é chamado → o <code>/ws/metrics</code> do PC nem abre. A separação certa de componente matou um stream inútil de graça.</p>
<p><strong>O flash que o review final pescou:</strong> <code>metrics</code> começa <code>null</code>, então todo mount piscava 'este dispositivo não expõe métricas' antes dos dados chegarem. Fix: <code>hasDisplayMetrics()</code> + render de três vias — <em>carregando</em>, <em>não-suportado</em>, <em>tiles</em>.</p>
<p><strong>Testes:</strong> backend <strong>589 passed</strong>, frontend <strong>159 vitest</strong>, tsc e next build limpos.</p>`,
}
