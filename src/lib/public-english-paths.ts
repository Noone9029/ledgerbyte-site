import { team, technologyServices } from "@/content";
import { seoPages } from "@/content/seo";
import { buildPersonPath } from "./person-identity";

export const publicEnglishPaths = [...new Set([
  ...Object.keys(seoPages),
  ...technologyServices.map((service) => `/technology/services/${service.slug}`),
  ...team.map((person) => buildPersonPath(person.name)),
])];
