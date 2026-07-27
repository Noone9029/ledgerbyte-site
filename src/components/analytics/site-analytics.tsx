"use client";

import { useEffect } from "react";
import Script from "next/script";
import { trackEvent } from "@/lib/analytics";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

function InteractionAnalytics() {
  useEffect(() => {
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

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
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
            `}
          </Script>
        </>
      ) : null}
      <InteractionAnalytics />
    </>
  );
}
