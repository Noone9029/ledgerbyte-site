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
      {text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g).map((part, i) => {
        const link = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(part);
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
}: {
  label: string;
  service?: string;
}) {
  return (
    <Link
      className="button button-amber"
      href={service ? serviceContactHref(service) : "/contact"}
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
export function TeamGrid({ locale = "en" }: { locale?: "en" | "ar" }) {
  const roles: Record<string, string> = { "Managing Partner": "الشريك الإداري", "CTO": "المدير التقني", "Financial Controller": "المراقب المالي", "Fractional Controller": "المراقب المالي الجزئي", "Customer Success Manager": "مديرة نجاح العملاء", "Senior Tax Consultant": "مستشار ضرائب أول" };
  return (
    <div className="accounting-team-grid">
      {team.map((person) => (
        <article key={person.name}>
          <Link href={buildPersonPath(person.name)}>
            <div className="accounting-portrait">
              <Image
                src={person.image}
                alt={person.name}
                unoptimized
                fill
                sizes="(max-width: 600px) 44vw, (max-width: 1000px) 28vw, 18vw"
              />
            </div>
            <h3>{person.name}</h3>
          </Link>
          <p>{locale === "ar" ? roles[person.role] || person.role : person.role}</p>
          <small>{person.credentials}</small>
        </article>
      ))}
    </div>
  );
}
export function ContentPage({ pageKey }: { pageKey: string }) {
  const page = accountingPages[pageKey];
  const example = guideExamples[pageKey];
  const dateModified = getPageSeo(page.path as SeoPagePath)?.lastModified ?? "2026-11-10";
  const service = accountingServices.find((item) => item.key === pageKey);
  const group =
    service?.group ??
    (pageKey.startsWith("regions/")
      ? "Markets"
      : pageKey.startsWith("insights/")
        ? "Insights"
        : "Accounting. Tax. Advisory.");
  const context =
    service?.title ?? (pageKey === "uae-vat" ? "UAE VAT support" : undefined);
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
            <EnquiryLink label={page.cta} service={context} />
          </div>
          {service ? (
            <aside className="accounting-output">
              <span className="accounting-mark" aria-hidden="true">
                ↗
              </span>
              <p className="eyebrow">Typical output</p>
              <p>{service.output}</p>
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
              <p>{example.summary}</p>
              <a href="#worked-example">See the calculation</a>
              <hr />
              <small><a href={example.url}>{example.reference}</a></small>
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
            {page.sections.map((section, i) => (
              <section id={`section-${i + 1}`} key={section.heading}>
                <span className="accounting-section-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 id={example && section.heading.startsWith("Worked example") ? "worked-example" : undefined}>{section.heading}</h2>
                {(section.blocks ?? [...section.paragraphs, section.bullets]).map((block) =>
                  typeof block === "string" ? <p key={block}><CopyText text={block} /></p> : block.length > 0 && (
                  <ul key={block[0]}>
                    {block.map((text) => (
                      <li key={text}>
                        <CopyText text={text} />
                      </li>
                    ))}
                  </ul>
                ))}
                {example && section.heading.startsWith("Worked example") && (
                  <p><Link href={example.servicePath}>{example.service}</Link></p>
                )}
                {pageKey === "about" &&
                  section.heading === "Meet the people behind the work" && (
                    <div id="team">
                      <TeamGrid />
                    </div>
                  )}
              </section>
            ))}
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
          <h2>{page.cardStrapline || page.cta}</h2>
          <EnquiryLink label={page.cta} service={context} />
        </section>
      </main>
    </>
  );
}
