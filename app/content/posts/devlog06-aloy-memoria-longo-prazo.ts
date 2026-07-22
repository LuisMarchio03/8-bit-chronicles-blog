import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog06-aloy-memoria-longo-prazo",
  title: "DevLog #06 – Aloy: Memória de longo prazo — a Aloy passa a me conhecer",
  category: "DevLog",
  description:
    "DevLog #06 da Aloy. Até aqui a memória era só RAM: sumia no restart e cada sessão era uma ilha. Neste post a Aloy ganha memória que atravessa conversas — fatos sobre mim, guardados em SQLite com embeddings locais e recuperados por similaridade, sem nenhuma dependência nova.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-06-26",
  tags: ["memoria", "embeddings", "sqlite", "rag", "ollama"],
  coverImage: "./coverimg-aloy-06.jpg",
  series: "aloy",
  content: `<p>Essa é a parte que faz a Aloy deixar de ser "um chat esperto" e começar a ser <strong>uma assistente que me conhece</strong>.</p>
<p>Até este ponto, a memória dela era só RAM: um histórico de sessão que <strong>sumia no restart</strong>, e cada sessão era uma ilha isolada. Se eu dissesse "prefiro reunião de manhã" numa conversa, na seguinte ela não fazia ideia. Neste DevLog isso muda.</p>
<hr>
<h3>Dois tipos de memória</h3>
<p>O pacote <code>memory/</code> passou a guardar duas coisas:</p>
<ul>
<li><strong>Conversa persistida por sessão</strong> — o histórico agora vive em SQLite (<code>aloy_memory.db</code>), então sobrevive a reinício.</li>
<li><strong>Fatos globais sobre mim</strong> — coisas como "meu cachorro é o Rex" ou "prefiro reunião de manhã", guardadas com um vetor (embedding) pra poderem ser recuperadas por significado em <em>qualquer</em> conversa futura.</li>
</ul>
<p>É o segundo tipo que faz a mágica de "ela me conhece".</p>
<hr>
<h3>Local-first radical: zero dependência nova</h3>
<p>Eu podia ter puxado um banco vetorial, numpy, sqlite-vec… e escolhi <strong>não puxar nada</strong>. A memória inteira roda com o que já tinha:</p>
<ul>
<li><strong>Embeddings via Ollama</strong> (<code>nomic-embed-text</code>) — o Ollama já é o backend, então nenhuma dependência nova.</li>
<li><strong>SQLite da biblioteca padrão</strong> pra guardar os fatos e os vetores.</li>
<li><strong>Similaridade de cosseno em Python puro</strong>, na força bruta. Pra uso pessoal escala de sobra — não preciso de índice vetorial pra buscar entre alguns milhares de fatos.</li>
</ul>
<p>Deu pra fazer RAG de gente grande sem arrastar meio ecossistema pra dentro do projeto.</p>
<hr>
<h3>Como ela lembra (e recupera)</h3>
<p>A captura de fatos é <strong>híbrida</strong>: tem uma tool <code>remember_fact</code> (quando eu peço explicitamente "lembra disso"), e tem um <code>FactExtractor</code> que, em segundo plano depois de cada turno, garimpa fatos novos da conversa usando o próprio LLM. Antes de gravar, tem deduplicação por similaridade, pra não encher o banco com dez versões da mesma coisa.</p>
<p>A recuperação é o pulo do gato: em vez de depender de a Aloy "lembrar de chamar uma tool de busca", os fatos mais relevantes pro turno atual são <strong>injetados automaticamente</strong> (top-K) como uma segunda mensagem de sistema, antes do turno. O modelo simplesmente já <em>sabe</em> o que precisa, sem ter que pedir.</p>
<p>Uma decisão de arquitetura sutil mas importante: os embeddings e o <code>FactMemory</code> são <strong>síncronos</strong>, porque o registro de tools chama as funções sem <code>await</code>. No runtime assíncrono, o recall e a extração usam <code>asyncio.to_thread</code>. Resultado: <strong>zero mudança no kernel</strong> — a memória plugou sem mexer no coração do agente. E se o <code>nomic-embed-text</code> não estiver instalado? O chat funciona normal, só o recall fica inativo. Degradação graciosa, como sempre.</p>
<hr>
<h3>A lição: o furo estava ANTES do try</h3>
<p>E a revisão achou de novo um buraco de "nunca quebra" — pela terceira vez no projeto (depois da voz e do monitor). Desta vez num lugar traiçoeiro: o caminho que roda <strong>antes</strong> do <code>try</code> principal do runtime.</p>
<p>O <code>try</code> do runtime só capturava o erro do LLM. Só que carregar o histórico e fazer o recall rodam <em>antes</em> desse try. Dois vazamentos: ler uma linha corrompida do banco fazia um <code>json.loads</code> estourar, e uma resposta de embedding malformada (um 200 com corpo estranho) também. Qualquer um dos dois virava um 500.</p>
<p>Fechei na fonte: desserialização protegida linha a linha no store, um erro próprio pra qualquer falha do provider de embedding, e os <code>except</code> ampliados (com cuidado, cercando só o necessário). A lição, agora consolidada: a garantia "nunca quebra" tem que cobrir até as etapas que rodam <strong>fora</strong> do try que você achou que era o principal.</p>
<hr>
<h3>O que vem a seguir?</h3>
<p>A Aloy agora responde, ouve, fala, vê o hardware, mexe na agenda e me conhece. Mas ela ainda é <strong>reativa</strong> — só age quando eu chamo. No próximo DevLog isso muda: <strong>proatividade</strong> (lembretes que ela dispara sozinha, wake word "Hey Aloy") e automação com n8n.</p>
<hr>
<p>Me segue pros próximos DevLogs do projeto Aloy:</p>
<p>🌐 <a href="https://luismarchio-portfolio.vercel.app/">https://luismarchio-portfolio.vercel.app/</a></p>
<p>🐱 <a href="https://github.com/LuisMarchio03">https://github.com/LuisMarchio03</a></p>
<p>Ass. LuisMarchio03</p>`,
}
