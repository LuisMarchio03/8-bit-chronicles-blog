import Link from "next/link"
import { Gamepad2, Monitor, Terminal, Calendar, Clock } from "lucide-react"
import type { Post } from "@/app/data/posts"
import { readingTime } from "@/lib/post-utils"

type CatMeta = { Icon: typeof Monitor; grad: string }

const CATEGORY: Record<string, CatMeta> = {
  Games: { Icon: Gamepad2, grad: "from-fuchsia-700/50 to-purple-950" },
  Tech: { Icon: Monitor, grad: "from-indigo-700/50 to-purple-950" },
  DevLog: { Icon: Terminal, grad: "from-purple-700/50 to-indigo-950" },
}

export default function PostCard({ post }: { post: Post }) {
  const meta = CATEGORY[post.category] ?? CATEGORY.DevLog
  const { Icon } = meta
  const minutes = readingTime(post.content)

  return (
    <Link
      href={`/post/${post.id}`}
      className="group block bg-gray-900 rounded-lg pixelated-border overflow-hidden hover:-translate-y-1 transition-transform duration-200"
    >
      {/* capa procedural por categoria */}
      <div className={`relative h-32 flex items-center justify-center overflow-hidden bg-gradient-to-br ${meta.grad}`}>
        <div className="absolute inset-0 bg-grid-purple-400 bg-grid-8 opacity-20" aria-hidden />
        <Icon className="relative z-10 w-10 h-10 text-purple-200 transition-transform duration-300 group-hover:scale-110" />
        <span className="absolute top-2 right-2 px-2 py-1 bg-purple-600 text-black text-xs font-mono rounded">
          {post.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-base font-pixel leading-snug mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {post.title}
        </h3>
        <p className="font-mono text-lg text-purple-300/80 mb-4 line-clamp-3">
          {post.description}
        </p>
        <div className="flex items-center gap-4 font-mono text-base text-purple-400/70">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {minutes} min
          </span>
        </div>
      </div>
    </Link>
  )
}
