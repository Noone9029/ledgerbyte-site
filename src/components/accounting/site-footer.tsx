import Link from "next/link";
import { EnquiryLink } from "./enquiry-link";
import { Brand } from "@/components/layout/brand";
import {
  accountingContact,
  accountingCopy,
} from "@/content/accounting";

export function AccountingFooter() {
  return (
    <footer className="accounting-footer">
      <div className="accounting-wrap">
        <div className="accounting-footer-lead">
          <div>
            <Brand />
            <p>{accountingCopy.C01.footer_description}</p>
          </div>
          <EnquiryLink className="button button-amber">
            Get in touch ↗
          </EnquiryLink>
        </div>
        <div className="accounting-footer-grid">
          <div>
            <h2>Services</h2>
            <Link href="/finance">Finance overview</Link>
            <Link href="/build-your-finance-department">Build your finance department</Link>
            <Link href="/finance/services">All 22 services</Link>
            <Link href="/uae-vat">UAE VAT support</Link>
          </div>
          <div>
            <h2>LedgerByte</h2>
            <Link href="/about">About us</Link>
            <Link href="/how-we-work">How we work</Link>
            <Link href="/regions">Markets</Link>
            <Link href="/insights">Practical guides</Link>
            <a href="https://blog.ledgerbyte.io">LedgerByte Insights</a>
            <a
              href={accountingContact.social.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href={accountingContact.social.trustpilot}
              target="_blank"
              rel="noreferrer"
            >
              Trustpilot
            </a>
          </div>
          <div>
            <h2>Contact</h2>
            <a href={`mailto:${accountingContact.contact.email}`}>
              {accountingContact.contact.email}
            </a>
            <a
              href={`tel:${accountingContact.contact.phone.replace(/\s/g, "")}`}
            >
              {accountingContact.contact.phone}
            </a>
            <a
              href={accountingContact.social.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <address>{accountingContact.contact.address.join(", ")}</address>
            <EnquiryLink className="accounting-tech-link" technologyOnly>
              Technology enquiries ↗
            </EnquiryLink>
          </div>
        </div>
        <div className="accounting-footer-bottom">
          <span>{accountingCopy.C01.copyright_draft}</span>
          <div>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-use">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
