"use client";

import { useEffect, useRef } from "react";
import { initializeBuilder } from "./calculator";

const initialized = new WeakSet<HTMLElement>();

export function BuilderControls() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>("[data-finance-builder]");
    if (!root) return;
    if (!initialized.has(root)) {
      initializeBuilder(root);
      initialized.add(root);
    }

    const mobile = root.querySelector<HTMLElement>("#mobile");
    const estimate = root.querySelector<HTMLElement>("#estimate");
    const controls = root.querySelector<HTMLElement>("#builder-controls");
    const intro = root.querySelector<HTMLElement>(".finance-intro");
    if (!mobile || !estimate || !controls || !intro || !("IntersectionObserver" in window)) return;

    let working = false;
    let reviewing = false;
    let introducing = true;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === controls) working = entry.isIntersecting;
        if (entry.target === estimate) reviewing = entry.isIntersecting;
        if (entry.target === intro) introducing = entry.isIntersecting;
      }
      mobile.hidden = !working || reviewing || introducing;
    }, { rootMargin: "-82px 0px -70px" });
    observer.observe(controls);
    observer.observe(intro);
    observer.observe(estimate);
    return () => observer.disconnect();
  }, []);

  return <span hidden ref={marker} />;
}
