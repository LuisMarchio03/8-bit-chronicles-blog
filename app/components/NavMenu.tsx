import Link from "next/link"
import { Gamepad2, Monitor, Terminal } from "lucide-react"
import { CATEGORIES } from "@/lib/categories"
import type { Category } from "@/lib/posts"

const ICONS: Record<Category, typeof Monitor> = {
  Games: Gamepad2,
  Tech: Monitor,
  DevLog: Terminal,
}

const NavMenu = () => {
  return (
    <nav className="flex flex-wrap justify-center gap-3 sm:gap-4 my-6">
      {CATEGORIES.map(({ label, slug }) => {
        const Icon = ICONS[label]
        return (
          <Link
            key={slug}
            href={`/category/${slug}`}
            className="flex flex-col items-center justify-center gap-2 p-2 bg-gray-900 rounded pixelated-border hover:bg-gray-800 transition-colors w-24 h-24 sm:w-32 sm:h-32"
          >
            <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="font-pixel text-[10px] sm:text-xs">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default NavMenu
