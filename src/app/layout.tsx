import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { GtmNoScript, TrackingScripts } from "@/components/tracking/TrackingScripts";
import { AttributionCapture } from "@/features/quote/AttributionCapture";
import { IS_INDEXABLE, SITE_URL } from "@/lib/config/env";
import { getSiteSettings } from "@/lib/content";
import { SITE_NAME } from "@/lib/seo/metadata";
import { organizationJsonLd } from "@/lib/seo/json-ld";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const heading = Archivo({ subsets: ["latin"], variable: "--font-heading", display: "swap" });

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
    <html lang="pt-BR" className={`${body.variable} ${heading.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <GtmNoScript />
        <a
          href="#conteudo"
          className="sr-only z-[60] rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
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
        <TrackingScripts />
        <JsonLd data={organizationJsonLd(settings)} />
      </body>
    </html>
  );
}
