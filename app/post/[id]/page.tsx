import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import { posts } from "@/app/data/posts"
import { SITE_URL, SITE_NAME } from "@/lib/site"
import { buildToc, readingTime } from "@/lib/post-utils"
import PostBody from "@/app/components/PostBody"
import TableOfContents from "@/app/components/TableOfContents"
import PostNav from "@/app/components/PostNav"
import SocialShare from "@/app/components/SocialShare"

export function generateStaticParams() {
  return posts.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = posts.find((p) => p.id === id)
  if (!post) return { title: "Post não encontrado" }

  const url = `${SITE_URL}/post/${post.id}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const index = posts.findIndex((p) => p.id === id)
  const post = posts[index]

  if (!post) {
    notFound()
  }

  const { html, toc } = buildToc(post.content)
  const minutes = readingTime(post.content)
  const prev = posts[index - 1]
  const next = posts[index + 1]
  const url = `${SITE_URL}/post/${post.id}`

  return (
    <article>
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-lg text-purple-400 hover:text-purple-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <header className="mt-5 mb-8">
        <h1 className="font-pixel leading-[1.7] text-xl md:text-2xl mb-5">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 font-mono text-lg text-purple-400/80">
          <span className="px-2 py-1 bg-purple-600 text-black rounded">{post.category}</span>
          <span>{post.date}</span>
          <span aria-hidden>•</span>
          <span>{minutes} min de leitura</span>
        </div>
      </header>

      <TableOfContents toc={toc} />

      <div className="prose prose-invert prose-purple max-w-none">
        <PostBody html={html} />
      </div>

      <SocialShare url={url} title={post.title} />
      <PostNav prev={prev} next={next} />
    </article>
  )
}
