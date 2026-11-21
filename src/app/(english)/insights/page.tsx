import { accountingCopy, accountingPages, guideKeys } from "@/content/accounting";
import { StructuredData } from "@/components/structured-data";
import { buildCollectionSchema } from "@/lib/schema";
import { GuideCards } from "@/components/accounting/guide-cards";
import styles from "@/components/accounting/guide-cards.module.css";
import { getPageSeo } from "@/content/seo";
import { createPageMetadata } from "@/lib/seo";
import { insightsEnglishUrl } from "@/lib/review-links";
export const metadata = createPageMetadata(getPageSeo("/insights"), { path: "/insights" });
export default function InsightsPage() {
  return (
    <main id="main-content" className="accounting-page">
      <StructuredData data={buildCollectionSchema("/insights",
        guideKeys.map(key => ({ name: accountingPages[key].heading, path: accountingPages[key].path })))} />
      <section className="accounting-index-hero accounting-wrap">
        <p className="eyebrow">Insights</p>
        <h1>{accountingCopy.C10.insights_heading}</h1>
        <p className="accounting-lead" data-aeo-answer>{accountingCopy.C10.insights_intro}</p>
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
