import type { Metadata } from "next";
import Link from "next/link";
import { AuthoritySection } from "@/components/sections/AuthoritySection";
import { CtaSection } from "@/components/sections/CtaSection";
import { QuoteCta } from "@/components/sections/QuoteCta";
import { SpecialistCta } from "@/components/sections/SpecialistCta";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LabeledGrid } from "@/components/ui/LabeledGrid";
import { Media } from "@/components/ui/Media";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SegmentCard } from "@/components/ui/SegmentCard";
import { SolutionCard } from "@/components/ui/SolutionCard";
import { getAuthority, getHomeContent, getSegments, getSiteSettings, getSolutions } from "@/lib/content";
import { SITE_NAME, buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: `${SITE_NAME} | Soluções em etiquetas e identificação industrial`,
    description: settings.description,
    path: "/",
    absoluteTitle: true,
  });
}

const HIGHLIGHT_ICONS: IconName[] = ["factory", "shield", "clock"];

export default async function HomePage() {
  const [content, settings, solutions, segments, authority] = await Promise.all([
    getHomeContent(),
    getSiteSettings(),
    getSolutions(),
    getSegments(),
    getAuthority(),
  ]);
  const { hero } = content;

  return (
    <>
      {/* 1. Hero */}
      <section className="border-b border-line bg-background">
        <div className="container-site grid items-center gap-10 py-12 sm:py-16 lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-16">
          <div className="reveal min-w-0">
            {hero.eyebrow ? <p className="eyebrow">{hero.eyebrow}</p> : null}
            <h1 className="heading-display mt-5">
              {hero.title}
              {hero.highlight ? (
                <>
                  {" "}
                  <span className="text-accent">{hero.highlight}</span>
                </>
              ) : null}
            </h1>
            <p className="text-lead mt-6 max-w-xl">{hero.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <QuoteCta location="home_hero">{hero.primaryCtaLabel}</QuoteCta>
              <SpecialistCta whatsapp={settings.contact.whatsapp} location="home_hero">
                {hero.secondaryCtaLabel}
              </SpecialistCta>
            </div>
            {hero.highlights.length ? (
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 text-sm text-muted">
                {hero.highlights.map((item, index) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <span className="text-accent-strong">
                      <Icon name={HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length] ?? "check"} size={17} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="reveal reveal-delay min-w-0">
            <Media
              image={hero.image}
              visual="labels"
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="aspect-[16/11] rounded-[var(--radius-panel)] border border-line lg:aspect-[5/4]"
            />
          </div>
        </div>
      </section>

      {/* 2. Posicionamento */}
      <section aria-labelledby="posicionamento" className="section-y bg-surface">
        <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            id="posicionamento"
            eyebrow={content.positioning.eyebrow}
            title={content.positioning.title}
          />
          <div className="min-w-0">
            {content.positioning.description ? (
              <p className="text-lead">{content.positioning.description}</p>
            ) : null}
            <div className="mt-8">
              <LabeledGrid items={content.positioning.items} columns={2} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Soluções */}
      {solutions.length ? (
        <section id="solucoes" aria-labelledby="solucoes-titulo" className="section-y">
          <div className="container-site">
            <SectionHeading
              id="solucoes-titulo"
              eyebrow={content.solutionsIntro.eyebrow}
              title={content.solutionsIntro.title}
              description={content.solutionsIntro.description}
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {solutions.map((solution) => (
                <SolutionCard key={solution.slug} solution={solution} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 4. Aplicações industriais */}
      <section aria-labelledby="aplicacoes" className="section-y bg-surface">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Media
            image={content.applications.image}
            visual="industry"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[4/3] rounded-[var(--radius-panel)] border border-line"
          />
          <div className="min-w-0">
            <SectionHeading
              id="aplicacoes"
              eyebrow={content.applications.eyebrow}
              title={content.applications.title}
              description={content.applications.description}
            />
            <ul className="mt-8 grid gap-x-6 sm:grid-cols-2">
              {content.applications.items.map((item) => (
                <li key={item.label} className="border-b border-line py-3 text-sm font-semibold">
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Segmentos */}
      {segments.length ? (
        <section aria-labelledby="segmentos-titulo" className="section-y">
          <div className="container-site">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                id="segmentos-titulo"
                eyebrow={content.segmentsIntro.eyebrow}
                title={content.segmentsIntro.title}
                description={content.segmentsIntro.description}
              />
              <Link
                href="/segmentos"
                className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent-strong hover:text-ink"
              >
                Ver todos os segmentos
                <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {segments.map((segment) => (
                <SegmentCard key={segment.slug} segment={segment} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 6. Diferenciais / forma de atendimento */}
      <section aria-labelledby="diferenciais" className="section-y relative isolate overflow-clip bg-ink text-white">
        <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10 opacity-50" />
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            id="diferenciais"
            eyebrow={content.differentiators.eyebrow}
            title={content.differentiators.title}
            description={content.differentiators.description}
            surface="dark"
          />
          <LabeledGrid items={content.differentiators.items} numbered columns={2} surface="dark" />
        </div>
      </section>

      <AuthoritySection content={authority} />

      {/* Bloco final */}
      <CtaSection content={content.finalCta} whatsapp={settings.contact.whatsapp} location="home_final" />
    </>
  );
}
