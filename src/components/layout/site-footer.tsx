import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Brand } from "@/components/layout/brand";
import {
  contactDetails,
  financeServices,
  technologyServices,
} from "@/content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-lead">
        <Brand inverse />
        <p>
          Empowering businesses with expert accounting and smart financial
          solutions.
        </p>
        <Link className="footer-contact" href="/contact">
          Let&apos;s Connect
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>

      <div className="footer-links">
        <div>
          <h2>Finance</h2>
          {financeServices.map((service) => (
            <Link href={`/finance/services/${service.slug}`} key={service.slug}>
              {service.title}
            </Link>
          ))}
          <Link href="/finance/services">Explore All Services</Link>
        </div>
        <div>
          <h2>Technology</h2>
          {technologyServices.map((service) => (
            <Link
              href={`/technology/services/${service.slug}`}
              key={service.slug}
            >
              {service.title}
            </Link>
          ))}
          <Link href="/technology/services">View All Services</Link>
        </div>
        <div>
          <h2>Company</h2>
          <Link href="/about">About Us</Link>
          <Link href="/about#team">Our Team</Link>
          <Link href="/technology/process">Process</Link>
          <a href="https://blog.ledgerbyte.io">LedgerByte Insights</a>
          <a href="https://www.linkedin.com/company/ledger-byte/">
            LinkedIn
          </a>
          <a href="https://www.trustpilot.com/review/ledgerbyte.io">
            Trustpilot
          </a>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-use">Terms of Use</Link>
        </div>
        <div>
          <h2>Contact</h2>
          <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
          <a href={`tel:${contactDetails.phoneHref}`}>
            {contactDetails.phone}
          </a>
          <a
            href={contactDetails.whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            WhatsApp
          </a>
          <span>{contactDetails.location}</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 LedgerByte Tech. All rights reserved.</span>
        <span>SMART ACCOUNTING</span>
      </div>
    </footer>
  );
}
