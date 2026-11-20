import { AccountingContactForm } from "@/components/accounting/contact-form";
import { EnquiryChannels, EnquiryWhatsApp } from "@/components/accounting/enquiry-channels";
import { enquiryMarket, financeEnquiryChoices } from "@/lib/enquiry-options";
import {
  accountingContact,
  accountingCopy,
} from "@/content/accounting";
import { createMetadata } from "@/lib/seo";

type ContactProps = {
  searchParams: Promise<{ service?: string | string[]; market?: string | string[] }>;
};

export const metadata = createMetadata({
  path: "/contact",
  title: accountingCopy.C08.heading,
  description: accountingCopy.C08.intro,
});

export default async function ContactPage({ searchParams }: ContactProps) {
  const { service: value, market: selectedMarket } = await searchParams;
  const market = enquiryMarket(selectedMarket);
  const service = typeof value === "string" && financeEnquiryChoices.includes(value) ? value : "";
  return (
    <main id="main-content" className="accounting-page">
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
              <a href={"mailto:" + accountingContact.contact.email}>
                {accountingContact.contact.email}
              </a>
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
      </EnquiryChannels>
    </main>
  );
}
