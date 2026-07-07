import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Post } from "@/lib/posts"

export default function PostNav({ prev, next }: { prev?: Post; next?: Post }) {
  return (
    <div className="not-prose mt-10 grid sm:grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={`/post/${prev.id}`}
          className="group flex items-start gap-3 p-4 bg-gray-900 rounded-lg pixelated-border hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mt-1 shrink-0 text-purple-400 group-hover:-translate-x-1 transition-transform" />
          <span>
            <span className="block font-mono text-base text-purple-400/70">Anterior</span>
            <span className="block font-pixel text-xs leading-snug">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={`/post/${next.id}`}
          className="group flex items-start justify-end gap-3 p-4 bg-gray-900 rounded-lg pixelated-border hover:bg-gray-800 transition-colors text-right"
        >
          <span>
            <span className="block font-mono text-base text-purple-400/70">Próximo</span>
            <span className="block font-pixel text-xs leading-snug">{next.title}</span>
          </span>
          <ArrowRight className="w-5 h-5 mt-1 shrink-0 text-purple-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}
