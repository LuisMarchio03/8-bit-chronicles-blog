"use client"

import type React from "react"
import { useState } from "react"
import { Twitter, Linkedin, MessageCircle, Link2, Check } from "lucide-react"

interface SocialShareProps {
  url: string
  title: string
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false)

  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)

  const links = [
    { label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, Icon: Twitter },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: Linkedin },
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, Icon: MessageCircle },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard indisponível */
    }
  }

  return (
    <div className="not-prose mt-10">
      <p className="font-pixel text-xs mb-3 text-purple-300">{"// COMPARTILHAR"}</p>
      <div className="flex flex-wrap gap-3">
        {links.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Compartilhar no ${label}`}
            className="pixelated-border p-2 bg-gray-900 hover:bg-gray-800 transition-colors"
          >
            <Icon className="w-6 h-6" />
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label="Copiar link"
          className="pixelated-border p-2 bg-gray-900 hover:bg-gray-800 transition-colors"
        >
          {copied ? <Check className="w-6 h-6 text-green-400" /> : <Link2 className="w-6 h-6" />}
        </button>
      </div>
    </div>
  )
}

export default SocialShare
