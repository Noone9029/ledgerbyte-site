import { technologyEnquiryHref } from "@/lib/enquiry-options";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { StructuredData } from "@/components/structured-data";
import { technologyServices } from "@/content";
import { getPageSeo } from "@/content/seo";
import { getTechnologyServiceVisual } from "@/content/visuals";
import styles from "./catalogue.module.css";
import {
  buildSchemaGraph,
  buildServiceSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

const pageSeo = getPageSeo("/technology/services");

export const metadata = createPageMetadata(pageSeo, {
  path: "/technology/services",
});

export default function TechnologyServicesPage() {
  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          buildWebPageSchema({
            path: "/technology/services",
            name: pageSeo.title,
            description: pageSeo.description,
            type: "CollectionPage",
          }),
          buildServiceSchema({
            path: "/technology/services",
            name: pageSeo.title,
            description: pageSeo.description,
            serviceType: technologyServices.map((service) => service.title),
          }),
        )}
      />
      <main id="main-content">
        <PageMotion>
        <section className={styles.directory} aria-labelledby="technology-directory">
          <header className={styles.intro}>
            <div><p className="eyebrow">LedgerByte Tech</p><h1 id="technology-directory">Technology services</h1></div>
            <Link className="button button-amber" href={technologyEnquiryHref()}>Get a Quote<ArrowUpRight weight="bold" aria-hidden="true" /></Link>
          </header>
          <div className={styles.grid}>
            {technologyServices.map((service) => (
              <Link
                className={styles.service}
                aria-labelledby={`card-${service.slug}`}
                href={`/technology/services/${service.slug}`}
                key={service.slug}
              >
                <Image src={getTechnologyServiceVisual(service.slug)} width={212} height={142} sizes="(max-width: 700px) 76px, 116px" alt="" />
                <div>
                  <h2 id={`card-${service.slug}`}>{service.title}</h2>
                  <p>{service.features.slice(0, 3).join(" · ")}</p>
                </div>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <ConsultationCta
          href={technologyEnquiryHref()}
          title="Ready to Transform Your Business?"
          description="Let's discuss your project and explore how LedgerByte Tech can deliver the solutions you need."
          buttonLabel="Start Your Project Today"
        />
        </PageMotion>
      </main>
    </>
  );
}
