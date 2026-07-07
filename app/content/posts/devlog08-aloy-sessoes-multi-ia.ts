import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog08-aloy-sessoes-multi-ia",
  title: "DevLog #08 – Aloy: Maestra — orquestrando sessões multi-IA (Claude + opencode)",
  category: "DevLog",
  description:
    "DevLog #08 da Aloy. A funcionalidade mais ambiciosa até agora: a Aloy vira superfície de controle de agentes de código autônomos — Claude e opencode — com cockpit ao vivo, suporte a múltiplas plataformas e até rodando a IA em outro PC pela rede.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-05",
  tags: ["claude", "opencode", "orquestracao", "agentes", "websocket"],
  coverImage: "./coverimg-aloy-08.jpg",
  content: `<p>Esse é o DevLog da funcionalidade mais ambiciosa do projeto até agora. A Aloy deixa de ser <em>a IA</em> e passa a ser a <strong>maestra</strong>: uma superfície de controle pra dirigir <strong>outras</strong> IAs — agentes de código autônomos que trabalham num diretório por conta própria.</p>
<hr>
<h3>Dois planos de modelo (não confunda)</h3>
<p>Essa parte confunde à primeira vista, então deixo explícito. Existem <strong>dois planos de IA</strong> no projeto agora:</p>
<ul>
<li><strong>A Aloy em si</strong> roda no Ollama local (<code>llama3.2:3b</code>/<code>qwen2.5</code>). Sem internet, sem API key. É a assistente do dia a dia.</li>
<li><strong>As sessões orquestradas</strong> sobem um agente de código de verdade — o <strong>Claude</strong> pela API da Anthropic (via <code>claude-agent-sdk</code>), ou o <strong>opencode</strong>. Aqui a Aloy é só o painel de controle; quem programa é o agente autônomo.</li>
</ul>
<p>Ou seja: eu falo com a Aloy (local) e mando ela colocar um Claude (nuvem) pra trabalhar numa pasta. São mundos separados, de propósito.</p>
<hr>
<h3>O cockpit</h3>
<p>O pacote <code>sessions/</code> expõe a orquestração por um canal <code>/ws/sessions</code>, e o front virou um <strong>cockpit</strong>: eu crio uma sessão com uma tarefa, e acompanho ao vivo o agente trabalhando — o texto transmitido em tempo real, os <strong>chips de ferramenta</strong> (Write, Bash, Read…) que ele usa, e o painel de <strong>arquivos tocados</strong>. Dá pra interromper e apagar a sessão. Uma tarefa dispara automaticamente como o primeiro turno.</p>
<p>O smoke ao vivo — dirigindo sessões Claude reais — pegou <strong>dois bugs que os 251 testes com fakes não pegaram</strong>: a tarefa criada não rodava sozinha (ficava só como rótulo), e os eventos de tool nunca eram emitidos porque o objeto real do SDK não tinha o campo <code>.type</code> que o meu fake tinha. Clássico caso de teste que confirma a própria suposição errada. Corrigidos, com os testes reescritos pro formato real do SDK.</p>
<hr>
<h3>Multiplataforma: a lição da API real</h3>
<p>Depois veio o suporte ao <strong>opencode</strong> como segunda plataforma. E aqui uma das maiores lições do projeto inteiro: eu tinha mapeado as rotas e eventos do opencode <strong>pela documentação</strong>, porque não tinha um servidor no ar. Quando finalmente subi um <code>opencode serve</code> real (versão 1.4.7), o adaptador estava <strong>quebrado ao vivo</strong>. Três bugs reais:</p>
<ul>
<li>O <code>model</code> tinha que ser um objeto <code>{providerID, modelID}</code>, não uma string — string dava HTTP 400 e o turno nunca começava.</li>
<li>O formato do texto transmitido era diferente do que a doc sugeria — eu lia o campo errado e <strong>todo o texto da resposta era descartado</strong> (eu não veria nada).</li>
<li>O opencode roda o turno no diretório que vai no parâmetro da requisição, não no diretório do processo — sem isso, as sessões rodavam na pasta errada.</li>
</ul>
<p>A moral: <strong>validar ao vivo revela o que teste com fake nunca mostra.</strong> Atualizei as fixtures pro formato real capturado do servidor e segui.</p>
<hr>
<h3>Rodando a IA em outro PC</h3>
<p>A cereja: o <strong>RemoteWorker</strong>. Eu queria poder dizer pra Aloy "roda esse Claude no meu outro PC". O insight que viabilizou foi lindo de simples: <strong>o aloy-brain do outro PC já é o daemon</strong> — ele já expõe <code>/api/sessions</code> e <code>/ws/sessions</code>. Então o RemoteWorker é só um <em>cliente</em> HTTP+WS do outro PC, sem protocolo novo. E um servidor aloy roda as duas plataformas — Claude remoto <strong>e</strong> opencode remoto de brinde.</p>
<p>Tecnicamente ele é um proxy: assina o WebSocket do PC remoto, <strong>reescreve o session_id remoto pro id local</strong>, sincroniza o estado e reemite os eventos como se fossem locais. E, fiel ao projeto, nunca trava: boot falho, envio falho, stream caindo → a sessão vai pra <code>FAILED</code>, com reconexão e backoff antes de desistir. Nunca um 500. A autenticação entre os PCs usa um worker-token compartilhado, com bypass pro acesso local.</p>
<p>Validei ao vivo subindo um segundo aloy-brain fazendo de "PC-B" e dirigindo uma sessão de código nele pela rede — os eventos voltaram pelo relay com o id reescrito, texto transmitido e histórico pelo proxy. Funcionou.</p>
<hr>
<h3>O que vem a seguir?</h3>
<p>Se a Aloy comanda IAs em outros PCs, o próximo passo natural é <strong>a rede</strong>: alcançar essas máquinas com segurança de qualquer lugar. No próximo (e último desta leva) DevLog: VPN (Tailscale e WireGuard) e acesso remoto pelo celular via QR code.</p>
<hr>
<p>Me segue pros próximos DevLogs do projeto Aloy:</p>
<p>🌐 <a href="https://luismarchio-portfolio.vercel.app/">https://luismarchio-portfolio.vercel.app/</a></p>
<p>🐱 <a href="https://github.com/LuisMarchio03">https://github.com/LuisMarchio03</a></p>
<p>Ass. LuisMarchio03</p>`,
}
