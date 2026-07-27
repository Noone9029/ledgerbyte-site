"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ScrubTextProps {
  children: string;
  className?: string;
}

export function ScrubText({ children, className = "" }: ScrubTextProps) {
  const container = useRef<HTMLParagraphElement>(null);
  const words = children.split(" ");

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = container.current?.querySelectorAll("span");
        if (!targets?.length) return;

        gsap.fromTo(
          targets,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top 82%",
              end: "bottom 58%",
              scrub: 0.4,
            },
          },
        );
      });
      return () => media.revert();
    },
    { scope: container },
  );

  return (
    <p className={`scrub-text ${className}`} ref={container}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
