import { AccountingContactForm } from "@/components/accounting/contact-form";
import {
  accountingContact,
  accountingCopy,
  accountingServices,
} from "@/content/accounting";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({
  path: "/contact",
  title: accountingCopy.C08.heading,
  description: accountingCopy.C08.intro,
});
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const value = (await searchParams).service ?? "";
  const service = [
    ...accountingServices.map((s) => s.title),
    "UAE VAT support",
    "Not sure yet",
  ].includes(value)
    ? value
    : "";
  const whatsapp =
    accountingContact.social.whatsapp +
    "?text=" +
    encodeURIComponent(
      service
        ? "Hi LedgerByte, I would like to discuss " + service + "."
        : accountingCopy.C08.whatsapp_generic_text,
    );
  return (
    <main id="main-content" className="accounting-page">
      <section className="accounting-contact-layout accounting-wrap">
        <div className="accounting-contact-intro">
          <p className="eyebrow">Get in touch</p>
          <h1>{accountingCopy.C08.heading}</h1>
          <p className="accounting-lead">{accountingCopy.C08.intro}</p>
          <a
            className="button button-amber"
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp ↗
          </a>
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
          <AccountingContactForm initialService={service} />
        </section>
      </section>
    </main>
  );
}
