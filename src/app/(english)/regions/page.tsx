import Link from "next/link";
import {
  accountingCopy,
  accountingPages,
  contentPath,
  marketKeys,
  marketNames,
} from "@/content/accounting";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({
  path: "/regions",
  title: "Markets | LedgerByte",
  description: accountingCopy.C10.market_index_intro,
});
export default function MarketsPage() {
  return (
    <main id="main-content" className="accounting-page">
      <section className="accounting-index-hero accounting-wrap">
        <p className="eyebrow">Markets</p>
        <h1>{accountingCopy.C10.market_index_heading}</h1>
        <p className="accounting-lead">
          {accountingCopy.C10.market_index_intro}
        </p>
      </section>
      <section className="accounting-market-grid accounting-wrap">
        {marketKeys.map((key) => (
          <article key={key}>
            <p className="eyebrow">{marketNames[key]}</p>
            <h2>
              <Link href={contentPath(key)}>
                {accountingPages[key].heading} ↗
              </Link>
            </h2>
            <p>{accountingPages[key].intro}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
