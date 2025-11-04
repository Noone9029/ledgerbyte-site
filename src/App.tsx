import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Index from "./pages/Index";
import Services from "./pages/Services";
import AboutUs from "./pages/AboutUs";
import LetsConnect from "./pages/LetsConnect";
import NotFound from "./pages/NotFound";
import WhatsAppButton from "@/components/WhatsappButton";
import { fbq, pageview } from "@/lib/fbq";

const queryClient = new QueryClient();

/* 🧭 Pixel route listener */
const PixelRouterListener = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    pageview();
    fbq("trackCustom", "VirtualPageview", { path: pathname + search });
  }, [pathname, search]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        {/* Meta Pixel listener for SPA route changes */}
        <PixelRouterListener />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/lets-connect" element={<LetsConnect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Floating WhatsApp button visible on all pages */}
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
