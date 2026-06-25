import Link from "next/link"
import { posts } from "./data/posts"
import PostCard from "./components/PostCard"

export default function Home() {
  const categories = ["Games", "Tech", "DevLog"]

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-pixel mb-8">Últimas aventuras 8-Bit</h2>
      {categories.map((category) => {
        const categoryPosts = posts.filter((post) => post.category === category)
        if (categoryPosts.length === 0) return null

        return (
          <section key={category} className="mb-12">
            <h3 className="text-lg sm:text-xl font-pixel mb-5">{category}</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {categoryPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Link
              href={`/category/${category.toLowerCase()}`}
              className="inline-block mt-5 font-pixel text-sm underline text-purple-400 hover:text-purple-300"
            >
              Ver todos os posts
            </Link>
          </section>
        )
      })}
    </div>
  )
}
