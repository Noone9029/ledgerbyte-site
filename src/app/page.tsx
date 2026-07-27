import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { ScrubText } from "@/components/motion/scrub-text";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredData } from "@/components/structured-data";
import { contactDetails, team, trustPoints } from "@/content";
import { corporateVisual } from "@/content/visuals";

export const metadata: Metadata = {
  title: "Finance + Technology",
  description:
    "Elevating business performance through clarity, compliance, and smart finance.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "LedgerByte",
          url: "https://ledgerbyte.io",
          email: contactDetails.email,
          telephone: contactDetails.phoneHref,
          address: {
            "@type": "PostalAddress",
            ...contactDetails.address,
          },
          description:
            "Elevating business performance through clarity, compliance, and smart finance.",
        }}
      />
      <main id="main-content">
        <PageMotion>
          <section className="corporate-hero page-section">
            <CinematicMedia
              className="corporate-hero-visual hero-reveal"
              src={corporateVisual}
              mode="overlay"
              copySide="left"
              priority
              frameOverlay={
                <div className="art-caption">
                  <span>FINANCE</span>
                  <span>TECHNOLOGY</span>
                </div>
              }
            >
              <div className="corporate-hero-copy">
                <p className="eyebrow hero-reveal">LEDGERBYTE</p>
                <h1 className="hero-reveal">
                  Clarity, compliance, and smart finance.
                </h1>
                <p className="hero-summary hero-reveal">
                  Elevating business performance through clarity, compliance,
                  and smart finance.
                </p>
                <div className="hero-actions hero-reveal">
                  <Link className="button button-amber" href="/finance">
                    Finance
                    <ArrowRight weight="bold" aria-hidden="true" />
                  </Link>
                  <Link className="text-link" href="/technology">
                    Technology
                    <ArrowUpRight weight="bold" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </CinematicMedia>
          </section>

          <section className="division-gateway page-section">
            <Link className="division-door finance-door" href="/finance">
              <p className="eyebrow">Smart Accounting</p>
              <h2>Smart Accounting, Confident Decisions, Seamless Growth</h2>
              <p>
                Expert Remote Accountants delivering precise, reliable
                financial management.
              </p>
              <span>
                Finance
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </span>
            </Link>
            <Link className="division-door technology-door" href="/technology">
              <p className="eyebrow">Innovating the Future</p>
              <h2>Tech Solutions That Scale With Your Business</h2>
              <p>
                LedgerByte Tech delivers cutting-edge web, mobile, cloud, and AI
                solutions designed for reliability, security, and long-term
                growth.
              </p>
              <span>
                Technology
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </span>
            </Link>
          </section>

          <section className="statement-section page-section">
            <ScrubText>
              We bring tech, automation, and expert accounting together — so you
              can stay compliant, save time, and focus on growing your business.
            </ScrubText>
          </section>

          <section className="trust-section page-section">
            <SectionHeading
              eyebrow="Why Teams Trust LedgerByte"
              title="Transparent. Accurate. Modern. That’s how Ledger Byte does finance."
              description="By blending practical finance insight with innovative fintech, we help businesses operate with precision, scale with confidence, and grow with stronger financial discipline."
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

          <section className="credentials-strip page-section">
            <p className="eyebrow">Qualified Finance Oversight</p>
            <div>
              {team.slice(0, 3).map((member) => (
                <article key={member.name}>
                  <span>{member.credentials}</span>
                  <h2>{member.name}</h2>
                  <p>{member.role}</p>
                </article>
              ))}
            </div>
            <Link className="text-link" href="/about#team">
              Our Team
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
