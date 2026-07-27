import visualManifest from "./visuals.json";

export const corporateVisual = "/art/corporate-editorial-v3.webp";
export const financeVisual = "/art/finance-editorial-v3.webp";
export const technologyVisual = "/art/technology-editorial-v3.webp";
export const partnershipVisual = "/art/partnership-editorial-v3.webp";

export const financeServiceVisuals = visualManifest.financeServices;
export const technologyServiceVisuals = visualManifest.technologyServices;
export const technologyPartnershipVisuals =
  visualManifest.technologyPartnerships;
export const technologyProcessVisual = visualManifest.technologyProcess;
export const financeOversightVisual = visualManifest.financeOversight;

export const getFinanceServiceVisual = (slug: string) =>
  financeServiceVisuals[slug as keyof typeof financeServiceVisuals] ??
  financeVisual;

export const getTechnologyServiceVisual = (slug: string) =>
  technologyServiceVisuals[slug as keyof typeof technologyServiceVisuals] ??
  technologyVisual;

export const getTechnologyPartnershipVisual = (slug: string) =>
  technologyPartnershipVisuals[
    slug as keyof typeof technologyPartnershipVisuals
  ] ?? partnershipVisual;
