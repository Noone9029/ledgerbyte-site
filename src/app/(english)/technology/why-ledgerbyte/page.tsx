import { technologyEnquiryHref } from "@/lib/enquiry-options";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredData } from "@/components/structured-data";
import { technologyAdvantages } from "@/content";
import { getPageSeo } from "@/content/seo";
import { partnershipVisual } from "@/content/visuals";
import { buildSchemaGraph, buildWebPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const pageSeo = getPageSeo("/technology/why-ledgerbyte");

export const metadata = createPageMetadata(pageSeo, {
  path: "/technology/why-ledgerbyte",
});

export default function WhyLedgerBytePage() {
  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: "/technology/why-ledgerbyte",
            name: pageSeo.title,
            description: pageSeo.description,
            type: "AboutPage",
          }),
        )}
      />
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

        <ConsultationCta
          href={technologyEnquiryHref()}
          title="Our Partnership Promise"
          description="When you work with LedgerByte Tech, you're not just hiring a vendor, you're gaining a strategic partner committed to your success. We're in this for the long haul, and we'll be with you every step of the way as your business grows and evolves."
          buttonLabel="Start Your Partnership Today"
        />
        </PageMotion>
      </main>
    </>
  );
}
