import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { posts } from "../../data/posts"
import { notFound } from "next/navigation"
import PostCard from "../../components/PostCard"

const CATEGORIES = ["games", "tech", "devlog"]

export function generateStaticParams() {
  return CATEGORIES.map((slug) => ({ slug }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = slug.charAt(0).toUpperCase() + slug.slice(1)
  const categoryPosts = posts.filter((post) => post.category.toLowerCase() === slug)

  if (categoryPosts.length === 0) {
    notFound()
  }

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-lg text-purple-400 hover:text-purple-200 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      <h2 className="text-xl sm:text-2xl font-pixel mb-8">Posts · {category}</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {categoryPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
