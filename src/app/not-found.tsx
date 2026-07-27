import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <main className="not-found" id="main-content">
      <p className="eyebrow">404</p>
      <h1>Get In Touch</h1>
      <p>
        Let&apos;s discuss how we can help scale your business with innovative
        technology solutions
      </p>
      <div>
        <Link className="button button-amber" href="/">
          Home
          <ArrowUpRight weight="bold" aria-hidden="true" />
        </Link>
        <Link className="text-link" href="/contact">
          Contact
          <ArrowUpRight weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
