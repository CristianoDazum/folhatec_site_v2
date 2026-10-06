import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  // NEXT_DIST_DIR é usado apenas pelo teste E2E de build de produção
  // (tests/e2e/production.spec.ts), para não sobrescrever o .next padrão.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /*
   * Redirects 301 das URLs do site atual (folhatec.com.br, levantadas em
   * 06/10/2026). /contato mantém o mesmo caminho. Completar após o
   * inventário do Search Console (docs/go-live-checklist.md).
   */
  async redirects() {
    return [
      { source: "/sobre", destination: "/empresa", permanent: true },
      { source: "/produtos-e-servicos", destination: "/solucoes", permanent: true },
    ];
  },
};

export default nextConfig;
