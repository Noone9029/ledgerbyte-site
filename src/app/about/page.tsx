import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { ScrubText } from "@/components/motion/scrub-text";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import {
  companyPrinciples,
  companyStory,
  companyValues,
  team,
  technologyValues,
} from "@/content";
import { corporateVisual } from "@/content/visuals";

export const metadata: Metadata = {
  title: "About LedgerByte",
  description:
    "We are a forward-thinking financial technology company dedicated to revolutionizing how businesses manage their accounting, compliance, and growth strategies in global markets.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageMotion>
        <section className="inner-hero page-section">
          <CinematicMedia
            className="inner-hero-art hero-reveal"
            src={corporateVisual}
            mode="overlay"
            copySide="left"
            priority
          >
            <div className="inner-hero-copy">
              <p className="eyebrow hero-reveal">About Ledger Byte</p>
              <h1 className="hero-reveal">Building the future</h1>
              <p className="hero-summary hero-reveal">
                Building the future through innovative technology and trusted
                partnerships
              </p>
              <p className="hero-summary hero-reveal">
                We are a forward-thinking financial technology company
                dedicated to revolutionizing how businesses manage their
                accounting, compliance, and growth strategies in global
                markets.
              </p>
              <Link className="button button-amber hero-reveal" href="/contact">
                Let&apos;s Connect
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </CinematicMedia>
        </section>

        <section className="story-section page-section">
          <SectionHeading eyebrow="Who We Are" title={companyStory.title} />
          <div className="story-copy">
            {companyStory.paragraphs.map((paragraph, index) =>
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

        <section className="principles-section page-section">
          {companyPrinciples.map((principle) => (
            <article className="principle-card motion-reveal" key={principle.title}>
              <p className="eyebrow">{principle.title}</p>
              <h2>{principle.description}</h2>
            </article>
          ))}
        </section>

        <section className="team-section page-section" id="team">
          <SectionHeading
            eyebrow="Our Team"
            title="Meet Our Team"
          />
          <div className="team-grid">
            {team.map((member) => (
              <article className="team-card motion-reveal" key={member.name}>
                <div className="team-image">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 700px) 88vw, (max-width: 1100px) 42vw, 28vw"
                  />
                </div>
                <div className="team-copy">
                  <p className="eyebrow">{member.credentials}</p>
                  <h2>{member.name}</h2>
                  <span>{member.role}</span>
                  <p>{member.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="values-section page-section">
          <SectionHeading
            eyebrow="Our Values"
            title="The principles that guide everything we do"
          />
          <div className="values-grid">
            {[...companyValues, ...technologyValues].map((value) => (
              <article className="value-card motion-reveal" key={value.title}>
                <h2>{value.title}</h2>
                <p>{value.description}</p>
              </article>
            ))}
            <Link
              className="value-action-card value-action-finance motion-reveal"
              href="/finance/services"
            >
              <p className="eyebrow">Finance</p>
              <h2>Smart Accounting</h2>
              <p>
                Expert Remote Accountants delivering precise, reliable
                financial management.
              </p>
              <span className="value-action-link">
                Explore All Services
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </span>
            </Link>
            <Link
              className="value-action-card value-action-technology motion-reveal"
              href="/technology/services"
            >
              <p className="eyebrow">Technology</p>
              <h2>Technology Solutions</h2>
              <p>
                Comprehensive technology solutions designed to transform your
                business and drive growth
              </p>
              <span className="value-action-link">
                View All Services
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </span>
            </Link>
            <Link
              className="value-action-card value-action-contact motion-reveal"
              href="/contact"
            >
              <p className="eyebrow">Let&apos;s Connect</p>
              <h2>Ready to strengthen your finance function?</h2>
              <p>
                Get in touch with our team to discuss bookkeeping, reporting,
                compliance, payroll, cash flow planning, or CFO-level support
                for your business.
              </p>
              <span className="value-action-link">
                Let&apos;s Connect
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </section>

        <ConsultationCta
          title="Our Commitment to You"
          description="We don't just build software—we build lasting partnerships. Every project is an opportunity to deliver excellence, foster trust, and create solutions that stand the test of time."
          buttonLabel="Let's Connect"
        />
      </PageMotion>
    </main>
  );
}
