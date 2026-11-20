import { accountingServices, contentPath } from "./accounting";
import { homeUpdate } from "./home-update";
import catalogue from "./home-service-scopes.json";

const scopes = new Map(catalogue.flatMap(group => group.items.map(item => [item.slug, item.scope] as const)));
const vatOffer = homeUpdate.offers.find(offer => offer.service === "UAE VAT support")!;
const aliases: Record<string, string> = {
  "tax-vat-compliance": "VAT returns VAT filing",
  "corporate-tax-filing": "corporate tax return tax returns",
};

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

const index = accountingServices.map(service => {
  const scope = scopes.get(service.slug) ?? service.output;
  const offer = service.slug === "tax-vat-compliance" ? vatOffer : homeUpdate.offers.find(item => item.service === service.title);
  const names = normalize([service.title, offer?.name, aliases[service.slug]].filter(Boolean).join(" "));
  return {
    service,
    scope,
    names,
    terms: normalize([names, scope, service.summary, service.group].join(" ")),
  };
});

export function findServices(term: string, category: string) {
  const query = normalize(term);
  const words = query.split(" ").filter(Boolean);
  return index.filter(({ service, terms }) =>
    (!category || service.group === category) && words.every(word => terms.includes(word)),
  ).map(({ service, scope, names }) => {
    const showOffer = service.slug === "tax-vat-compliance"
      && words.includes("vat") && words.some(word => /^(returns?|filing)$/.test(word));
    return {
      service,
      title: showOffer ? vatOffer.name : service.title,
      scope: showOffer ? vatOffer.description : scope,
      href: showOffer ? vatOffer.href : contentPath(service.key),
      enquiry: showOffer ? vatOffer.service : service.title,
      rank: showOffer ? 2 : Number(Boolean(query) && names.includes(query)),
    };
  }).sort((a, b) => b.rank - a.rank);
}
