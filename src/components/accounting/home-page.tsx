import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { accountingContact, accountingPages, accountingShowcaseServices, contentPath, guideKeys } from "@/content/accounting";
import { EnquiryLink, Faqs, TeamGrid } from "./content-page";
import { StructuredData } from "@/components/structured-data";
import { ScrollReveals } from "@/components/motion/scroll-reveals";
import { ServiceFlashcards } from "./service-flashcards";
import { HomeCatalogue } from "./home-catalogue";
import { HomeOffers, HomeWorkingProcess, HomeWorkstreams } from "./home-offers";
import { homeUpdate } from "@/content/home-update";
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
            <p className="accounting-location">Accounting · Tax · Controller · Fractional CFO</p>
          </div>
          <figure className="accounting-hero-figure">
            <div className="accounting-hero-image">
              <Image src="/art/finance-editorial-v3.webp" alt="Editorial illustration of finance records, reporting and planning" width={1536} height={1024} priority sizes="(max-width: 900px) 90vw, 44vw" />
            </div>
            <figcaption className="accounting-hero-caption"><span>LEDGERBYTE</span><span>ACCOUNTING. TAX. ADVISORY.</span></figcaption>
          </figure>
        </section>

        <HomeOffers />

        <section className="accounting-reviews accounting-wrap" data-home-section="reviews" data-scroll-reveal>
          <div><p className="eyebrow">Client reviews</p><h2>Hear from LedgerByte clients.</h2><p>Read their feedback on Trustpilot.</p></div>
          <a className="text-link" href="https://www.trustpilot.com/review/ledgerbyte.io" target="_blank" rel="noreferrer">Read our reviews on Trustpilot<ArrowUpRight aria-hidden="true" /></a>
        </section>

        <section className="accounting-finance-services accounting-wrap" data-home-section="finance-services" data-scroll-reveal>
          <div className="accounting-section-heading">
            <div><p className="eyebrow">A team around your business</p><h2>{home.sections[0].heading}</h2></div>
            <p>{home.sections[0].paragraphs[0]}</p>
          </div>
          <HomeWorkstreams />
          <aside className="accounting-statement accounting-home-department">
            <p className="eyebrow">Need the workstreams connected?</p>
            <h3>Full finance department outsourcing</h3>
            <p>{homeUpdate.department}</p>
            <div className="hero-actions">
              <Link className="button button-amber" href="/build-your-finance-department">Estimate your team cost<ArrowUpRight aria-hidden="true" /></Link>
              <Link className="text-link" href="/contact?service=Full%20Finance%20Department%20Outsourcing">Discuss full finance support<ArrowUpRight aria-hidden="true" /></Link>
              <Link className="text-link" href="/finance/services/finance-department-outsourcing">Explore the scope<ArrowUpRight aria-hidden="true" /></Link>
            </div>
          </aside>
        </section>

        <section id="services-showcase" className="accounting-featured accounting-wrap" data-home-section="catalogue" data-scroll-reveal>
          <div className="accounting-section-heading">
            <div><p className="eyebrow">The service catalogue</p><h2>{home.sections[1].heading}</h2></div>
            <p>{home.sections[1].paragraphs[0]}</p>
          </div>
          <ServiceFlashcards services={accountingShowcaseServices} label={home.sections[1].heading} />
          <HomeCatalogue />
          <Link className="text-link accounting-all-services" href="/finance/services">All 22 services<ArrowUpRight aria-hidden="true" /></Link>
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
          <p className="accounting-home-blog">Explore LedgerByte articles on finance, technology and business decisions. <a className="text-link" href="https://blog.ledgerbyte.io/" target="_blank" rel="noreferrer">Read the blog<ArrowUpRight aria-hidden="true" /></a></p>
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
          <aside className="accounting-output"><h3>Discuss your requirements.</h3><p>Share your business location and the support you need through our enquiry form.</p><EnquiryLink label="Open enquiry form" /></aside>
        </section>
      </main>
    </>
  );
}
