import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getSeriesGroups } from "@/lib/posts"
import { CATEGORIES } from "@/lib/categories"
import PostCard from "../../components/PostCard"

export function generateStaticParams() {
  return CATEGORIES.map(({ slug }) => ({ slug }))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  const groups = getSeriesGroups(category.label)

  if (groups.length === 0) {
    notFound()
  }

  // Categoria sem séries (um grupo só) mostra o grid direto — sem um cabeçalho inútil.
  const showHeadings = groups.length > 1

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-lg text-purple-400 hover:text-purple-200 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      <h2 className="text-xl sm:text-2xl font-pixel mb-8">Posts · {category.label}</h2>
      {groups.map((group) => (
        <section key={group.slug ?? "ungrouped"} className={showHeadings ? "mb-10" : undefined}>
          {showHeadings && (
            <h3 className="text-lg sm:text-xl font-pixel mb-5 text-purple-400">{group.label}</h3>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            {group.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
