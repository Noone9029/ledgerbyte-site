import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import {
  contactDetails,
  financeServices,
  technologyServices,
} from "@/content";
import {
  createWhatsAppHref,
  formatContactEnquiry,
} from "@/lib/contact-whatsapp";

const validServices = new Set([
  ...financeServices.map((service) => service.title),
  ...technologyServices.map((service) => service.title),
  "Other",
]);

const contactSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().max(32).optional().default(""),
    companyName: z.string().trim().max(120).optional().default(""),
    service: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .refine((value) => validServices.has(value)),
    message: z.string().trim().min(10).max(1000),
    website: z.string().max(200).optional().default(""),
    startedAt: z.number().int().positive(),
  })
  .strict();

const fallback = {
  message: "There was an issue sending your message. Please try again.",
  alternatives: {
    email: contactDetails.email,
    phone: contactDetails.phone,
    whatsapp: contactDetails.whatsappHref,
  },
};

export async function POST(request: Request) {
  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json(fallback, { status: 400 });
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(fallback, { status: 400 });
  }

  const { website, startedAt, ...contact } = parsed.data;
  const elapsed = Date.now() - startedAt;

  if (website) {
    return NextResponse.json({ message: "WhatsApp is ready." });
  }

  if (elapsed < 1500 || elapsed > 86_400_000) {
    return NextResponse.json(fallback, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    "LedgerByte Website <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO_EMAIL ?? contactDetails.email;
  const whatsappHref = createWhatsAppHref(contact);
  let emailDelivered = false;

  if (apiKey && process.env.CONTACT_EMAIL_DISABLED !== "true") {
    const resend = new Resend(apiKey);

    try {
      const { error } = await resend.emails.send({
        from,
        to,
        replyTo: contact.email,
        subject: `LedgerByte enquiry: ${contact.service}`,
        text: formatContactEnquiry(contact),
      });
      emailDelivered = !error;
    } catch {
      emailDelivered = false;
    }
  }

  return NextResponse.json({
    message: "WhatsApp is ready.",
    whatsappHref,
    emailDelivered,
  });
}
