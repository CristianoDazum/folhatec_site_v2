# Arquitetura

## Princípios

1. **Simplicidade** — poucas camadas, sem abstrações especulativas.
2. **Server Components por padrão** — `"use client"` só em interação:
   `HeaderNav`, `QuoteForm`, `AttributionCapture`, `TrackView`, `TrackedLink`.
3. **Conteúdo desacoplado** — páginas só conhecem o data layer.
4. **Nada inventado** — ausência de dado = `null` = elemento oculto.

## Fluxo de conteúdo

```
app/**/page.tsx
   │  getSolutions(), getSegmentBySlug(), getSiteSettings()…
   ▼
src/lib/content/index.ts          (data layer, React cache())
   │  provider = Sanity configurado ? sanityProvider : fallbackProvider
   ├──► src/lib/sanity/provider.ts   GROQ → normalize.ts → tipos do frontend
   └──► src/lib/content/fallback-provider.ts → src/data/fallback/*
```

- Contrato: `ContentProvider` (`src/lib/content/provider.ts`).
- Tipos crus do Sanity ficam em `src/lib/sanity/types.ts` e nunca saem de lá.
- Falha no CMS: em produção o erro é propagado (ISR mantém a última versão
  válida); em development/staging registra o erro e usa o fallback.
- Home (`getHomeContent`), Empresa (`getCompanyContent`) e Provas de
  autoridade (`getAuthority`) seguem o mesmo fluxo: singletons `homePage`,
  `companyPage` e `authoritySettings` no Sanity, com fallback local.
  Documento ausente no CMS → fallback. Layout, grid e estilos nunca vêm do CMS.
- Política de Privacidade (`getPrivacyPolicy`) fica no código, versionada
  junto com a revisão jurídica.
- Sanity não configurado → fallback em qualquer ambiente. Sanity configurado
  e com falha: em production o erro é propagado (não mascara configuração
  quebrada); em development/staging registra e usa o fallback.

## Rotas

| Rota                          | Renderização                     |
| ----------------------------- | -------------------------------- |
| `/`, `/empresa`, `/solucoes`, `/segmentos`, `/conteudos`, `/contato`, `/politica-de-privacidade` | Estática + ISR (5 min) |
| `/solucoes/[slug]`, `/segmentos/[slug]`, `/conteudos/[slug]` | SSG via `generateStaticParams` + on-demand para novos slugs; slug inexistente → `notFound()` (404 real) |
| `/solicitar-cotacao`          | Dinâmica (lê `?solucao=&segmento=`) |
| `/api/quote`                  | Route Handler (POST)             |
| `/sitemap.xml`, `/robots.txt` | Gerados a partir do data layer / ambiente |

## Design system (V2 — identidade azul + amarelo)

Baseado no roteiro de design da agência (06/10/2026).

- Tokens em `src/app/globals.css` (`:root`) expostos ao Tailwind via
  `@theme inline` (Tailwind 4 — não há `tailwind.config.js`):
  `primary` #232C73 (azul), `accent` #CCCF32 (amarelo), `background` #F5F5F5,
  `detail` #5D5DA7, `ink` #0F0F0F, além de `surface`, `muted`, `line`,
  `success`, `error`.
- Acessibilidade: o amarelo é usado como **fundo** (botões, item ativo do
  menu, blocos, marcadores) com texto grafite; sobre fundo claro ele não tem
  contraste para texto (~1,5:1). Texto de destaque em fundo claro usa
  `accent-strong` (azul); sobre o azul, o amarelo é usado em texto
  (`accent-on-dark`, ~7,5:1).
- Geometria: cantos retos em tudo (botões, menu, cards, campos). A "quina
  assinatura" (raio `brand` = 3rem num único canto) usa `rounded-bl-brand`
  no bloco amarelo e nas mídias de destaque, e `rounded-tr-brand` nos cards
  de destaques/métricas.
- Tipografia: Source Sans 3 (`next/font`), equivalente livre da Myriad Pro
  pedida no roteiro; trocar por `next/font/local` quando houver licença web.
- Botões: `buttonClassName(variant, surface)` com `primary | secondary | ghost`
  e superfícies `light | dark`. `cn()` apenas junta classes completas.
- Logo oficial em `public/brand/` (SiteSettings); no rodapé azul, sobre placa
  branca.
- Imagens: `Media` usa `next/image` (AVIF/WebP) quando há foto e a
  composição `IndustrialVisual` (SVG) quando não há.

## Responsividade

Mobile-first. Grids e flex com `min-w-0`; decorativos absolutos dentro de
wrappers `overflow-clip` locais. Não há `overflow-x: hidden` global. O teste de
overflow compara `scrollWidth` × `innerWidth` (≤ 1px) e lista os elementos
causadores quando falha.

## URL pública

`src/lib/config/env.ts` → `resolveSiteUrl()`. Em production a URL precisa ser
https e não local; caso contrário o módulo lança erro e o build/inicialização
falha. Em development/staging, URL ausente usa `http://localhost:3000`
(sempre com noindex).

## Segurança

- Headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`; `poweredByHeader: false`.
- API: validação server-side, limite de 16 KB, honeypot, timeout do webhook,
  HMAC opcional, logs sem dados pessoais.
- IDs de GTM/GA4 validados por regex antes de entrar em snippets inline.
- JSON-LD serializado com escape de `<`.
- CSP não configurada nesta etapa (ver `infrastructure.md`).
