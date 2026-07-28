import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { InfiniteMarquee } from "@/components/sections/infinite-marquee";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredData } from "@/components/structured-data";
import {
  getTechnologyService,
  technologyAdvantages,
  technologyProcess,
  technologyServices,
} from "@/content";
import { getTechnologyServiceSeoTitle } from "@/content/seo";
import {
  getTechnologyPartnershipVisual,
  getTechnologyServiceVisual,
} from "@/content/visuals";
import {
  buildBreadcrumbSchema,
  buildSchemaGraph,
  buildServiceSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { createMetadata } from "@/lib/seo";

interface TechnologyServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return technologyServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: TechnologyServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getTechnologyService(slug);
  if (!service) return {};

  return createMetadata({
    path: `/technology/services/${service.slug}`,
    title: getTechnologyServiceSeoTitle(service.slug, service.title),
    description: service.description,
    image: getTechnologyServiceVisual(service.slug),
  });
}

export default async function TechnologyServicePage({
  params,
}: TechnologyServicePageProps) {
  const { slug } = await params;
  const service = getTechnologyService(slug);
  if (!service) notFound();

  const serviceVisual = getTechnologyServiceVisual(service.slug);
  const partnershipServiceVisual = getTechnologyPartnershipVisual(service.slug);

  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: `/technology/services/${service.slug}`,
            name: service.title,
            description: service.description,
            dateModified: "2026-07-28",
          }),
          buildBreadcrumbSchema([
            { name: "Technology", path: "/technology" },
            { name: "Technology Services", path: "/technology/services" },
            {
              name: service.title,
              path: `/technology/services/${service.slug}`,
            },
          ]),
          buildServiceSchema({
            path: `/technology/services/${service.slug}`,
            name: service.title,
            description: service.description,
          }),
        )}
      />
      <main id="main-content">
        <PageMotion>
          <nav className="breadcrumbs page-section" aria-label="Breadcrumb">
            <Link href="/technology">Technology</Link>
            <span>/</span>
            <Link href="/technology/services">Services</Link>
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
              <div className="service-detail-copy" data-aeo-answer>
                <p className="eyebrow hero-reveal">LedgerByte Tech</p>
                <h1 className="hero-reveal">{service.title}</h1>
                <p className="hero-summary hero-reveal">
                  {service.description}
                </p>
                <Link className="button button-amber hero-reveal" href="/contact">
                  Get a Quote
                  <ArrowUpRight weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </CinematicMedia>
          </section>

          <section className="deliverables-section page-section">
            <SectionHeading
              eyebrow="Key Features"
              title={service.title}
            />
            <div className="deliverables-grid">
              {service.features.map((feature) => (
                <article className="deliverable-card motion-reveal" key={feature}>
                  <Check weight="bold" aria-hidden="true" />
                  <p>{feature}</p>
                </article>
              ))}
            </div>
            <InfiniteMarquee items={service.technologies} />
          </section>

          <section className="process-detail page-section">
            <SectionHeading
              eyebrow="Our Development Process"
              title="A proven methodology that delivers exceptional results, from initial concept to ongoing support"
              description="Every step is designed to ensure transparency, quality, and success"
            />
            <div className="stack-cards">
              {technologyProcess.steps.map((step, index) => (
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

          <section className="advantage-section page-section">
            <SectionHeading
              eyebrow="Our Competitive Advantages"
              title="What sets us apart in a crowded marketplace"
            />
            <div className="advantage-grid">
              {technologyAdvantages.map((advantage) => (
                <article className="advantage-card motion-reveal" key={advantage.title}>
                  <h3>{advantage.title}</h3>
                  <p>{advantage.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="partnership-promise page-section">
            <div className="partnership-promise-copy">
              <p className="eyebrow">Our Partnership Promise</p>
              <h2>Your Technology Partner for the Long Haul</h2>
              <p>
                When you work with LedgerByte Tech, you&apos;re not just hiring
                a vendor, you&apos;re gaining a strategic partner committed to
                your success. We&apos;re in this for the long haul, and
                we&apos;ll be with you every step of the way as your business
                grows and evolves.
              </p>
              <Link className="text-link" href="/technology/why-ledgerbyte">
                Why LedgerByte Tech
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </Link>
            </div>
            <CinematicMedia
              className="partnership-promise-art motion-reveal"
              src={partnershipServiceVisual}
            />
          </section>

          <ConsultationCta
            title="Ready to Transform Your Business?"
            description="Let's discuss your project and explore how LedgerByte Tech can deliver the solutions you need."
            buttonLabel="Start Your Project Today"
          />
        </PageMotion>
      </main>
    </>
  );
}
