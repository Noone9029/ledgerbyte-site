import Link from "next/link";
import {
  accountingGroups,
  accountingPages,
  accountingServices,
} from "@/content/accounting";
import { EnquiryLink } from "@/components/accounting/content-page";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({
  path: "/finance",
  title: "Accounting. Tax. Advisory.",
  description: accountingPages.home.intro,
});
export default function FinancePage() {
  return (
    <main id="main-content" className="accounting-page">
      <section className="accounting-index-hero accounting-wrap">
        <p className="eyebrow">LedgerByte</p>
        <h1>Accounting. Tax. Advisory.</h1>
        <p className="accounting-lead">{accountingPages.home.intro}</p>
        <EnquiryLink label="Discuss your requirements" />
      </section>
      <section className="accounting-market-grid accounting-wrap">
        {accountingGroups.map((group) => (
          <article key={group}>
            <h2>{group}</h2>
            {accountingServices
              .filter((s) => s.group === group)
              .map((s) => (
                <Link
                  className="accounting-hub-link"
                  key={s.slug}
                  href={"/finance/services/" + s.slug}
                >
                  {s.title} ↗
                </Link>
              ))}
          </article>
        ))}
      </section>
    </main>
  );
}
