import Link from "next/link";
import "./globals.css";
export const metadata = { title: "Page not found | LedgerByte", robots: { index: false, follow: false } };
export default function GlobalNotFound() {
  return <html lang="en"><body><main id="main-content" className="accounting-wrap accounting-page"><h1>Page not found</h1><Link href="/">LedgerByte</Link></main></body></html>;
}
