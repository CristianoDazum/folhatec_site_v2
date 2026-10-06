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
      {/* 1. Hero — centralizado, com a curva da identidade na base */}
      <section className="relative isolate overflow-clip bg-background">
        <div className="container-site flex flex-col items-center pb-14 pt-14 text-center sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
          <div className="reveal min-w-0 max-w-4xl">
            {hero.eyebrow ? <p className="eyebrow">{hero.eyebrow}</p> : null}
            <h1 className="heading-display mt-5">
              {hero.title}
              {hero.highlight ? (
                <>
                  {" "}
                  <span className="text-accent-strong">{hero.highlight}</span>
                </>
              ) : null}
            </h1>
            <p className="text-lead mx-auto mt-6 max-w-2xl">{hero.description}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <QuoteCta location="home_hero">{hero.primaryCtaLabel}</QuoteCta>
              <SpecialistCta whatsapp={settings.contact.whatsapp} location="home_hero">
                {hero.secondaryCtaLabel}
              </SpecialistCta>
            </div>
          </div>
        </div>
        {/* Curva azul com filete amarelo (decorativa, contida na seção). */}
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="block h-16 w-full sm:h-24 lg:h-36"
        >
          <path d="M0 150 C 520 140 1000 100 1440 -6 L1440 200 L0 200 Z" fill="var(--accent)" />
          <path d="M0 176 C 520 166 1000 126 1440 22 L1440 200 L0 200 Z" fill="var(--primary)" />
        </svg>
      </section>

      {/* 2. Posicionamento — faixa azul com o bloco amarelo de destaque */}
      <section aria-labelledby="posicionamento" className="-mt-px bg-primary pb-16 pt-6 text-white sm:pb-20 lg:pb-24 lg:pt-4">
        <div className="container-site grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="min-w-0">
            <SectionHeading
              id="posicionamento"
              eyebrow={content.positioning.eyebrow}
              title={content.positioning.title}
              description={content.positioning.description}
              surface="dark"
            />
            <div className="mt-8">
              <LabeledGrid items={content.positioning.items} columns={2} surface="dark" />
            </div>
          </div>
          {/* Bloco amarelo: quina assinatura no canto inferior esquerdo. */}
          <div className="reveal reveal-delay min-w-0 pb-4 pl-4 sm:pb-6 sm:pl-6">
            <div className="relative">
              <div aria-hidden="true" className="absolute -bottom-4 -left-4 h-full w-full rounded-bl-brand bg-accent sm:-bottom-6 sm:-left-6" />
              <Media
                image={hero.image}
                visual="labels"
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="relative aspect-[4/3] rounded-bl-brand lg:aspect-[5/4]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destaques — cards com quina assinatura no canto superior direito */}
      {hero.highlights.length ? (
        <div className="container-site pt-16 sm:pt-20">
          <ul aria-label="Destaques" className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {hero.highlights.map((item, index) => (
              <li
                key={item}
                className="flex min-h-40 min-w-0 flex-col justify-between gap-6 rounded-tr-brand bg-gradient-to-b from-surface-muted to-background p-7 sm:min-h-48 sm:p-8"
              >
                <span className="text-primary">
                  <Icon name={HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length] ?? "check"} size={40} />
                </span>
                <p className="text-xl font-semibold leading-snug text-ink sm:text-2xl">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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

      {/* 4. Aplicações industriais — título, texto e faixa de foto larga */}
      <section aria-labelledby="aplicacoes" className="section-y">
        <div className="container-site">
          <SectionHeading
            id="aplicacoes"
            eyebrow={content.applications.eyebrow}
            title={content.applications.title}
            description={content.applications.description}
          />
          <Media
            image={content.applications.image}
            visual="industry"
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="mt-10 aspect-[16/9] rounded-bl-brand sm:aspect-[21/9]"
          />
          <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {content.applications.items.map((item) => (
              <li key={item.label} className="flex items-center gap-3 border-b border-line py-4 text-base font-semibold">
                <span aria-hidden="true" className="h-3 w-3 shrink-0 bg-accent" />
                {item.label}
              </li>
            ))}
          </ul>
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
      <section aria-labelledby="diferenciais" className="section-y relative isolate overflow-clip bg-primary text-white">
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
