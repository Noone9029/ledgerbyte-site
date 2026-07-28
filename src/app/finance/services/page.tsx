import Link from "next/link";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { InfiniteMarquee } from "@/components/sections/infinite-marquee";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredData } from "@/components/structured-data";
import {
  financeServiceGroups,
  financeServices,
  financeTools,
  getFinanceServiceByTitle,
} from "@/content";
import {
  getFinanceServiceSeoTitle,
  getPageSeo,
} from "@/content/seo";
import { financeVisual } from "@/content/visuals";
import {
  buildItemListSchema,
  buildSchemaGraph,
  buildServiceSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const pageSeo = getPageSeo("/finance/services");

export const metadata = createPageMetadata(pageSeo, {
  path: "/finance/services",
});

export default function FinanceServicesPage() {
  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: "/finance/services",
            name: pageSeo.title,
            description: pageSeo.description,
            type: "CollectionPage",
          }),
          buildServiceSchema({
            path: "/finance/services",
            name: pageSeo.title,
            description: pageSeo.description,
            serviceType: financeServices.map((service) =>
              getFinanceServiceSeoTitle(service.slug, service.title),
            ),
          }),
          buildItemListSchema({
            name: pageSeo.title,
            items: financeServices.map((service) => ({
              name: getFinanceServiceSeoTitle(
                service.slug,
                service.title,
              ),
              path: `/finance/services/${service.slug}`,
            })),
          }),
        )}
      />
      <main id="main-content">
        <PageMotion>
        <section className="inner-hero page-section">
          <CinematicMedia
            className="inner-hero-art hero-reveal"
            src={financeVisual}
            mode="overlay"
            copySide="left"
            priority
          >
            <div className="inner-hero-copy">
              <p className="eyebrow hero-reveal">Our Services</p>
              <h1 className="hero-reveal">{pageSeo.title}</h1>
              <p className="hero-summary hero-reveal">
                End-to-end accounting, reporting, compliance, and finance
                support for businesses that want cleaner operations, sharper
                visibility, and better financial decision-making.
              </p>
              <p className="hero-reveal">
                From monthly bookkeeping and payroll support to reporting,
                forecasting, automation, and CFO-level advisory, LedgerByte
                helps global businesses build a stronger finance function at
                every stage.
              </p>
              <Link className="button button-amber hero-reveal" href="/contact">
                Get Started Today
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </CinematicMedia>
        </section>

        <section className="service-groups page-section">
          {financeServiceGroups.map((group) => (
            <article className="service-group-card motion-reveal" key={group.title}>
              <p className="eyebrow">{group.title}</p>
              <h2>{group.description}</h2>
              <span>{group.services.length} services in this area</span>
              <div>
                {group.services.map((title) => {
                  const service = getFinanceServiceByTitle(title);
                  return service ? (
                    <Link
                      href={`/finance/services/${service.slug}`}
                      key={service.slug}
                    >
                      {getFinanceServiceSeoTitle(
                        service.slug,
                        service.title,
                      )}
                      <ArrowUpRight weight="bold" aria-hidden="true" />
                    </Link>
                  ) : null;
                })}
              </div>
            </article>
          ))}
        </section>

        <section className="service-index-section page-section">
          <SectionHeading
            eyebrow="Our Service Lines"
            title="A focused suite of finance, accounting, compliance, and advisory services designed to work together as your business grows."
          />
          <div className="service-card-grid">
            {financeServices.map((service) => (
              <Link
                className="service-card motion-reveal"
                href={`/finance/services/${service.slug}`}
                key={service.slug}
              >
                <p className="eyebrow">{service.category}</p>
                <h2>
                  {getFinanceServiceSeoTitle(
                    service.slug,
                    service.title,
                  )}
                </h2>
                <p>{service.description}</p>
                <div className="service-included">
                  <strong>What&apos;s Included:</strong>
                  {service.deliverables.slice(0, 3).map((deliverable) => (
                    <span key={deliverable}>
                      <Check weight="bold" aria-hidden="true" />
                      {deliverable}
                    </span>
                  ))}
                </div>
                <div className="service-fit">
                  <span>Best for</span>
                  <p>{service.idealFor[0]}</p>
                </div>
                <strong className="service-card-link">
                  View service
                  <ArrowUpRight weight="bold" aria-hidden="true" />
                </strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="tools-section page-section">
          <SectionHeading
            eyebrow="Our Tech Stack"
            title="Powered by trusted finance and reporting tools that support cleaner operations and better visibility."
          />
          <InfiniteMarquee items={financeTools} />
        </section>

        <ConsultationCta
          title="Build a Stronger Finance Function"
          description="Whether you need better books, tighter compliance, stronger reporting, or more strategic finance support, we can help shape a service mix that fits your stage and operating model."
          buttonLabel="Talk to Our Team"
        />
        </PageMotion>
      </main>
    </>
  );
}
