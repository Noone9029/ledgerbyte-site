"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PageMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-reveal", {
          y: 28,
          duration: 0.9,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "all",
        });

        gsap.utils.toArray<HTMLElement>(".motion-reveal").forEach((element) => {
          gsap.from(element, {
            y: 34,
            duration: 0.75,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          });
        });

        gsap.utils
          .toArray<HTMLElement>(".stack-card")
          .forEach((card, index, cards) => {
            if (index === cards.length - 1) return;
            gsap.to(card, {
              scale: 0.94 + index * 0.012,
              filter: "brightness(0.72)",
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 132px",
                end: "bottom 132px",
                scrub: 0.35,
              },
            });
          });

        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh, { once: true });
        return () => window.removeEventListener("load", refresh);
      });

      return () => media.revert();
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
