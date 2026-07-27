import {
  Envelope,
  MapPin,
  Phone,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "@/components/contact-form";
import { PageMotion } from "@/components/motion/page-motion";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredData } from "@/components/structured-data";
import { contactDetails } from "@/content";
import { getPageSeo } from "@/content/seo";
import { partnershipVisual } from "@/content/visuals";
import { buildSchemaGraph, buildWebPageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const pageSeo = getPageSeo("/contact");

export const metadata = createPageMetadata(pageSeo, { path: "/contact" });

const reasons = [
  "Qualified finance leadership across bookkeeping, reporting, tax, payroll, and advisory support",
  "Remote-first delivery that fits distributed teams and global operating models",
  "Bookkeeping, compliance, reporting, payroll, and planning support under one roof",
  "Practical communication, documented workflows, and proactive guidance as your needs evolve",
] as const;

export default function ContactPage() {
  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: "/contact",
            name: pageSeo.title,
            description: pageSeo.description,
            type: "ContactPage",
          }),
        )}
      />
      <main id="main-content">
        <PageMotion>
        <section className="contact-hero page-section">
          <CinematicMedia
            className="contact-hero-art hero-reveal"
            src={partnershipVisual}
            mode="overlay"
            copySide="left"
            priority
          >
            <div className="contact-hero-copy">
              <p className="eyebrow hero-reveal">Let&apos;s Connect</p>
              <h1 className="hero-reveal">
                Ready to strengthen your finance function?
              </h1>
              <p className="hero-summary hero-reveal">
                Get in touch with our team to discuss bookkeeping, reporting,
                compliance, payroll, cash flow planning, or CFO-level support
                for your business.
              </p>
            </div>
          </CinematicMedia>
        </section>

        <section className="contact-main page-section">
          <div className="contact-form-shell">
            <SectionHeading
              eyebrow="Send us a Message"
              title="Get In Touch"
              description="Let's discuss how we can help scale your business with innovative technology solutions"
            />
            <ContactForm />
          </div>
          <aside className="contact-aside">
            <div>
              <p className="eyebrow">Quick Contact</p>
              <h2>
                Need instant help? Ping us on WhatsApp, or use email/phone below.
              </h2>
            </div>
            <a href={`mailto:${contactDetails.email}`}>
              <Envelope weight="light" aria-hidden="true" />
              <span>
                Email Us
                <strong>{contactDetails.email}</strong>
                <small>We&apos;ll respond within 24 hours</small>
              </span>
            </a>
            <a href={`tel:${contactDetails.phoneHref}`}>
              <Phone weight="light" aria-hidden="true" />
              <span>
                Call Us
                <strong>{contactDetails.phone}</strong>
              </span>
            </a>
            <a
              href={contactDetails.whatsappHref}
              rel="noreferrer"
              target="_blank"
            >
              <WhatsappLogo weight="light" aria-hidden="true" />
              <span>
                WhatsApp
                <strong>{contactDetails.phone}</strong>
              </span>
            </a>
            <div className="contact-location">
              <MapPin weight="light" aria-hidden="true" />
              <span>
                Location
                <strong>{contactDetails.location}</strong>
              </span>
            </div>
            <div className="contact-reasons">
              <p className="eyebrow">Why Choose LedgerByte?</p>
              {reasons.map((reason) => (
                <p key={reason}>{reason}</p>
              ))}
            </div>
          </aside>
        </section>
        </PageMotion>
      </main>
    </>
  );
}
