import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { StructuredData } from "@/components/structured-data";
import {
  accountingPages,
  accountingServices,
  contentPath,
  marketNames,
  serviceContactHref,
  type AccountingPage,
} from "@/content/accounting";
import { team } from "@/content";
import { guideExamples } from "@/content/insight-guides";
import { homeUpdate } from "@/content/home-update";
import { CashBridgeWorksheet, CashTimingSample, GuideCashChart, ProcessorSettlementSample, ReceiptMatchingSample } from "./finance-examples";
import { WorkedExampleFigure } from "./worked-example-figure";
import figureStyles from "./worked-example-figure.module.css";
import { SecondaryExample } from "./secondary-example";
import { ServiceSample } from "./service-sample";
import { serviceSamples } from "@/content/service-samples";
import exampleStyles from "./finance-examples.module.css";
import { getPageSeo, type SeoPagePath } from "@/content/seo";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildPersonPath,
  buildSchemaGraph,
  buildServiceSchema,
  buildWebPageSchema,
  ORGANIZATION_ID,
} from "@/lib/schema";

export function CopyText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\]\((?:https?:\/\/|\/(?![\\/]))[^\s\\)]+\))/g).map((part, i) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link?.[2].startsWith("/")) return <Link key={i} href={link[2]}>{link[1]}</Link>;
        return link ? (
          <a key={i} href={link[2]} target="_blank" rel="noreferrer">
            {link[1]}
          </a>
        ) : (
          part
        );
      })}
    </>
  );
}
export function EnquiryLink({
  label,
  service,
  market,
}: {
  label: string;
  service?: string;
  market?: string;
}) {
  return (
    <Link
      className="button button-amber"
      href={serviceContactHref(service, market)}
    >
      {label}
      <ArrowUpRight aria-hidden="true" />
    </Link>
  );
}
export function Faqs({ items, heading = "Questions, answered." }: { items: AccountingPage["faqs"]; heading?: string }) {
  if (!items.length) return null;
  return (
    <section
      className="accounting-faq accounting-wrap"
      aria-labelledby="accounting-faq-title"
    >
      <p className="eyebrow">FAQs</p>
      <h2 id="accounting-faq-title">{heading}</h2>
      <div>
        {items.map((faq) => (
          <details key={faq.question}>
            <summary>
              {faq.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              <CopyText text={faq.answer} />
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
export function TeamGrid({ locale = "en", compact = false }: { locale?: "en" | "ar"; compact?: boolean }) {
  const roles: Record<string, string> = { "Managing Partner": "الشريك الإداري", "CTO": "المدير التقني", "Financial Controller": "المراقب المالي", "Fractional Controller": "المراقب المالي الجزئي", "Customer Success Manager": "مديرة نجاح العملاء", "Senior Tax Consultant": "مستشار ضرائب أول" };
  return (
    <div className={compact ? "accounting-team-grid accounting-team-roster" : "accounting-team-grid"}>
      {team.map((person) => (
        <article key={person.name}>
          <Link href={buildPersonPath(person.name)}>
            <div className="accounting-portrait">
              <Image
                src={person.image}
                alt=""
                unoptimized={!compact}
                fill
                sizes={compact ? "54px" : "(max-width: 600px) 44vw, (max-width: 1000px) 28vw, 18vw"}
              />
            </div>
            <h3>{person.name}</h3>
            {compact && <p>{person.role}</p>}
          </Link>
          {!compact && <>
            <p>{locale === "ar" ? roles[person.role] || person.role : person.role}</p>
            <small>{person.credentials}</small>
          </>}
        </article>
      ))}
    </div>
  );
}
const pageEnquiryServices: Record<string, string> = {
  "uae-vat": "UAE VAT support",
  "insights/month-end-close": "Month-End & Year-End Close Support",
  "regions/uae": "Accounting & Bookkeeping",
  "regions/united-states": "Accounting & Bookkeeping",
  "regions/pakistan": "Accounting & Bookkeeping",
};

const exampleThumbnails: Record<string, string> = {
  "services/accounting-automation-systems": "processor-settlement",
  "services/accounting-bookkeeping": "receipt-matching",
  "services/cash-flow-working-capital": "cash-timing",
};

function ExampleIllustrationLink({ pageKey, href, label }: { pageKey: string; href: string; label: string }) {
  const artwork = guideExamples[pageKey]?.artwork ?? exampleThumbnails[pageKey];
  return (
    <a className={figureStyles.teaser} href={href}>
      {artwork && <Image src={`/art/examples/${artwork}.webp`} alt="" width={360} height={240}
        sizes="(max-width: 600px) 108px, 150px" />}
      <span>{label}</span>
    </a>
  );
}

export function ContentPage({ pageKey }: { pageKey: string }) {
  const page = accountingPages[pageKey];
  const sample = serviceSamples[pageKey];
  const example = guideExamples[pageKey];
  const profitGuide = pageKey === "insights/profit-and-cash";
  const hasNumberedSteps = page.sections.some(section => /^\d+\.\s/.test(section.heading));
  const founder = pageKey === "about" ? team.find(person => person.name === "Haider Ali") : undefined;
  const filingOffer = homeUpdate.offers.find(offer => offer.href === page.path && offer.service !== "Accounting & Bookkeeping");
  const dateModified = getPageSeo(page.path as SeoPagePath)?.lastModified ?? "2026-11-10";
  const service = accountingServices.find((item) => item.key === pageKey);
  const exampleSection = page.sections.findIndex(section => /example/i.test(section.heading));
  const heroExample = pageKey === "services/accounting-bookkeeping" ||
    pageKey === "services/cash-flow-working-capital" || pageKey === "services/accounting-automation-systems";
  const deliverableSection = page.sections.findIndex(section => /what you receive|what you provide and receive|what to have ready|return from supported records/i.test(section.heading));
  const detailSection = exampleSection >= 0 ? exampleSection : deliverableSection;
  const marketOutput = marketNames[pageKey] && page.sections.find(section => section.bullets.length);
  const group =
    service?.group ??
    (pageKey.startsWith("regions/")
      ? "Markets"
      : pageKey.startsWith("insights/")
        ? "Insights"
        : "Accounting. Tax. Advisory.");
  const market = marketNames[pageKey];
  const context = service?.title ?? pageEnquiryServices[pageKey] ?? example?.service;
  const closingHeading = page.cardStrapline || page.cta;
  const breadcrumbs = [{ name: "LedgerByte", path: "/" }];
  if (service) breadcrumbs.push({ name: "Services", path: "/finance/services" });
  else if (group === "Insights") breadcrumbs.push({ name: group, path: "/insights" });
  else if (group === "Markets") breadcrumbs.push({ name: group, path: "/regions" });
  breadcrumbs.push({
    name: service?.title ?? marketNames[pageKey] ?? page.eyebrow ?? page.title.replace(/\s*\|\s*LedgerByte$/i, ""),
    path: page.path,
  });
  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: page.path,
            name: page.title,
            description: page.description,
            dateModified,
          }),
          buildBreadcrumbSchema(breadcrumbs),
          ...(service
            ? [
                buildServiceSchema({
                  path: page.path,
                  name: service.title,
                  description: page.intro,
                  serviceType: service.title,
                  jurisdiction: ({
                    "UAE Tax & Formation": "United Arab Emirates",
                    "Saudi Arabia": "Saudi Arabia",
                  } as Record<string, string>)[service.group],
                }),
              ]
            : []),
          ...(example ? [{
            "@type": "Article",
            "@id": absoluteUrl(page.path) + "#article",
            mainEntityOfPage: { "@id": absoluteUrl(page.path) + "#webpage" },
            headline: page.heading,
            description: page.description,
            inLanguage: "en",
            publisher: { "@id": ORGANIZATION_ID, "@type": "Organization", name: SITE_NAME },
            dateModified,
            citation: example.url,
          }] : []),
          ...(page.faqs.length ? [buildFaqSchema(page.faqs)] : []),
        )}
      />
      <main id="main-content" className="accounting-page">
        <nav
          className="accounting-breadcrumb accounting-wrap"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map(({ name, path }, index) => (
            <Fragment key={path}>
              {index > 0 && <span aria-hidden="true">/</span>}
              {path === page.path
                ? <span aria-current="page">{name}</span>
                : <Link href={path}>{name}</Link>}
            </Fragment>
          ))}
        </nav>
        <section className="accounting-detail-hero accounting-wrap">
          <div data-aeo-answer>
            <p className="eyebrow">{page.eyebrow ?? group}</p>
            <h1>{page.heading}</h1>
            <p className="accounting-lead">{page.intro}</p>
            {example && <p className="guide-publisher">Published by <Link href="/about">{SITE_NAME}</Link></p>}
            <EnquiryLink label={page.cta} service={context} market={market} />
          </div>
          {filingOffer ? (
            <aside className="accounting-output">
              <p className="eyebrow">{filingOffer.name}</p>
              <h2 className={exampleStyles.offerPrice}><small>From</small> AED {filingOffer.price} {filingOffer.unit && <small>{filingOffer.unit}</small>}</h2>
              <p>{filingOffer.description}</p>
              <hr />
              {pageKey === "uae-vat"
                ? <Link className="text-link" href="/insights/vat-records#worked-example">See a VAT reconciliation ↗</Link>
                : sample ? <a className="text-link" href="#sample-deliverable">View the sample filing pack ↓</a>
                : detailSection >= 0 && <a className="text-link" href={`#section-${detailSection + 1}`}>{page.sections[detailSection].heading} ↓</a>}
            </aside>
          ) : service && (pageKey === "services/accounting-bookkeeping" || pageKey === "services/cash-flow-working-capital") ? (
            <aside className="accounting-output" id="example-illustration">
              <p className="eyebrow">Worked example</p>
              {pageKey === "services/accounting-bookkeeping" ? <ReceiptMatchingSample /> : <CashTimingSample />}
              {exampleSection >= 0 && <a className="text-link" href={`#section-${exampleSection + 1}`}>{page.sections[exampleSection].heading} ↓</a>}
            </aside>
          ) : sample ? (
            <aside aria-label="Sample deliverable"><ServiceSample sample={sample} /></aside>
          ) : service ? (
            <aside className="accounting-output" id={heroExample ? "example-illustration" : undefined}>
              <p className="eyebrow">Typical output</p>
              <p>{service.output}</p>
              {pageKey === "services/accounting-automation-systems" && <ProcessorSettlementSample />}
              {detailSection >= 0 && <a className="text-link" href={`#section-${detailSection + 1}`}>{page.sections[detailSection].heading} ↓</a>}
              <hr />
              <small>{service.boundary}</small>
            </aside>
          ) : pageKey === "regions/uae" ? (
            <aside className="accounting-output">
              <p className="eyebrow">Monthly bookkeeping</p>
              <h2>From AED 500 per month</h2>
              <p>The starting team includes 15 hours and VAT filing. A senior accountant reviews reconciliations and flags balances that need your attention.</p>
              <hr />
              <Link href="/build-your-finance-department">See the hours and price before tax ↗</Link>
            </aside>
          ) : example ? (
            <aside className="accounting-output guide-example" aria-label="Worked example">
              <p className="eyebrow">Worked example</p>
              {profitGuide ? (
                <>
                  <GuideCashChart view="result" />
                  <a className="text-link" href="#worked-example">See the calculation ↓</a>
                </>
              ) : (
                <>
                  <ExampleIllustrationLink pageKey={pageKey} href="#worked-example" label="See the calculation" />
                  <dl className="guide-calculation">
                    {example.amounts.map(([label, amount]) => (
                      <div key={label}><dt>{label}</dt><dd>{amount}</dd></div>
                    ))}
                  </dl>
                </>
              )}
              <hr />
              <small><a href={example.url}>{example.reference}</a></small>
            </aside>
          ) : founder ? (
            <Link className={figureStyles.founder} href={buildPersonPath(founder.name)}>
              <Image src="/team/haider-ali.jpg" alt="" width={747} height={770}
                sizes="(max-width: 600px) calc(100vw - 36px), (max-width: 900px) 60vw, 470px" />
              <div><span><strong>{founder.name}</strong><small>{founder.role} · {founder.credentials}</small></span><ArrowUpRight aria-hidden="true" /></div>
            </Link>
          ) : marketOutput ? (
            <aside className="accounting-output market-output">
              <p className="eyebrow">{marketNames[pageKey]}</p>
              <h2>{marketOutput.heading}</h2>
              <ul>{marketOutput.bullets.slice(0, 2).map(text => <li key={text}><CopyText text={text} /></li>)}</ul>
              <a className="text-link" href={`#section-${page.sections.indexOf(marketOutput) + 1}`}>See the full scope ↓</a>
            </aside>
          ) : (
            <div className="accounting-detail-motif" aria-hidden="true">
              <svg viewBox="0 0 400 300">
                <path d="M30 240H370M30 160H370M30 80H370M90 35V265M200 35V265M310 35V265" />
                <path
                  className="accounting-chart-line"
                  d="M45 225L120 180L175 200L250 100L355 50"
                />
                <circle cx="250" cy="100" r="17" />
                <circle cx="120" cy="180" r="8" />
              </svg>
            </div>
          )}
        </section>
        <div className="accounting-article-layout accounting-wrap">
          <aside className="accounting-toc">
            <p className="eyebrow">On this page</p>
            {page.sections.map((section, i) => (
              <a key={section.heading} href={`#section-${i + 1}`}>
                {section.heading}
              </a>
            ))}
          </aside>
          <div className="accounting-prose">
            {page.sections.map((section, i) => {
              const isCashBridge = pageKey === "insights/profit-and-cash" && section.heading === "Build the bridge from profit to cash";
              const isWorkedExample = example && section.heading.startsWith("Worked example");
              const isExampleSection = i === exampleSection;
              const headingId = isCashBridge ? "cash-bridge" : isExampleSection ? "worked-example" : undefined;
              return (
              <section id={`section-${i + 1}`} key={section.heading}>
                {!hasNumberedSteps && <span className="accounting-section-number">
                  {String(i + 1).padStart(2, "0")}
                </span>}
                <h2 id={headingId}>{section.heading}</h2>
                {sample && i === deliverableSection && (
                  filingOffer ? <ServiceSample sample={sample} /> : service && (
                    <div className="accounting-output">
                      <p className="eyebrow">Typical output</p>
                      <p>{service.output}</p>
                      <small>{service.boundary}</small>
                      <a className="text-link" href="#sample-deliverable">View the sample ↑</a>
                    </div>
                  )
                )}
                {pageKey === "services/tax-vat-compliance" && section.heading === "Why the accounting-to-tax bridge matters" && (
                  <SecondaryExample kind="tax-adjustment" />
                )}
                {pageKey === "insights/profit-and-cash" && section.heading === "Test one realistic delay" && (
                  <SecondaryExample kind="delayed-collection" />
                )}
                {isExampleSection && (
                  heroExample ? <ExampleIllustrationLink pageKey={pageKey} href="#example-illustration" label="View the illustration ↑" />
                  : profitGuide ? <>
                    <GuideCashChart view="movements" />
                    <a className="text-link" href="#cash-bridge">See the cash bridge ↓</a>
                  </>
                  : <WorkedExampleFigure pageKey={pageKey} />
                )}
                {(section.blocks ?? [...section.paragraphs, section.bullets]).map((block) =>
                  typeof block === "string" ? <p key={block}><CopyText text={block} /></p>
                  : isCashBridge ? <CashBridgeWorksheet key={section.heading} />
                  : block.length > 0 && (
                  <ul key={block[0]}>
                    {block.map((text) => (
                      <li key={text}>
                        <CopyText text={text} />
                      </li>
                    ))}
                  </ul>
                ))}
                {isWorkedExample && (
                  <p><Link href={example.servicePath}>{example.service}</Link></p>
                )}
                {pageKey === "about" &&
                  section.heading === "Meet the people behind the work" && (
                    <div id="team">
                      <TeamGrid />
                    </div>
                  )}
              </section>
              );
            })}
          </div>
        </div>
        <Faqs items={page.faqs} />
        {page.related.length > 0 && (
          <section className="accounting-related accounting-wrap">
            <p className="eyebrow">Related services and guides</p>
            <div>
              {page.related.map((link) => (
                <Link
                  key={link.route}
                  href={contentPath(link.target?.page_key ?? link.route)}
                >
                  {link.label}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}
        <section className="accounting-closing accounting-wrap">
          <p className="eyebrow">Get in touch</p>
          <h2>{closingHeading}</h2>
          <EnquiryLink label={closingHeading === page.cta ? "Open enquiry form" : page.cta} service={context} market={market} />
        </section>
      </main>
    </>
  );
}
