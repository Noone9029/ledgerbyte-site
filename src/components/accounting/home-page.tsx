import Image from "next/image";
import { insightsEnglishUrl } from "@/lib/review-links";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { accountingContact, accountingPages, accountingServices } from "@/content/accounting";
import { Faqs, TeamGrid } from "./content-page";
import { StructuredData } from "@/components/structured-data";
import { ScrollReveals } from "@/components/motion/scroll-reveals";
import { HomeCatalogue } from "./home-catalogue";
import { GuideCards } from "./guide-cards";
import { HomeOffers, HomeWorkingProcess, HomeWorkstreams } from "./home-offers";
import { homeUpdate } from "@/content/home-update";
import { CashBridgePreview } from "./finance-examples";
import exampleStyles from "./finance-examples.module.css";
import { buildFaqSchema, buildSchemaGraph, buildUaeOffer, buildWebPageSchema } from "@/lib/schema";

export function AccountingHome() {
  const home = accountingPages.home;
  return (
    <>
      <StructuredData data={buildSchemaGraph(
        buildWebPageSchema({ path: "/", name: home.title, description: home.description }),
        buildFaqSchema(home.faqs),
        ...homeUpdate.offers.map(buildUaeOffer),
      )} />
      <main id="main-content" className="accounting-page accounting-home-flow">
        <ScrollReveals />
        <section className="accounting-home-hero accounting-wrap" data-home-section="hero">
          <div>
            <p className="eyebrow">{home.eyebrow}</p>
            <h1>{home.heading}</h1>
            <p className="accounting-lead" data-aeo-answer>{home.intro}</p>
            <div className="hero-actions">
              <Link className="button button-amber" href="/build-your-finance-department">
                <span className="accounting-builder-label">Build your finance department</span>
                <span className="accounting-builder-label-short">Build my team</span>
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <a className="text-link" href="#offers">Explore UAE offers<ArrowUpRight aria-hidden="true" /></a>
            </div>
          </div>
          <figure className="accounting-hero-figure">
            <div className="accounting-hero-image">
              <Image src="/art/finance-editorial-v3.webp" alt="Editorial illustration of finance records, reporting and planning" width={1536} height={1024} priority sizes="(max-width: 900px) 90vw, 44vw" />
            </div>
            <figcaption className="accounting-hero-caption">
              <span>LEDGERBYTE</span>
              <a href="#worked-example">See the profit-to-cash example <span aria-hidden="true">↓</span></a>
            </figcaption>
          </figure>
          <div id="analytics-inline" />
        </section>

        <HomeOffers />

        <section id="worked-example" className="accounting-reviews accounting-wrap" data-home-section="reviews" data-scroll-reveal>
          <div className={exampleStyles.proofIntro}>
            <p className="eyebrow">Worked example</p>
            <h2>{accountingPages["insights/profit-and-cash"].heading}</h2>
            <p>Customers still owe AED 40,000 of the month’s sales. Check when those receipts will arrive before committing cash.</p>
          </div>
          <div className="accounting-home-example"><CashBridgePreview /></div>
          <div className="accounting-receipt-proof">
            <div className="accounting-receipt-title">
              <Image src="/art/examples/receipt-matching.webp" alt="" width={144} height={96}
                sizes="96px" />
              <div><p className="eyebrow">Illustrative workpaper</p><h3>Matching a customer receipt</h3></div>
            </div>
            <p>One AED 10,000 receipt settles invoices of AED 6,000 and AED 4,000. Once the remittance is confirmed, the unallocated balance is AED 0.</p>
            <Link className="text-link" href="/finance/services/accounts-receivable#sample-deliverable">Sample receipt allocation<ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <aside className="accounting-review-link" aria-label="Client reviews">
            <a className="text-link" href={accountingContact.social.trustpilot} target="_blank" rel="noreferrer">Read our reviews on Trustpilot<ArrowUpRight aria-hidden="true" /></a>
          </aside>
        </section>

        <section className="accounting-finance-services accounting-wrap" data-home-section="finance-services" data-scroll-reveal>
          <h2>{home.sections[0].heading}</h2>
          <HomeWorkstreams />
          <aside className="accounting-home-department">
            <h3><Link href="/finance/services/finance-department-outsourcing">Full finance department outsourcing<ArrowUpRight aria-hidden="true" /></Link></h3>
            <Link className="text-link" href="/build-your-finance-department">Estimate your team cost<ArrowUpRight aria-hidden="true" /></Link>
          </aside>
        </section>

        <section id="services-showcase" className="accounting-featured accounting-wrap" data-home-section="catalogue" data-scroll-reveal>
          <div className="accounting-section-heading">
            <h2>{home.sections[1].heading}</h2>
            <Link className="text-link" href="/finance/services">All {accountingServices.length} services<ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <HomeCatalogue />
        </section>

        <HomeWorkingProcess />

        <section id="team" className="accounting-team accounting-wrap" data-home-section="team" data-scroll-reveal>
          <div className="accounting-section-heading">
            <div><p className="eyebrow">The people behind the work</p><h2>Meet your finance team.</h2></div>
            <Link className="text-link" href="/about#team">About us<ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <aside className="accounting-founder-note">
            <p className="eyebrow">From the founder</p><h3>Can we afford the next move?</h3><p>{homeUpdate.founder}</p>
            <Link className="text-link" href="/about/team/haider-ali">Haider Ali, ACMA, CGMA · Founder &amp; Managing Partner<ArrowUpRight aria-hidden="true" /></Link>
          </aside>
          <TeamGrid compact />
        </section>

        <section id="guides" className="accounting-guides accounting-wrap" data-home-section="guides" data-scroll-reveal>
          <div className="accounting-section-heading">
            <h2>Practical guides</h2>
            <div className="accounting-guide-actions">
              <Link className="text-link" href="/insights">Browse practical guides<ArrowUpRight aria-hidden="true" /></Link>
              <a className="text-link" href={insightsEnglishUrl()} target="_blank" rel="noreferrer">Read the blog<ArrowUpRight aria-hidden="true" /></a>
            </div>
          </div>
          <GuideCards />
        </section>

        <Faqs items={home.faqs} heading="Before you get in touch." />

        <section id="contact" className="accounting-closing accounting-home-contact accounting-wrap" data-home-section="contact" data-scroll-reveal>
          <div>
            <h2>{home.closing_heading}</h2>
            <p>Accounting, tax, controller or fractional CFO support. Tell us what you need next.</p>
            <div className="accounting-home-enquiry-actions">
              <a className="button button-amber" href={accountingContact.social.whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp<ArrowUpRight aria-hidden="true" /></a>
              <Link className="text-link" href="/contact#enquiry-heading">Open enquiry form<ArrowUpRight aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="accounting-home-contact-details">
            <a href={`mailto:${accountingContact.contact.email}`}>{accountingContact.contact.email}</a>
            <a href={`tel:${accountingContact.contact.phone.replace(/\s/g, "")}`}>{accountingContact.contact.phone}</a>
            <address>{accountingContact.contact.address.join(", ")}</address>
          </div>
        </section>
      </main>
    </>
  );
}
