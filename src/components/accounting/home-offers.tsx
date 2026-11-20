import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { serviceContactHref } from "@/content/accounting";
import { homeUpdate } from "@/content/home-update";

export function HomeOffers() {
  return (
    <section className="accounting-home-offers accounting-wrap" id="offers" data-home-section="offers" data-scroll-reveal>
      <div className="accounting-section-heading">
        <div><p className="eyebrow">Three ways to start · UAE</p><h2>The support you need. A clear starting point.</h2></div>
        <p>Choose monthly support for your books and tax work, or get help with a specific UAE return.</p>
      </div>
      <div className="accounting-home-offer-grid">
        {homeUpdate.offers.map(offer => (
          <section className="accounting-home-offer" key={offer.name}>
            <h3>{offer.name}</h3>
            <p className="accounting-offer-price"><span>From</span> AED {offer.price}<small>{offer.unit}</small></p>
            <details className="accounting-offer-details">
              <summary>What’s included</summary>
              <p>{offer.description}</p>
              <Link className="accounting-offer-scope" href={offer.href}>{offer.scope} ↗</Link>
            </details>
            <Link className="text-link" href={serviceContactHref(offer.service)}>{offer.cta}<ArrowUpRight aria-hidden="true" /></Link>
          </section>
        ))}
      </div>
      <p className="accounting-home-scope-note">{homeUpdate.offersNote}</p>
    </section>
  );
}

export function HomeWorkstreams() {
  return (
    <div className="accounting-home-pillars">
      {homeUpdate.workstreams.map(work => (
        <article key={work.name}>
          <h3>{work.name}</h3>
          <p>{work.output}</p>
          <details className="accounting-work-details">
            <summary>Explore service</summary>
            <p>{work.description}</p>
            <Link className="accounting-offer-scope" href={work.href}>{work.name} ↗</Link>
            <Link className="text-link" href={serviceContactHref(work.service)}>{work.cta}<ArrowUpRight aria-hidden="true" /></Link>
          </details>
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
        <p>From the first conversation to the next reporting cycle, agree what the work needs to achieve and who owns each step.</p>
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
