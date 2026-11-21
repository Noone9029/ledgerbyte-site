import Link from "next/link";
import { StructuredData } from "@/components/structured-data";
import { buildCollectionSchema } from "@/lib/schema";
import {
  accountingPages,
  accountingServices,
  contentPath,
} from "@/content/accounting";
import { EnquiryLink } from "@/components/accounting/content-page";
import { getPageSeo } from "@/content/seo";
import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata(getPageSeo("/finance"), { path: "/finance" });
export default function FinancePage() {
  return (
    <main id="main-content" className="accounting-page">
      <StructuredData data={buildCollectionSchema("/finance", (accountingPages.home.pathways ?? [])
        .map(pathway => ({ name: pathway.cta, path: contentPath(pathway.target.page_key) })))} />
      <section className="accounting-index-hero accounting-wrap">
        <p className="eyebrow">LedgerByte</p>
        <h1>Which finance services does your business need?</h1>
        <p className="accounting-lead" data-aeo-answer>Choose bookkeeping for day-to-day records, a controller for the monthly close and controls, or a fractional CFO for cash, budgets and funding decisions.</p>
        <EnquiryLink label="Discuss your requirements" />
      </section>
      <section className="accounting-market-grid accounting-wrap" aria-label="Choose finance support">
        {accountingPages.home.pathways?.map((pathway) => (
          <article key={pathway.target.page_key}>
            <h2>{pathway.heading}</h2>
            <p>{pathway.text}</p>
            <Link className="accounting-hub-link" href={contentPath(pathway.target.page_key)}>
              {pathway.cta} ↗
            </Link>
          </article>
        ))}
      </section>
      <nav className="accounting-related accounting-wrap" aria-label="Finance services and pricing">
        <div>
          <Link href="/finance/services">All {accountingServices.length} finance services ↗</Link>
          <Link href="/finance/services/fractional-cfo-advisory">Fractional CFO &amp; Finance Advisory ↗</Link>
          <Link href="/build-your-finance-department">Estimate your finance team cost ↗</Link>
        </div>
      </nav>
    </main>
  );
}
