"use client";

export type LedgerByteAnalyticsEvent =
  | "ai_referral_session"
  | "contact_email"
  | "contact_form_start"
  | "contact_phone"
  | "contact_whatsapp"
  | "generate_lead"
  | "service_cta_click";

type EventParameters = Record<string, string | number | boolean | undefined>;

const aiReferrerSources = [
  { domains: ["chatgpt.com", "chat.openai.com"], source: "chatgpt" },
  { domains: ["perplexity.ai"], source: "perplexity" },
  { domains: ["copilot.microsoft.com"], source: "microsoft_copilot" },
  { domains: ["gemini.google.com"], source: "google_gemini" },
  { domains: ["claude.ai"], source: "claude" },
  { domains: ["you.com"], source: "you" },
] as const;

export function classifyAiReferrer(referrer: string) {
  if (!referrer) return null;

  try {
    const hostname = new URL(referrer).hostname.toLowerCase();
    const match = aiReferrerSources.find(({ domains }) =>
      domains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
      ),
    );

    return match ? { source: match.source, hostname } : null;
  } catch {
    return null;
  }
}

export function trackEvent(
  name: LedgerByteAnalyticsEvent,
  parameters: EventParameters = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return false;
  }

  window.gtag("event", name, parameters);
  return true;
}
