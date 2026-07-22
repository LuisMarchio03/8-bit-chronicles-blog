import type { SeriesSlug } from "@/lib/posts"

// A ordem deste array é a ordem de exibição das subseções.
export const SERIES: { label: string; slug: SeriesSlug }[] = [
  { label: "DevLog da Aloy", slug: "aloy" },
  { label: "Order Pipeline", slug: "pipeline" },
  { label: "BrigidAI", slug: "brigid" },
]

export const UNGROUPED_LABEL = "Aleatórios"
