import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog07-aloy-proatividade-n8n",
  title: "DevLog #07 – Aloy: Proatividade e automação — lembretes, wake word e n8n",
  category: "DevLog",
  description:
    "DevLog #07 da Aloy. Até aqui ela só agia quando eu chamava. Neste post ela vira proativa: agenda e dispara lembretes sozinha (em 3 canais), acorda com 'Hey Aloy' e conversa nos dois sentidos com o n8n pra disparar e receber automações.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-01",
  tags: ["proatividade", "agendamento", "wake-word", "n8n", "automacao"],
  coverImage: "./coverimg-aloy-07.jpg",
  series: "aloy",
  content: `<p>Toda a Aloy que construí até aqui é <strong>reativa</strong>: ela espera eu falar. Neste DevLog ela ganha iniciativa — passa a me procurar sozinha, a acordar só pela voz, e a conversar com o n8n pra puxar e empurrar automações.</p>
<hr>
<h3>O motor de agendamento</h3>
<p>O coração da proatividade é o pacote <code>schedule/</code>. Ele tem tipos de agendamento <code>once</code> (uma vez), <code>interval</code> (a cada X) e <code>daily</code> (com dias da semana), e — importante — o cálculo do próximo disparo é <strong>tz-aware</strong> (com fuso, via <code>zoneinfo</code>), o que de quebra fecha aquele caveat de fuso que ficou pendente lá no DevLog do calendário.</p>
<p>O detalhe que me deixou orgulhoso é o <code>claim_due</code> do store: ele é <strong>atômico</strong>. Quando um lembrete dispara, na mesma transação ele já reagenda o próximo (pela hora do disparo, sem drift) ou desliga o <code>once</code>. Resultado: <strong>nunca tem disparo duplo</strong>, mesmo com o loop rodando rápido. Cada disparo roda numa task separada, então um turno lento não trava o "ticker".</p>
<hr>
<h3>Alcance proativo em 3 canais</h3>
<p>Quando um lembrete dispara, ele precisa <em>chegar em mim</em>. A mensagem pode ser um texto literal ("beber água") ou, se for contextual, o resultado de rodar um prompt no agente. E ela é entregue por <strong>três canais independentes</strong>, cada um isolado (se um falha, os outros seguem):</p>
<ul>
<li><strong>Desktop</strong> — um evento <code>notification</code> pelo WebSocket, que o front transforma num toast de "Lembrete".</li>
<li><strong>Discord DM</strong> — a Aloy me manda no privado (reusando o bot do DevLog #05).</li>
<li><strong>Voz falada</strong> — o Piper sintetiza e ela fala em voz alta.</li>
</ul>
<p>Do lado do usuário tem as tools <code>schedule_reminder</code>/<code>list_reminders</code>/<code>cancel_reminder</code> e os endpoints REST correspondentes — que, fiéis ao projeto, <strong>nunca dão 5xx</strong>: body inválido vira 422, spec ruim vira um agendamento desligado com aviso no log, mas o servidor não cai.</p>
<hr>
<h3>"Hey Aloy": a wake word</h3>
<p>Pra ela acordar sem eu clicar em nada, criei o <code>WakeWordListener</code>: um loop contínuo que <strong>reaproveita</strong> o gravador com VAD e o Whisper que já tinha da voz — <strong>zero dependência nova</strong>. Ele fica ouvindo, normaliza acento e caixa, e quando detecta a frase "Hey Aloy", dispara um turno de voz normal. É opt-in (desligado por padrão), porque ficar com o mic sempre aberto é uma escolha, não um default.</p>
<hr>
<h3>n8n: automação nos dois sentidos</h3>
<p>Além de agir por conta própria, a Aloy passou a conversar com o <strong>n8n</strong> (a ferramenta de automação self-hosted) nas duas direções:</p>
<ul>
<li><strong>Saída (Aloy → n8n):</strong> uma tool <code>trigger_n8n_workflow</code> dispara workflows por webhook. O caso típico são "cenas" — <code>work</code>, <code>game</code>, <code>study</code> — que eu configuro por URL. A Aloy só faz o POST; o que cada fluxo faz (apagar luz, abrir apps, tocar playlist) eu monto lá no n8n.</li>
<li><strong>Entrada (n8n → Aloy):</strong> um endpoint <code>POST /api/n8n/inbound</code>, protegido por token, onde um fluxo do n8n pode <strong>entregar um texto pronto</strong> ou <strong>rodar um prompt no agente</strong> — e a resposta cai como push no desktop, reusando o mesmo canal WebSocket dos lembretes.</li>
</ul>
<p>Com pouca coisa, a Aloy vira tanto o gatilho quanto o destino das minhas automações.</p>
<hr>
<h3>Bônus: um bug de timeout que fingia ser "Ollama fora"</h3>
<p>Durante os testes, o chat às vezes voltava "não consegui falar com o modelo local" de forma <strong>intermitente</strong> — mas o Ollama estava lá. Investigando com evidência: um turno completava em <strong>58,9s</strong>, outro falhava em <strong>exatos 60,03s</strong>. Ou seja, batia no <code>timeout=60s</code> do cliente.</p>
<p>Por quê tão lento? O <code>llama3.2:3b</code> rodando em 100% CPU (sem GPU), e a Aloy manda as ~14 ferramentas (uns 1.500 tokens) em <em>toda</em> chamada; turnos com tool fazem 2+ chamadas. A soma encostava nos 60s. O fix de raiz foi tornar o timeout configurável e folgado (padrão 180s). O timeout <strong>absorve</strong> a lentidão — não acelera; velocidade real mesmo só com GPU ou modelo menor. Ficou o registro honesto de que a lentidão é ambiente/modelo, não código.</p>
<hr>
<h3>O que vem a seguir?</h3>
<p>A Aloy agora tem iniciativa. No próximo DevLog vem a funcionalidade mais ambiciosa até agora: fazer a Aloy <strong>orquestrar outras IAs</strong> — dirigir agentes de código autônomos (Claude e opencode), inclusive rodando em outro PC.</p>
<hr>
<p>Me segue pros próximos DevLogs do projeto Aloy:</p>
<p>🌐 <a href="https://luismarchio-portfolio.vercel.app/">https://luismarchio-portfolio.vercel.app/</a></p>
<p>🐱 <a href="https://github.com/LuisMarchio03">https://github.com/LuisMarchio03</a></p>
<p>Ass. LuisMarchio03</p>`,
}
