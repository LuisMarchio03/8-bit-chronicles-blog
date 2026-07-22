import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog25-aloy-painel-sistema-celular",
  title: "DevLog #25 – Aloy: O Painel de Sistema do celular",
  category: "DevLog",
  description:
    "DevLog #25 da Aloy. O celular deixa de ser uma janela pro PC e vira um dispositivo com métricas próprias. A restrição: ele é um navegador, não roda o binário Go. E o CRITICAL do review — uma Web API que lança sincronamente e congela a navegação.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-22",
  tags: ["mobile", "web-apis", "metricas", "bateria", "frontend"],
  coverImage: "./coverimg-aloy-12.jpg",
  series: "aloy",
  content: `<p>O pedido foi direto: <em>"meu celular e o desktop deveriam ser máquinas distintas — quero compartilhar arquivos entre eles e ver o monitoramento <strong>do celular</strong>, não do PC"</em>. Até aqui, abrir a aba Sistema no celular mostrava a CPU e a RAM do <em>PC</em>. O celular era só uma janela.</p>
<p>O brainstorming decompôs isso em <strong>duas features independentes</strong>. Esta é a <strong>2 de 2</strong> — o monitoramento. A Feature 1 (inbox por dispositivo) fica pro ciclo dela.</p>
<hr>
<h3>A restrição que desenhou tudo</h3>
<p>Antes de qualquer design, um fato incontornável: o celular é um <strong>navegador</strong> falando com o kernel do PC. Ele <strong>não roda</strong> o binário Go <code>sysmetrics</code> — aquele que eu construí lá no #04 e que me dá CPU por núcleo, temperaturas, disco e top processos.</p>
<p>Então as métricas do celular só podem vir das <strong>Web APIs</strong>: bateria, rede, memória aproximada, núcleos, storage e modelo. E o que <strong>não</strong> dá:</p>
<p><strong>CPU%, temperatura, disco e processos são impossíveis no navegador.</strong> Não por falta de esforço meu — a plataforma simplesmente não expõe. Registro isso com todas as letras porque é o tipo de coisa que, daqui a seis meses, eu ia tentar de novo achando que tinha desistido cedo.</p>
<p>Alvo confirmado: <strong>Android/Chrome</strong>. O iOS expõe quase nada e vai degradar — decisão consciente, não descuido. Daí duas escolhas de design:</p>
<ul>
<li><strong>Exibição só local.</strong> Cada aparelho mostra o seu; <strong>nada trafega ao kernel</strong>. Métrica de celular não vira dado no servidor.</li>
<li><strong>Troca só do card de hardware.</strong> Os cards de assistente (Health/LLM, Discord, Calendar) continuam nos dois — eles falam do serviço, não da máquina.</li>
</ul>
<hr>
<h3>"Quem sou eu?" em uma linha</h3>
<p>A troca precisa de uma resposta pra "este código está rodando no PC ou num dispositivo pareado?". A resposta saiu absurdamente simples:</p>
<p><code>isPairedDevice()</code> = <code>getToken() != null</code>.</p>
<p>Sem token, você chegou por loopback — <strong>você é o PC</strong>. Com token, você foi pareado por QR — <strong>você é um device</strong>. Reusa o primitivo de auth do #11, não inventa identidade nova. E a Feature 1 vai reusar isso de graça.</p>
<p>O <strong>único</strong> toque no backend foi <code>GET /api/devices/me</code>: read-only, never-crash, resolve o token → <code>{id, name}</code> do <strong>próprio</strong> caller. Repare no que ele <em>não</em> tem: <strong>não existe parâmetro <code>id</code></strong>. Não dá pra perguntar o nome de outro dispositivo, porque a rota não aceita a pergunta. É a diferença entre "verifico se você pode" e "não há o que verificar".</p>
<p>Ele também <strong>não</strong> é loopback-guarded — ao contrário das outras rotas de <code>/api/devices</code>. Tem que ser assim: o celular precisa alcançar. O gate global já garante que só chega aqui quem tem token válido.</p>
<hr>
<h3>Todo campo anulável, degradando um a um</h3>
<p>O pacote ficou em helpers puros (<code>formatBattery</code>, <code>describeConnection</code>, <code>formatStorage</code>, <code>parseModel</code>) mais <code>readDeviceMetrics()</code> — um snapshot que <strong>nunca rejeita</strong>, cada fonte no seu try/catch — e <code>subscribeDeviceMetrics()</code>, que assina bateria e rede ao vivo por eventos.</p>
<p>Como cada browser expõe um subconjunto diferente, <strong>todo campo é anulável</strong> e some sozinho quando não existe. Nada de "suporta ou não suporta": degrada campo a campo.</p>
<hr>
<h3>O CRITICAL: uma API que lança <em>sincronamente</em></h3>
<p>O review pegou um crítico real, e ele é bom demais pra não registrar.</p>
<p>Eu tinha envolvido as fontes em try/catch — mas <strong>não todas</strong>. E acontece que <code>navigator.connection</code> e <code>getBattery</code> podem <strong>lançar de forma síncrona</strong> em browsers com proteção anti-fingerprint. Não rejeitar uma promise: <em>lançar</em>, na hora da chamada.</p>
<p>O efeito: <code>readDeviceMetrics</code> <strong>rejeitaria</strong> — violando o contrato "nunca rejeita" do meu próprio plano — e <code>subscribeDeviceMetrics</code> daria <strong>throw síncrono dentro do <code>useEffect</code></strong>. Que é <strong>exatamente a classe do bug de nav-freeze que este projeto já sofreu</strong>: a navegação inteira congela porque um efeito explodiu no meio do render.</p>
<p>O revisor verificou com spikes, não no chute. Fix: as 8 fontes envolvidas (mais hardening de <code>userAgent</code> e <code>screen</code>) e 4 testes de caminho-perigoso, fail-before/pass-after.</p>
<p>A lição, que eu vou repetir pra mim mesmo: <strong>"o navegador vai me dar <code>undefined</code>" é otimismo.</strong> Ele pode explodir na sua cara. Feature detection que assume ausência silenciosa é uma suposição, não uma proteção.</p>
<hr>
<h3>O efeito colateral mais elegante do dia</h3>
<p>Pra fazer a troca, o card "PC SERVER" saiu do <code>system-status.tsx</code> pra um <code>pc-hardware-card.tsx</code> próprio — que passou a ser o dono do <code>useMetrics</code>. Entrou um <code>device-hardware-card.tsx</code> ao lado, e a seção escolhe entre os dois por <code>isPairedDevice()</code>.</p>
<p>A consequência não estava no plano, e é a melhor parte: <strong>no celular o <code>PcHardwareCard</code> nem monta</strong> → <code>useMetrics</code> nunca é chamado → o <strong><code>/ws/metrics</code> do PC nem abre</strong>.</p>
<p>Antes, o celular mantinha um WebSocket aberto recebendo métricas de uma máquina que ele nem estava mostrando. A separação certa de componente matou um stream inútil <strong>de graça</strong> — sem uma linha de código de otimização. É o argumento a favor de mover a busca de dados pra dentro do componente que usa o dado: quando o componente não monta, o custo dele some junto.</p>
<hr>
<h3>O flash que o review final pescou</h3>
<p>O opus final deu READY, mas achou um detalhe user-facing: <code>metrics</code> começa <code>null</code>, então <strong>todo mount piscava "este dispositivo não expõe métricas"</strong> antes dos dados chegarem. Tecnicamente correto, na prática uma mentira de 200ms.</p>
<p>Fix: <code>hasDisplayMetrics()</code> sobre os 6 campos exibidos, e render de <strong>três vias</strong> — <em>carregando</em>, <em>não-suportado</em>, <em>tiles</em>. A diferença entre "não sei ainda" e "sei que não tem" precisa existir no código, senão vaza pra tela.</p>
<p><strong>Testes:</strong> backend <strong>589 passed</strong> (1 falha ambiental de <code>zeroconf</code>, 1 skip), frontend <strong>159 vitest</strong> (27 arquivos), <code>tsc</code> e <code>next build</code> limpos.</p>
<p><strong>Smoke ao vivo:</strong> pendente — depende do aparelho. Abrir no Android/Chrome, ir em Sistema, e ver o card com o <strong>nome do pareamento</strong> no título, bateria variando ao plugar e desplugar, rede, memória, núcleos, storage e modelo. E confirmar que o card do PC <strong>não</strong> aparece.</p>
<p><strong>Follow-on:</strong> visão cruzada (o PC ver o celular), riqueza no iOS, e a <strong>Feature 1</strong> — compartilhamento com inbox por dispositivo, que é o outro metade do pedido original e vai reusar o <code>isPairedDevice()</code> daqui.</p>`,
}
