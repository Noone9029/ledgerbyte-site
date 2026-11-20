import Link from "next/link";
import { notFound } from "next/navigation";
import manifest from "@/content/localization-manifest.json";
import serviceMap from "@/content/seo-drafts/service-map.json";
import { isSeoReview } from "@/lib/localization";
export const metadata = { title: "SEO and Arabic review | LedgerByte", robots: { index: false, follow: false } };
export default function SeoReview() {
  if (!isSeoReview) notFound();
  return <main id="main-content" className="accounting-page accounting-wrap seo-review"><h1>SEO and Arabic review</h1><p>This protected review keeps the live release unchanged. All new service assignments and Arabic copy are drafts. Haider must approve facts and launch; Arabic also needs a named finance and language reviewer. Search volumes and growth results have not been measured.</p>
    <section><h2>Service intent and copy review</h2><div className="seo-review-table"><table><caption>{serviceMap.services.length} service pages, including {serviceMap.services.filter((service) => service.priority).length} priorities</caption><thead><tr><th>Service</th><th>Primary query</th><th>Distinct purpose</th><th>First priority</th></tr></thead><tbody>{serviceMap.services.map((service) => <tr key={service.slug}><td><Link href={service.path}>{service.title}</Link></td><td>{service.primaryQuery}</td><td>{service.intent}<p>{service.boundary}</p></td><td>{service.priority ? "Yes" : "Later review"}</td></tr>)}</tbody></table></div></section>
    <section><h2>Arabic page drafts</h2><p>These pages keep English route slugs and use Arabic reading direction. Public language metadata is withheld until each translation has been approved.</p><div className="seo-review-table"><table><caption>18 Arabic drafts</caption><thead><tr><th>English page</th><th>Arabic draft</th><th>Status</th></tr></thead><tbody>{manifest.pages.map((page) => <tr key={page.path}><td><Link href={page.englishPath}>{page.englishPath}</Link></td><td><Link href={page.path} lang="ar">مراجعة الترجمة</Link></td><td>{page.status}</td></tr>)}</tbody></table></div></section>
    <section><h2>Launch checks</h2><p>Review the service scope and proposed search descriptions, Arabic labels and contact flow, consent choices, mobile reading and keyboard navigation. Real enquiry receipt, search ownership, Arabic review and final production promotion remain separate recorded checks.</p></section>
  </main>;
}
