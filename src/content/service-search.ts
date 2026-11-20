import { accountingServices, contentPath, marketNames } from "./accounting";
import { homeUpdate } from "./home-update";
import catalogue from "./home-service-scopes.json";

const scopes = new Map(catalogue.flatMap(group => group.items.map(item => [item.slug, item.scope] as const)));
const aliases: Record<string, string> = {
  "accounting-bookkeeping": "bookkeeper bookkeepers book keeping",
  "accounts-receivable": "overdue invoices unpaid invoices late customer payments customers paying late outstanding invoices customers owe us",
  "accounts-payable": "supplier bills vendor bills overdue supplier payments unpaid suppliers outstanding vendor invoices bills to pay",
  "accounting-automation-systems": "automate books automate accounting workflows automated bookkeeping automating invoice reconciliation",
  "fractional-cfo-advisory": "chief financial officer outsourced cfo",
  "payroll-wps-management": "salary salaries wages protection system",
  "tax-vat-compliance": "VAT returns VAT filing",
  "corporate-tax-filing": "corporate tax return tax returns",
};

// Match a specific offer alongside its underlying service when a visitor asks for that offer.
// A broad VAT query can include the return, registration and compliance as distinct destinations.
const offerTerms: Record<string, string> = {
  "tax-vat-compliance": "uae vat return returns filing quarterly",
  "accounting-bookkeeping": "sme accounting tax management monthly books",
  "corporate-tax-filing": "uae corporate tax review filing",
};

const fillerWords = new Set(["a", "an", "and", "are", "for", "help", "i", "me", "my", "need", "our", "services", "service", "the", "to", "with"]);

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\bcashflows?\b/g, "cash flow").trim();
}

const index = accountingServices.map(service => {
  const scope = scopes.get(service.slug) ?? service.output;
  const offer = homeUpdate.offers.find(item => item.serviceSlug === service.slug);
  const names = normalize([service.title, aliases[service.slug]].filter(Boolean).join(" "));
  return {
    service,
    scope,
    offer,
    names,
    terms: normalize([names, scope, service.summary, service.group].join(" ")),
  };
});

export function findServices(term: string, category: string) {
  const query = normalize(term);
  const tokens = query.split(" ").filter(Boolean);
  const keywords = tokens.filter(word => !fillerWords.has(word));
  const words = keywords.length ? keywords : tokens;
  return index.flatMap(({ service, scope, offer, names, terms }) => {
    if (category && service.group !== category) return [];
    const href = contentPath(service.key);
    const rows = [];
    const offerIntent = words.includes("vat") || words.includes("sme") || words.includes("review");
    if (offer && offerIntent && words.every(word => (offerTerms[service.slug] + " " + normalize(offer.name)).includes(word))) {
      rows.push({ service, scope: offer.fit, title: offer.name, href: offer.href, enquiry: offer.name, market: marketNames["regions/uae"], rank: 2 });
    }
    if (words.every(word => terms.includes(word)) && rows[0]?.href !== href) {
      rows.push({ service, scope, title: service.title, href, enquiry: service.title, market: "", rank: Number(Boolean(query) && names.includes(query)) });
    }
    return rows;
  }).sort((a, b) => b.rank - a.rank);
}
