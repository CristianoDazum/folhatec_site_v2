import type { Metadata } from "next";
import { ContactChannels } from "@/components/sections/ContactChannels";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuoteForm } from "@/features/quote/QuoteForm";
import { getSiteSettings } from "@/lib/content";
import { hasAnyContactChannel } from "@/lib/contact";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/types/navigation";

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Início", path: "/" },
  { name: "Contato", path: "/contato" },
];

export const metadata: Metadata = buildMetadata({
  title: "Contato",
  description:
    "Fale com a FolhaTec sobre etiquetas, ribbons, equipamentos e soluções de identificação para a sua operação industrial.",
  path: "/contato",
});

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const hasChannels = hasAnyContactChannel(settings.contact);

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Contato"
        title="Fale com um especialista."
        description="Envie sua mensagem ou solicitação de cotação. A equipe da FolhaTec retorna para entender a sua aplicação."
      />

      <section aria-labelledby="formulario-contato" className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="min-w-0">
            <SectionHeading
              id="formulario-contato"
              eyebrow="Atendimento"
              title={hasChannels ? "Canais de atendimento" : "Envie sua mensagem"}
              description="Para agilizar o retorno, descreva o produto, o ambiente de aplicação, a quantidade estimada e o prazo desejado."
            />
            {hasChannels ? (
              <div className="mt-10">
                <ContactChannels settings={settings} location="contact_page" />
              </div>
            ) : null}
          </div>
          <div className="min-w-0">
            <QuoteForm location="contact_page" solution={null} segment={null} />
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    </>
  );
}
