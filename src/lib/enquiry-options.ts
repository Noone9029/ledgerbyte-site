import { accountingContact, accountingCopy, accountingServices } from "@/content/accounting";
export { technologyEnquiryChoices, technologyEnquiryHref } from "./technology-enquiry";

export const financeEnquiryChoices = [
  ...accountingServices.map((service) => service.title),
  "UAE VAT support",
  "Not sure yet",
];

export function serviceWhatsAppHref(service: string) {
  let message = accountingCopy.C08.whatsapp_generic_text;
  if (service) {
    const subject = service === "Technology project" ? "a technology project" : service;
    message = `Hi LedgerByte, I would like to discuss ${subject}.`;
  }
  return `${accountingContact.social.whatsapp}?text=${encodeURIComponent(message)}`;
}
