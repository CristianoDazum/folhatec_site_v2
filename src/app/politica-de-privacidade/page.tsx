import type { Metadata } from "next";
import { ContactChannels } from "@/components/sections/ContactChannels";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPrivacyPolicy, getSiteSettings } from "@/lib/content";
import { hasAnyContactChannel } from "@/lib/contact";
import { formatDate } from "@/lib/format";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/types/navigation";

/*
 * O texto exibido aqui vem de src/data/fallback/privacy-policy.ts e é uma
 * versão estrutural para homologação: REQUER APROVAÇÃO JURÍDICA antes do
 * go-live (docs/go-live-checklist.md).
 */

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Início", path: "/" },
  { name: "Política de Privacidade", path: "/politica-de-privacidade" },
];

export const metadata: Metadata = buildMetadata({
  title: "Política de Privacidade",
  description: "Saiba como a FolhaTec trata os dados pessoais enviados por meio deste site, conforme a LGPD.",
  path: "/politica-de-privacidade",
});

export default async function PrivacyPolicyPage() {
  const [policy, settings] = await Promise.all([getPrivacyPolicy(), getSiteSettings()]);
  const controller = [settings.legalName ?? settings.name, settings.cnpj ? `CNPJ ${settings.cnpj}` : null]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <PageHero breadcrumbs={breadcrumbs} eyebrow="LGPD" title={policy.title} description={policy.intro} />

      <section className="section-y">
        <div className="container-site">
          <div className="prose-content mx-auto max-w-3xl">
            <h2>Controlador dos dados</h2>
            <p>
              O controlador dos dados pessoais tratados por meio deste site é {controller}.
            </p>
            {policy.sections.map((section) => (
              <div key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
            {hasAnyContactChannel(settings.contact) ? (
              <>
                <h2>Contato</h2>
                <p>Para exercer seus direitos ou esclarecer dúvidas sobre esta política, utilize os canais abaixo.</p>
              </>
            ) : null}
          </div>
          {hasAnyContactChannel(settings.contact) ? (
            <div className="mx-auto mt-6 max-w-3xl">
              <ContactChannels settings={settings} location="privacy_policy" />
            </div>
          ) : null}
          {policy.updatedAt ? (
            <p className="mx-auto mt-10 max-w-3xl text-sm text-muted">
              Última atualização: {formatDate(policy.updatedAt)}
            </p>
          ) : null}
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    </>
  );
}
