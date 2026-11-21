import { accountingServices, contentPath, marketNames, serviceJurisdiction } from "./accounting";
import { homeUpdate } from "./home-update";
import catalogue from "./home-service-scopes.json";

const scopes = new Map(catalogue.flatMap(group => group.items.map(item => [item.slug, item.scope] as const)));
const aliases: Record<string, string> = {
  "accounting-bookkeeping": "outsourced managed bookkeeping bookkeeper bookkeepers book keeping catch up books backlog cleanup bank reconciliation small businesses UAE Saudi Arabia Pakistan United States US",
  "accounts-receivable": "outsourced accounts receivable AR overdue invoices unpaid invoices late customer payments customers paying late outstanding invoices customers owe us receipt allocation aging ageing",
  "accounts-payable": "AP outsourced accounts payable supplier bills vendor bills overdue supplier payments unpaid suppliers outstanding vendor invoices bills to pay vendor reconciliation payment runs",
  "accounting-automation-systems": "automate books automate accounting workflows automated bookkeeping automating invoice reconciliation accounts payable automation UAE Dubai Sharjah",
  "finance-department-outsourcing": "outsourced finance department outsourced finance team",
  "fractional-controller": "outsourced financial controller part time financial controller controllership",
  "month-end-year-end-close": "monthly annual close closing books close checklist year end bookkeeping small businesses",
  "financial-reporting-mis": "management reporting services Dubai UAE Pakistan management accounts monthly reporting pack KPI",
  "budgeting-forecasting": "rolling forecast annual budget budget versus actual variance financial planning",
  "cash-flow-working-capital": "cash flow forecasting short term cash runway working capital 13 week cash flow forecast",
  "fractional-cfo-advisory": "chief financial officer outsourced CFO part time CFO Dubai UAE Sharjah",
  "payroll-wps-management": "outsourced payroll processing WPS payroll service UAE Dubai monthly payroll run salary salaries wages protection system payslips",
  "tax-vat-compliance": "monthly tax compliance UAE VAT returns VAT filing tax support",
  "corporate-tax-filing": "UAE corporate tax return tax returns CT return preparation file business corporate tax return",
  "vat-registration": "UAE VAT registration register for VAT TRN application",
  "corporate-tax-registration": "UAE CT registration register for corporate tax",
  "uae-company-formation": "set up a company business setup mainland free zone UAE company formation finance support",
  "internal-audit": "outsourced internal audit controls testing process review",
  "external-audit": "external audit preparation coordination readiness statutory audit evidence pack",
  "ksa-company-formation": "Saudi Arabia KSA company setup Saudi company formation support establish a business",
  "ksa-vat": "Saudi Arabia KSA VAT return filing preparation VAT registration",
  "zatca-filing": "Saudi Arabia ZATCA filing support zakat withholding tax return preparation",
};

// Match a specific offer alongside its underlying service when a visitor asks for that offer.
// A broad VAT query can include the return, registration and compliance as distinct destinations.
const offerTerms: Record<string, string> = {
  "tax-vat-compliance": "uae vat return filing quarterly prepare preparation support",
  "accounting-bookkeeping": "sme accounting tax management monthly books",
  "corporate-tax-filing": "uae corporate tax review filing",
};

const fillerWords = new Set(["a", "an", "and", "are", "for", "help", "i", "in", "me", "my", "need", "our", "services", "service", "the", "to", "with"]);

function normalize(text: string) {
  return text.toLowerCase()
    .replace(/\ba\/([pr])\b/g, "a$1")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\bcashflows?\b/g, "cash flow")
    .replace(/\b(filings?|file|filed)\b/g, "filing")
    .replace(/\breturns\b/g, "return")
    .replace(/\b(register|registering)\b/g, "registration")
    .replace(/\bunited arab emirates\b/g, "uae")
    .trim();
}

function hasWord(text: string, word: string) {
  // Two-letter accounting terms such as AP and AR must stand on their own.
  return word.length <= 2 ? text.split(" ").includes(word) : text.includes(word);
}

const index = accountingServices.map(service => {
  const scope = scopes.get(service.slug) ?? service.output;
  const offer = homeUpdate.offers.find(item => item.serviceSlug === service.slug);
  const names = normalize([service.title, aliases[service.slug]].filter(Boolean).join(" "));
  return {
    service,
    scope,
    offer,
    offerNames: offer ? normalize([offerTerms[service.slug], offer.name].join(" ")) : "",
    names,
    terms: normalize([names, scope, service.summary, service.group].join(" ")),
  };
});

export function findServices(term: string, category: string) {
  const query = normalize(term);
  const tokens = query.split(" ").filter(Boolean);
  const keywords = tokens.filter(word => !fillerWords.has(word));
  const words = keywords.length ? keywords : tokens;
  return index.flatMap(({ service, scope, offer, offerNames, names, terms }) => {
    if (category && service.group !== category) return [];
    const href = contentPath(service.key);
    const rows = [];
    const offerIntent = words.includes("vat") || words.includes("sme") || words.includes("review");
    if (offer && offerIntent && words.every(word => hasWord(offerNames, word))) {
      rows.push({ service, scope: offer.fit, title: offer.name, href: offer.href, enquiry: offer.name, market: marketNames["regions/uae"], rank: 3 });
    }
    if (words.every(word => hasWord(terms, word)) && rows[0]?.href !== href) {
      const rank = !query ? 0 : Number(words.every(word => hasWord(names, word))) + Number(names.includes(query));
      rows.push({ service, scope, title: service.title, href, enquiry: service.title, market: serviceJurisdiction(service.group) ?? "", rank });
    }
    return rows;
  }).sort((a, b) => b.rank - a.rank);
}
