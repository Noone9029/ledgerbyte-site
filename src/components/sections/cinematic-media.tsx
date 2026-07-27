import type { ReactNode } from "react";
import Image from "next/image";
import { CinematicMediaMotion } from "@/components/motion/cinematic-media-motion";

export type CinematicMediaMode = "stacked" | "overlay";
export type CinematicMediaCopySide = "left" | "right";

export interface CinematicMediaPresentation {
  src: string;
  alt?: string;
  mode?: CinematicMediaMode;
  copySide?: CinematicMediaCopySide;
  priority?: boolean;
  sizes?: string;
  className?: string;
  children?: ReactNode;
  frameOverlay?: ReactNode;
}

const fullWidthSizes =
  "(max-width: 820px) calc(100vw - 24px), (max-width: 1440px) calc(100vw - 40px), 1400px";

export function CinematicMedia({
  src,
  alt = "",
  mode = "stacked",
  copySide = "left",
  priority = false,
  sizes = fullWidthSizes,
  className,
  children,
  frameOverlay,
}: CinematicMediaPresentation) {
  const classes = ["cinematic-media", className].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      data-cinematic-media
      data-copy-side={copySide}
      data-mode={mode}
    >
      {children ? <div className="cinematic-media-copy">{children}</div> : null}
      <CinematicMediaMotion>
        <Image
          className="cinematic-media-image"
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
        />
        {frameOverlay}
      </CinematicMediaMotion>
    </div>
  );
}
