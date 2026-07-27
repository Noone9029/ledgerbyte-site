"use client";

export type LedgerByteAnalyticsEvent =
  | "contact_email"
  | "contact_form_start"
  | "contact_phone"
  | "contact_whatsapp"
  | "generate_lead"
  | "service_cta_click";

type EventParameters = Record<string, string | number | boolean | undefined>;

export function trackEvent(
  name: LedgerByteAnalyticsEvent,
  parameters: EventParameters = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", name, parameters);
}
