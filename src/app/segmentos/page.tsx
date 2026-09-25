import type { Metadata } from "next";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { SegmentCard } from "@/components/ui/SegmentCard";
import { getSegments, getSiteSettings } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/types/navigation";

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Início", path: "/" },
  { name: "Segmentos", path: "/segmentos" },
];

export const metadata: Metadata = buildMetadata({
  title: "Segmentos atendidos",
  description:
    "Soluções de identificação para alimentos e pescados, logística e transporte, setor químico e demais operações industriais.",
  path: "/segmentos",
});

export default async function SegmentsPage() {
  const [segments, settings] = await Promise.all([getSegments(), getSiteSettings()]);

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Segmentos"
        title="Identificação pensada para cada operação."
        description="Cada segmento tem desafios próprios de ambiente, volume, prazo e rastreabilidade. Encontre o seu e veja como a identificação se conecta ao processo."
      />

      <section aria-labelledby="lista-segmentos" className="section-y">
        <div className="container-site">
          <h2 id="lista-segmentos" className="sr-only">
            Segmentos atendidos
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {segments.map((segment) => (
              <SegmentCard key={segment.slug} segment={segment} />
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        content={{
          eyebrow: "Sua operação",
          title: "Não encontrou o seu segmento?",
          description:
            "A FolhaTec atende diferentes operações industriais. Conte qual é a sua aplicação e receba uma indicação técnica.",
        }}
        whatsapp={settings.contact.whatsapp}
        location="segments_index"
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    </>
  );
}
