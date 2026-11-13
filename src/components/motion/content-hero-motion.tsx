"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { desktopStoryQuery } from "./desktop-story";

gsap.registerPlugin(useGSAP);

export function ContentHeroMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(desktopStoryQuery, () => {
      const container = scope.current;
      const visual = container?.firstElementChild;
      if (!visual) return;
      const tween = gsap.fromTo(visual, { y: 8 }, {
        y: 0,
        duration: 0.45,
        ease: "power3.out",
        clearProps: "transform",
      });
      const finish = () => { tween.progress(1); };
      container?.addEventListener("focusin", finish);
      return () => container?.removeEventListener("focusin", finish);
    });
    return () => media.revert();
  }, { scope });
  return <div className="accounting-content-visual" ref={scope}>{children}</div>;
}
