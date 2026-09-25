import type { Metadata } from "next";
import Image from "next/image";
import { AuthoritySection } from "@/components/sections/AuthoritySection";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteCta } from "@/components/sections/QuoteCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { LabeledGrid } from "@/components/ui/LabeledGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAuthority, getCompanyContent, getSiteSettings } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/types/navigation";

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Início", path: "/" },
  { name: "Empresa", path: "/empresa" },
];

export const metadata: Metadata = buildMetadata({
  title: "Empresa",
  description:
    "Conheça a FolhaTec: conhecimento técnico, atendimento próximo e compromisso com qualidade e prazo em soluções de identificação para a indústria.",
  path: "/empresa",
});

export default async function CompanyPage() {
  const [content, settings, authority] = await Promise.all([
    getCompanyContent(),
    getSiteSettings(),
    getAuthority(),
  ]);

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        description={content.hero.description}
        visual="industry"
        image={content.hero.image}
        actions={<QuoteCta location="company_hero" />}
      />

      {content.history ? (
        <section aria-labelledby="historia" className="section-y bg-surface">
          <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading id="historia" eyebrow="História" title={content.history.title} />
            <div className="grid min-w-0 gap-5">
              {content.history.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lead">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="atendimento" className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            id="atendimento"
            eyebrow={content.service.eyebrow}
            title={content.service.title}
            description={content.service.description}
          />
          <LabeledGrid items={content.service.items} numbered columns={2} />
        </div>
      </section>

      <section aria-labelledby="pilares" className="section-y relative isolate overflow-clip bg-ink text-white">
        <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10 opacity-50" />
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            id="pilares"
            eyebrow={content.pillars.eyebrow}
            title={content.pillars.title}
            description={content.pillars.description}
            surface="dark"
          />
          <LabeledGrid items={content.pillars.items} numbered columns={2} surface="dark" />
        </div>
      </section>

      <section aria-labelledby="compromisso" className="section-y bg-surface">
        <div className="container-site grid gap-12 md:grid-cols-2 lg:gap-16">
          <div className="min-w-0 rounded-[var(--radius-panel)] border border-line bg-background p-8 sm:p-10">
            <SectionHeading
              id="compromisso"
              eyebrow={content.commitment.eyebrow}
              title={content.commitment.title}
              description={content.commitment.description}
            />
          </div>
          {content.relationship ? (
            <div className="min-w-0 rounded-[var(--radius-panel)] border border-line bg-background p-8 sm:p-10">
              <SectionHeading
                eyebrow={content.relationship.eyebrow}
                title={content.relationship.title}
                description={content.relationship.description}
              />
            </div>
          ) : null}
        </div>
      </section>

      {content.structure ? (
        <section aria-labelledby="estrutura" className="section-y">
          <div className="container-site">
            <SectionHeading
              id="estrutura"
              eyebrow={content.structure.eyebrow}
              title={content.structure.title}
              description={content.structure.description}
            />
            {content.structure.images.length ? (
              <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {content.structure.images.map((image) => (
                  <li key={image.url} className="relative aspect-[4/3] overflow-clip rounded-[var(--radius-card)] bg-surface-muted">
                    <Image src={image.url} alt={image.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      <AuthoritySection content={authority} />

      <CtaSection content={content.finalCta} whatsapp={settings.contact.whatsapp} location="company_final" />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    </>
  );
}
