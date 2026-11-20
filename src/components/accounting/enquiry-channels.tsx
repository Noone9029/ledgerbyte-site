"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { serviceEmailHref, serviceWhatsAppHref } from "@/lib/enquiry-options";
import { accountingContact } from "@/content/accounting";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";

const ServiceContext = createContext<{
  service: string;
  setService: (service: string) => void;
  market: string;
  setMarket: (market: string) => void;
} | null>(null);

export function EnquiryChannels({ initialService, initialMarket, children }: {
  initialService: string; initialMarket: string; children: ReactNode;
}) {
  const [service, setService] = useState(initialService);
  const [market, setMarket] = useState(initialMarket);
  return <ServiceContext.Provider value={{ service, setService, market, setMarket }}>{children}</ServiceContext.Provider>;
}

export function useEnquiryService() {
  return useContext(ServiceContext);
}

export function EnquiryWhatsApp({ floating = false }: { floating?: boolean }) {
  const selection = useEnquiryService();
  const href = serviceWhatsAppHref(selection?.service ?? "", selection?.market);
  if (floating) return <FloatingWhatsApp href={href} />;
  return (
    <a className="button button-amber" href={href} target="_blank" rel="noreferrer">
      WhatsApp ↗
    </a>
  );
}

export function EnquiryEmail() {
  const selection = useEnquiryService();
  return <a href={serviceEmailHref(selection?.service ?? "", selection?.market)}>{accountingContact.contact.email}</a>;
}
