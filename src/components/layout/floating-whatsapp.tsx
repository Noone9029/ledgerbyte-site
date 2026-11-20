"use client";

import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";

export function EnglishFloatingWhatsApp({ href }: { href: string }) {
  // The contact page renders this button inside its editable enquiry context.
  return usePathname() === "/contact" ? null : <FloatingWhatsApp href={href} />;
}

export function FloatingWhatsApp({ href }: { href: string }) {
  return (
    <a
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
