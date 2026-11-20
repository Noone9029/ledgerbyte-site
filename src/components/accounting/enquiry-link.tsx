"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function EnquiryLink({ children, className }: {
  children: ReactNode;
  className: string;
}) {
  const href = usePathname() === "/contact" ? "#enquiry-heading" : "/contact";
  return <Link href={href} className={className}>{children}</Link>;
}
