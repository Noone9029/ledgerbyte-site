import { notFound } from "next/navigation";
import { ContentPage } from "@/components/accounting/content-page";
import {
  accountingPages,
  accountingServices,
  getAccountingService,
} from "@/content/accounting";
import { createMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return accountingServices.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: Props) {
  const service = getAccountingService((await params).slug);
  if (!service) return {};
  const page = accountingPages[service.key];
  return createMetadata({
    path: page.path,
    title: page.title,
    description: page.description,
  });
}
export default async function ServicePage({ params }: Props) {
  const service = getAccountingService((await params).slug);
  if (!service) notFound();
  return <ContentPage pageKey={service.key} />;
}
