import Link from "next/link"
import { posts } from "../../data/posts"
import { notFound } from "next/navigation"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
  const categoryPosts = posts.filter((post) => post.category.toLowerCase() === params.slug)

  if (categoryPosts.length === 0) {
    notFound()
  }

  return (
    <div className="h-[100%]">
      <h2 className="text-2xl font-pixel mb-6">{category} Posts</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {categoryPosts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="block p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-pixel mb-2">{post.title}</h3>
              <p className="font-mono text-sm mb-2"
                dangerouslySetInnerHTML={{ __html: post.content.slice(0, 100) }}
              />
            </div>
            <span
              className={`inline-block px-2 py-1 bg-purple-600 text-black text-sm font-mono rounded ${post.category === "Games" ? "w-16 text-center" : "w-auto"}`}
            >
              {post.category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

