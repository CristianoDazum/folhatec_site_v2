import type { Metadata } from "next";
import { ContactChannels } from "@/components/sections/ContactChannels";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuoteForm } from "@/features/quote/QuoteForm";
import { getSegmentBySlug, getSiteSettings, getSolutionBySlug } from "@/lib/content";
import { hasAnyContactChannel } from "@/lib/contact";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/types/navigation";

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Início", path: "/" },
  { name: "Solicitar cotação", path: "/solicitar-cotacao" },
];

export const metadata: Metadata = buildMetadata({
  title: "Solicitar cotação",
  description:
    "Solicite uma cotação de etiquetas, ribbons, equipamentos ou soluções especiais de identificação. A FolhaTec avalia sua aplicação e retorna.",
  path: "/solicitar-cotacao",
});

const STEPS = [
  { title: "Envie sua solicitação", description: "Conte qual é a aplicação e como é a sua operação." },
  { title: "Análise técnica", description: "A equipe avalia ambiente, material, volume e prazo." },
  { title: "Retorno com a proposta", description: "Você recebe a indicação da solução adequada." },
];

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ? raw.trim().toLowerCase() : null;
}

export default async function QuotePage({ searchParams }: Props) {
  const params = await searchParams;
  const solutionSlug = first(params.solucao);
  const segmentSlug = first(params.segmento);

  // Apenas slugs existentes viram contexto; valores desconhecidos são ignorados.
  const [solution, segment, settings] = await Promise.all([
    solutionSlug ? getSolutionBySlug(solutionSlug) : Promise.resolve(null),
    segmentSlug ? getSegmentBySlug(segmentSlug) : Promise.resolve(null),
    getSiteSettings(),
  ]);

  return (
    <section className="bg-background">
      <div className="container-site py-10 sm:py-14 lg:py-16">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-8 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="min-w-0">
            <p className="eyebrow">Cotação</p>
            <h1 className="heading-page mt-4">Solicitar cotação</h1>
            <p className="text-lead mt-6">
              Conte sobre a sua aplicação. Quanto mais contexto sobre produto, ambiente e volume, mais precisa
              será a indicação da FolhaTec.
            </p>

            <ol className="mt-10 grid gap-4">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex min-w-0 gap-4 border-t border-line pt-4">
                  <span className="pt-0.5 text-xs font-semibold tracking-[0.16em] text-accent-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold">{step.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            {hasAnyContactChannel(settings.contact) ? (
              <div className="mt-10">
                <ContactChannels
                  settings={settings}
                  location="quote_page"
                  whatsappMessage={solution?.whatsappMessage ?? segment?.whatsappMessage}
                />
              </div>
            ) : null}
          </div>

          <div className="min-w-0">
            <QuoteForm
              location="quote_page"
              solution={solution ? { slug: solution.slug, title: solution.title } : null}
              segment={segment ? { slug: segment.slug, title: segment.title } : null}
            />
          </div>
        </div>
      </div>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    </section>
  );
}
