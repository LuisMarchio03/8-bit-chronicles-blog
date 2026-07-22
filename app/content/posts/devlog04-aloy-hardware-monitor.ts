import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog04-aloy-hardware-monitor",
  title: "DevLog #04 – Aloy: Monitor de hardware em tempo real (Go + dashboard)",
  category: "DevLog",
  description:
    "DevLog #04 da Aloy. O painel de hardware do front também era fake. Neste post ele vira real: um binário em Go coletando CPU, memória, disco, rede, temperaturas e GPU, um coletor async no Python e um dashboard ao vivo servido pelo próprio backend.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-06-25",
  tags: ["golang", "hardware", "metricas", "dashboard", "websocket"],
  coverImage: "./coverimg-aloy-04.jpg",
  series: "aloy",
  content: `<p>Seguindo a saga de "matar os dados falsos da UI": o painel de sistema da Aloy mostrava gráficos bonitos de CPU e memória… que eram fake. Neste DevLog ele passa a mostrar o que a máquina <strong>realmente</strong> está fazendo, em tempo real.</p>
<hr>
<h3>Go pro trabalho pesado</h3>
<p>Coletar métricas de sistema é exatamente o tipo de coisa que o Go faz melhor que o Python. Então criei um binário novo, o <code>sysmetrics</code>, separado do <code>sysinfo</code> que o kernel já usava — assim eu não corro risco de quebrar a tool <code>system_status</code> que já funcionava.</p>
<p>O <code>sysmetrics</code> coleta bastante coisa:</p>
<ul>
<li>CPU no geral <strong>e por núcleo</strong></li>
<li>Memória, disco e uptime</li>
<li>Rede — com as <strong>taxas calculadas por delta</strong> (bytes agora menos bytes de antes, dividido pelo tempo), que é o jeito certo de mostrar "MB/s" em vez de um contador que só cresce</li>
<li>Temperaturas, GPU (via <code>nvidia-smi</code>, quando existe) e os processos que mais consomem</li>
</ul>
<p>Tudo com <strong>degradação graciosa</strong>: se a máquina não tem sensor de temperatura ou GPU, aquele campo simplesmente some do JSON, sem erro.</p>
<hr>
<h3>O coletor e o canal dedicado</h3>
<p>Do lado do Python tem um <code>MetricsCollector</code>: um loop assíncrono que fica chamando o binário Go de tempos em tempos, calcula as taxas de rede, guarda o último snapshot em cache e é resiliente a falha. Ele transmite as métricas por um canal WebSocket <strong>próprio</strong>, o <code>/ws/metrics</code>, com seu próprio hub — de propósito desacoplado do canal da voz, pra uma coisa não atrapalhar a outra.</p>
<p>Também expus um <code>GET /api/system-info</code> (o contrato que o front consome) e — o mais divertido — um <code>/dashboard</code>: uma página standalone de HTML/CSS/JS puro, <strong>sem CDN</strong>, servida pelo próprio backend. Assim eu tenho uma entrega visível das métricas <em>sem depender</em> do repo do Electron, e que funciona 100% offline. Bem no espírito local-first.</p>
<hr>
<h3>A lição: o loop de background não pode morrer</h3>
<p>De novo a revisão pegou o mesmo tipo de furo — e é por isso que virou um mantra do projeto. O <code>_loop</code> do coletor só sobrevivia a um tipo específico de erro (<code>NativeError</code>). Se o <code>sysmetrics</code> cuspisse um JSON válido mas que não fosse um objeto (um <code>AttributeError</code>, por exemplo), a exceção escaparia e <strong>mataria a task de coleta silenciosamente</strong> — o dashboard simplesmente congelaria, sem ninguém perceber.</p>
<p>Endureci o loop com um <code>except Exception</code> abrangente (tomando o cuidado de deixar o <code>CancelledError</code> passar, pra que o <code>stop()</code> continue funcionando) e adicionei um teste de sobrevivência. O padrão que se repete: <strong>um loop de background nunca pode morrer por causa de um dado estranho.</strong></p>
<hr>
<h3>O que vem a seguir?</h3>
<p>Métricas reais fechadas, com o Go e o Python conversando ponta a ponta e os nomes dos campos batendo do binário até o dashboard. No próximo DevLog a Aloy começa a <strong>agir no mundo lá fora</strong>: integração com o Google Calendar e um bot de Discord pra falar com ela de longe.</p>
<hr>
<p>Me segue pros próximos DevLogs do projeto Aloy:</p>
<p>🌐 <a href="https://luismarchio-portfolio.vercel.app/">https://luismarchio-portfolio.vercel.app/</a></p>
<p>🐱 <a href="https://github.com/LuisMarchio03">https://github.com/LuisMarchio03</a></p>
<p>Ass. LuisMarchio03</p>`,
}
