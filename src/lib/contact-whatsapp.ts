import type { ContactRequest } from "@/content/types";

export const LEDGERBYTE_WHATSAPP_NUMBER = "971561371569";

const cleanInline = (value: string) =>
  value
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const cleanMessage = (value: string) =>
  value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export function formatContactEnquiry(contact: ContactRequest) {
  const phone = cleanInline(contact.phone ?? "") || "Not provided";
  const company = cleanInline(contact.companyName ?? "") || "Not provided";

  return [
    "LedgerByte website enquiry",
    "",
    `Name: ${cleanInline(contact.fullName)}`,
    `Email: ${cleanInline(contact.email)}`,
    `Phone: ${phone}`,
    `Company: ${company}`,
    `Service: ${cleanInline(contact.service)}`,
    "",
    "Message:",
    cleanMessage(contact.message),
  ].join("\n");
}

export function createWhatsAppHref(contact: ContactRequest) {
  const message = encodeURIComponent(formatContactEnquiry(contact));
  return `https://wa.me/${LEDGERBYTE_WHATSAPP_NUMBER}?text=${message}`;
}
