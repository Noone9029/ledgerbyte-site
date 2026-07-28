import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  SealCheck,
} from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { ScrubText } from "@/components/motion/scrub-text";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { InfiniteMarquee } from "@/components/sections/infinite-marquee";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredData } from "@/components/structured-data";
import {
  financeServices,
  getFinanceService,
} from "@/content";
import { getFinanceServiceSeoTitle } from "@/content/seo";
import { getFinanceServiceVisual } from "@/content/visuals";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildPersonId,
  buildPersonSchema,
  buildSchemaGraph,
  buildServiceSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { createMetadata } from "@/lib/seo";

const supplementalRelatedServiceSlugs: Partial<Record<string, string[]>> = {
  "accounting-bookkeeping": ["payroll-wps-management"],
  "tax-vat-compliance": ["payroll-wps-management"],
};

interface FinanceServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return financeServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: FinanceServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getFinanceService(slug);

  if (!service) return {};

  return createMetadata({
    path: `/finance/services/${service.slug}`,
    title: getFinanceServiceSeoTitle(service.slug, service.seo.title),
    description: service.seo.description,
    image: getFinanceServiceVisual(service.slug),
  });
}

export default async function FinanceServicePage({
  params,
}: FinanceServicePageProps) {
  const { slug } = await params;
  const service = getFinanceService(slug);

  if (!service) notFound();

  const serviceVisual = getFinanceServiceVisual(service.slug);
  const serviceSeoTitle = getFinanceServiceSeoTitle(
    service.slug,
    service.title,
  );
  const reviewerId = buildPersonId(service.reviewer.name);
  const relatedServiceTitles = new Set(
    service.relatedServices.map((related) => related.title),
  );
  const supplementalSlugs = new Set(
    supplementalRelatedServiceSlugs[service.slug] ?? [],
  );
  const relatedServices = financeServices.filter(
    (candidate) =>
      candidate.slug !== service.slug &&
      (relatedServiceTitles.has(candidate.title) ||
        supplementalSlugs.has(candidate.slug)),
  );

  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: `/finance/services/${service.slug}`,
            name: serviceSeoTitle,
            description: service.description,
            reviewedBy: reviewerId,
          }),
          buildBreadcrumbSchema([
            { name: "Finance", path: "/finance" },
            { name: "Finance Services", path: "/finance/services" },
            {
              name: service.title,
              path: `/finance/services/${service.slug}`,
            },
          ]),
          buildServiceSchema({
            path: `/finance/services/${service.slug}`,
            name: serviceSeoTitle,
            description: service.description,
            serviceType: service.primaryFocus,
          }),
          buildPersonSchema({
            name: service.reviewer.name,
            jobTitle: service.reviewer.role,
            description: service.reviewer.summary,
            credentials: service.reviewer.credentials,
          }),
          buildFaqSchema(service.faqs),
        )}
      />
      <main id="main-content">
        <PageMotion>
          <nav className="breadcrumbs page-section" aria-label="Breadcrumb">
            <Link href="/finance">Finance</Link>
            <span>/</span>
            <Link href="/finance/services">Services</Link>
            <span>/</span>
            <span aria-current="page">{service.title}</span>
          </nav>

          <section className="service-detail-hero page-section">
            <CinematicMedia
              className="service-detail-art hero-reveal"
              src={serviceVisual}
              mode="overlay"
              copySide="left"
              priority
            >
              <div className="service-detail-copy">
                <p className="eyebrow hero-reveal">{service.category}</p>
                <h1 className="hero-reveal">{serviceSeoTitle}</h1>
                <p className="hero-summary hero-reveal">
                  {service.description}
                </p>
                <div className="outcome-list hero-reveal">
                  {service.outcomes.map((outcome) => (
                    <p key={outcome}>
                      <Check weight="bold" aria-hidden="true" />
                      {outcome}
                    </p>
                  ))}
                </div>
                <Link className="button button-amber hero-reveal" href="/contact">
                  Book Your Free Consultation
                  <ArrowUpRight weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </CinematicMedia>
          </section>

          <section className="reviewer-band page-section">
            <div>
              <p className="eyebrow">Expert Reviewed</p>
              <h2>{service.reviewer.name}</h2>
              <span>
                {service.reviewer.role} · {service.reviewer.credentials}
              </span>
            </div>
            <p>{service.reviewer.summary}</p>
            <SealCheck weight="light" aria-hidden="true" />
          </section>

          <section className="service-overview page-section">
            <div className="service-overview-title">
              <h2>{service.overviewHeading}</h2>
            </div>
            <div className="ideal-fit-column">
              <p className="eyebrow">Ideal For</p>
              <div className="ideal-fit-list">
                {service.idealFor.map((item) => (
                  <p key={item}>
                    <Check weight="bold" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="service-prose">
              {service.overview.map((paragraph, index) =>
                index === 0 ? (
                  <ScrubText key={paragraph}>{paragraph}</ScrubText>
                ) : (
                  <p className="motion-reveal" key={paragraph}>
                    {paragraph}
                  </p>
                ),
              )}
            </div>
          </section>

          <section className="deliverables-section page-section">
            <SectionHeading
              eyebrow="What’s Included"
              title={service.title}
            />
            <div className="deliverables-grid">
              {service.deliverables.map((deliverable) => (
                <article className="deliverable-card motion-reveal" key={deliverable}>
                  <Check weight="bold" aria-hidden="true" />
                  <p>{deliverable}</p>
                </article>
              ))}
            </div>
            <InfiniteMarquee items={service.platforms} />
          </section>

          <section className="process-detail page-section">
            <SectionHeading
              eyebrow="How this engagement usually works"
              title={service.processIntro}
            />
            <div className="stack-cards">
              {service.process.map((step, index) => (
                <article
                  className="stack-card"
                  style={{ "--stack-index": index } as React.CSSProperties}
                  key={step.step}
                >
                  <span>{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="trust-proof page-section">
            <SectionHeading
              eyebrow="Why businesses trust LedgerByte on this work"
              title={service.title}
            />
            <div className="proof-list">
              {service.trustPoints.map((point) => (
                <p className="motion-reveal" key={point}>
                  <SealCheck weight="light" aria-hidden="true" />
                  {point}
                </p>
              ))}
            </div>
          </section>

          <section className="examples-section page-section">
            <SectionHeading
              eyebrow="Typical engagement examples"
              title={service.title}
            />
            <div className="example-grid">
              {service.engagementExamples.map((example) => (
                <article className="example-card motion-reveal" key={example.title}>
                  <p className="eyebrow">{example.profile}</p>
                  <h3>{example.title}</h3>
                  <dl>
                    <div>
                      <dt>Challenge</dt>
                      <dd>{example.challenge}</dd>
                    </div>
                    <div>
                      <dt>Result</dt>
                      <dd>{example.result}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          {service.relatedResources.length ? (
            <section className="related-section page-section">
              <SectionHeading
                eyebrow="Related resources from LedgerByte Insights"
                title="Supporting reading that connects directly to this service area and the decisions growing finance teams usually face next."
              />
              <div className="related-grid">
                {service.relatedResources.map((resource) => (
                  <a href={resource.href} key={resource.title}>
                    <p className="eyebrow">{resource.pillar}</p>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <span>
                      Read insight
                      <ArrowUpRight weight="bold" aria-hidden="true" />
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          <section className="faq-section page-section">
            <SectionHeading
              eyebrow="Frequently asked questions"
              title={service.title}
            />
            <div className="faq-list">
              {service.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {relatedServices.length ? (
            <section className="related-section page-section">
              <SectionHeading
                eyebrow="Related services"
                title="Related services that usually strengthen the same reporting, compliance, planning, or finance-operations goals."
              />
              <div className="related-grid">
                {relatedServices.map((related) => (
                  <Link
                    href={`/finance/services/${related.slug}`}
                    key={related.slug}
                  >
                    <p className="eyebrow">{related.category}</p>
                    <h3>
                      {getFinanceServiceSeoTitle(
                        related.slug,
                        related.title,
                      )}
                    </h3>
                    <p>{related.description}</p>
                    <span>
                      View service
                      <ArrowUpRight weight="bold" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <ConsultationCta
            title={service.cta.title}
            description={service.cta.description}
          />
        </PageMotion>
      </main>
    </>
  );
}
