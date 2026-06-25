import type { TocEntry } from "@/lib/post-utils"

export default function TableOfContents({ toc }: { toc: TocEntry[] }) {
  if (toc.length < 2) return null

  return (
    <nav className="not-prose mb-8 p-4 bg-gray-900 rounded-lg pixelated-border">
      <p className="font-pixel text-xs mb-3 text-purple-300">{"// SUMÁRIO"}</p>
      <ul className="space-y-1.5 font-mono text-lg">
        {toc.map((entry) => (
          <li key={entry.id} className={entry.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${entry.id}`}
              className="text-purple-400 hover:text-purple-200 transition-colors"
            >
              {entry.level === 3 ? "› " : ""}
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
