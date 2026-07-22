import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog01-aloy-introducao-ao-projeto-aloy",
  title: "DevLog #01 – Aloy: Introdução ao projeto Aloy",
  category: "DevLog",
  description:
    "DevLog #01 da Aloy – uma assistente pessoal local, privada e modular. Neste post explico por que decidi criar minha própria IA, o que já está funcionando, e como pretendo abrir o projeto como open source futuramente.",
  author: "Luís Gabriel Marchió Batista",
  date: "2025-04-23",
  tags: ["ia", "assistente", "electron", "microservices", "open-source"],
  coverImage: "./coverimg-01.jpg",
  series: "aloy",
  content: `<p>Fala pessoal, tudo certo?</p>
<p>Gostaria de compartilhar com vocês um projeto pessoal que tenho desenvolvido nos últimos meses… e que tem me deixado bem empolgado.</p>
<p>Cerca de dois meses atrás, comecei a pensar em como poderia organizar melhor minha vida, automatizar minhas anotações, rotinas diárias, lembretes, enfim...</p>
<p>Mas aí bateu a pergunta:</p>
<p>&quot;Por que me limitar a automatizar só o básico?&quot;</p>
<p>O que estava me travando não era a tecnologia em si, mas sim as limitações das assistentes virtuais atuais e das ferramentas atuais… tipo a Alexa, o Google Assistant, ferramentas que não se comunicam entre si, etc…</p>
<p>Elas são feitas pra atender todo mundo, de forma genérica. E aí o resultado é sempre o mesmo: uma solução mediana, que serve pra todo mundo… mas NUNCA uma funcionalidade extremamente forte e completa para o meu caso ou para o seu caso.</p>
<p>Comecei a me questionar:</p>
<ul>
<li>Por que eu preciso de 30 ferramentas diferentes de IA pra fazer tarefas simples no meu dia a dia?</li>
<li>Por que essas ferramentas não conversam entre si?</li>
<li>Por que tudo que eu uso hoje é centralizado por empresas terceiras, que impõem limites e travam funcionalidades?</li>
</ul>
<p>Foi aí que eu pensei:</p>
<p>Por que não criar minha própria assistente virtual? Algo feito sob medida, do meu jeito. Local, modular, privada, customizada para as minhas necessidades.</p>
<p>Assim nasceu a ideia da Aloy (obs: sim, o nome é inspirado na franquia da sony: Horizon ksksks)</p>
<hr>
<h3 id="o-que-a-aloy-afinal-">O que é a Aloy, afinal?</h3>
<p>A Aloy é uma assistente pessoal inteligente, construída para rodar localmente, ela roda no seu desktop sem depender da clouds services. A proposta dela é ser:</p>
<ul>
<li>Privada, onde seus dados são gerenciados apenas por você</li>
<li>Modular, você escolhe quais blocos quer rodar naquele momento e tem a liberdade total de adicionar novos módulos conforme surgir a necessidade, seja por conta de um trabalho novo ou de um projeto novo… você sempre pode remover ou adicionar módulos</li>
<li>Extensível, você pode criar seus próprios comandos e personalizar com as suas palavras e jeitos… afinal a LLM roda na sua maquina local, você pode treina-la da forma que preferir. O banco de dados é seu, você desenvolve o cérebro do seu modelo de IA</li>
<li>Visual, com uma interface bonita e futurista. As cores predominantes são roxo, azul e preto — pra dar aquele ar de tecnologia, futuro… e porque roxo é a melhor cor que tem.</li>
<li>E principalmente, útil de verdade, sem enrolação</li>
</ul>
<p>Ela entende comandos em linguagem natural, e já começa a transformar essas frases em ações dentro do seu próprio sistema operacional ou apenas em uma conversa amigável adaptando sempre o contexto para melhor atender você nas suas necessidades. </p>
<hr>
<h3 id="um-projeto-pessoal-n-o-um-produto">Um projeto pessoal, não um produto</h3>
<p>Importante dizer: a Aloy não é um projeto comercial.</p>
<p>Ela não foi feita pra ser vendida como &quot;a solução perfeita pra todo mundo”</p>
<p>Ela nasceu pra mim, pras minhas necessidades, pro meu estilo de vida.</p>
<p>O que eu queria era:</p>
<ul>
<li>Algo 100% meu</li>
<li>Que eu pudesse editar, adaptar, reescrever se quisesse</li>
<li>Que não dependesse de nenhum provedor cloud (AWS, Google, Azure...)</li>
<li>Que rodasse local, com meus dados, sob meu controle</li>
</ul>
<p>E a visão de futuro é clara:</p>
<p>Transformar a Aloy em um projeto open source, pra que qualquer pessoa possa fazer o mesmo — editar, adicionar funcionalidades, e criar uma versão da Aloy que seja perfeita pra sua realidade.</p>
<p>Porque cada um tem suas próprias limitações e seus próprios desafios no dia a dia. E nenhuma solução genérica vai resolver isso melhor do que algo feito sob medida por você mesmo.
Esse DevLog é escrito de Dev (e um toque de IA para agilizar a vida ksks) para Dev </p>
<p>A Aloy é simplesmente:</p>
<p>Liberdade, autonomia e controle.</p>
<hr>
<h3 id="o-que-j-t-funcionando-at-agora-">O que já tá funcionando até agora?</h3>
<p>Apesar de estar nos estágios iniciais, já tenho alguns serviços da Aloy rodando</p>
<ul>
<li>Uma interface desktop em Electron + React + Tailwind + Shadcn/ui</li>
<li>Um monitor de recursos do hardware em Go, que acompanha CPU, RAM, Armazenamento e etc..</li>
<li>Um serviço de processamento de linguagem natural, usando uma LLM local (GEMMA) via LM Studio, escrito em Python com FastAPI</li>
<li>A primeira funcionalidade real: o Aloy-Scheduler, pra criar alarmes e agendamentos simples… Esse serviços está escrito em Node e se conecta diretamente com o Google Calendar (nesse caso dependendo sim de uma alternativa externa para comunicação com entre vários dispositivos. Provavelmente como uma solução temporária)</li>
</ul>
<p>No  quesito arquitetura utilizo microservices, para comunicação HTTP e RabbitMQ e por fim, para iniciar todo o projeto ALOY, eu encapsulo containers docker dentro de um docker-compose (onde eu tbm ligo serviços externos como o RabbitMQ e o Localstack para rodar localmente).</p>
<hr>
<h3 id="por-que-isso-importa-">Por que isso importa?</h3>
<p>Porque eu não quero mais depender de ferramentas limitadas. Quero poder dizer:</p>
<blockquote>
<p>“Aloy, me acorde às 7h da amanhã”</p>
</blockquote>
<p>E ela fazer isso, do meu jeito, com minhas ferramentas, do jeito que eu configurei.</p>
<p>Sem pagar mensalidade.</p>
<p>Sem abrir mão da minha privacidade.</p>
<hr>
<h3 id="o-que-vem-a-seguir-">O que vem a seguir?</h3>
<p>Os próximos passos do projeto basicamente é implementar a parte de conversação por áudio: </p>
<ul>
<li>Expandir o NLP pra entender mais tipos de frases</li>
<li>Criar serviços para converter áudios em texto</li>
<li>Criar serviços para converter texto em áudios</li>
</ul>
<hr>
<h3 id="-curtiu-a-proposta-">💬 Curtiu a proposta?</h3>
<p>Bem, é isso, se você curtiu essa proposta me segue ai para ver os próximos DevLogs do projeto Aloy, em breve eu vou abrir o projeto para algo full open source, atualmente o único repositório publico é o frontend em Electron e React</p>
<p>Vou deixar o GitHub e algumas redes sociais aqui em baixo: </p>
<p>🌐 <a href="https://luismarchio-portfolio.vercel.app/">https://luismarchio-portfolio.vercel.app/</a></p>
<p>📸 <a href="https://www.instagram.com/luis_marchio/">https://www.instagram.com/luis_marchio/</a></p>
<p>💼 <a href="https://www.linkedin.com/in/lu%C3%ADs-gabriel-marchi%C3%B3-batista-4a8b58287/">https://www.linkedin.com/in/luís-gabriel-marchió-batista-4a8b58287/</a></p>
<p>🐱 <a href="https://github.com/LuisMarchio03">https://github.com/LuisMarchio03</a></p>
<p>Estou sempre aberto a criticas construtivas, ideias ou apenas trocar conhecimento mesmo…</p>
<p>Obrigado por ler até aqui,</p>
<p>Ass. LuisMarchio03f</p>`,
}
