// src/lib/fbq.ts
export const fbq = (...args: any[]) => {
  if (typeof window === "undefined" || !("fbq" in window)) return;
  // @ts-ignore
  window.fbq(...args);
};
export const pageview = () => fbq("track", "PageView");