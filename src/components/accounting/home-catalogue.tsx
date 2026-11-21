import Link from "next/link";
import { accountingShowcaseServices } from "@/content/accounting";
import { catalogueWhatsAppHref } from "@/lib/enquiry-options";
import catalogue from "@/content/home-service-scopes.json";
import { ServiceCatalogue } from "./service-catalogue";
import { ServiceFlashcards } from "./service-flashcards";

export function HomeCatalogue() {
  return (
    <ServiceCatalogue>
      <ServiceFlashcards services={accountingShowcaseServices} label="Featured accounting services" />
      <details className="accounting-home-catalogue" id="all-services">
        <summary>Browse by category <span aria-hidden="true" className="accounting-browse-toggle" /></summary>
        {catalogue.map(({ group, items }) => (
          <details key={group} className="accounting-home-catalogue-group">
            <summary>{group} <span>{items.length} services</span></summary>
            {items.map(({ name, scope, slug }) => (
              <article key={slug}>
                <div>
                  <h3><Link href={`/finance/services/${slug}`}>{name}</Link></h3>
                  <p>{scope}</p>
                  <small>{slug === "corporate-tax-filing" ? "From AED 750. Scope and records readiness affect the quote." : "Request a quote"}</small>
                </div>
                <a className="text-link" href={catalogueWhatsAppHref(slug)} aria-label={`Discuss ${name}`} target="_blank" rel="noreferrer">Discuss ↗</a>
              </article>
            ))}
          </details>
        ))}
      </details>
    </ServiceCatalogue>
  );
}
