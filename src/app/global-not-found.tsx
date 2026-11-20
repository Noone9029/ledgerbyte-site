import { MissingPage } from "@/components/layout/missing-page";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import "./globals.css";
export const metadata = { title: "Page not found | LedgerByte", robots: { index: false, follow: false } };
export default function GlobalNotFound() {
  return <html lang="en"><body><MissingPage /><FloatingWhatsApp /></body></html>;
}
