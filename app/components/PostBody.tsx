"use client"

import { useEffect, useRef } from "react"
import hljs from "highlight.js/lib/common"
import "highlight.js/styles/atom-one-dark.css"

export default function PostBody({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.querySelectorAll<HTMLElement>("pre code").forEach((el) => {
      el.removeAttribute("data-highlighted")
      try {
        hljs.highlightElement(el)
      } catch {
        /* idioma desconhecido — ignora */
      }
    })
  }, [html])

  return (
    <div
      ref={ref}
      className="font-mono text-xl leading-8 post-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
