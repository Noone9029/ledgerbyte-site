import { accountingContact, accountingCopy, accountingServices } from "@/content/accounting";
import technologyServices from "@/content/generated/technology-services.json";

export const financeEnquiryChoices = [
  ...accountingServices.map((service) => service.title),
  "UAE VAT support",
  "Not sure yet",
];

export const technologyEnquiryChoices = [
  ...technologyServices.map((service) => service.title),
  "Technology project",
];

export function technologyEnquiryHref(service?: string) {
  const query = new URLSearchParams({ division: "technology" });
  if (service && technologyEnquiryChoices.includes(service)) query.set("service", service);
  return `/contact?${query}#enquiry-heading`;
}

export function serviceWhatsAppHref(service: string) {
  let message = accountingCopy.C08.whatsapp_generic_text;
  if (service) {
    const subject = service === "Technology project" ? "a technology project" : service;
    message = `Hi LedgerByte, I would like to discuss ${subject}.`;
  }
  return `${accountingContact.social.whatsapp}?text=${encodeURIComponent(message)}`;
}
