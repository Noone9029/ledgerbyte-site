"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { serviceWhatsAppHref } from "@/lib/enquiry-options";

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

export function EnquiryWhatsApp() {
  const selection = useEnquiryService();
  return (
    <a className="button button-amber" href={serviceWhatsAppHref(selection?.service ?? "", selection?.market)} target="_blank" rel="noreferrer">
      WhatsApp ↗
    </a>
  );
}
