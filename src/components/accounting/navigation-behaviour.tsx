"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function NavigationBehaviour() {
  const marker = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const header = marker.current?.closest("header");
    if (!header) return;
    const closeMenus = (restoreFocus = false) => {
      const outer = header.querySelector<HTMLDetailsElement>(
        ".accounting-mobile-nav[open], .accounting-desktop-nav details[open]",
      );
      header
        .querySelectorAll<HTMLDetailsElement>("details[open]")
        .forEach((menu) => {
          menu.open = false;
        });
      if (restoreFocus)
        outer?.querySelector<HTMLElement>(":scope > summary")?.focus();
    };
    // Preserve a native menu opened while the first client scripts are loading.
    if (previousPathname.current !== pathname) closeMenus();
    previousPathname.current = pathname;
    const outside = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const openMenus = [...header.querySelectorAll("details[open]")];
      if (
        openMenus.length &&
        !openMenus.some((menu) => menu.contains(event.target as Node))
      )
        closeMenus();
    };
    const navigate = (event: Event) => {
      if (event.target instanceof Element && event.target.closest("a[href]"))
        closeMenus();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !header.querySelector("details[open]"))
        return;
      event.preventDefault();
      closeMenus(true);
    };
    header.addEventListener("click", navigate);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", escape);
    return () => {
      header.removeEventListener("click", navigate);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [pathname]);

  return <span ref={marker} hidden />;
}
