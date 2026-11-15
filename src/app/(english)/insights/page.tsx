import Link from "next/link";
import {
  accountingCopy,
  accountingPages,
  contentPath,
  guideKeys,
} from "@/content/accounting";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({
  path: "/insights",
  title: accountingCopy.C10.insights_heading,
  description: accountingCopy.C10.insights_intro,
});
export default function InsightsPage() {
  return (
    <main id="main-content" className="accounting-page">
      <section className="accounting-index-hero accounting-wrap">
        <p className="eyebrow">Insights</p>
        <h1>{accountingCopy.C10.insights_heading}</h1>
        <p className="accounting-lead">{accountingCopy.C10.insights_intro}</p>
        <a className="text-link" href="https://blog.ledgerbyte.io">
          LedgerByte Insights ↗
        </a>
      </section>
      <section className="accounting-market-grid accounting-wrap">
        {guideKeys.map((key) => (
          <article key={key}>
            <p className="eyebrow">Practical guides</p>
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
