import { AccountingContactForm } from "@/components/accounting/contact-form";
import { EnquiryChannels, EnquiryWhatsApp } from "@/components/accounting/enquiry-channels";
import Link from "next/link";
import { financeEnquiryChoices, technologyEnquiryChoices } from "@/lib/enquiry-options";
import {
  accountingContact,
  accountingCopy,
} from "@/content/accounting";
import { createMetadata } from "@/lib/seo";
const technologyIntro = "Let’s discuss your project requirements.";

type ContactProps = {
  searchParams: Promise<{ service?: string; division?: string }>;
};

export async function generateMetadata({ searchParams }: ContactProps) {
  const technology = (await searchParams).division === "technology";
  return createMetadata({
    path: "/contact",
    title: technology ? "Technology project enquiry" : accountingCopy.C08.heading,
    description: technology ? technologyIntro : accountingCopy.C08.intro,
  });
}

export default async function ContactPage({ searchParams }: ContactProps) {
  const { service: value = "", division } = await searchParams;
  const technology = division === "technology";
  const choices = technology ? technologyEnquiryChoices : financeEnquiryChoices;
  const service = choices.includes(value) ? value : technology ? "Technology project" : "";
  const heading = technology ? "Technology project enquiry" : accountingCopy.C08.heading;
  return (
    <main id="main-content" className="accounting-page">
      <EnquiryChannels key={heading + service} initialService={service}>
        <section className="accounting-contact-layout accounting-wrap">
          <div className="accounting-contact-intro">
            <p className="eyebrow">Get in touch</p>
            <h1>{heading}</h1>
            <p className="accounting-lead">{technology ? technologyIntro : accountingCopy.C08.intro}</p>
            {technology && <p><Link className="text-link" href="/technology">Browse technology services ↗</Link></p>}
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
            <h2 id="enquiry-heading">{technology ? "Technology enquiry" : accountingCopy.C08.form_heading}</h2>
            <AccountingContactForm initialService={service} technology={technology} />
          </section>
        </section>
      </EnquiryChannels>
    </main>
  );
}
