import { notFound } from "next/navigation";
import Link from "next/link";
export const metadata = {
  title: "Private review notes | LedgerByte",
  robots: { index: false, follow: false },
};
export default function ReviewNotes() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <main id="main-content" className="accounting-page">
      <section className="accounting-index-hero accounting-wrap">
        <p className="eyebrow">Private review · Not approved for publication</p>
        <h1>November content review</h1>
        <p className="accounting-lead">
          Haider’s November 10 copy is applied to 22 services and 33 substantive
          pages. These owner decisions remain open before launch.
        </p>
        <ul className="accounting-review-list">
          <li>
            Confirm the final accounting-site roster. Existing Amir and Ahmad
            profiles remain pending that decision.
          </li>
          <li>
            Supply the selected LinkedIn portrait for Haider. The prior portrait
            remains until the approved replacement is available.
          </li>
          <li>
            Supply the official Trustpilot embed configuration. The profile link
            is used without invented reviews, stars or counts.
          </li>
          <li>Confirm the official phone and WhatsApp number.</li>
          <li>
            Confirm the new service and guide paths. The preview keeps all eight
            existing service URLs, places added services under
            /finance/services, and uses /insights for the three new guides.
          </li>
          <li>
            Approve the contracting entity, professional scope, tax-source
            review and final privacy/terms. Existing legal pages are retained.
          </li>
          <li>
            Authorize an actual enquiry-delivery test and confirm the production
            recipient. Automated tests use mocks and never send email.
          </li>
          <li>
            Confirm the analytics property, consent and tracking setup before
            activation or paid traffic.
          </li>
        </ul>
        <p>
          No live domain is assigned to this review. Publication requires
          separate approval.
        </p>
        <Link className="text-link" href="/">
          Review the homepage ↗
        </Link>
      </section>
    </main>
  );
}
