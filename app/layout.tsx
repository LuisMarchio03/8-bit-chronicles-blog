import "./globals.css"
import { Press_Start_2P, VT323 } from "next/font/google"
import type React from "react"
import ColorfulPixelLogo from "./components/ColorfulPixelLogo"
import BlinkingCursor from "./components/BlinkingCursor"
import FloatingPixels from "./components/FloatingPixels"
import NavMenu from "./components/NavMenu"
import SoundEffect from "./components/SoundEffect"
import PixelatedBackground from "./components/PixelatedBackground"

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
})

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
})

export const metadata = {
  title: "8-Bit Chronicles",
  description: "Video Games & Tech with a retro pixel aesthetic",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} font-sans bg-black text-purple-400 dark:bg-black dark:text-purple-400`}
      >
        <PixelatedBackground />
        <div className="max-w-4xl mx-auto px-4">
          <header className="py-8 flex flex-col items-center">
            <ColorfulPixelLogo />
            <h1 className="text-4xl font-bold text-center font-pixel mb-2">8-Bit Chronicles</h1>
            <p className="text-xl text-center font-mono flex items-center">
              Games • Tech • DevLog <BlinkingCursor />
            </p>
            <NavMenu />
          </header>
          <main>{children}</main>
          <footer className="py-8 text-center font-mono">© 2025 8-Bit Chronicles. All rights Luís Gabriel Marchió Batista.</footer>
        </div>
        <FloatingPixels />
        <SoundEffect />
      </body>
    </html>
  )
}



import './globals.css'
