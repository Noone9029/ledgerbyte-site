import Image from "next/image";
import Link from "next/link";
import { StructuredData } from "@/components/structured-data";
import { getPageSeo } from "@/content/seo";
import { buildSchemaGraph, buildWebPageSchema, ORGANIZATION_ID } from "@/lib/schema";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";
import { BuilderControls } from "./builder-controls";
import { createEnquiryHref, includedWork, industries, minimumHours, roles } from "./calculator";

const path = "/build-your-finance-department";
const page = getPageSeo(path);
const description = "Build a UAE finance team from AED 500 per month before tax. See role hours and rates, including bookkeeping, senior review and VAT filing.";
export const metadata = createPageMetadata(page, { path, description });

const people = [
  { name: "Haider Ali", credentials: "CGMA, ACMA", role: "Managing Partner", slug: "haider-ali", image: "/team/studio/haider-ali.webp" },
  { name: "Faisal Nawaz", credentials: "FCA", role: "Financial Controller", slug: "faisal-nawaz", image: "/team/studio/faisal-nawaz.webp" },
  { name: "Sayyam Nasir", credentials: "ACCA", role: "Fractional Controller", slug: "sayyam-nasir", image: "/team/studio/sayyam-nasir.webp" },
  { name: "Alina Khalid", role: "Customer Success Manager", slug: "alina-khalid", image: "/team/studio/alina-khalid.webp" },
];

const startingHours = minimumHours.reduce((sum, hours) => sum + hours, 0);
const startingSubtotals = roles.map((role, i) => minimumHours[i] * role.rate);
const startingPrice = startingSubtotals.reduce((sum, subtotal) => sum + subtotal, 0);
const startingEnquiry = createEnquiryHref({
  name: "Finance essentials", industry: industries[0][0], volume: 150, work: [includedWork],
  hours: minimumHours, subtotals: startingSubtotals, monthly: startingPrice, hourly: startingPrice / startingHours,
  channel: "Email", cadence: "Monthly",
});
const monthlyPrice = `AED ${startingPrice} / month`;
const serviceId = absoluteUrl(path) + "#service";
const schema = buildSchemaGraph(
  { ...buildWebPageSchema({ path, name: page.title, description, dateModified: page.lastModified }), mainEntity: { "@id": serviceId } },
  {
    "@type": "Service", "@id": serviceId, name: "Build your finance department",
    description, provider: { "@id": ORGANIZATION_ID }, areaServed: { "@type": "Country", name: "United Arab Emirates" },
    offers: {
      "@type": "Offer", name: "Finance essentials, 15 hours per month", url: absoluteUrl(path),
      description: "Includes 3 junior admin support hours, 8 junior accountant hours and 4 senior accountant hours each month, with bookkeeping and VAT filing.",
      priceSpecification: { "@type": "UnitPriceSpecification", price: startingPrice, priceCurrency: "AED", unitText: "month", valueAddedTaxIncluded: false },
    },
  }
);

function Introduction() {
  return <>
    <section className="accounting-home-hero finance-intro accounting-wrap" aria-labelledby="builder-title">
      <div className="intro-copy">
        <p className="eyebrow">Finance team builder</p>
        <h1 id="builder-title">Build your <em>finance department.</em></h1>
        <p className="intro-lead">Know who keeps your books, who reviews the numbers and who follows up when a deadline is at risk. Your team includes senior review and VAT filing from <strong>AED 500/month before tax</strong>.</p>
        <div className="intro-actions">
          <a className="button button-amber" href="#builder">Build my team <span aria-hidden="true">↗</span></a>
          <a className="finance-link" href="#people">Meet the people <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <figure className="accounting-hero-figure"><div className="accounting-hero-image"><Image src="/art/finance-editorial-v3.webp" alt="Editorial illustration of finance records, reporting and planning" width={1536} height={1024} sizes="(max-width: 900px) 90vw, 44vw" priority /></div><figcaption className="accounting-hero-caption"><span>LEDGERBYTE</span><span>ACCOUNTING. TAX. ADVISORY.</span></figcaption></figure>
    </section>
    <section id="people" className="finance-people" aria-labelledby="people-title"><div className="accounting-wrap">
      <div className="people-heading">
        <h2 id="people-title">The people behind LedgerByte</h2>
        <a className="finance-link" href="https://www.trustpilot.com/review/ledgerbyte.io" target="_blank" rel="noopener">Read client reviews <span aria-hidden="true">↗</span></a>
      </div>
      <div className="roster">{people.map(person => (
        <Link className="person" key={person.slug} href={`/about/team/${person.slug}`}>
          <Image src={person.image} alt="" width={56} height={56} unoptimized />
          <span><strong>{person.name}</strong> {person.credentials && <b>{person.credentials}</b>}<small>{person.role}</small></span>
        </Link>
      ))}</div>
    </div></section>
  </>;
}

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return <div className="section-title"><span className="glyph" data-icon={icon} aria-hidden="true" /><h2>{children}</h2></div>;
}

