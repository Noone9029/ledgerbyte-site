"use client";

import { useEffect } from "react";
import Script from "next/script";
import { classifyAiReferrer, trackEvent } from "@/lib/analytics";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

function InteractionAnalytics() {
  useEffect(() => {
    const aiReferral = classifyAiReferrer(document.referrer);
    const aiSessionKey = "ledgerbyte-ai-" + "referral-recorded";

    const recordAiReferral = () => {
      if (!aiReferral) return;

      try {
        if (window.sessionStorage.getItem(aiSessionKey)) return;
      } catch {
        // Analytics remains non-blocking when storage is unavailable.
      }

      const recorded = trackEvent("ai_referral_session", {
        ai_source: aiReferral.source,
        referral_host: aiReferral.hostname,
        landing_page: window.location.pathname,
      });

      if (recorded) {
        try {
          window.sessionStorage.setItem(aiSessionKey, "true");
        } catch {
          // The event is still valid when storage is unavailable.
        }
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.href;
      if (href.startsWith("mailto:")) {
        trackEvent("contact_email", { page_path: window.location.pathname });
      } else if (href.startsWith("tel:")) {
        trackEvent("contact_phone", { page_path: window.location.pathname });
      } else if (new URL(href, window.location.href).hostname === "wa.me") {
        trackEvent("contact_whatsapp", {
          page_path: window.location.pathname,
        });
      } else if (
        new URL(href, window.location.href).pathname === "/contact" &&
        anchor.matches(".button, .footer-contact, .text-link")
      ) {
        trackEvent("service_cta_click", {
          page_path: window.location.pathname,
          link_text: anchor.textContent?.replace(/\s+/g, " ").trim().slice(0, 80),
        });
      }
    };

    recordAiReferral();
    window.addEventListener("ledgerbyte:analytics-ready", recordAiReferral);
    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      window.removeEventListener(
        "ledgerbyte:analytics-ready",
        recordAiReferral,
      );
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  return null;
}

export function SiteAnalytics() {
  return (
    <>
      {measurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ledgerbyte-google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${measurementId}', {
                anonymize_ip: true,
                send_page_view: true
              });
              window.dispatchEvent(new Event('ledgerbyte:analytics-ready'));
            `}
          </Script>
        </>
      ) : null}
      <InteractionAnalytics />
    </>
  );
}
