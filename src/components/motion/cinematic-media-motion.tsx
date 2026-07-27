"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CinematicMediaMotionProps {
  children: ReactNode;
}

export function CinematicMediaMotion({
  children,
}: CinematicMediaMotionProps) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const image = frame.current?.querySelector<HTMLElement>(
          ".cinematic-media-image",
        );

        if (!image || !frame.current) return;

        gsap.fromTo(
          image,
          {
            scale: 1.035,
            yPercent: 2,
          },
          {
            scale: 1,
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: frame.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.45,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope: frame },
  );

  return (
    <div className="cinematic-media-frame" ref={frame}>
      {children}
    </div>
  );
}
