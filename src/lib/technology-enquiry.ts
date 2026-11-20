import technologyServices from "@/content/generated/technology-services.json";

export const technologyEnquiryChoices = [
  ...technologyServices.map((service) => service.title),
  "Technology project",
];

export function technologyEnquiryHref(service?: string) {
  const query = new URLSearchParams({ division: "technology" });
  if (service && technologyEnquiryChoices.includes(service)) query.set("service", service);
  return `/contact?${query}#enquiry-heading`;
}

export function contactHrefForPath(pathname: string, technologyOnly: boolean) {
  if (pathname === "/contact" && !technologyOnly) return "#enquiry-heading";
  if (pathname === "/technology" || pathname.startsWith("/technology/")) {
    const service = technologyServices.find(item => pathname === `/technology/services/${item.slug}`);
    return technologyEnquiryHref(service?.title);
  }
  return technologyOnly ? technologyEnquiryHref() : "/contact";
}
