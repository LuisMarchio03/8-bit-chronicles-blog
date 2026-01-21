import Link from "next/link"
import { Gamepad2, Monitor, Terminal } from "lucide-react"

const NavMenu = () => {
  return (
    <nav className="flex justify-center space-x-4 my-4">
      <Link
        href="/category/games"
        className="flex flex-col items-center justify-center p-2 bg-gray-900 rounded pixelated-border hover:bg-gray-800 transition-colors w-32 h-32"
      >
        <Gamepad2 className="w-8 h-8 mb-2" />
        <span className="font-pixel text-xs">Games</span>
      </Link>
      <Link
        href="/category/tech"
        className="flex flex-col items-center justify-center p-2 bg-gray-900 rounded pixelated-border hover:bg-gray-800 transition-colors w-32 h-32"
      >
        <Monitor className="w-8 h-8 mb-2" />
        <span className="font-pixel text-xs">Tech</span>
      </Link>
      <Link
        href="/category/devlog"
        className="flex flex-col items-center justify-center p-2 bg-gray-900 rounded pixelated-border hover:bg-gray-800 transition-colors w-32 h-32"
      >
        <Terminal className="w-8 h-8 mb-2" />
        <span className="font-pixel text-xs">DevLog</span>
      </Link>
    </nav>
  )
}

export default NavMenu

