import { accountingCopy } from "@/content/accounting";
import { GuideCards } from "@/components/accounting/guide-cards";
import styles from "@/components/accounting/guide-cards.module.css";
import { createMetadata } from "@/lib/seo";
import { insightsEnglishUrl } from "@/lib/review-links";
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
        <a className="text-link" href={insightsEnglishUrl()}>
          LedgerByte Insights ↗
        </a>
      </section>
      <section className={`accounting-wrap ${styles.index}`} aria-label="Practical guides">
        <GuideCards summaries />
      </section>
    </main>
  );
}
