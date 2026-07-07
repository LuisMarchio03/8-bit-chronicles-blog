import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog05-aloy-calendar-discord",
  title: "DevLog #05 – Aloy: Calendar + Discord — a Aloy ganha o mundo",
  category: "DevLog",
  description:
    "DevLog #05 da Aloy. Duas capacidades que tiram a Aloy de dentro da máquina: agenda real no Google Calendar (com 6 ferramentas de CRUD e horários livres) e um bot de Discord que a transforma num frontend remoto — pra falar com ela do celular, de qualquer lugar.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-06-26",
  tags: ["google-calendar", "discord", "bot", "oauth", "tool-calling"],
  coverImage: "./coverimg-aloy-05.jpg",
  content: `<p>Até aqui a Aloy vivia dentro da máquina. Neste DevLog ela ganha o mundo em dois sentidos: passa a mexer na minha <strong>agenda real</strong> e vira um <strong>bot de Discord</strong> que eu falo de longe. E, como manda o figurino, as abas CALENDAR e DISCORD do front eram… você já sabe, fake.</p>
<hr>
<h3>Calendário de verdade (Google Calendar)</h3>
<p>Criei o pacote <code>calendar/</code> com uma interface <code>CalendarProvider</code> e uma implementação em cima do Google Calendar. Por quê o Google? Simples: é onde meu calendário real vive e sincroniza com o celular. Aceito conscientemente a troca de privacidade (esses dados ficam na nuvem do Google) — e é justamente por isso que fica atrás de uma <strong>interface trocável</strong>: dá pra migrar pra CalDAV ou algo local depois sem reescrever o resto.</p>
<p>A Aloy ganhou <strong>6 ferramentas</strong>: listar, criar, atualizar, excluir e buscar eventos, mais calcular horários livres (uma função pura <code>compute_free_slots</code>). O modelo recebe datas em ISO, e a conversão de linguagem natural pra ISO ("amanhã às 15h" → timestamp) fica por conta do LLM, que se apoia na tool <code>current_time</code>.</p>
<p>Dois cuidados que valeram muito:</p>
<ul>
<li><strong>Credenciais carregadas de forma preguiçosa:</strong> o provider recebe o caminho do token e só carrega as libs do Google no primeiro uso. Assim, token ausente <strong>não derruba o boot</strong> — a falha só acontece na hora de usar, com um erro acionável.</li>
<li><strong>Um caveat honesto de fuso horário:</strong> a tool <code>current_time</code> é "naive" (sem fuso), e o Google exige data com fuso. No uso ao vivo isso pode fazer uma listagem falhar — mas, fiel ao projeto, isso vira uma observação de erro pro agente, <strong>não um crash</strong>. Ficou anotado como dívida técnica pra normalizar.</li>
</ul>
<hr>
<h3>Discord: a Aloy como frontend remoto</h3>
<p>Aqui a sacada é boa: em vez de o Discord ser mais uma "capacidade" da Aloy, ele é um <strong>frontend remoto</strong>. O bot só faz a ponte — recebe a mensagem e joga no mesmíssimo <code>AgentRuntime</code> do chat. Falo com ela por DM ou @menção, do celular, de qualquer lugar, e é a mesma Aloy com as mesmas ferramentas.</p>
<p>O pacote <code>discord/</code> separa um miolo <strong>puro e testável</strong> (políticas de acesso, limpeza de mensagem, quebra de texto longo) de um adaptador fino em cima do <code>discord.py</code> — mesmo padrão da voz e do calendar. A suíte roda inteira sem instalar o extra do Discord.</p>
<p>Como a Aloy tem ferramentas de calendário e de sistema, a <strong>fronteira de acesso é crítica</strong>. Então usei um <strong>duplo allowlist</strong>: precisa estar na lista de user IDs permitidos <em>e</em> num canal/servidor permitido. Acesso negado = <strong>silêncio total</strong>. E allowlist vazia significa "ninguém" — <em>fail-closed</em> por padrão. Ninguém entra por acidente.</p>
<hr>
<h3>A lição: até o parsing de config pode derrubar o boot</h3>
<p>A revisão pegou um problema real e sorrateiro. O parser dos IDs permitidos fazia <code>int(parte)</code>, e isso rodava <em>logo no import do módulo</em>, no boot. Bastava um <strong>ID não-numérico</strong> na config (um typo bobo no <code>.env</code>) pra estourar um <code>ValueError</code> e <strong>derrubar o backend inteiro na inicialização</strong> — violando na cara a invariante "nada do Discord derruba o servidor".</p>
<p>Corrigi fazendo o parser <strong>ignorar</strong> entradas não-numéricas com um aviso (fail-closed: na dúvida, não libera). É a mesma lição do projeto vista de um ângulo novo: a promessa "nunca quebra" tem que cobrir até o <strong>parsing da configuração no boot</strong>.</p>
<hr>
<h3>O que vem a seguir?</h3>
<p>A Aloy agora sabe minha agenda e me atende de longe. No próximo DevLog vem uma das partes que eu mais queria: <strong>memória de longo prazo</strong> — fazer a Aloy lembrar de fatos sobre mim entre conversas diferentes, e não zerar tudo a cada restart.</p>
<hr>
<p>Me segue pros próximos DevLogs do projeto Aloy:</p>
<p>🌐 <a href="https://luismarchio-portfolio.vercel.app/">https://luismarchio-portfolio.vercel.app/</a></p>
<p>🐱 <a href="https://github.com/LuisMarchio03">https://github.com/LuisMarchio03</a></p>
<p>Ass. LuisMarchio03</p>`,
}
