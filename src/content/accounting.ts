import data from "./accounting.json";

export interface PageTarget {
  page_key: string;
  path?: string;
}
export interface CopySection {
  heading: string;
  paragraphs: string[];
  bullets: string[];
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
export const accountingGroups = data.replacements.C06.groups;
export const accountingCopy = data.replacements;
export const accountingContact = data.contact;
export const contentPaths = data.paths as Record<string, string>;
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
  return contentPaths[key] ?? "/finance/services";
}
export function serviceContactHref(service: string) {
  return `/contact?service=${encodeURIComponent(service)}`;
}
export function getAccountingService(slug: string) {
  return accountingServices.find((service) => service.slug === slug);
}
