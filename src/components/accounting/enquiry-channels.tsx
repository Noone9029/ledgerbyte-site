"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { serviceWhatsAppHref } from "@/lib/enquiry-options";

const ServiceContext = createContext<{
  service: string;
  setService: (service: string) => void;
} | null>(null);

export function EnquiryChannels({ initialService, children }: { initialService: string; children: ReactNode }) {
  const [service, setService] = useState(initialService);
  return <ServiceContext.Provider value={{ service, setService }}>{children}</ServiceContext.Provider>;
}

export function useEnquiryService() {
  return useContext(ServiceContext);
}

export function EnquiryWhatsApp() {
  const selection = useEnquiryService();
  return (
    <a className="button button-amber" href={serviceWhatsAppHref(selection?.service ?? "")} target="_blank" rel="noreferrer">
      WhatsApp ↗
    </a>
  );
}
