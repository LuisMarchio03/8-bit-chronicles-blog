import type { Post } from "@/lib/posts"

export const post: Post = {
  id: "devlog15-aloy-proatividade",
  title: "DevLog #15 – Aloy: Proatividade, agendamento e wake word",
  category: "DevLog",
  description:
    "DevLog #15 da Aloy. A Aloy aprende a tomar iniciativa: agendamento tz-aware, disparo em 3 canais (desktop, Discord, voz), wake word 'Hey Aloy', e os fixes de timeout de chat e captura de áudio.",
  author: "Luís Gabriel Marchió Batista",
  date: "2026-07-01",
  tags: ["proatividade", "agendamento", "wake-word", "voz", "stt-tts"],
  coverImage: "./coverimg-aloy-15.jpg",
  series: "aloy",
  content: `<p>Primeira fatia do roadmap <strong>#7 Proatividade</strong>. Esta fatia (#7a) entrega agendamento + alcance proativo + wake word; multi-device sync (#7b) ficou pra depois.</p>
<p><strong>Agendamento (motor):</strong> pacote <code>aloy_brain/schedule/</code> — <code>Schedule</code> com tipos <code>once</code>/<code>interval</code>/<code>daily</code>+dias-da-semana, tz-aware via <code>zoneinfo</code>, <code>SqliteScheduleStore</code> com <code>claim_due</code> atômico (sem disparo duplo), <code>Scheduler</code> com loop de polling no <code>lifespan</code>.</p>
<p><strong>Alcance proativo:</strong> <code>ScheduleDispatcher</code> entrega em 3 canais independentes: <strong>desktop</strong> (WS notification), <strong>Discord DM</strong> (<code>send_dm</code> never-raise), <strong>voz falada</strong> (Piper→SoundDevice).</p>
<p><strong>Wake word 'Hey Aloy':</strong> <code>WakeWordListener</code> reusa <code>VadRecorder</code>+<code>FasterWhisperStt</code> (zero dep nova). Opt-in por <code>ALOY_WAKEWORD_ENABLED</code>, never-crash com backoff.</p>
<p><strong>TDD:</strong> 10 tasks. Suíte: <strong>294 → 344 passed</strong>. Review final: Ready-to-merge WITH FIXES.</p>
<hr>
<p><strong>Fix: chat intermitente ('Ollama fora')</strong> — timeout de 60s colado na latência do modelo em CPU. <strong>Fix:</strong> <code>ollama_timeout_seconds</code> configurável (default 180s).</p>
<p><strong>Fix: captura de áudio falhava</strong> — <code>setuptools 82</code> removeu <code>pkg_resources</code> que o <code>webrtcvad</code> usava. <strong>Fix:</strong> pin <code>setuptools<81</code> no extra <code>voice</code>. E <code>PiperTts.synthesize</code> API quebrada na 1.4.2 → <code>synthesize_wav</code>.</p>`,
}
