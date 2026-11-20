import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { serviceContactHref } from "@/content/accounting";
import { homeUpdate } from "@/content/home-update";

export function HomeOffers() {
  return (
    <aside className="accounting-home-offers" id="offers" aria-label="Three ways to start · UAE">
      <p className="eyebrow">Three ways to start · UAE</p>
      <div className="accounting-home-offer-grid">
        {homeUpdate.offers.map(offer => (
          <section className="accounting-home-offer" key={offer.name}>
            <h3>{offer.name}</h3>
            <p>{offer.description}</p>
            <p className="accounting-offer-price"><span>From</span> AED {offer.price}<small>{offer.unit}</small></p>
            <Link className="text-link" href={serviceContactHref(offer.service)}>{offer.cta}<ArrowUpRight aria-hidden="true" /></Link>
            <Link className="accounting-offer-scope" href={offer.href}>{offer.scope} ↗</Link>
          </section>
        ))}
      </div>
      <p className="accounting-home-scope-note">{homeUpdate.offersNote}</p>
    </aside>
  );
}

export function HomeWorkstreams() {
  return (
    <div className="accounting-home-workstreams" aria-label="Finance support">
      {homeUpdate.workstreams.map(work => (
        <details key={work.name}>
          <summary>{work.name}<span aria-hidden="true">+</span></summary>
          <p>{work.description}</p>
          <p><strong>Typical output:</strong> {work.output}</p>
          <Link className="text-link" href={work.href}>Explore service<ArrowUpRight aria-hidden="true" /></Link>
        </details>
      ))}
    </div>
  );
}

export function HomeWorkingProcess() {
  return (
    <details className="accounting-home-process">
      <summary>Clear scope. Clear responsibility.<span aria-hidden="true">+</span></summary>
      <ol>
        {homeUpdate.process.map(step => (
          <li key={step.title}><h3>{step.title}</h3><p>{step.text}</p></li>
        ))}
      </ol>
      <p>{homeUpdate.preparation}</p>
      <Link className="text-link" href="/how-we-work">Read the full working process<ArrowUpRight aria-hidden="true" /></Link>
    </details>
  );
}
