import { team } from "@/content";
import { seoPages } from "@/content/seo";
import { buildPersonPath } from "./person-identity";

export const publicEnglishPaths = [...new Set([
  ...Object.keys(seoPages),
  ...team.map((person) => buildPersonPath(person.name)),
])];
