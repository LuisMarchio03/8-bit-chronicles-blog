import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog02-aloy-kernel-agente-local",
  title: "DevLog #02 – Aloy: A grande virada — a Aloy renasce como agente local",
  category: "DevLog",
  description:
    "DevLog #02 da Aloy. Depois de um tempo parada, a Aloy foi reescrita do zero: saiu a sopa de microserviços e o LM Studio, entrou um monorepo modular Python (FastAPI) + Go com um agente local (Ollama) e tool-calling. Conto o porquê do pivô e a nova arquitetura.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-06-25",
  tags: ["ia", "agente", "ollama", "fastapi", "golang", "tool-calling"],
  coverImage: "./coverimg-aloy-02.jpg",
  content: `<p>Fala pessoal! Faz um tempão desde o DevLog #01, né?</p>
<p>A Aloy não morreu — pelo contrário. Ela passou por uma <strong>reescrita completa</strong>. Neste post eu conto por que joguei fora boa parte da arquitetura antiga e o que ela virou: um kernel enxuto, local e modular, com um agente de verdade no centro.</p>
<hr>
<h3>Por que reescrever tudo?</h3>
<p>No #01 a Aloy era uma sopa de tecnologias: NLP com o GEMMA rodando via LM Studio, um scheduler em Node conversando com o Google Calendar, um monitor de hardware em Go, tudo amarrado com microserviços, HTTP, RabbitMQ e um docker-compose gigante pra subir a bagunça toda.</p>
<p>Funcionava? Mais ou menos. Mas pra um projeto <strong>pessoal</strong>, aquilo era peso morto. Cada funcionalidade nova exigia mexer em três serviços, subir fila, cuidar de contrato entre eles. Eu estava pagando o custo de complexidade de uma arquitetura de empresa pra rodar algo que vive numa máquina só: a minha.</p>
<p>Aí bateu a real: <strong>microserviços aqui era resolver um problema que eu não tinha.</strong> Decidi colapsar tudo num monorepo único, com módulos internos que se comunicam por chamada de função — não por rede.</p>
<hr>
<h3>A nova arquitetura: monorepo Python + Go</h3>
<p>A Aloy agora é um único projeto — o <strong>aloy-brain</strong> — dividido em dois idiomas, cada um no que faz de melhor:</p>
<ul>
<li><strong>Python (FastAPI)</strong> pro núcleo e pra IA — é onde vive quase toda a lógica, e o ecossistema de IA em Python é imbatível.</li>
<li><strong>Go</strong> pro baixo nível — coletar métricas de hardware, informações de sistema. A ponte é o <code>NativeClient</code>, que chama binários Go compilados via subprocess e troca JSON.</li>
</ul>
<p>Sem fila, sem docker-compose obrigatório, sem serviços que precisam se achar na rede. Um <code>uvicorn</code> sobe o kernel inteiro na porta 8080 e pronto. O frontend em Electron conversa com ele por HTTP e WebSocket.</p>
<hr>
<h3>O coração: um agente com tool-calling</h3>
<p>A mudança conceitual mais importante: a Aloy deixou de ser um <em>roteador de intenção</em> (aquele esquema de "se a frase contém X, chama a função Y") e virou um <strong>agente de verdade</strong>.</p>
<p>No centro tem o <code>AgentRuntime</code>: ele monta as mensagens (system prompt + histórico da sessão + o turno do usuário), manda pro LLM, e se a resposta pede pra usar uma ferramenta, ele executa a ferramenta e devolve o resultado pro modelo — repetindo isso até o modelo dar a resposta final (com um teto de iterações pra não rodar pra sempre).</p>
<p>As ferramentas vivem num <code>ToolRegistry</code>: eu decoro uma função Python com <code>@tool</code>, o registro lê a assinatura dela e monta sozinho o schema (via pydantic) que é entregue pro modelo. Quer uma capacidade nova? Escreve uma função. <strong>O agente escala só adicionando tools</strong> — não mexendo num roteador central que vira um monstro.</p>
<hr>
<h3>Ollama local: privacidade e alguns perrengues</h3>
<p>A Aloy roda o modelo <strong>localmente via Ollama</strong>. Zero nuvem, zero API key, zero custo por chamada, e os dados não saem da máquina — que é o espírito do projeto desde o começo.</p>
<p>Mas modelo local tem seus dramas. O primeiro achado: <code>qwen2.5:1.5b</code> é <strong>pequeno demais</strong> pra tool-calling confiável — ele alucina a chamada em vez de realmente chamar a ferramenta. Subi pro <code>llama3.2:3b</code> e aí sim ficou de pé. Lição: tool-calling em modelo local é mais frágil que na OpenAI da vida, então o runtime tem <strong>validação de schema, tolerância a erro e teto de iterações</strong> pra segurar as pontas.</p>
<hr>
<h3>A regra de ouro: nunca derrubar o servidor</h3>
<p>Uma invariante que virou lei do projeto: <strong>nada pode derrubar o kernel.</strong> Se uma tool estoura uma exceção, isso não vira um erro 500 — vira uma <em>observação</em> que o próprio agente recebe de volta ("a ferramenta falhou por isso") e segue a conversa. Se o Ollama está fora, o chat responde de forma degradada, mas responde. O servidor sempre fica de pé.</p>
<p>Isso vai ser um tema recorrente nos próximos DevLogs — inclusive porque as revisões de código vão insistir que eu esqueci de proteger algum caminho. 😅</p>
<hr>
<h3>O que vem a seguir?</h3>
<p>Com o kernel de pé, dá pra empilhar capacidade em cima. Os próximos posts vão cobrir cada bloco que plugei nesse agente:</p>
<ul>
<li>Voz de verdade (ouvir e falar, tudo local)</li>
<li>Monitor de hardware em tempo real</li>
<li>Calendário e Discord</li>
<li>Memória de longo prazo</li>
<li>Proatividade, sessões multi-IA e acesso remoto</li>
</ul>
<p>É a Aloy saindo do papel de "chat bonitinho" pra virar uma assistente que realmente faz coisa.</p>
<hr>
<p>Se curtiu, me segue pros próximos DevLogs do projeto Aloy. Links abaixo:</p>
<p>🌐 <a href="https://luismarchio-portfolio.vercel.app/">https://luismarchio-portfolio.vercel.app/</a></p>
<p>🐱 <a href="https://github.com/LuisMarchio03">https://github.com/LuisMarchio03</a></p>
<p>Obrigado por ler até aqui,</p>
<p>Ass. LuisMarchio03</p>`,
}
