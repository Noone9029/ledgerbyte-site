import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import {
  accountingCopy,
  accountingPages,
  accountingShowcaseServices,
  contentPath,
  guideKeys,
} from "@/content/accounting";
import { EnquiryLink, Faqs, TeamGrid } from "./content-page";
import { StructuredData } from "@/components/structured-data";
import { ScrollReveals } from "@/components/motion/scroll-reveals";
import { ServiceFlashcards } from "./service-flashcards";
import { HomeCatalogue } from "./home-catalogue";
import { HomeOffers, HomeWorkingProcess, HomeWorkstreams } from "./home-offers";
import { homeUpdate } from "@/content/home-update";
import {
  buildFaqSchema,
  buildSchemaGraph,
  buildWebPageSchema,
} from "@/lib/schema";

export function AccountingHome() {
  const home = accountingPages.home;
  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: "/",
            name: home.title,
            description: home.description,
          }),
          buildFaqSchema(home.faqs),
        )}
      />
      <main id="main-content" className="accounting-page">
        <ScrollReveals />
        <section className="accounting-home-hero accounting-wrap">
          <div>
            <p className="eyebrow">{home.eyebrow}</p>
            <h1>{home.heading}</h1>
            <p className="accounting-lead" data-aeo-answer>
              {home.intro}
            </p>
            <div className="hero-actions">
              <Link className="button button-amber" href="/build-your-finance-department">
                Build your finance department
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link className="text-link" href="/finance/services">
                Find your service
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
            <p className="accounting-location">{home.hero_note}</p>
          </div>
          <figure className="accounting-hero-figure">
            <div className="accounting-hero-image">
              <Image
                src="/art/finance-editorial-v3.webp"
                alt="Editorial illustration of finance records, reporting and planning"
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 900px) 90vw, 44vw"
              />
            </div>
            <figcaption className="accounting-hero-caption">
              <span>LEDGERBYTE</span>
              <span>ACCOUNTING. TAX. ADVISORY.</span>
            </figcaption>
          </figure>
        </section>
        <section className="accounting-reviews accounting-wrap" data-scroll-reveal>
          <div>
            <p className="eyebrow">Trustpilot</p>
            <h2>Hear from LedgerByte clients.</h2>
            <p>Explore publicly available client feedback on Trustpilot.</p>
          </div>
          <a
            className="text-link"
            href="https://www.trustpilot.com/review/ledgerbyte.io"
            target="_blank"
            rel="noreferrer"
          >
            Read our client reviews on Trustpilot
            <ArrowUpRight aria-hidden="true" />
          </a>
        </section>
        <section className="accounting-pathways accounting-wrap" data-scroll-reveal>
          <div className="accounting-section-heading">
            <p className="eyebrow">Find your service</p>
            <h2>Choose the support you need.</h2>
          </div>
          <HomeOffers />
          <div>
            {home.pathways?.map((pathway, i) => (
              <article key={pathway.heading}>
                <span className="accounting-section-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{pathway.heading}</h3>
                <p>{pathway.text}</p>
                <Link href={contentPath(pathway.target.page_key)}>
                  {pathway.cta}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section className="accounting-statement accounting-wrap" data-scroll-reveal>
          <p className="eyebrow">Accounting. Tax. Advisory.</p>
          <h2>{home.sections[0].heading}</h2>
          <p>{home.sections[0].paragraphs[0]}</p>
          <div className="accounting-home-department">
            <h3>Full finance department outsourcing</h3>
            <p>{homeUpdate.department}</p>
            <div className="hero-actions">
              <Link className="button button-amber" href="/build-your-finance-department">Estimate your team cost<ArrowUpRight aria-hidden="true" /></Link>
              <Link className="text-link" href="/finance/services/finance-department-outsourcing">Explore the scope<ArrowUpRight aria-hidden="true" /></Link>
            </div>
          </div>
          <HomeWorkingProcess />
        </section>
        <section id="services-showcase" className="accounting-featured accounting-wrap" data-scroll-reveal>
          <div className="accounting-section-heading">
            <div>
              <p className="eyebrow">Know what you will receive</p>
              <h2>{home.sections[1].heading}</h2>
            </div>
            <p>{home.sections[1].paragraphs[0]}</p>
          </div>
          <ServiceFlashcards services={accountingShowcaseServices} label={home.sections[1].heading} />
          <HomeWorkstreams />
          <HomeCatalogue />
          <Link
            className="text-link accounting-all-services"
            href="/finance/services"
          >
            All 22 services
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>
        <section className="accounting-team accounting-wrap" data-scroll-reveal>
          <div className="accounting-section-heading">
            <div>
              <p className="eyebrow">The people behind the work</p>
              <h2>A team behind the records, reports and next decision.</h2>
            </div>
            <Link className="text-link" href="/about#team">
              About us
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <TeamGrid />
          <aside className="accounting-founder-note">
            <p className="eyebrow">From the founder</p>
            <h3>Can we afford the next move?</h3>
            <p>{homeUpdate.founder}</p>
            <Link className="text-link" href="/about/team/haider-ali">Haider Ali, ACMA, CGMA · Founder &amp; Managing Partner<ArrowUpRight aria-hidden="true" /></Link>
          </aside>
        </section>
        <section className="accounting-guides accounting-wrap" data-scroll-reveal>
          <div className="accounting-section-heading">
            <div>
              <p className="eyebrow">Insights</p>
              <h2>{accountingCopy.C10.insights_heading}</h2>
            </div>
            <Link className="text-link" href="/insights">
              Practical guides
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <p className="accounting-home-blog">Explore LedgerByte articles on finance, technology and business decisions. <a className="text-link" href="https://blog.ledgerbyte.io/" target="_blank" rel="noreferrer">Read the blog<ArrowUpRight aria-hidden="true" /></a></p>
          <div>
            {guideKeys.map((key, i) => (
              <Link href={contentPath(key)} key={key}>
                <span className="accounting-section-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{accountingPages[key].heading}</h3>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
        <Faqs items={home.faqs} />
        <section className="accounting-closing accounting-wrap" data-scroll-reveal>
          <p className="eyebrow">Get in touch</p>
          <h2>{home.closing_heading}</h2>
          <div className="hero-actions">
            <EnquiryLink label={home.cta} />
            <a className="text-link" href="https://wa.me/971561371569" target="_blank" rel="noreferrer">Chat on WhatsApp<ArrowUpRight aria-hidden="true" /></a>
          </div>
        </section>
      </main>
    </>
  );
}
