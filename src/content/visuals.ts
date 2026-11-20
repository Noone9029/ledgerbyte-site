import visualManifest from "./visuals.json";

export const corporateVisual = "/art/corporate-editorial-v3.webp";
export const financeVisual = "/art/finance-editorial-v3.webp";
export const partnershipVisual = "/art/partnership-editorial-v3.webp";

export const financeServiceVisuals = visualManifest.financeServices;
export const financeOversightVisual = visualManifest.financeOversight;

export const getFinanceServiceVisual = (slug: string) =>
  financeServiceVisuals[slug as keyof typeof financeServiceVisuals] ??
  financeVisual;
