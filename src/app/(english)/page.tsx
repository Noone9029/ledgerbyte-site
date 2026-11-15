import { AccountingHome } from "@/components/accounting/home-page";
import { accountingPages } from "@/content/accounting";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata({
  path: "/",
  title: accountingPages.home.title,
  description: accountingPages.home.description,
});
export default AccountingHome;
