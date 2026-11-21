import { accountingContact, accountingCopy, accountingServices, marketNames } from "@/content/accounting";
import { homeUpdate } from "@/content/home-update";

export const financeEnquiryChoices = [
  ...homeUpdate.offers.map(offer => offer.name),
  ...accountingServices.map((service) => service.title),
  "UAE VAT support",
  "Not sure yet",
];

const markets = new Set(Object.values(marketNames));

// Only a public market name can be carried into a link. The location field also accepts private free text.
export function enquiryMarket(value: unknown) {
  return typeof value === "string" && markets.has(value) ? value : "";
}

export function selectedOffer(service: string) {
  return homeUpdate.offers.find(offer => offer.name === service);
}

export function enquiryService(value: unknown) {
  if (typeof value !== "string") return "";
  if (financeEnquiryChoices.includes(value)) return value;
  return accountingServices.find((item) => item.slug === value)?.title ?? "";
}

export function enquiryDimensions(service: string, market: string) {
  const offer = selectedOffer(service) ?? homeUpdate.offers.find(item => item.service === service);
  return {
    service: offer?.serviceSlug ?? accountingServices.find(item => item.title === service)?.slug,
    market: Object.entries(marketNames).find(([, name]) => name === market)?.[0].split("/")[1],
  };
}

function enquiryDraft(service: string, market: string) {
  let message = accountingCopy.C08.whatsapp_generic_text;
  if (financeEnquiryChoices.includes(service)) {
    message = `Hi LedgerByte, I would like to discuss ${service}.`;
    const offer = selectedOffer(service);
    if (offer) message += ` ${offer.fit}`;
  }
  if (enquiryMarket(market)) message += ` Market: ${market}.`;
  return message;
}

export function serviceWhatsAppHref(service: string, market = "") {
  return `${accountingContact.social.whatsapp}?text=${encodeURIComponent(enquiryDraft(service, market))}`;
}

export function serviceEmailHref(service: string, market = "") {
  const email = "mailto:" + accountingContact.contact.email;
  if (!financeEnquiryChoices.includes(service) && !enquiryMarket(market)) return email;
  const subject = financeEnquiryChoices.includes(service) ? "LedgerByte enquiry: " + service : "LedgerByte enquiry";
  return `${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiryDraft(service, market))}`;
}
