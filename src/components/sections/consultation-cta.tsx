import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CinematicMedia } from "@/components/sections/cinematic-media";
import { partnershipVisual } from "@/content/visuals";

interface ConsultationCtaProps {
  title: string;
  description: string;
  buttonLabel?: string;
}

export function ConsultationCta({
  title,
  description,
  buttonLabel = "Book Your Free Consultation",
}: ConsultationCtaProps) {
  return (
    <section className="consultation-cta motion-reveal">
      <CinematicMedia
        className="consultation-media"
        src={partnershipVisual}
        mode="overlay"
        copySide="left"
      >
        <div className="consultation-copy">
          <p className="eyebrow">Let&apos;s Connect</p>
          <h2>{title}</h2>
          <p>{description}</p>
          <Link className="button button-amber" href="/contact">
            {buttonLabel}
            <ArrowUpRight weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </CinematicMedia>
    </section>
  );
}
