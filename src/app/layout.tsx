import type { Metadata, Viewport } from "next";
import { Source_Sans_3 } from "next/font/google";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { GtmNoScript, TrackingScripts } from "@/components/tracking/TrackingScripts";
import { AttributionCapture } from "@/features/quote/AttributionCapture";
import { IS_INDEXABLE, SITE_URL } from "@/lib/config/env";
import { getSiteSettings } from "@/lib/content";
import { SITE_NAME } from "@/lib/seo/metadata";
import { organizationJsonLd } from "@/lib/seo/json-ld";
import "./globals.css";

/*
 * O roteiro de design pede Myriad Pro (fonte comercial da Adobe). Até haver
 * licença web, usamos Source Sans 3 — também da Adobe, livre e com desenho
 * muito próximo. Para trocar: next/font/local com os .woff2 licenciados.
 */
const body = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/** Revalidação ISR do conteúdo do CMS (segundos). */
export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Soluções de identificação para a indústria`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Soluções em etiquetas e identificação para operações industriais, com conhecimento técnico, atendimento consultivo e compromisso com prazo.",
  applicationName: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  // Fora de produção nada é indexável. Em produção, cada página define o
  // próprio robots via buildMetadata (o padrão "index, follow" é implícito).
  ...(IS_INDEXABLE ? {} : { robots: { index: false, follow: false } }),
};

export const viewport: Viewport = {
  themeColor: "#10202b",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="pt-BR" className={body.variable}>
      <body className="flex min-h-dvh flex-col">
        <GtmNoScript />
        <a
          href="#conteudo"
          className="sr-only z-[60] rounded-none bg-primary px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <FloatingWhatsApp settings={settings} />
        <AttributionCapture />
        <ScrollReveal />
        <TrackingScripts />
        <JsonLd data={organizationJsonLd(settings)} />
      </body>
    </html>
  );
}
