import { PageMotion } from "@/components/motion/page-motion";
import { StructuredData } from "@/components/structured-data";
import { getPageSeo } from "@/content/seo";
import { buildSchemaGraph, buildWebPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const pageSeo = getPageSeo("/terms-of-use");

export const metadata = createPageMetadata(pageSeo, {
  path: "/terms-of-use",
});

const sections = [
  {
    title: "Website Information",
    body: "The content on this website is intended to describe LedgerByte's services, capabilities, and areas of expertise. It is provided for general informational purposes and should not be treated as formal accounting, tax, legal, or regulatory advice on its own.",
  },
  {
    title: "Professional Engagements",
    body: "Any professional support from LedgerByte begins only after direct communication, scoping, and mutual agreement on the nature of the engagement. Website content, blog links, and general explanations do not create an advisory relationship by themselves.",
  },
  {
    title: "Use of Content and Links",
    body: "You may browse and reference the website for informational use. External links, including links to LedgerByte's blog or third-party platforms, are provided for convenience. Their availability and content may change independently from the main site.",
  },
  {
    title: "Contact",
    body: "If you need clarification on any website content, want to discuss a service, or need the current scope of support available from LedgerByte, you can contact the team at info@ledgerbyte.io.",
  },
] as const;

export default function TermsOfUsePage() {
  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: "/terms-of-use",
            name: pageSeo.title,
            description: pageSeo.description,
          }),
        )}
      />
      <main id="main-content">
        <PageMotion>
        <article className="legal-page page-section">
          <header>
            <p className="eyebrow hero-reveal">Last Updated April 2026</p>
            <h1 className="hero-reveal">Terms of Use</h1>
            <p className="hero-summary hero-reveal">
              These terms explain how website content should be understood and
              how LedgerByte&apos;s online information relates to formal service
              engagements.
            </p>
          </header>
          <div className="legal-sections">
            {sections.map((section) => (
              <section className="motion-reveal" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
        </article>
        </PageMotion>
      </main>
    </>
  );
}
