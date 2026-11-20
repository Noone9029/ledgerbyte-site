import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { financeEnquiryChoices } from "@/lib/enquiry-options";

const choices = new Set(financeEnquiryChoices);
const schema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    location: z.string().trim().min(2).max(100),
    service: z.string().refine((value) => choices.has(value)),
    companyName: z.string().trim().max(120).optional().default(""),
    message: z.string().trim().max(2000).optional().default(""),
    website: z.string().max(200).optional().default(""),
    startedAt: z.number().int().positive(),
  })
  .strict();
const failure =
  "We could not send your enquiry. Please try again or contact us by email.";
const attempts = new Map<string, { count: number; expires: number }>();
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  // Next can canonicalize loopback addresses to localhost while the browser keeps the requested host.
  const loopback = new Set(["localhost", "127.0.0.1", "[::1]"]);
  const trustedOrigins = new Set([requestUrl.origin]);
  if (loopback.has(requestUrl.hostname)) {
    for (const host of loopback) {
      const alternate = new URL(requestUrl);
      alternate.hostname = host;
      trustedOrigins.add(alternate.origin);
    }
  }
  if (origin && !trustedOrigins.has(origin))
    return NextResponse.json({ message: failure }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 16000)
    return NextResponse.json({ message: failure }, { status: 413 });
  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ message: failure }, { status: 400 });
  }
  if (body.length > 16000)
    return NextResponse.json({ message: failure }, { status: 413 });
  let parsed;
  try {
    parsed = schema.safeParse(JSON.parse(body));
  } catch {
    return NextResponse.json({ message: failure }, { status: 400 });
  }
  if (!parsed.success)
    return NextResponse.json(
      { message: "Please check the required fields and try again." },
      { status: 400 },
    );
  const { startedAt, website, ...contact } = parsed.data;
  if (website)
    return NextResponse.json({ message: "Request received." }, { status: 202 });
  const now = Date.now();
  if (now - startedAt < 1500 || now - startedAt > 86400000)
    return NextResponse.json({ message: failure }, { status: 400 });
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  for (const [key, value] of attempts)
    if (value.expires <= now) attempts.delete(key);
  const bucket = attempts.get(ip) ?? { count: 0, expires: now + 600000 };
  if (bucket.count >= 5)
    return NextResponse.json(
      { message: "Please wait before trying again, or contact us by email." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  bucket.count++;
  attempts.set(ip, bucket);
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.CONTACT_FROM_EMAIL ||
    process.env.CONTACT_EMAIL_DISABLED === "true"
  )
    return NextResponse.json(
      {
        message:
          "Email delivery is unavailable. Please email info@ledgerbyte.io or choose WhatsApp.",
      },
      { status: 503 },
    );
  const text = [
    "LedgerByte website enquiry",
    "",
    "Name: " + contact.fullName,
    "Email: " + contact.email,
    "Business location: " + contact.location,
    "Company: " + (contact.companyName || "Not provided"),
    "Service: " + contact.service,
    "",
    "Message:",
    contact.message || "Not provided",
  ].join("\n");
  try {
    const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL || "info@ledgerbyte.io",
      replyTo: contact.email,
      subject: "LedgerByte enquiry: " + contact.service,
      text,
    });
    if (result.error || !result.data?.id)
      return NextResponse.json({ message: failure }, { status: 502 });
    return NextResponse.json(
      {
        message: "Your enquiry has been accepted for email delivery.",
        enquiryId: result.data.id,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ message: failure }, { status: 502 });
  }
}
