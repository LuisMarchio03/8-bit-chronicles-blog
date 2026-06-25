import Link from "next/link"
import { Gamepad2, Monitor, Terminal } from "lucide-react"

const ITEMS = [
  { href: "/category/games", label: "Games", Icon: Gamepad2 },
  { href: "/category/tech", label: "Tech", Icon: Monitor },
  { href: "/category/devlog", label: "DevLog", Icon: Terminal },
]

const NavMenu = () => {
  return (
    <nav className="flex flex-wrap justify-center gap-3 sm:gap-4 my-6">
      {ITEMS.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center justify-center gap-2 p-2 bg-gray-900 rounded pixelated-border hover:bg-gray-800 transition-colors w-24 h-24 sm:w-32 sm:h-32"
        >
          <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="font-pixel text-[10px] sm:text-xs">{label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default NavMenu

