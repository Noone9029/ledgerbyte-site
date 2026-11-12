import { ContentPage } from "@/components/accounting/content-page";
import { accountingPages } from "@/content/accounting";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({
  path: "/about",
  title: accountingPages.about.title,
  description: accountingPages.about.description,
});
export default function AboutPage() {
  return <ContentPage pageKey="about" />;
}