function Business() {
  return <section className="form-section">
    <SectionTitle icon="business">Your business</SectionTitle>
    <label className="field" htmlFor="industry">Industry</label>
    <select id="industry" defaultValue="0">{industries.map(([name], index) => <option key={name} value={index}>{name}</option>)}</select>
    <div className="volume">
      <div className="line"><label className="field" htmlFor="volume">Monthly transactions</label><output className="number" id="count" htmlFor="volume">150</output></div>
      <p className="helper" id="volume-help">Include sales, purchases and bank entries.</p>
      <input className="range" aria-describedby="volume-help" id="volume" type="range" min="25" max="2500" defaultValue="150" step="25" />
      <div className="range-labels"><span>25</span><span>2,500</span></div>
    </div>
    <div className="workload-estimate" id="monthly-estimate">
      <div><span>Estimated monthly department cost</span><strong id="workload-price">{monthlyPrice}</strong><small>Minimum package · AED 500 for 15 hours before tax</small></div>
      <a className="finance-link" href="#estimate">View breakdown</a>
    </div>
  </section>;
}

function ContactPreferences() {
  return <section className="form-section">
    <SectionTitle icon="chat">How we’ll work with you</SectionTitle>
    <div className="working-notes">
      <p><strong>A named owner.</strong> At kickoff, we agree who handles your records, who reviews the work and which approvals sit with you.</p>
      <p><strong>Early updates.</strong> If a missing invoice could hold up your VAT return, your contact flags it on your agreed channel, explains what’s needed and follows up until it’s resolved.</p>
      <p><strong>A senior review.</strong> Your package includes at least four senior accountant hours. We check reconciliations and explain unusual balances before handing the figures over.</p>
    </div>
    <div className="inputs">
      <div><label htmlFor="channel" className="field">Preferred contact</label><select id="channel"><option>Email</option><option>WhatsApp</option><option>Phone</option></select></div>
      <div><label htmlFor="cadence" className="field">Preferred check-in</label><select id="cadence"><option>Monthly</option><option>Twice monthly</option><option>Weekly</option></select></div>
    </div>
    <p className="helper">At kickoff, we’ll agree your check-in schedule and how to flag an urgent question. <Link href="/how-we-work">See our working process</Link> or <Link href="/regions/uae">explore UAE accounting and bookkeeping services</Link>.</p>
  </section>;
}

function ComparisonDetails() {
  return <>
    <details className="sources" id="assumptions"><summary>Adjust the in-house hiring assumptions</summary>
      <p>Model a full-time expatriate employee under UAE federal private-sector rules. Defaults assume a five-day week, eight hours a day, and the midpoint of a published UAE salary range for each role.</p>
      <div className="assumption-grid" id="assumption-inputs" />
      <p>Visa costs cover the work and residence permits, Emirates ID, medical fitness test and worker protection. The default uses an illustrative two-year Dubai hire from abroad. The AED 1,500 annual insurance allowance is a planning input. Enter your premium and any additional annual spend on recruitment, flights, equipment, bonuses or cover.</p>
      <p>Paid leave is already in salary. We subtract only working time lost, counting each day once. The default allows 22 weekdays for 30 calendar days of annual leave, five fully paid sick days, ten weekday holidays and 40 hours of Ramadan reductions outside leave.</p>
      <p>Gratuity accrues on basic pay. The default models an eligible employee in years one to five. Use 30 days for a subsequent service year or zero if you budget a separate savings contribution under other costs.</p>
      <p id="capacity" className="capacity" /><button type="button" className="plain" id="reset-assumptions">Restore benchmark assumptions</button>
    </details>
    <details className="sources" id="method"><summary>How we compare hourly rates</summary>
      <p>Market comparisons use the starting rate or lower end of the cited provider range. The controller comparison uses an offshore provider benchmark in US dollars, converted at AED 3.6725 per US dollar. Actual quotes depend on scope.</p>
      <p>For an in-house hire, we divide annual pay, gratuity accrual and employer expenses by available working hours. Team averages weight each role by the hours you select. Savings are the difference divided by the comparison rate.</p>
      <ul id="sources">{roles.map(role => <li key={role.name}>
        <b>{role.name}</b> · {role.marketNote}. <a href={role.url}>{role.source} provider benchmark</a> · <a href={role.salaryUrl}>{role.salarySource} salary guide</a>.
      </li>)}</ul>
      <p className="helper">Benchmarks reviewed November 2026. <a href="https://centralbank.ae/en/forex-eibor/exchange-rates/">UAE exchange rates</a> · <a href="https://employerofrecord.ae/visas/">Dubai visa fees</a> · <a href="https://www.dha.gov.ae/uploads/032022/AR2022322813.pdf">Health coverage</a> · <a href="https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/end-of-service-benefits-for-employees-in-the-private-sector">Gratuity</a> · <a href="https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/types-of-leaves-and-entitlements-in-the-private-sector/annual-leave">Annual leave</a> · <a href="https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/types-of-leaves-and-entitlements-in-the-private-sector/sick-leave">Sick leave</a></p>
    </details>
  </>;
}

