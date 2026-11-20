import { ServiceCatalogue } from "@/components/accounting/service-catalogue";
import { accountingCopy, accountingServices } from "@/content/accounting";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({
  path: "/finance/services",
  title: accountingCopy.C06.catalog_heading,
  description: accountingCopy.C06.catalog_intro,
});
export default function ServicesPage() {
  return (
    <main id="main-content" className="accounting-page">
      <section className="accounting-index-hero accounting-wrap">
        <p className="eyebrow">All {accountingServices.length} services</p>
        <h1>{accountingCopy.C06.catalog_heading}</h1>
        <p className="accounting-lead" data-aeo-answer>
          {accountingCopy.C06.catalog_intro}
        </p>
      </section>
      <ServiceCatalogue />
    </main>
  );
}
