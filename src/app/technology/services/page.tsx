import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { technologyServices } from "@/content";
import { technologyVisual } from "@/content/visuals";

export const metadata: Metadata = {
  title: "Technology Services",
  description:
    "Comprehensive technology solutions designed to transform your business and drive growth",
  alternates: { canonical: "/technology/services" },
};

export default function TechnologyServicesPage() {
  return (
    <main id="main-content">
      <PageMotion>
        <section className="inner-hero page-section">
          <CinematicMedia
            className="inner-hero-art hero-reveal"
            src={technologyVisual}
            mode="overlay"
            copySide="left"
            priority
          >
            <div className="inner-hero-copy">
              <p className="eyebrow hero-reveal">Our Services</p>
              <h1 className="hero-reveal">
                Comprehensive Technology Solutions
              </h1>
              <p className="hero-summary hero-reveal">
                Comprehensive technology solutions designed to transform your
                business and drive growth
              </p>
              <Link className="button button-amber hero-reveal" href="/contact">
                Get a Quote
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </CinematicMedia>
        </section>

        <section className="service-index-section page-section">
          <SectionHeading
            eyebrow="Our Services"
            title="Comprehensive technology solutions tailored to your business needs"
          />
          <div className="service-card-grid technology-service-grid">
            {technologyServices.map((service) => (
              <Link
                className="service-card motion-reveal"
                href={`/technology/services/${service.slug}`}
                key={service.slug}
              >
                <p className="eyebrow">LedgerByte Tech</p>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <div className="service-included">
                  {service.features.slice(0, 4).map((feature) => (
                    <span key={feature}>
                      <Check weight="bold" aria-hidden="true" />
                      {feature}
                    </span>
                  ))}
                </div>
                <strong className="service-card-link">
                  Learn more
                  <ArrowUpRight weight="bold" aria-hidden="true" />
                </strong>
              </Link>
            ))}
          </div>
        </section>

        <ConsultationCta
          title="Ready to Transform Your Business?"
          description="Let's discuss your project and explore how LedgerByte Tech can deliver the solutions you need."
          buttonLabel="Start Your Project Today"
        />
      </PageMotion>
    </main>
  );
}
