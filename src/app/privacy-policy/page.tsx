import { PageMotion } from "@/components/motion/page-motion";
import { StructuredData } from "@/components/structured-data";
import { getPageSeo } from "@/content/seo";
import { buildSchemaGraph, buildWebPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const pageSeo = getPageSeo("/privacy-policy");

export const metadata = createPageMetadata(pageSeo, {
  path: "/privacy-policy",
});

const sections = [
  {
    title: "Information We Receive",
    body: "When you contact LedgerByte through the website, we may receive the details you submit, including your name, email address, phone number, company information, service interest, and message contents. We also receive limited technical and analytics data related to page visits and interactions.",
  },
  {
    title: "How We Use Information",
    body: "We use submitted information to respond to inquiries, understand service needs, improve the website experience, and measure the performance of marketing and contact journeys. We do not use contact-form submissions for unrelated purposes that are inconsistent with the services you requested.",
  },
  {
    title: "Cookies, Pixels, and Third Parties",
    body: "The site uses essential web technologies as well as analytics and advertising tools, including Meta Pixel, to understand website usage and lead activity. Contact actions may also route through third-party services such as WhatsApp when you choose that channel.",
  },
  {
    title: "Data Handling and Contact",
    body: "We only retain information for legitimate business, communication, operational, or legal purposes. If you have questions about the information you submitted through this website, you can contact LedgerByte at info@ledgerbyte.io.",
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: "/privacy-policy",
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
            <h1 className="hero-reveal">Privacy Policy</h1>
            <p className="hero-summary hero-reveal">
              This page explains, in plain language, how LedgerByte handles
              contact information, basic website usage data, and communication
              requests submitted through the site.
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
