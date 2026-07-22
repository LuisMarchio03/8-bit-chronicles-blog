import type { Post } from "@/lib/posts"
import { post as microservices } from "./microservices-scalability-operational-costs-cloud-native"
import { post as clairObscur } from "./clair-obscur-expedition-33-review-sem-spoilers"
import { post as devlogAloy01 } from "./devlog01-aloy-introducao-ao-projeto-aloy"
import { post as devlogAloy02 } from "./devlog02-aloy-kernel-agente-local"
import { post as devlogAloy03 } from "./devlog03-aloy-voz-stt-tts"
import { post as devlogAloy04 } from "./devlog04-aloy-hardware-monitor"
import { post as devlogAloy05 } from "./devlog05-aloy-calendar-discord"
import { post as devlogAloy06 } from "./devlog06-aloy-memoria-longo-prazo"
import { post as devlogAloy07 } from "./devlog07-aloy-sessoes-multi-ia"
import { post as devlogAloy08 } from "./devlog08-aloy-automacao-n8n"
import { post as devlogAloy09 } from "./devlog09-aloy-proatividade-n8n"
import { post as devlogAloy10 } from "./devlog10-aloy-proatividade-agendamento-wake-word"
import { post as devlogAloy11 } from "./devlog11-aloy-smoke-proatividade-verdade-ui-web"
import { post as devlogAloy12 } from "./devlog12-aloy-desktop-redesign-shell"
import { post as devlogAloy13 } from "./devlog13-aloy-reconciliacao-opencode-servidores"
import { post as devlogAloy14 } from "./devlog14-aloy-maestra-sessoes-multi-ia"
import { post as devlogAloy15 } from "./devlog15-aloy-statusline-crud-servidores-mdns"
import { post as devlogAloy16 } from "./devlog16-aloy-transferencia-arquivos"
import { post as devlogAloy17 } from "./devlog17-aloy-vpn-tailscale"
import { post as devlogAloy18 } from "./devlog18-aloy-wireguard"
import { post as devlogAloy19 } from "./devlog19-aloy-auth-celular-qr"
import { post as devlogAloy20 } from "./devlog20-aloy-rede-vpn-acesso-remoto"
import { post as devlogAloy21 } from "./devlog21-aloy-ux-mobile-nav-inferior"
import { post as devlogAloy22 } from "./devlog22-aloy-ux-mobile-tokens-dispositivo"
import { post as devlogAloy23 } from "./devlog23-aloy-tokens-dispositivo-https"
import { post as devlogAloy24 } from "./devlog24-aloy-https-tailscale-download"
import { post as devlogAloy25 } from "./devlog25-aloy-painel-sistema-celular"
import { post as devlogAloy26 } from "./devlog26-aloy-painel-celular-web-apis"
import { post as devlogBrigid01 } from "./devlog01-brigid-voltando-ao-tcc"
import { post as devlog01Pipeline } from "./devlog01-pipeline-observability-jan-2026"
import { post as devlog02Pipeline } from "./devlog02-pipeline-observability-instrumentation"
import { post as devlog03Pipeline } from "./devlog03-pipeline-resilience-patterns"
import { post as devlog04Pipeline } from "./devlog04-pipeline-testing-validation"

export const posts: Post[] = [
  microservices,
  clairObscur,
  // Série DevLog da Aloy — ordem reversa por data (mais recente primeiro)
  devlogAloy26,
  devlogAloy25,
  devlogAloy24,
  devlogAloy23,
  devlogAloy22,
  devlogAloy21,
  devlogAloy20,
  devlogAloy19,
  devlogAloy18,
  devlogAloy17,
  devlogAloy16,
  devlogAloy15,
  devlogAloy14,
  devlogAloy13,
  devlogAloy12,
  devlogAloy11,
  devlogAloy10,
  devlogAloy09,
  devlogAloy08,
  devlogAloy07,
  devlogAloy06,
  devlogAloy05,
  devlogAloy04,
  devlogAloy03,
  devlogAloy02,
  devlogAloy01,
  // Série BrigidAI
  devlogBrigid01,
  devlog01Pipeline,
  devlog02Pipeline,
  devlog03Pipeline,
  devlog04Pipeline,
]
