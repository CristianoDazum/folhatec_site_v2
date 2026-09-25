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
import { SegmentCard } from "@/components/ui/SegmentCard";
import { getSegments, getSiteSettings, getSolutionBySlug, getSolutions, pickBySlugs } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { NOT_FOUND_METADATA, buildMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/types/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const solutions = await getSolutions();
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = await getSolutionBySlug(slug);
  if (!solution) return NOT_FOUND_METADATA;
  return buildMetadata({
    title: solution.title,
    description: solution.shortDescription,
    path: `/solucoes/${solution.slug}`,
    seo: solution.seo,
    image: solution.image,
  });
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const [solution, segments, settings] = await Promise.all([
    getSolutionBySlug(slug),
    getSegments(),
    getSiteSettings(),
  ]);
  if (!solution) notFound();

  const relatedSegments = pickBySlugs(segments, solution.relatedSegmentSlugs);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Início", path: "/" },
    { name: "Soluções", path: "/solucoes" },
    { name: solution.title, path: `/solucoes/${solution.slug}` },
  ];
  const whatsapp = settings.contact.whatsapp;

  return (
    <>
      <TrackView event="view_solution" params={{ solution: solution.slug }} />

      {/* 1. Hero */}
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={solution.eyebrow}
        title={solution.title}
        description={solution.shortDescription}
        visual={solution.visual}
        image={solution.image}
        actions={
          <>
            <QuoteCta location="solution_hero" solution={solution.slug} />
            <SpecialistCta whatsapp={whatsapp} message={solution.whatsappMessage} location="solution_hero" />
          </>
        }
      />

      {/* 2. Descrição */}
      <section aria-labelledby="visao-geral" className="section-y bg-surface">
        <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading id="visao-geral" eyebrow="Visão geral" title="A especificação começa pela aplicação." />
          <p className="text-lead min-w-0">{solution.description}</p>
        </div>
      </section>

      {/* 3. Aplicações */}
      {solution.applications.length ? (
        <section aria-labelledby="aplicacoes" className="section-y">
          <div className="container-site">
            <SectionHeading id="aplicacoes" eyebrow="Aplicações" title="Para que serve e onde é utilizada." />
            <div className="mt-10">
              <LabeledGrid items={solution.applications} />
            </div>
          </div>
        </section>
      ) : null}

      {/* 4. Possibilidades técnicas */}
      {solution.technicalOptions.length ? (
        <section aria-labelledby="especificacao" className="section-y bg-surface">
          <div className="container-site">
            <SectionHeading
              id="especificacao"
              eyebrow="Possibilidades técnicas"
              title="O que é avaliado na especificação."
              description="Cada variável influencia a escolha da solução. Com essas informações, a indicação é feita a partir das condições reais de uso."
            />
            <div className="mt-10">
              <LabeledGrid items={solution.technicalOptions} numbered />
            </div>
          </div>
        </section>
      ) : null}

      {/* 5. Segmentos relacionados */}
      {relatedSegments.length ? (
        <section aria-labelledby="segmentos-relacionados" className="section-y">
          <div className="container-site">
            <SectionHeading
              id="segmentos-relacionados"
              eyebrow="Segmentos"
              title="Aplicações por segmento."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {relatedSegments.map((segment) => (
                <SegmentCard key={segment.slug} segment={segment} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 6. Diferencial de atendimento */}
      {solution.differentiators.length ? (
        <section aria-labelledby="diferencial" className="section-y relative isolate overflow-clip bg-ink text-white">
          <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10 opacity-50" />
          <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              id="diferencial"
              eyebrow="Diferencial FolhaTec"
              title="Conhecimento técnico para indicar a solução adequada."
              surface="dark"
            />
            <LabeledGrid items={solution.differentiators} numbered columns={2} surface="dark" />
          </div>
        </section>
      ) : null}

      {/* 7. FAQ */}
      <FaqSection items={solution.faq} />

      {/* 8. CTA */}
      <CtaSection
        content={{
          eyebrow: solution.title,
          title: "Precisa encontrar a solução adequada para a sua aplicação?",
          description:
            "Envie as informações da sua operação e fale com um especialista da FolhaTec.",
        }}
        whatsapp={whatsapp}
        whatsappMessage={solution.whatsappMessage}
        location="solution_final"
        solution={solution.slug}
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    </>
  );
}
