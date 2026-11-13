import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import {
  accountingCopy,
  accountingPages,
  accountingServices,
  contentPath,
  guideKeys,
} from "@/content/accounting";
import { EnquiryLink, Faqs, TeamGrid } from "./content-page";
import { StructuredData } from "@/components/structured-data";
import { ScrollReveals } from "@/components/motion/scroll-reveals";
import {
  buildFaqSchema,
  buildSchemaGraph,
  buildWebPageSchema,
} from "@/lib/schema";

export function AccountingHome() {
  const home = accountingPages.home;
  const featured = accountingServices.filter((service) =>
    home.featured_services?.includes(service.key.split("/").at(-1) ?? ""),
  );
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
              <EnquiryLink label={home.cta} />
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
        </section>
        <section className="accounting-featured accounting-wrap" data-scroll-reveal>
          <div className="accounting-section-heading">
            <div>
              <p className="eyebrow">Know what you will receive</p>
              <h2>{home.sections[1].heading}</h2>
            </div>
            <p>{home.sections[1].paragraphs[0]}</p>
          </div>
          <div className="accounting-service-grid">
            {featured.map((service) => (
              <article key={service.slug}>
                <p className="eyebrow">{service.group}</p>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <Link className="text-link" href={contentPath(service.key)}>
                  Explore service
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
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
          <EnquiryLink label={home.cta} />
        </section>
      </main>
    </>
  );
}
