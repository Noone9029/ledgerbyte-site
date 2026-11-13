"use client";

import { useEffect } from "react";

/** Enhance the existing document flow; the server-rendered page is always visible. */
export function ScrollReveals() {
  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-reveal]"));
    const preference = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)",
    );
    const seen = new WeakSet<HTMLElement>();
    const active = new Map<HTMLElement, Animation>();
    let observer: IntersectionObserver | undefined;
    let disposed = false;

    function settle(element: HTMLElement) {
      seen.add(element);
      observer?.unobserve(element);
      active.get(element)?.cancel();
      active.delete(element);
      element.dataset.revealState = "done";
    }

    function stop() {
      observer?.disconnect();
      active.forEach((animation) => animation.cancel());
      active.clear();
      targets.forEach((element) => {
        element.dataset.revealState = seen.has(element) ? "done" : "static";
      });
    }

    function observe() {
      stop();
      if (!preference.matches) return;
      const tokens = getComputedStyle(root!);
      const duration = parseFloat(tokens.getPropertyValue("--motion-reveal"));
      const distance = tokens.getPropertyValue("--motion-reveal-distance").trim();
      const easing = tokens.getPropertyValue("--ease-out").trim();

      observer = new IntersectionObserver((entries) => {
        if (disposed || !preference.matches) return;
        entries.forEach(({ target, isIntersecting }) => {
          const element = target as HTMLElement;
          if (!isIntersecting || seen.has(element)) return;
          observer?.unobserve(element);
          seen.add(element);
          if (element.contains(document.activeElement)) {
            settle(element);
            return;
          }
          try {
            const animation = element.animate(
              [
                { opacity: 0.9, transform: `translateY(${distance})` },
                { opacity: 1, transform: "none" },
              ],
              { duration, easing },
            );
            active.set(element, animation);
            element.dataset.revealState = "revealing";
            animation.onfinish = animation.oncancel = () => {
              active.delete(element);
              element.dataset.revealState = "done";
            };
          } catch {
            settle(element);
          }
        });
      }, { threshold: 0 });

      targets.forEach((element) => {
        // Never replay content already on screen, including restored history.
        if (seen.has(element) || element.getBoundingClientRect().top < innerHeight) {
          settle(element);
        } else {
          element.dataset.revealState = "ready";
          observer!.observe(element);
        }
      });
    }

    const focus = (event: FocusEvent) => {
      const element = (event.target as Element).closest<HTMLElement>("[data-scroll-reveal]");
      if (element && root.contains(element)) settle(element);
    };
    const anchor = () => {
      if (!window.location.hash) return;
      const element = targets.find((target) =>
        target.id === window.location.hash.slice(1) ||
        Array.from(target.querySelectorAll("[id]")).some((child) => `#${child.id}` === window.location.hash),
      );
      if (element) settle(element);
    };
    observe();
    anchor();
    root.addEventListener("focusin", focus);
    preference.addEventListener("change", observe);
    window.addEventListener("hashchange", anchor);
    window.addEventListener("pageshow", observe);
    return () => {
      disposed = true;
      stop();
      root.removeEventListener("focusin", focus);
      preference.removeEventListener("change", observe);
      window.removeEventListener("hashchange", anchor);
      window.removeEventListener("pageshow", observe);
      targets.forEach((element) => delete element.dataset.revealState);
    };
  }, []);

  return null;
}
