import type { Post } from "@/lib/posts"
import { post as microservices } from "./microservices-scalability-operational-costs-cloud-native"
import { post as clairObscur } from "./clair-obscur-expedition-33-review-sem-spoilers"
import { post as devlogAloy } from "./devlog01-aloy-introducao-ao-projeto-aloy"
import { post as devlogAloy02 } from "./devlog02-aloy-kernel-agente-local"
import { post as devlogAloy03 } from "./devlog03-aloy-voz-stt-tts"
import { post as devlogAloy04 } from "./devlog04-aloy-hardware-monitor"
import { post as devlogAloy05 } from "./devlog05-aloy-calendar-discord"
import { post as devlogAloy06 } from "./devlog06-aloy-memoria-longo-prazo"
import { post as devlogAloy07 } from "./devlog07-aloy-proatividade-n8n"
import { post as devlogAloy08 } from "./devlog08-aloy-sessoes-multi-ia"
import { post as devlogAloy09 } from "./devlog09-aloy-rede-vpn-acesso-remoto"
import { post as devlog01Pipeline } from "./devlog01-pipeline-observability-jan-2026"
import { post as devlog02Pipeline } from "./devlog02-pipeline-observability-instrumentation"
import { post as devlog03Pipeline } from "./devlog03-pipeline-resilience-patterns"
import { post as devlog04Pipeline } from "./devlog04-pipeline-testing-validation"

export const posts: Post[] = [
  microservices,
  clairObscur,
  // Série DevLog da Aloy — ordem reversa por marco (resolve empates de mesma data no sort)
  devlogAloy09,
  devlogAloy08,
  devlogAloy07,
  devlogAloy06,
  devlogAloy05,
  devlogAloy04,
  devlogAloy03,
  devlogAloy02,
  devlogAloy,
  devlog01Pipeline,
  devlog02Pipeline,
  devlog03Pipeline,
  devlog04Pipeline,
]
