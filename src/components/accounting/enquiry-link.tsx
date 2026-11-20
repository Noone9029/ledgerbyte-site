"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { contactHrefForPath } from "@/lib/technology-enquiry";

export function EnquiryLink({ children, className, technologyOnly = false }: {
  children: ReactNode;
  className: string;
  technologyOnly?: boolean;
}) {
  const href = contactHrefForPath(usePathname(), technologyOnly);
  return <Link href={href} className={className}>{children}</Link>;
}
