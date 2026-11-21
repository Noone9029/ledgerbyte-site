"use client";

import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function FooterWhatsApp({ href, startingHref }: { href: string; startingHref: string }) {
  const pathname = usePathname();
  const link = useRef<HTMLAnchorElement>(null);
  const needsDraft = pathname === "/contact" || pathname === "/build-your-finance-department";

  useEffect(() => {
    if (!needsDraft) return;
    const source = document.querySelector<HTMLAnchorElement>("main a.floating-whatsapp");
    const footer = link.current;
    if (!source || !footer) return;
    const sync = () => {
      footer.href = source.href;
      footer.target = "_blank";
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(source, { attributes: true, attributeFilter: ["href"] });
    return () => observer.disconnect();
  }, [needsDraft, pathname]);

  const fallback = pathname === "/build-your-finance-department" ? startingHref
    : pathname === "/contact" ? "#whatsapp-enquiry" : href;
  return <a key={pathname} ref={link} href={fallback}
    target={fallback.startsWith("#") ? undefined : "_blank"} rel="noreferrer">WhatsApp</a>;
}

export function EnglishFloatingWhatsApp({ href }: { href: string }) {
  const pathname = usePathname();
  // These pages render the same button with their own current enquiry draft.
  if (pathname === "/contact" || pathname === "/build-your-finance-department") return null;
  return <FloatingWhatsApp href={href} />;
}

export function FloatingWhatsApp({ href }: { href: string }) {
  return (
    <a
      id="whatsapp-enquiry"
      className="floating-whatsapp"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      dir="ltr"
    >
      <WhatsappLogo size={26} weight="regular" aria-hidden="true" />
      <span className="sr-only">WhatsApp (opens in a new tab)</span>
    </a>
  );
}
