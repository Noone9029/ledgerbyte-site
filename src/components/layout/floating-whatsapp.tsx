import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { accountingContact } from "@/content/accounting";

export function FloatingWhatsApp() {
  return (
    <a
      className="floating-whatsapp"
      href={accountingContact.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      dir="ltr"
    >
      <WhatsappLogo size={26} weight="regular" aria-hidden="true" />
      <span className="sr-only">WhatsApp (opens in a new tab)</span>
    </a>
  );
}
