import Link from "next/link";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredData } from "@/components/structured-data";
import { technologyProcess } from "@/content";
import { getPageSeo } from "@/content/seo";
import { technologyProcessVisual } from "@/content/visuals";
import { buildSchemaGraph, buildWebPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const pageSeo = getPageSeo("/technology/process");

export const metadata = createPageMetadata(pageSeo, {
  path: "/technology/process",
});

const processReasons = [
  {
    title: "Transparency",
    description:
      "Regular updates and clear communication throughout every phase of development.",
  },
  {
    title: "Quality Assurance",
    description:
      "Rigorous testing, automated checks, and code reviews at every stage.",
  },
  {
    title: "Agile Flexibility",
    description:
      "Adaptable approach that responds to your evolving business needs quickly.",
  },
] as const;

export default function TechnologyProcessPage() {
  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: "/technology/process",
            name: pageSeo.title,
            description: pageSeo.description,
          }),
        )}
      />
      <main id="main-content">
        <PageMotion>
        <section className="inner-hero page-section">
          <CinematicMedia
            className="inner-hero-art hero-reveal"
            src={technologyProcessVisual}
            mode="overlay"
            copySide="left"
            priority
          >
            <div className="inner-hero-copy">
              <p className="eyebrow hero-reveal">Our Development Process</p>
              <h1 className="hero-reveal">Our Development Process</h1>
              <p className="hero-summary hero-reveal">
                A proven methodology that delivers exceptional results, from
                initial concept to ongoing support
              </p>
              <Link className="button button-amber hero-reveal" href="/contact">
                Get Started Today
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </CinematicMedia>
        </section>

        <section className="process-detail page-section">
          <div className="stack-cards">
            {technologyProcess.steps.map((step, index) => (
              <article
                className="stack-card"
                style={{ "--stack-index": index } as React.CSSProperties}
                key={step.step}
              >
                <span>{step.step}</span>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="process-reasons page-section">
          <SectionHeading
            eyebrow="Why Our Process Works"
            title="Every step is designed to ensure transparency, quality, and success"
          />
          <div className="reason-grid">
            {processReasons.map((reason) => (
              <article className="reason-card motion-reveal" key={reason.title}>
                <Check weight="bold" aria-hidden="true" />
                <h2>{reason.title}</h2>
                <p>{reason.description}</p>
              </article>
            ))}
          </div>
        </section>

        <ConsultationCta
          title="Ready to Start Your Project?"
          description="Let's discuss how our proven process can bring your vision to life"
          buttonLabel="Get Started Today"
        />
        </PageMotion>
      </main>
    </>
  );
}