function Estimate() {
  return <aside className="estimate-card" id="estimate" aria-labelledby="plan">
    <p className="eyebrow">Your recommended team</p><h2 id="plan">Finance essentials</h2>
    <div className="price"><small>Estimated department cost</small><div><span className="currency">AED</span> <strong id="monthly-total">{startingPrice}</strong> <small>/ month</small></div><p>Before tax · AED <span id="total">{(startingPrice / startingHours).toFixed(2)}</span>/hr blended</p></div>
    <div id="savings" className="savings" />
    <div className="line mixhead"><b>Team allocation</b><span id="hours">{startingHours} hrs / mo</span></div>
    <div id="segments" className="segments" aria-hidden="true" />
    <div id="mix">{roles.map((role, i) => minimumHours[i] > 0 && <div className="roleline" key={role.name}>
      <span><i className="dot" style={{background: role.color}} />{role.name}<small className="allocation">{minimumHours[i]} h × AED {role.rate}/hr</small></span>
      <strong className="subtotal">AED {startingSubtotals[i]}</strong>
    </div>)}</div>
    <p id="vat-included" className="included-service"><strong>VAT filing included</strong> with bookkeeping</p>
    <p id="comm" className="comm-summary">Preferred contact · Email · monthly check-in</p>
    <a className="cta button button-amber" id="discuss" href={startingEnquiry}><span className="icon" data-icon="chat" aria-hidden="true" />Review my team with LedgerByte</a>
    <p className="footnote">Review and send your enquiry in WhatsApp or email. If you prefer a phone call, your email draft requests a callback.</p>
  </aside>;
}

export default function FinanceDepartmentPage() {
  return <main className="finance-builder" id="main-content" data-finance-builder="">
    <StructuredData data={schema} />
    <Introduction />
    <noscript><p className="accounting-wrap">Turn on JavaScript to adjust your estimate, or <Link href="/contact">discuss your workload with LedgerByte</Link>.</p></noscript>
    <div className="workspace accounting-wrap" id="builder">
      <fieldset className="builder-fields" id="builder-controls" aria-labelledby="builder-title" disabled>
        <Business />
        <section className="form-section"><SectionTitle icon="work">Work to cover</SectionTitle><p className="helper">Bookkeeping and VAT filing come with your team. Choose any additional services you need.</p><div className="chips" id="work" /></section>
        <section className="form-section"><SectionTitle icon="team">Roles, rates &amp; hours</SectionTitle><p className="helper">Every team starts with 3 junior admin hours, 8 junior accountant hours and 4 senior accountant hours. Add time or finance leadership as needed.</p><div id="roles" /><button className="plain" id="restore" type="button">Restore recommended hours</button></section>
        <ContactPreferences />
        <ComparisonDetails />
      </fieldset>
      <Estimate />
    </div>
    <div className="mobile-est" id="mobile"><strong id="mobile-price">{monthlyPrice}</strong><a className="button button-amber button-small" href="#estimate">My team <span aria-hidden="true">↑</span></a></div>
    <div role="status" id="status" className="sr-only" />
    <BuilderControls />
  </main>;
}
