export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "config" | "event" | "js",
      target: string | Date,
      parameters?: Record<string, unknown>,
    ) => void;
  }
}
