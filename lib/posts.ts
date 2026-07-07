import { format, isValid, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { posts } from "@/app/content/posts"

export type Category = "Games" | "Tech" | "DevLog"

export type Post = {
  id: string
  title: string
  category: Category
  description: string
  author: string
  date: string // ISO "YYYY-MM-DD"
  tags: string[]
  coverImage?: string
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
