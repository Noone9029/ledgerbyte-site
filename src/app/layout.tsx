import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { corporateVisual } from "@/content/visuals";
import "./globals.css";

const cabinetGrotesk = localFont({
  variable: "--font-cabinet-grotesk",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/cabinet-grotesk-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/cabinet-grotesk-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/cabinet-grotesk-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ledgerbyte.io"),
  title: {
    default: "LedgerByte | Smart Accounting",
    template: "%s | LedgerByte",
  },
  description:
    "Elevating business performance through clarity, compliance, and smart finance.",
  applicationName: "LedgerByte",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "LedgerByte",
    title: "LedgerByte | Smart Accounting",
    description:
      "Elevating business performance through clarity, compliance, and smart finance.",
    images: [corporateVisual],
  },
  twitter: {
    card: "summary_large_image",
    title: "LedgerByte | Smart Accounting",
    description:
      "Elevating business performance through clarity, compliance, and smart finance.",
    images: [corporateVisual],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0e5" },
    { media: "(prefers-color-scheme: dark)", color: "#171716" },
  ],
  colorScheme: "dark light",
};

const themeInitializer = `
  (function () {
    try {
      var storedTheme = window.localStorage.getItem("ledgerbyte-theme");
      var theme = storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.style.colorScheme = "dark";
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cabinetGrotesk.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <Script
          id="ledgerbyte-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitializer }}
        />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
