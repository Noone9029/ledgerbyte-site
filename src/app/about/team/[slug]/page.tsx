import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/motion/page-motion";
import { ConsultationCta } from "@/components/sections/consultation-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredData } from "@/components/structured-data";
import { financeServices, team } from "@/content";
import {
  buildBreadcrumbSchema,
  buildPersonId,
  buildPersonPath,
  buildPersonSchema,
  buildSchemaGraph,
  buildWebPageSchema,
} from "@/lib/schema";
import { createMetadata } from "@/lib/seo";

interface TeamProfilePageProps {
  params: Promise<{ slug: string }>;
}

function getTeamMember(slug: string) {
  return team.find(
    (member) => buildPersonPath(member.name).split("/").at(-1) === slug,
  );
}

export function generateStaticParams() {
  return team.map((member) => ({
    slug: buildPersonPath(member.name).split("/").at(-1),
  }));
}

export async function generateMetadata({
  params,
}: TeamProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) return {};

  return createMetadata({
    path: buildPersonPath(member.name),
    title: `${member.name}, ${member.role}`,
    description: member.description,
    image: "/art/corporate-editorial-v3.webp",
  });
}

export default async function TeamProfilePage({
  params,
}: TeamProfilePageProps) {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) notFound();

  const profilePath = buildPersonPath(member.name);
  const personId = buildPersonId(member.name);
  const reviewedServices = financeServices.filter(
    (service) => service.reviewer.name === member.name,
  );

  return (
    <>
      <StructuredData
        data={buildSchemaGraph(
          {
            ...buildWebPageSchema({
              path: profilePath,
              name: `${member.name}, ${member.role}`,
              description: member.description,
              type: "ProfilePage",
              dateModified: "2026-07-28",
            }),
            mainEntity: { "@id": personId },
          },
          buildBreadcrumbSchema([
            { name: "About", path: "/about" },
            { name: member.name, path: profilePath },
          ]),
          buildPersonSchema({
            name: member.name,
            jobTitle: member.role,
            description: member.description,
            credentials: member.credentials,
            image: member.image,
            path: profilePath,
          }),
        )}
      />
      <main id="main-content">
        <PageMotion>
          <nav className="breadcrumbs page-section" aria-label="Breadcrumb">
            <Link href="/about">About</Link>
            <span>/</span>
            <span aria-current="page">{member.name}</span>
          </nav>

          <section className="expert-profile page-section">
            <div className="expert-profile-image hero-reveal">
              <Image
                src={member.image}
                alt={member.name}
                fill
                priority
                sizes="(max-width: 700px) 88vw, 42vw"
              />
            </div>
            <div className="expert-profile-copy">
              <p className="eyebrow hero-reveal">{member.credentials}</p>
              <h1 className="hero-reveal">{member.name}</h1>
              <span className="hero-reveal">{member.role}</span>
              <p className="hero-reveal">{member.description}</p>
            </div>
          </section>

          {reviewedServices.length ? (
            <section className="related-section page-section">
              <SectionHeading
                eyebrow="Expert Reviewed"
                title={member.name}
              />
              <div className="related-grid">
                {reviewedServices.map((service) => (
                  <Link
                    href={`/finance/services/${service.slug}`}
                    key={service.slug}
                  >
                    <p className="eyebrow">{service.category}</p>
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>
                    <span>
                      View service
                      <ArrowUpRight weight="bold" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <ConsultationCta
            title="Ready to strengthen your finance function?"
            description="Get in touch with our team to discuss bookkeeping, reporting, compliance, payroll, cash flow planning, or CFO-level support for your business."
          />
        </PageMotion>
      </main>
    </>
  );
}
