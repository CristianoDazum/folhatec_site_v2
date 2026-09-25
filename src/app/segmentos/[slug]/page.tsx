import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteCta } from "@/components/sections/QuoteCta";
import { SpecialistCta } from "@/components/sections/SpecialistCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/tracking/TrackView";
import { LabeledGrid } from "@/components/ui/LabeledGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SolutionCard } from "@/components/ui/SolutionCard";
import { getSegmentBySlug, getSegments, getSiteSettings, getSolutions, pickBySlugs } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { NOT_FOUND_METADATA, buildMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/types/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const segments = await getSegments();
  return segments.map((segment) => ({ slug: segment.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const segment = await getSegmentBySlug(slug);
  if (!segment) return NOT_FOUND_METADATA;
  return buildMetadata({
    title: segment.title,
    description: segment.shortDescription,
    path: `/segmentos/${segment.slug}`,
    seo: segment.seo,
    image: segment.image,
  });
}

export default async function SegmentPage({ params }: Props) {
  const { slug } = await params;
  const [segment, solutions, settings] = await Promise.all([
    getSegmentBySlug(slug),
    getSolutions(),
    getSiteSettings(),
  ]);
  if (!segment) notFound();

  const relatedSolutions = pickBySlugs(solutions, segment.relatedSolutionSlugs);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Início", path: "/" },
    { name: "Segmentos", path: "/segmentos" },
    { name: segment.title, path: `/segmentos/${segment.slug}` },
  ];
  const whatsapp = settings.contact.whatsapp;

  return (
    <>
      <TrackView event="view_segment" params={{ segment: segment.slug }} />

      {/* 1. Hero */}
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Segmento"
        title={segment.title}
        description={segment.shortDescription}
        visual={segment.visual}
        image={segment.image}
        actions={
          <>
            <QuoteCta location="segment_hero" segment={segment.slug} />
            <SpecialistCta whatsapp={whatsapp} message={segment.whatsappMessage} location="segment_hero" />
          </>
        }
      />

      {/* 2. Contexto da indústria */}
      <section aria-labelledby="contexto" className="section-y bg-surface">
        <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading id="contexto" eyebrow="Contexto" title="A identificação dentro da operação." />
          <p className="text-lead min-w-0">{segment.description}</p>
        </div>
      </section>

      {/* 3. Desafios de identificação */}
      {segment.challenges.length ? (
        <section aria-labelledby="desafios" className="section-y">
          <div className="container-site">
            <SectionHeading id="desafios" eyebrow="Desafios" title="O que a identificação precisa enfrentar." />
            <div className="mt-10">
              <LabeledGrid items={segment.challenges} numbered />
            </div>
            {segment.applications.length ? (
              <div className="mt-12">
                <h3 className="text-lg font-semibold">Aplicações frequentes</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {segment.applications.map((item) => (
                    <li key={item.label} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium">
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 4. Soluções relacionadas */}
      {relatedSolutions.length ? (
        <section aria-labelledby="solucoes-relacionadas" className="section-y bg-surface">
          <div className="container-site">
            <SectionHeading id="solucoes-relacionadas" eyebrow="Soluções" title="Soluções para este segmento." />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {relatedSolutions.map((solution) => (
                <SolutionCard key={solution.slug} solution={solution} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 5. Diferenciais */}
      {segment.differentiators.length ? (
        <section aria-labelledby="diferencial" className="section-y relative isolate overflow-clip bg-ink text-white">
          <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10 opacity-50" />
          <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              id="diferencial"
              eyebrow="Diferencial FolhaTec"
              title="Atendimento que entende o ritmo da sua operação."
              surface="dark"
            />
            <LabeledGrid items={segment.differentiators} numbered columns={2} surface="dark" />
          </div>
        </section>
      ) : null}

      {/* 6. FAQ opcional */}
      <FaqSection items={segment.faq} />

      {/* 7. CTA */}
      <CtaSection
        content={{
          eyebrow: segment.title,
          title: "Vamos avaliar a identificação da sua operação?",
          description: "Conte como é o seu processo e receba uma indicação técnica da FolhaTec.",
        }}
        whatsapp={whatsapp}
        whatsappMessage={segment.whatsappMessage}
        location="segment_final"
        segment={segment.slug}
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    </>
  );
}
