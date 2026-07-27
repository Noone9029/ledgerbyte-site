import Link from "next/link";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { ScrubText } from "@/components/motion/scrub-text";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { InfiniteMarquee } from "@/components/sections/infinite-marquee";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceAccordion } from "@/components/sections/service-accordion";
import { StructuredData } from "@/components/structured-data";
import {
  financeServices,
  financeTools,
  team,
  trustPoints,
} from "@/content";
import { getPageSeo } from "@/content/seo";
import { financeOversightVisual, financeVisual } from "@/content/visuals";
import {
  buildSchemaGraph,
  buildServiceSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const pageSeo = getPageSeo("/finance");

export const metadata = createPageMetadata(pageSeo, { path: "/finance" });

export default function FinancePage() {
  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: "/finance",
            name: pageSeo.title,
            description: pageSeo.description,
          }),
          buildServiceSchema({
            path: "/finance",
            name: "LedgerByte Finance",
            description: pageSeo.description,
            serviceType: financeServices.map((service) => service.title),
          }),
        )}
      />
      <main id="main-content">
        <PageMotion>
          <section className="division-hero finance-hero page-section">
            <CinematicMedia
              className="division-hero-art hero-reveal"
              src={financeVisual}
              mode="overlay"
              copySide="left"
              priority
              frameOverlay={
                <span className="image-note">SMART ACCOUNTING</span>
              }
            >
              <div className="division-hero-copy">
                <p className="eyebrow hero-reveal">Smart Accounting</p>
                <h1 className="hero-reveal">
                  Smart Accounting, Confident Decisions, Seamless Growth
                </h1>
                <div className="hero-lines hero-reveal">
                  <p>
                    Expert Remote Accountants delivering precise, reliable
                    financial management.
                  </p>
                  <p>
                    Automated Bookkeeping &amp; Real-Time Reporting for total
                    visibility.
                  </p>
                  <p>
                    VAT, Zakat &amp; Corporate Tax Compliance handled with
                    accuracy and ease.
                  </p>
                </div>
                <div className="hero-actions hero-reveal">
                  <Link className="button button-amber" href="/contact">
                    Book Your Free Consultation
                    <ArrowUpRight weight="bold" aria-hidden="true" />
                  </Link>
                  <Link className="text-link" href="/finance/services">
                    Explore All Services
                    <ArrowUpRight weight="bold" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </CinematicMedia>
          </section>

          <section className="trust-section page-section trust-on-ivory">
            <SectionHeading
              eyebrow="Why Teams Trust LedgerByte"
              title="Finance Services Built for Growing Businesses"
            />
            <div className="trust-bento">
              {trustPoints.map((point, index) => (
                <article
                  className={`trust-card ${index === 0 ? "trust-lead" : ""} ${
                    index === 3 ? "trust-wide" : ""
                  } motion-reveal`}
                  key={point.title}
                >
                  <h3>{point.title}</h3>
                  <p>{point.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="services-showcase page-section">
            <SectionHeading
              eyebrow="Our Services"
              title="Finance, reporting, and advisory services designed for growing businesses"
              description="A focused suite of finance, accounting, compliance, and advisory services designed to work together as your business grows."
            />
            <ServiceAccordion
              services={financeServices}
              basePath="/finance/services"
            />
            <Link className="button button-outline" href="/finance/services">
              Explore All Services
              <ArrowUpRight weight="bold" aria-hidden="true" />
            </Link>
          </section>

          <section className="statement-section page-section">
            <ScrubText>
              Ledger Byte helps startups and SMEs run their finances smarter.
            </ScrubText>
          </section>

          <section className="review-section page-section">
            <div className="review-copy">
              <p className="eyebrow">Qualified Finance Oversight</p>
              <h2>Our Team</h2>
              <p>
                Qualified finance leadership across bookkeeping, reporting,
                tax, payroll, and advisory support
              </p>
              <Link className="text-link" href="/about#team">
                Our Team
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </Link>
            </div>
            <div className="review-team">
              <CinematicMedia
                className="review-team-visual motion-reveal"
                src={financeOversightVisual}
              />
              <div className="reviewer-credentials">
                {team.slice(0, 3).map((member) => (
                  <article
                    className="reviewer-card reviewer-card-compact motion-reveal"
                    key={member.name}
                  >
                    <div>
                      <p>{member.credentials}</p>
                      <h3>{member.name}</h3>
                      <span>{member.role}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="tools-section page-section">
            <SectionHeading
              eyebrow="Our Tech Stack"
              title="Powered by trusted finance and reporting tools that support cleaner operations and better visibility."
            />
            <InfiniteMarquee items={financeTools} />
            <div className="finance-promises">
              {[
                "Remote-first delivery that fits distributed teams and global operating models",
                "Bookkeeping, compliance, reporting, payroll, and planning support under one roof",
                "Practical communication, documented workflows, and proactive guidance as your needs evolve",
              ].map((item) => (
                <p key={item}>
                  <Check weight="bold" aria-hidden="true" />
                  {item}
                </p>
              ))}
            </div>
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
