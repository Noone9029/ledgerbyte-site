import { ServiceCatalogue } from "@/components/accounting/service-catalogue";
import { StructuredData } from "@/components/structured-data";
import { buildCollectionSchema } from "@/lib/schema";
import { accountingCopy, accountingServices } from "@/content/accounting";
import { getPageSeo } from "@/content/seo";
import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata(getPageSeo("/finance/services"), { path: "/finance/services" });
export default function ServicesPage() {
  return (
    <main id="main-content" className="accounting-page">
      <StructuredData data={buildCollectionSchema("/finance/services",
        accountingServices.map(service => ({ name: service.title, path: `/finance/services/${service.slug}` })))} />
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
