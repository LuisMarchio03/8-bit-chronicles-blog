import { format, isValid, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { posts } from "@/app/content/posts"
import { SERIES, UNGROUPED_LABEL } from "@/lib/series"

export type Category = "Games" | "Tech" | "DevLog"

export type SeriesSlug = "aloy" | "pipeline" | "brigid"

export type Post = {
  id: string
  title: string
  category: Category
  description: string
  author: string
  date: string // ISO "YYYY-MM-DD"
  tags: string[]
  coverImage?: string
  series?: SeriesSlug // ausente = post avulso → "Aleatórios"
  content: string // HTML cru
}

// Ordenado por data desc (mais novo primeiro). Fonte única da ordem.
const sorted: Post[] = [...posts].sort((a, b) => b.date.localeCompare(a.date))

export function getAllPosts(): Post[] {
  return sorted
}

export function getPostById(id: string): Post | undefined {
  return sorted.find((p) => p.id === id)
}

export function getPostsByCategory(category: Category): Post[] {
  return sorted.filter((p) => p.category === category)
}

export type SeriesGroup = { label: string; slug: SeriesSlug | null; posts: Post[] }

// Grupos na ordem de SERIES; os posts sem série vêm sempre por último, em "Aleatórios".
// Grupos vazios são omitidos. A ordem dentro de cada grupo é a global (data desc).
export function getSeriesGroups(category: Category): SeriesGroup[] {
  const inCategory = getPostsByCategory(category)

  const groups: SeriesGroup[] = SERIES.map(({ label, slug }) => ({
    label,
    slug,
    posts: inCategory.filter((p) => p.series === slug),
  }))

  groups.push({
    label: UNGROUPED_LABEL,
    slug: null,
    posts: inCategory.filter((p) => !p.series),
  })

  return groups.filter((g) => g.posts.length > 0)
}

export function getAdjacentPosts(id: string): { prev?: Post; next?: Post } {
  const i = sorted.findIndex((p) => p.id === id)
  if (i === -1) return {}
  // prev = vizinho mais novo (acima na lista); next = vizinho mais antigo (abaixo).
  return { prev: sorted[i - 1], next: sorted[i + 1] }
}

export function formatDate(iso: string): string {
  const d = parseISO(iso)
  if (!isValid(d)) return iso // fallback: não quebra a página
  return format(d, "dd 'de' MMM 'de' yyyy", { locale: ptBR })
}
