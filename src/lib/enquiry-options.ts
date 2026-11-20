import { accountingContact, accountingCopy, accountingServices, marketNames } from "@/content/accounting";

export const financeEnquiryChoices = [
  ...accountingServices.map((service) => service.title),
  "UAE VAT support",
  "Not sure yet",
];

const markets = new Set(Object.values(marketNames));

// Only a public market name can be carried into a link. The location field also accepts private free text.
export function enquiryMarket(value: unknown) {
  return typeof value === "string" && markets.has(value) ? value : "";
}

export function serviceWhatsAppHref(service: string, market = "") {
  let message = accountingCopy.C08.whatsapp_generic_text;
  if (financeEnquiryChoices.includes(service)) {
    message = `Hi LedgerByte, I would like to discuss ${service}.`;
  }
  if (enquiryMarket(market)) message += ` Market: ${market}.`;
  return `${accountingContact.social.whatsapp}?text=${encodeURIComponent(message)}`;
}
