import "./globals.css"
import type { Metadata } from "next"
import { Press_Start_2P, VT323 } from "next/font/google"
import type React from "react"
import ColorfulPixelLogo from "./components/ColorfulPixelLogo"
import BlinkingCursor from "./components/BlinkingCursor"
import FloatingPixels from "./components/FloatingPixels"
import NavMenu from "./components/NavMenu"
import SoundEffect from "./components/SoundEffect"
import PixelatedBackground from "./components/PixelatedBackground"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — DevLogs, Tech & Games retrô`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} font-sans bg-black text-purple-400 dark:bg-black dark:text-purple-400`}
      >
        <PixelatedBackground />
        <div className="max-w-4xl mx-auto px-4">
          <header className="py-8 flex flex-col items-center">
            <ColorfulPixelLogo />
            <h1 className="text-3xl sm:text-4xl font-bold text-center font-pixel mb-2">8-Bit Chronicles</h1>
            <p className="text-xl text-center font-mono flex items-center">
              Games • Tech • DevLog <BlinkingCursor />
            </p>
            <NavMenu />
          </header>
          <main>{children}</main>
          <footer className="py-8 text-center font-mono text-lg text-purple-400/70">
            © 2026 8-Bit Chronicles — feito por Luís Gabriel Marchió Batista.
          </footer>
        </div>
        <FloatingPixels />
        <SoundEffect />
      </body>
    </html>
  )
}
