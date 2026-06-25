export type TocEntry = { id: string; text: string; level: 2 | 3 }

/** Remove tags HTML e normaliza espaços. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Tempo de leitura em minutos (~200 palavras/min). */
export function readingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

/**
 * Injeta `id` nos headings h2/h3 (respeitando ids já existentes) e retorna
 * o HTML transformado + a lista para o sumário (TOC).
 */
export function buildToc(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = []
  const used = new Set<string>()

  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, lvl: string, attrs: string, inner: string) => {
      const level = Number(lvl) as 2 | 3
      const text = stripHtml(inner)
      if (!text) return match

      const idMatch = attrs.match(/id=["']([^"']+)["']/i)
      let base = idMatch ? idMatch[1] : slugify(text)
      if (!base) return match

      let id = base
      let i = 2
      while (used.has(id)) id = `${base}-${i++}`
      used.add(id)

      toc.push({ id, text, level })

      if (idMatch) {
        const newAttrs = attrs.replace(/id=["'][^"']*["']/i, `id="${id}"`)
        return `<h${lvl}${newAttrs}>${inner}</h${lvl}>`
      }
      return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`
    },
  )

  return { html: out, toc }
}
