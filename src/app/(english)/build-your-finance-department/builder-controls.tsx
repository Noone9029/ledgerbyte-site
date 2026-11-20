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
    if (!mobile || !estimate || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      mobile.hidden = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(estimate);
    return () => observer.disconnect();
  }, []);

  return <span hidden ref={marker} />;
}
