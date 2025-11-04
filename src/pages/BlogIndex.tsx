import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/posts";

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-hero-bg text-hero-text">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        {posts.length === 0 && (
          <p className="opacity-80">No posts yet. Check back soon.</p>
        )}

        <ul className="space-y-10">
          {posts.map((p) => (
            <li key={p.slug} className="border-b border-white/10 pb-8">
              {p.cover && (
                <img src={p.cover} alt="" className="rounded-2xl mb-4 w-full" />
              )}
              <h2 className="text-2xl font-semibold">
                <Link to={`/blog/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </h2>
              <div className="text-sm opacity-70">
                {new Date(p.date).toLocaleDateString()}
              </div>
              {p.excerpt && <p className="mt-3 opacity-90">{p.excerpt}</p>}
              {p.tags?.length ? (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded bg-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
