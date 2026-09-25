import Script from "next/script";
import { GA4_ID, GTM_ID } from "@/lib/config/env";

/**
 * Regra de carregamento:
 * - GTM configurado → carrega somente o GTM (GA4 deve ser configurado nele);
 * - apenas GA4 → carrega gtag.js diretamente;
 * - nenhum ID → nenhum script de terceiros.
 * IDs são validados por formato em `src/lib/config/env.ts`.
 */
export function TrackingScripts() {
  if (GTM_ID) {
    return (
      <Script id="gtm-init" strategy="afterInteractive">
        {`window.__folhatecAnalyticsMode='gtm';window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});(function(d){var s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';d.head.appendChild(s);})(document);`}
      </Script>
    );
  }

  if (GA4_ID) {
    return (
      <>
        <Script
          id="ga4-src"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.__folhatecAnalyticsMode='ga4';window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4_ID}');`}
        </Script>
      </>
    );
  }

  return null;
}

/** Fallback <noscript> do GTM — renderizado no início do <body>. */
export function GtmNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
