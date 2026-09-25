import type { Metadata } from "next";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { SolutionCard } from "@/components/ui/SolutionCard";
import { getSiteSettings, getSolutions } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/types/navigation";

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Início", path: "/" },
  { name: "Soluções", path: "/solucoes" },
];

export const metadata: Metadata = buildMetadata({
  title: "Soluções em etiquetas e identificação",
  description:
    "Etiquetas, ribbons, equipamentos e soluções especiais de identificação para operações industriais, indicados a partir da aplicação.",
  path: "/solucoes",
});

export default async function SolutionsPage() {
  const [solutions, settings] = await Promise.all([getSolutions(), getSiteSettings()]);

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Soluções"
        title="Identificação adequada para cada aplicação."
        description="Um portfólio organizado a partir das necessidades da operação: escolha a categoria ou conte sua aplicação para receber uma indicação técnica."
      />

      <section aria-labelledby="categorias" className="section-y">
        <div className="container-site">
          <h2 id="categorias" className="sr-only">
            Categorias de solução
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {solutions.map((solution) => (
              <SolutionCard key={solution.slug} solution={solution} showQuoteCta />
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        content={{
          eyebrow: "Não encontrou sua aplicação?",
          title: "Cada operação tem suas particularidades.",
          description:
            "Descreva o produto, o ambiente e o volume da sua operação. A equipe da FolhaTec avalia o cenário e indica a solução adequada.",
        }}
        whatsapp={settings.contact.whatsapp}
        location="solutions_index"
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    </>
  );
}
