import Link from "next/link";
import { StructuredData } from "@/components/structured-data";
import { buildCollectionSchema } from "@/lib/schema";
import {
  accountingCopy,
  accountingPages,
  contentPath,
  marketKeys,
  marketNames,
} from "@/content/accounting";
import { getPageSeo } from "@/content/seo";
import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata(getPageSeo("/regions"), { path: "/regions" });
export default function MarketsPage() {
  return (
    <main id="main-content" className="accounting-page">
      <StructuredData data={buildCollectionSchema("/regions",
        marketKeys.map(key => ({ name: marketNames[key], path: contentPath(key) })))} />
      <section className="accounting-index-hero accounting-wrap">
        <p className="eyebrow">Markets</p>
        <h1>{accountingCopy.C10.market_index_heading}</h1>
        <p className="accounting-lead" data-aeo-answer>
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
