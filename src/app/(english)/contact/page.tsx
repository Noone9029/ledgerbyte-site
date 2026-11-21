import { AccountingContactForm } from "@/components/accounting/contact-form";
import { StructuredData } from "@/components/structured-data";
import { buildSchemaGraph, buildWebPageSchema, ORGANIZATION_ID } from "@/lib/schema";
import { EnquiryChannels, EnquiryEmail, EnquiryWhatsApp } from "@/components/accounting/enquiry-channels";
import { enquiryMarket, enquiryService } from "@/lib/enquiry-options";
import {
  accountingContact,
  accountingCopy,
} from "@/content/accounting";
import { getPageSeo } from "@/content/seo";
import { createPageMetadata } from "@/lib/seo";

type ContactProps = {
  searchParams: Promise<{ service?: string | string[]; market?: string | string[] }>;
};

export const metadata = createPageMetadata(getPageSeo("/contact"), { path: "/contact" });

export default async function ContactPage({ searchParams }: ContactProps) {
  const { service: value, market: selectedMarket } = await searchParams;
  const market = enquiryMarket(selectedMarket);
  const service = enquiryService(value);
  return (
    <main id="main-content" className="accounting-page">
      <StructuredData data={buildSchemaGraph({
        ...buildWebPageSchema({ path: "/contact", name: accountingCopy.C08.heading, description: accountingCopy.C08.intro, type: "ContactPage" }),
        mainEntity: { "@id": ORGANIZATION_ID },
      })} />
      <EnquiryChannels key={`${service}|${market}`} initialService={service} initialMarket={market}>
        <section className="accounting-contact-layout accounting-wrap">
          <div className="accounting-contact-intro">
            <p className="eyebrow">Get in touch</p>
            <h1>{accountingCopy.C08.heading}</h1>
            <p className="accounting-lead">{accountingCopy.C08.intro}</p>
            <EnquiryWhatsApp />
            <p className="accounting-whatsapp-note">
              WhatsApp opens only when you choose it. Review the message and send
              it in WhatsApp.
            </p>
            <div className="accounting-contact-details">
              <EnquiryEmail />
              <a
                href={"tel:" + accountingContact.contact.phone.replace(/\s/g, "")}
              >
                {accountingContact.contact.phone}
              </a>
              <address>{accountingContact.contact.address.join(", ")}</address>
            </div>
          </div>
          <section
            className="accounting-form-panel"
            aria-labelledby="enquiry-heading"
          >
            <p className="eyebrow">Email enquiry</p>
            <h2 id="enquiry-heading">{accountingCopy.C08.form_heading}</h2>
            <AccountingContactForm initialService={service} initialMarket={market} />
          </section>
        </section>
        <EnquiryWhatsApp floating />
      </EnquiryChannels>
    </main>
  );
}
