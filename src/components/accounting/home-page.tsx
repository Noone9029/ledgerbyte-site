import Image from "next/image";
import { insightsEnglishUrl } from "@/lib/review-links";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { accountingContact, accountingPages, accountingServices, contentPath, guideKeys } from "@/content/accounting";
import { Faqs, TeamGrid } from "./content-page";
import { StructuredData } from "@/components/structured-data";
import { ScrollReveals } from "@/components/motion/scroll-reveals";
import { HomeCatalogue } from "./home-catalogue";
import { HomeOffers, HomeWorkingProcess, HomeWorkstreams } from "./home-offers";
import { homeUpdate } from "@/content/home-update";
import { CashBridgePreview } from "./finance-examples";
import exampleStyles from "./finance-examples.module.css";
import { buildFaqSchema, buildSchemaGraph, buildWebPageSchema } from "@/lib/schema";

export function AccountingHome() {
  const home = accountingPages.home;
  return (
    <>
      <StructuredData data={buildSchemaGraph(
        buildWebPageSchema({ path: "/", name: home.title, description: home.description }),
        buildFaqSchema(home.faqs),
      )} />
      <main id="main-content" className="accounting-page accounting-home-flow">
        <ScrollReveals />
        <section className="accounting-home-hero accounting-wrap" data-home-section="hero">
          <div>
            <p className="eyebrow">{home.eyebrow}</p>
            <h1>{home.heading}</h1>
            <p className="accounting-lead" data-aeo-answer>{home.intro}</p>
            <div className="hero-actions">
              <Link className="button button-amber" href="/build-your-finance-department">Build your finance department<ArrowUpRight aria-hidden="true" /></Link>
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
          <aside className="accounting-review-link" aria-label="Client reviews">
            <p>Hear from LedgerByte clients.</p>
            <a className="text-link" href={accountingContact.social.trustpilot} target="_blank" rel="noreferrer">Read our reviews on Trustpilot<ArrowUpRight aria-hidden="true" /></a>
          </aside>
        </section>

        <section className="accounting-finance-services accounting-wrap" data-home-section="finance-services" data-scroll-reveal>
          <div className="accounting-section-heading">
            <div><p className="eyebrow">A team around your business</p><h2>{home.sections[0].heading}</h2></div>
          </div>
          <HomeWorkstreams />
          <aside className="accounting-home-department">
            <h3><Link href="/finance/services/finance-department-outsourcing">Full finance department outsourcing<ArrowUpRight aria-hidden="true" /></Link></h3>
            <Link className="text-link" href="/build-your-finance-department">Estimate your team cost<ArrowUpRight aria-hidden="true" /></Link>
          </aside>
        </section>

        <section id="services-showcase" className="accounting-featured accounting-wrap" data-home-section="catalogue" data-scroll-reveal>
          <div className="accounting-section-heading">
            <div><p className="eyebrow">The service catalogue</p><h2>{home.sections[1].heading}</h2></div>
            <Link className="text-link" href="/finance/services">All {accountingServices.length} services<ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <HomeCatalogue />
        </section>

        <HomeWorkingProcess />

        <section id="team" className="accounting-team accounting-wrap" data-home-section="team" data-scroll-reveal>
          <div className="accounting-section-heading">
            <div><p className="eyebrow">The people behind the work</p><h2>Meet your finance team.</h2></div>
            <p>Explore the team’s backgrounds and discuss the people responsible for your engagement.</p>
          </div>
          <aside className="accounting-founder-note">
            <p className="eyebrow">From the founder</p><h3>Can we afford the next move?</h3><p>{homeUpdate.founder}</p>
            <Link className="text-link" href="/about/team/haider-ali">Haider Ali, ACMA, CGMA · Founder &amp; Managing Partner<ArrowUpRight aria-hidden="true" /></Link>
          </aside>
          <TeamGrid />
        </section>

        <section id="guides" className="accounting-guides accounting-wrap" data-home-section="guides" data-scroll-reveal>
          <div className="accounting-section-heading">
            <div><p className="eyebrow">Insights &amp; practical guides</p><h2>A little preparation goes a long way.</h2></div>
            <Link className="text-link" href="/insights">Browse practical guides<ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <p className="accounting-home-blog"><a className="text-link" href={insightsEnglishUrl()} target="_blank" rel="noreferrer">Read the blog<ArrowUpRight aria-hidden="true" /></a></p>
          <div>
            {guideKeys.map((key, index) => (
              <Link href={contentPath(key)} key={key}>
                <span className="accounting-section-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{accountingPages[key].heading}</h3><ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <Faqs items={home.faqs} heading="Before you get in touch." />

        <section id="contact" className="accounting-closing accounting-home-contact accounting-wrap" data-home-section="contact" data-scroll-reveal>
          <div>
            <p className="eyebrow">Get in touch</p><h2>{home.closing_heading}</h2>
            <p>Accounting, tax, controller or fractional CFO support. Tell us what you need next.</p>
            <a className="button button-amber" href={accountingContact.social.whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp<ArrowUpRight aria-hidden="true" /></a>
            <p className="accounting-home-scope-note">Opens WhatsApp. You choose whether to send a message.</p>
            <div className="accounting-home-contact-details">
              <a href={`mailto:${accountingContact.contact.email}`}>{accountingContact.contact.email}</a>
              <a href={`tel:${accountingContact.contact.phone.replace(/\s/g, "")}`}>{accountingContact.contact.phone}</a>
              <address>{accountingContact.contact.address.join(", ")}</address>
            </div>
          </div>
          <aside className="accounting-output"><h3>Discuss your requirements.</h3><p>Share your business location and the support you need through our enquiry form.</p><Link className="button button-amber" href="/contact#enquiry-heading">Open enquiry form<ArrowUpRight aria-hidden="true" /></Link></aside>
        </section>
      </main>
    </>
  );
}
