import Link from "next/link"
import { posts } from "./data/posts"

export default function Home() {
  const categories = ["Games", "Tech", "DevLog"]

  return (
    <div>
      <h2 className="text-2xl font-pixel mb-6">Ultimas aventuras 8-Bit</h2>
      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h3 className="text-xl font-pixel mb-4">{category}</h3>
          <div className="grid gap-5 md:grid-cols-2">
            {posts
              .filter((post) => post.category === category)
              // .slice(0, 3)
              .map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="block p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex flex-col justify-between"
                >
                  <h4 className="text-lg font-pixel mb-2">{post.title}</h4>
                  <span
                    className={`inline-block px-2 py-1 bg-purple-600 text-black text-sm font-mono rounded ${post.category === "Games" ? "w-16 text-center" : "w-auto"}`}
                  >
                    {post.category}
                  </span>
                </Link>
              ))}
          </div>
          <Link
            href={`/category/${category.toLowerCase()}`}
            className="inline-block mt-4 font-pixel text-sm underline text-purple-400 hover:text-purple-300"
          >
            Ver todos os posts
          </Link>
        </div>
      ))}
    </div>
  )
}

