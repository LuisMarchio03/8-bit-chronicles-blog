import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog03-aloy-voz-stt-tts",
  title: "DevLog #03 – Aloy: Dando voz à Aloy — STT, TTS e VAD 100% locais",
  category: "DevLog",
  description:
    "DevLog #03 da Aloy. A 'voz' do front era 100% fake. Neste post a Aloy ganha ouvido e boca de verdade: gravação com detecção de voz (VAD), transcrição com faster-whisper e fala com Piper — tudo rodando local, sem áudio saindo da máquina.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-06-25",
  tags: ["voz", "stt", "tts", "whisper", "piper", "local-first"],
  coverImage: "./coverimg-aloy-03.jpg",
  series: "aloy",
  content: `<p>No frontend em Electron, a Aloy já "falava" — mas era teatro. A animação de voz era 100% simulada; não tinha nada de áudio real por trás. Hora de resolver isso.</p>
<p>Neste DevLog a Aloy ganha <strong>ouvido e boca de verdade</strong>, e — fiel ao projeto — tudo local: nenhum byte de áudio trafega pela rede.</p>
<hr>
<h3>Quem manda no áudio é o backend</h3>
<p>Primeira decisão importante: o <strong>dono do microfone e do alto-falante é o kernel</strong> (o aloy-brain), não o front. Isso é local-first no osso — o áudio é capturado, transcrito, processado e falado tudo dentro da mesma máquina. O front vira só uma tela que reage a eventos de estado.</p>
<p>Nasceu o pacote <code>voice/</code>, e como toda parte pesada do projeto, ele é um <em>extra opcional</em>: quem não quer voz não precisa instalar as dependências dela. A suíte de testes roda sem PortAudio, sem Whisper e sem Piper — usando fakes e carregamento preguiçoso (lazy import).</p>
<hr>
<h3>O pipeline de voz</h3>
<p>Um turno de voz completo passa por quatro etapas:</p>
<ul>
<li><strong>Captura com VAD</strong> — um <code>VadRecorder</code> faz push-to-talk com detecção de atividade de voz (<code>webrtcvad</code>): ele grava e sabe a hora de parar sozinho quando você cala a boca (endpointing por silêncio). Escolhi o webrtcvad em vez do Silero justamente pra <strong>não arrastar o torch</strong> pra dentro do projeto.</li>
<li><strong>STT (fala → texto)</strong> com <code>faster-whisper</code> — leve, bom em português e local.</li>
<li><strong>O agente</strong> — o texto transcrito entra no mesmo <code>AgentRuntime</code> do chat. A voz não é um cérebro paralelo: ela reusa exatamente o mesmo agente e as mesmas ferramentas.</li>
<li><strong>TTS (texto → fala)</strong> com <code>Piper</code>, que sintetiza a resposta e toca no alto-falante.</li>
</ul>
<p>Isso tudo é orquestrado por um <code>VoiceSession</code> assíncrono. As partes bloqueantes (gravar, transcrever, sintetizar, tocar) rodam em <code>asyncio.to_thread</code> pra não travar o event loop, e o front acompanha o estado (ouvindo, pensando, falando) por eventos que o backend transmite pelo WebSocket.</p>
<hr>
<h3>A lição que doeu: "nunca quebra" é pra valer</h3>
<p>Na revisão final do código, o revisor pegou um problema <strong>Critical</strong> de verdade. A chamada do agente dentro do <code>run_turn</code> era a única etapa <em>não</em> protegida. Se o Ollama respondesse, por exemplo, um 200 com corpo que não fosse JSON, aquilo estourava uma exceção inesperada → erro 500 → e o front travava eternamente em "pensando".</p>
<p>Corrigi cercando a etapa com try/except: qualquer falha volta pro estado IDLE com uma resposta degradada, e tem teste garantindo isso. A lição ficou marcada: a promessa de <strong>"a Aloy nunca quebra" precisa cobrir TODAS as etapas</strong>, não só as que eu previ que poderiam falhar.</p>
<hr>
<h3>Os perrengues de fazer áudio funcionar de verdade</h3>
<p>Testes verdes com fakes é uma coisa; áudio real na máquina é outra. Uns dias depois, ao ligar a voz pra valer, apareceu uma sequência de armadilhas bem reais:</p>
<ul>
<li>Um <code>uv sync</code> puxou o <strong>setuptools 82</strong>, que removeu o <code>pkg_resources</code> — e o <code>webrtcvad</code> ainda depende dele. Resultado: <code>ModuleNotFoundError</code> na hora de gravar. Fixei prendendo <code>setuptools&lt;81</code> no extra de voz, pra durar.</li>
<li>O TTS não saía: eu chamava a API do <strong>Piper 1.2</strong>, mas a versão instalada era a <strong>1.4.2</strong>, onde o método mudou de comportamento e deixava o WAV sem formato (<code>wave.Error: # channels not specified</code>). Troquei pra <code>synthesize_wav()</code> e a fala voltou.</li>
</ul>
<p>São aqueles bugs que <strong>nenhum teste com fake pega</strong> — só aparecem quando você bota o hardware e as versões reais pra rodar. Vira e mexe isso vai ser o assunto dos DevLogs.</p>
<hr>
<h3>O que vem a seguir?</h3>
<p>O pipeline de voz está de pé (captura → STT → agente → fala). Falta o teste definitivo com fala real no mic, e mais pra frente ligar a wake word ("Hey Aloy") — mas isso é assunto do DevLog de proatividade. No próximo, a gente sai do áudio e vai pro <strong>monitor de hardware em tempo real</strong>.</p>
<hr>
<p>Me segue pros próximos DevLogs do projeto Aloy:</p>
<p>🌐 <a href="https://luismarchio-portfolio.vercel.app/">https://luismarchio-portfolio.vercel.app/</a></p>
<p>🐱 <a href="https://github.com/LuisMarchio03">https://github.com/LuisMarchio03</a></p>
<p>Ass. LuisMarchio03</p>`,
}
