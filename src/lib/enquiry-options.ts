import { accountingContact, accountingCopy, accountingServices } from "@/content/accounting";

export const financeEnquiryChoices = [
  ...accountingServices.map((service) => service.title),
  "UAE VAT support",
  "Not sure yet",
];

export function serviceWhatsAppHref(service: string) {
  let message = accountingCopy.C08.whatsapp_generic_text;
  if (financeEnquiryChoices.includes(service)) {
    message = `Hi LedgerByte, I would like to discuss ${service}.`;
  }
  return `${accountingContact.social.whatsapp}?text=${encodeURIComponent(message)}`;
}
