import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { getPostBySlug } from "@/lib/posts";

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : null;

  return (
    <div className="min-h-screen bg-hero-bg text-hero-text">
      <Header />
      <main className="container max-w-3xl mx-auto px-4 py-12">
        {!post ? (
          <p>
            Post not found.{" "}
            <Link to="/blog" className="underline">
              Back to blog
            </Link>
          </p>
        ) : (
          <article>
            <Link to="/blog" className="text-sm underline">
              ← Back
            </Link>
            <h1 className="text-4xl font-bold mt-2">{post.title}</h1>
            <div className="text-sm opacity-70 mb-6">
              {new Date(post.date).toLocaleDateString()}
            </div>
            {post.cover && (
              <img src={post.cover} alt="" className="rounded-2xl mb-6 w-full" />
            )}
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.html) }}
            />
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
