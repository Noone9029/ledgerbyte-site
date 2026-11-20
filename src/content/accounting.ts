import data from "./accounting.json";

export interface PageTarget {
  page_key: string;
  path?: string;
}
export interface CopySection {
  heading: string;
  paragraphs: string[];
  bullets: string[];
  blocks?: (string | string[])[];
}
export interface AccountingPage {
  title: string;
  description: string;
  path: string;
  heading: string;
  intro: string;
  cta: string;
  cardStrapline?: string;
  eyebrow?: string;
  hero_note?: string;
  closing_heading?: string;
  sections: CopySection[];
  faqs: { question: string; answer: string }[];
  related: { route: string; label: string; target?: PageTarget }[];
  pathways?: {
    heading: string;
    text: string;
    cta: string;
    target: PageTarget;
  }[];
  featured_services?: string[];
}
export interface AccountingService {
  key: string;
  slug: string;
  title: string;
  group: string;
  summary: string;
  output: string;
  boundary: string;
  audience: string | string[];
}
export const accountingPages = data.pages as Record<string, AccountingPage>;
export const accountingServices = data.services as AccountingService[];
// The eight services in the original expanding-card showcase, with approved copy.
export const accountingShowcaseServices = [
  "accounting-automation-systems",
  "accounting-bookkeeping",
  "budgeting-forecasting",
  "cash-flow-working-capital",
  "financial-reporting-mis",
  "fractional-cfo-advisory",
  "payroll-wps-management",
  "tax-vat-compliance",
].map((slug) => {
  const service = accountingServices.find((item) => item.slug === slug);
  if (!service) throw new Error(`Unmapped showcase service: ${slug}`);
  return service;
});
export const accountingGroups = data.replacements.C06.groups;
export const accountingCopy = data.replacements;
export const accountingContact = data.contact;
export const contentPaths: Record<string, string> = {
  ...data.paths,
  services: "/finance/services",
  regions: "/regions",
  insights: "/insights",
};
export const guideKeys = Object.keys(accountingPages).filter((key) =>
  key.startsWith("insights/"),
);
export const marketKeys = Object.keys(accountingPages).filter((key) =>
  key.startsWith("regions/"),
);
export const marketNames: Record<string, string> = {
  "regions/uae": "United Arab Emirates",
  "regions/saudi-arabia": "Saudi Arabia",
  "regions/united-states": "United States",
  "regions/pakistan": "Pakistan",
};
export function contentPath(key: string) {
  const path = contentPaths[key];
  if (!path) throw new Error(`Unmapped accounting content target: ${key}`);
  return path;
}
export function serviceContactHref(service: string) {
  return `/contact?service=${encodeURIComponent(service)}#enquiry-heading`;
}
export function getAccountingService(slug: string) {
  return accountingServices.find((service) => service.slug === slug);
}
