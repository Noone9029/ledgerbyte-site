import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import styles from "./service.module.css";

export function BuilderExample() {
  return (
    <section className={styles.example} aria-labelledby="builder-example">
      <div>
        <p className="eyebrow">On this website</p>
        <h2 id="builder-example">Inside the finance team builder</h2>
        <p>Start with the 15-hour team. Change senior accountant time from four to ten hours, then add payroll. The builder keeps your adjustment as it allocates the extra work.</p>
        <p>The result is 27 hours and AED 1,080 a month before tax. The email and WhatsApp drafts carry the same roles, hours and price.</p>
        <Link className="text-link" href="/build-your-finance-department">
          Try the finance team builder <ArrowUpRight weight="bold" aria-hidden="true" />
        </Link>
      </div>
      <figure>
        <Image src="/art/finance-builder-allocation.webp" width={956} height={752}
          sizes="(max-width: 820px) 94vw, (max-width: 1340px) 45vw, 540px"
          alt="Controller 1 hour, senior accountant 12 hours, junior accountant 10 hours and junior admin 4 hours." />
        <figcaption>Team allocation from the LedgerByte calculator</figcaption>
      </figure>
    </section>
  );
}
