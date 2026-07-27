import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceAccordion } from "@/components/sections/service-accordion";
import { StructuredData } from "@/components/structured-data";
import {
  technologyAdvantages,
  technologyProcess,
  technologyServices,
  technologyStats,
} from "@/content";
import { technologyVisual } from "@/content/visuals";

export const metadata: Metadata = {
  title: "Technology Solutions",
  description:
    "LedgerByte Tech delivers cutting-edge web, mobile, cloud, and AI solutions designed for reliability, security, and long-term growth.",
  alternates: { canonical: "/technology" },
  openGraph: {
    images: [technologyVisual],
  },
};

export default function TechnologyPage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "LedgerByte Technology",
          provider: {
            "@type": "Organization",
            name: "LedgerByte",
          },
          serviceType: technologyServices.map((service) => service.title),
          areaServed: "Worldwide",
        }}
      />
      <main id="main-content">
        <PageMotion>
          <section className="division-hero technology-hero page-section">
            <CinematicMedia
              className="division-hero-art hero-reveal"
              src={technologyVisual}
              mode="overlay"
              copySide="left"
              priority
              frameOverlay={
                <span className="image-note">SECURE ARCHITECTURE</span>
              }
            >
              <div className="division-hero-copy">
                <p className="eyebrow hero-reveal">Innovating the Future</p>
                <h1 className="hero-reveal">
                  Tech Solutions That Scale With Your Business
                </h1>
                <p className="hero-summary hero-reveal">
                  LedgerByte Tech delivers cutting-edge web, mobile, cloud, and
                  AI solutions designed for reliability, security, and
                  long-term growth.
                </p>
                <div className="hero-actions hero-reveal">
                  <Link className="button button-amber" href="/contact">
                    Get a Quote
                    <ArrowUpRight weight="bold" aria-hidden="true" />
                  </Link>
                  <Link className="text-link" href="/technology/services">
                    Talk to an Expert
                    <ArrowUpRight weight="bold" aria-hidden="true" />
                  </Link>
                </div>
                <div className="hero-assurances hero-reveal">
                  <span>
                    <ShieldCheck aria-hidden="true" />
                    Secure Architecture
                  </span>
                  <span>
                    <CheckCircle aria-hidden="true" />
                    Scalable Solutions
                  </span>
                </div>
              </div>
            </CinematicMedia>
          </section>

          <section className="stats-band page-section">
            {technologyStats.map(([value, label]) => (
              <article key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </section>

          <section className="services-showcase page-section">
            <SectionHeading
              eyebrow="Our Services"
              title="Comprehensive technology solutions tailored to your business needs"
            />
            <ServiceAccordion
              services={technologyServices}
              basePath="/technology/services"
            />
            <Link className="button button-outline" href="/technology/services">
              View All Services
              <ArrowUpRight weight="bold" aria-hidden="true" />
            </Link>
          </section>

          <section className="process-preview page-section">
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
            <Link className="text-link" href="/technology/process">
              Process
              <ArrowUpRight weight="bold" aria-hidden="true" />
            </Link>
          </section>

          <section className="advantage-section page-section">
            <SectionHeading
              eyebrow="Why Choose LedgerByte Tech?"
              title="Your Technology Partner for the Long Haul"
              description="Built on trust, driven by excellence, focused on your success"
            />
            <div className="advantage-grid">
              {technologyAdvantages.map((advantage) => (
                <article className="advantage-card motion-reveal" key={advantage.title}>
                  <h3>{advantage.title}</h3>
                  <p>{advantage.description}</p>
                </article>
              ))}
            </div>
            <Link
              className="button button-outline"
              href="/technology/why-ledgerbyte"
            >
              Why LedgerByte Tech
              <ArrowUpRight weight="bold" aria-hidden="true" />
            </Link>
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
