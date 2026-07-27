import type { Metadata } from "next";
import { Check, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { ScrubText } from "@/components/motion/scrub-text";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { technologyAdvantages } from "@/content";
import { partnershipVisual } from "@/content/visuals";

export const metadata: Metadata = {
  title: "Why LedgerByte Tech",
  description: "Built on trust, driven by excellence, focused on your success",
  alternates: { canonical: "/technology/why-ledgerbyte" },
};

const trackRecord = [
  {
    title: "Proven Track Record",
    description:
      "50+ successful projects delivered across diverse industries and markets",
  },
  {
    title: "Expert Team",
    description:
      "10 skilled professionals with 15+ years of combined experience",
  },
  {
    title: "Enterprise-Grade Quality",
    description:
      "Professional standards and best practices in every line of code",
  },
] as const;

export default function WhyLedgerBytePage() {
  return (
    <main id="main-content">
      <PageMotion>
        <section className="inner-hero page-section">
          <CinematicMedia
            className="inner-hero-art hero-reveal"
            src={partnershipVisual}
            mode="overlay"
            copySide="left"
            priority
          >
            <div className="inner-hero-copy">
              <p className="eyebrow hero-reveal">
                Why Choose LedgerByte Tech?
              </p>
              <h1 className="hero-reveal">
                Your Technology Partner for the Long Haul
              </h1>
              <p className="hero-summary hero-reveal">
                Built on trust, driven by excellence, focused on your success
              </p>
            </div>
          </CinematicMedia>
        </section>

        <section className="statement-section page-section">
          <ScrubText>
            At LedgerByte Tech, we don&apos;t just deliver projects, we build
            lasting partnerships. Our commitment to professionalism,
            reliability, and excellence has made us a trusted name in technology
            solutions across GCC and international markets. When you choose us,
            you&apos;re choosing a team that&apos;s invested in your long-term
            success.
          </ScrubText>
        </section>

        <section className="advantage-section page-section">
          <SectionHeading
            eyebrow="Our Competitive Advantages"
            title="What sets us apart in a crowded marketplace"
          />
          <div className="advantage-grid">
            {technologyAdvantages.map((advantage) => (
              <article className="advantage-card motion-reveal" key={advantage.title}>
                <ShieldCheck weight="light" aria-hidden="true" />
                <h2>{advantage.title}</h2>
                <p>{advantage.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="reliability-section page-section">
          <div className="reliability-copy">
            <p className="eyebrow">Built on Trust &amp; Reliability</p>
            <h2>
              In the fast-paced world of technology, trust is everything.
            </h2>
            <p>
              Our clients rely on us because we consistently deliver on our
              promises, maintain transparent communication, and take ownership
              of every project.
            </p>
            <p>
              We don&apos;t just build software, we build relationships. Our
              long-term partnerships with clients across industries are a
              testament to our commitment to excellence, integrity, and customer
              success.
            </p>
            <p>
              Whether you&apos;re a startup launching your first product or an
              enterprise modernizing your infrastructure, you can count on
              LedgerByte Tech to be there every step of the way.
            </p>
          </div>
          <div className="track-record">
            {trackRecord.map((item) => (
              <article className="motion-reveal" key={item.title}>
                <Check weight="bold" aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <ConsultationCta
          title="Our Partnership Promise"
          description="When you work with LedgerByte Tech, you're not just hiring a vendor, you're gaining a strategic partner committed to your success. We're in this for the long haul, and we'll be with you every step of the way as your business grows and evolves."
          buttonLabel="Start Your Partnership Today"
        />
      </PageMotion>
    </main>
  );
}
