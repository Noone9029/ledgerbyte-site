"use client";
import { consentLabels } from "@/content/consent-ui";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { analyticsReferrer, classifyAiReferrer, configureAnalytics, CONSENT_COOKIE, type Consent, readConsent, revokeAnalytics, safeAnalyticsPath, safePageDimensions, trackEvent, writePreference } from "@/lib/analytics";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const production = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
const labels = consentLabels;

function subscribeConsent(notify: () => void) {
  const sync = () => { if (readConsent() !== "granted") revokeAnalytics(measurementId); notify(); };
  window.addEventListener("ledgerbyte:consent", sync); window.addEventListener("focus", sync); document.addEventListener("visibilitychange", sync);
  return () => { window.removeEventListener("ledgerbyte:consent", sync); window.removeEventListener("focus", sync); document.removeEventListener("visibilitychange", sync); };
}
const subscribeHydration = () => () => {};
export function SiteAnalytics({ allowedPaths = [] }: { allowedPaths?: string[] }) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => null);
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [choiceOpen, setVisible] = useState<boolean | null>(null);
  const [inlineSlot, setInlineSlot] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const lastPage = useRef("");
  const copy = pathname?.startsWith("/ar") ? labels.ar : labels.en;
  const studio = pathname?.startsWith("/studio");
  const publicHost = hydrated && /^(blog\.)?ledgerbyte\.io$/.test(location.hostname);
  const eligible = Boolean(production && publicHost && !studio && measurementId && /^G-[A-Z0-9]+$/.test(measurementId) && allowedPaths.length);
  const visible = hydrated && (choiceOpen ?? (eligible && consent === null));
  const enabled = eligible && consent === "granted";

  useEffect(() => {
    const smallScreen = window.matchMedia("(max-width: 700px)");
    const updateSlot = () => setInlineSlot(smallScreen.matches ? document.getElementById("analytics-inline") : null);
    const frame = requestAnimationFrame(updateSlot);
    smallScreen.addEventListener("change", updateSlot);
    return () => {
      cancelAnimationFrame(frame);
      smallScreen.removeEventListener("change", updateSlot);
    };
  }, [pathname]);

  useEffect(() => {
    if (!enabled || !measurementId) return;
    (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
    const markReady = () => { if (readConsent() === "granted") setReady(true); };
    window.addEventListener("ledgerbyte:ga-loaded", markReady);
    let script = document.getElementById("ledgerbyte-google-analytics") as HTMLScriptElement | null;
    if (!script) {
      window.dataLayer = window.dataLayer || [];
      // Initialize the Google command queue once, before loading the SDK.
      // eslint-disable-next-line prefer-rest-params
      window.gtag = function () { window.dataLayer?.push(arguments); };
      const fields = { page_location: `https://${location.hostname}${safeAnalyticsPath(location.pathname, allowedPaths)}`, page_title: `LedgerByte ${safeAnalyticsPath(location.pathname, allowedPaths)}`, page_referrer: analyticsReferrer(document.referrer) };
      window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      window.gtag("set", fields);
      window.gtag("set", "send_page_view", false);
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { ...fields, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_domain: "ledgerbyte.io", cookie_flags: "SameSite=Lax;Secure" });
      script = document.createElement("script"); script.id = "ledgerbyte-google-analytics"; script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      const created = script;
      script.addEventListener("load", () => { created.dataset.loaded = "true"; window.dispatchEvent(new Event("ledgerbyte:ga-loaded")); }, { once: true });
      document.head.appendChild(script);
    } else if (script.dataset.loaded === "true") queueMicrotask(markReady);
    return () => window.removeEventListener("ledgerbyte:ga-loaded", markReady);
  }, [enabled, allowedPaths]);
  useEffect(() => {
    configureAnalytics(enabled && ready, allowedPaths);
    return () => configureAnalytics(false, []);
  }, [enabled, ready, allowedPaths]);
  useEffect(() => {
    if (!enabled || !ready || !measurementId || !pathname) return;
    (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
    const path = safeAnalyticsPath(pathname, allowedPaths), key = `${location.hostname}${path}`;
    if (lastPage.current === key) return;
    lastPage.current = key;
    const fields = { page_location: `https://${location.hostname}${path}`, page_path: path, page_title: path === "/404" ? "Page not found" : `LedgerByte ${path}`, page_referrer: analyticsReferrer(document.referrer), ...safePageDimensions(path) };
    window.gtag?.("set", fields); window.gtag?.("event", "page_view", fields);
    const alreadyRecorded = document.cookie.split("; ").some((part) => part.startsWith("ledgerbyte-ai-referral="));
    const newReferral = !alreadyRecorded && classifyAiReferrer(document.referrer, location.search) && trackEvent("ai_referral_session");
    if (alreadyRecorded || newReferral) writePreference("ledgerbyte-ai-referral", "recorded", 1800);
  }, [enabled, ready, pathname, allowedPaths]);
  useEffect(() => {
    if (!enabled || !ready) return;
    const handleClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a") : null;
      if (!anchor) return;
      const url = new URL(anchor.href, location.href);
      if (url.protocol === "mailto:") trackEvent("contact_email");
      else if (url.protocol === "tel:") trackEvent("contact_phone");
      else if (url.hostname === "wa.me") trackEvent("contact_whatsapp");
      else if (/^(blog\.)?ledgerbyte\.io$/.test(url.hostname) && /^\/(ar\/)?contact$/.test(url.pathname)) trackEvent("service_cta_click");
    };
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [enabled, ready]);
  function choose(value: Exclude<Consent, null>) {
    writePreference(CONSENT_COOKIE, value); window.dispatchEvent(new Event("ledgerbyte:consent")); setVisible(false);
    if (value === "denied") { revokeAnalytics(measurementId); lastPage.current = ""; }
  }
  if (studio) return null;
  const panel = visible && <section id="analytics-choice" className="analytics-choice" aria-labelledby="analytics-choice-title">
      <h2 id="analytics-choice-title">{copy.prompt}</h2>
      <details className="analytics-explanation"><summary>{copy.details}</summary><p>{copy.text} <a href="https://ledgerbyte.io/privacy-policy">{copy.policy}</a></p></details>
      <div><button type="button" aria-label={copy.accept} onClick={() => choose("granted")}>{copy.allowShort}</button><button type="button" aria-label={copy.decline} onClick={() => choose("denied")}>{copy.declineShort}</button>{choiceOpen && <button type="button" onClick={() => setVisible(false)}>{copy.close}</button>}</div>
    </section>;
  return <>
    <div className="analytics-preferences"><button type="button" onClick={() => setVisible(true)} aria-expanded={visible} aria-controls="analytics-choice">{copy.settings}</button></div>
    {inlineSlot && choiceOpen === null ? createPortal(panel, inlineSlot) : panel}
  </>;
}
