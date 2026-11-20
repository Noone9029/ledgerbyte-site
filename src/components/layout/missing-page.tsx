import Link from "next/link";

export function MissingPage() {
  return (
    <main className="not-found" id="main-content">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <div>
        <Link className="button button-amber" href="/">Back to home</Link>
        <Link className="text-link" href="/finance/services">Browse services ↗</Link>
      </div>
    </main>
  );
}
