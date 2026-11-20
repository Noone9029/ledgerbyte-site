import { technologyEnquiryHref } from "@/lib/enquiry-options";
import { BuilderExample } from "./builder-example";
import styles from "./service.module.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { StructuredData } from "@/components/structured-data";
import {
  getTechnologyService,
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

export const dynamicParams = false;

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
      <main id="main-content" className={styles.page}>
        <PageMotion>
          <nav className={`breadcrumbs page-section ${styles.breadcrumbs}`} aria-label="Breadcrumb">
            <Link href="/technology">Technology</Link>
            <span>/</span>
            <Link href="/technology/services">Services</Link>
            <span>/</span>
            <span aria-current="page">{service.title}</span>
          </nav>

          <section className={`service-detail-hero page-section ${styles.hero}`}>
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
                <Link className="button button-amber hero-reveal" href={technologyEnquiryHref(service.title)}>
                  Get a Quote
                  <ArrowUpRight weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </CinematicMedia>
          </section>

          {service.slug === "web-development" && <BuilderExample />}
          <section className={styles.specs} aria-labelledby="features-heading">
            <div>
              <h2 id="features-heading">Key features</h2>
              <ul className={styles.features}>
                {service.features.map((feature) => (
                  <li key={feature}><Check weight="bold" aria-hidden="true" />{feature}</li>
                ))}
              </ul>
              <h3>Technologies</h3>
              <ul className={styles.tools}>{service.technologies.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="hero-actions">
                <Link className="button button-amber" href={technologyEnquiryHref(service.title)}>
                  Discuss your project <ArrowUpRight weight="bold" aria-hidden="true" />
                </Link>
                <Link className="text-link" href="/technology/process">Our development process ↗</Link>
              </div>
            </div>
            <CinematicMedia
              className="partnership-promise-art motion-reveal"
              src={partnershipServiceVisual}
            />
          </section>

        </PageMotion>
      </main>
    </>
  );
}
