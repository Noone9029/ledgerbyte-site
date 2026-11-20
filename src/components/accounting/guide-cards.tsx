import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { accountingPages, contentPath, guideKeys } from "@/content/accounting";
import { guideExamples } from "@/content/insight-guides";
import styles from "./guide-cards.module.css";

export function GuideCards({ summaries = false }: { summaries?: boolean }) {
  const Heading = summaries ? "h2" : "h3";
  return (
    <ul className={styles.guides} role="list">
      {guideKeys.map(key => {
        const guide = accountingPages[key];
        return (
          <li key={key}>
            <Link href={contentPath(key)} className={styles.card}>
              <Image alt="" src={`/art/examples/${guideExamples[key].artwork}.webp`} width={960} height={640}
                sizes="auto, (max-width: 760px) 30vw, (max-width: 1384px) 32vw, 425px" />
              <div>
                <Heading>{guide.heading}<ArrowUpRight aria-hidden="true" /></Heading>
                {summaries && <p>{guide.intro}</p>}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
