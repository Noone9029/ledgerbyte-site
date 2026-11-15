"use client";
import serviceIdentifiers from "@/content/service-identifiers.json";

export const CONSENT_COOKIE = "ledgerbyte-analytics-consent";
export type Consent = "granted" | "denied" | null;
export type LedgerByteAnalyticsEvent = "ai_referral_session" | "contact_email" | "contact_form_start" | "contact_phone" | "contact_whatsapp" | "generate_lead" | "service_cta_click";
type Parameters = Record<string, string | number | boolean | undefined>;
let runtime: { enabled: boolean; paths: readonly string[] } = { enabled: false, paths: [] };

export function readConsent(): Consent {
  if (typeof document === "undefined") return null;
  const value = document.cookie.split("; ").find((part) => part.startsWith(`${CONSENT_COOKIE}=`))?.split("=")[1];
  return value === "granted" || value === "denied" ? value : null;
}

export function writePreference(name: string, value: string, maxAge = 15552000) {
  const companyHost = /^(blog\.)?ledgerbyte\.io$/.test(location.hostname);
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${companyHost ? "; Domain=ledgerbyte.io" : ""}${location.protocol === "https:" ? "; Secure" : ""}`;
}

export function revokeAnalytics(measurementId?: string) {
  runtime.enabled = false;
  if (measurementId) (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
  for (const part of document.cookie.split("; ")) {
    const name = part.split("=")[0];
    if (!/^_ga(?:_|$)|^_gid$|^ledgerbyte-ai-referral$/.test(name)) continue;
    for (const domain of ["", "; Domain=ledgerbyte.io", `; Domain=${location.hostname}`]) document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${domain}`;
  }
}

export function configureAnalytics(enabled: boolean, paths: readonly string[]) { runtime = { enabled, paths }; }
export function safeAnalyticsPath(pathname: string, allowedPaths: readonly string[]) { return allowedPaths.includes(pathname) ? pathname : "/404"; }
export function analyticsReferrer(value: string) {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) && !/^(blog\.)?ledgerbyte\.io$/.test(url.hostname) ? url.origin : "";
  } catch { return ""; }
}
export function classifyAiReferrer(referrer: string, search = "") {
  const sources = [["chatgpt.com", "chatgpt"], ["chat.openai.com", "chatgpt"], ["perplexity.ai", "perplexity"], ["copilot.microsoft.com", "microsoft_copilot"], ["gemini.google.com", "google_gemini"], ["claude.ai", "claude"], ["you.com", "you"]];
  try {
    let host = "";
    try { host = new URL(referrer).hostname.toLowerCase(); } catch { /* A known campaign source may still be available. */ }
    if (!host) {
      const campaign = new URLSearchParams(search).get("utm_source")?.toLowerCase();
      const known: Record<string, string> = { chatgpt: "chatgpt.com", "chatgpt.com": "chatgpt.com", perplexity: "perplexity.ai", copilot: "copilot.microsoft.com", gemini: "gemini.google.com", claude: "claude.ai" };
      host = campaign ? known[campaign] || "" : "";
    }
    const match = sources.find(([domain]) => host === domain || host.endsWith(`.${domain}`));
    return match ? { source: match[1], hostname: match[0] } : null;
  } catch { return null; }
}
export function safePageDimensions(path: string) {
  const fields: Parameters = { locale: path === "/ar" || path.startsWith("/ar/") ? "ar" : "en" };
  const context = typeof document.querySelector === "function" ? document.querySelector<HTMLElement>("main[data-analytics-market],main[data-analytics-service]")?.dataset : undefined;
  const market = path.match(/\/regions\/(uae|saudi-arabia|united-states|pakistan)(?:\/|$)/)?.[1] || (path !== "/404" ? context?.analyticsMarket : undefined);
  if (market && ["uae", "saudi-arabia", "united-states", "us", "pakistan", "all"].includes(market)) fields.market = market === "united-states" ? "us" : market;
  const service = path.match(/\/finance\/services\/([a-z-]+)$/)?.[1] || (path !== "/404" ? context?.analyticsService : undefined);
  if (service && serviceIdentifiers.includes(service)) fields.service_slug = service;
  return fields;
}
export function trackEvent(name: LedgerByteAnalyticsEvent, parameters: Parameters = {}) {
  if (typeof window === "undefined" || !runtime.enabled || readConsent() !== "granted" || typeof window.gtag !== "function") return false;
  const path = safeAnalyticsPath(location.pathname, runtime.paths);
  const clean: Parameters = { page_path: path, ...safePageDimensions(path) };
  if (parameters.method === "email") clean.method = "email";
  if (name === "ai_referral_session") {
    const referral = classifyAiReferrer(document.referrer, location.search);
    if (!referral) return false;
    clean.ai_source = referral.source; clean.referral_host = referral.hostname;
  }
  window.gtag("event", name, clean);
  return true;
}
