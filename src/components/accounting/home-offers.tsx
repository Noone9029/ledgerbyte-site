import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { marketNames } from "@/content/accounting";
import { catalogueWhatsAppHref, serviceWhatsAppHref } from "@/lib/enquiry-options";
import { homeUpdate } from "@/content/home-update";

export function HomeOffers() {
  return (
    <section className="accounting-home-offers accounting-wrap" id="offers" data-home-section="offers" data-scroll-reveal>
      <div className="accounting-section-heading">
        <h2>UAE starting offers</h2>
        <a className="text-link accounting-catalogue-shortcut" href="#catalogue-search">Find your service <span aria-hidden="true">↓</span></a>
      </div>
      <div className="accounting-home-offer-grid">
        {homeUpdate.offers.map(offer => (
          <section className="accounting-home-offer" key={offer.name}>
            <Link className="accounting-offer-overview" href={offer.priceHref ?? offer.href}>
              <h3>{offer.name}</h3>
              <p className="accounting-offer-price"><span>From</span> AED {offer.price}<small>{offer.unit}</small></p>
              {offer.priceLinkLabel && <span className="accounting-offer-destination">{offer.priceLinkLabel} <span aria-hidden="true">↗</span></span>}
            </Link>
            <p className="accounting-offer-fit">{offer.fit}</p>
            <details className="accounting-offer-details">
              <summary>What’s included</summary>
              <p>{offer.description}</p>
              <Link className="accounting-offer-scope" href={offer.href}>{offer.scope} ↗</Link>
            </details>
            <a className="text-link" href={serviceWhatsAppHref(offer.name, marketNames["regions/uae"])} target="_blank" rel="noreferrer">{offer.cta}<ArrowUpRight aria-hidden="true" /></a>
          </section>
        ))}
      </div>
      <aside className="accounting-builder-offer" aria-label="Finance team builder">
        <Link className="text-link" href="/build-your-finance-department">Finance team builder<ArrowUpRight aria-hidden="true" /></Link>
        <p>{homeUpdate.builderOffer}</p>
      </aside>
    </section>
  );
}

export function HomeWorkstreams() {
  return (
    <div className="accounting-home-pillars">
      {homeUpdate.workstreams.map(work => (
        <article key={work.name}>
          <h3><Link href={`/finance/services/${work.slug}`} title={work.need}>
            {work.name}<ArrowUpRight aria-hidden="true" />
          </Link></h3>
          <details>
            <summary>Typical output</summary>
            <p>{work.output}</p>
            {work.slug === "tax-vat-compliance" && <div className="accounting-workstream-tax-links">
              <Link href="/uae-vat">VAT return scope ↗</Link>
              <Link href="/finance/services/corporate-tax-filing">Corporate tax return filing ↗</Link>
            </div>}
          </details>
          <a className="text-link" href={catalogueWhatsAppHref(work.slug)} target="_blank" rel="noreferrer">{work.discuss}<ArrowUpRight aria-hidden="true" /></a>
        </article>
      ))}
    </div>
  );
}

export function HomeWorkingProcess() {
  return (
    <section id="how-we-work" className="accounting-home-process-section accounting-wrap" data-home-section="process" data-scroll-reveal>
      <div>
        <p className="eyebrow">How we work</p><h2>Clear scope. Clear responsibility.</h2>
        <Link className="text-link" href="/how-we-work">Read the full working process<ArrowUpRight aria-hidden="true" /></Link>
        <details className="accounting-process-preparation"><summary>What to have ready</summary><p>{homeUpdate.preparation}</p></details>
      </div>
      <ol className="accounting-home-process-steps">
        {homeUpdate.process.map(step => (
          <li key={step.title}><details><summary>{step.title}</summary><p>{step.text}</p></details></li>
        ))}
      </ol>
    </section>
  );
}
