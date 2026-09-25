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
- Textos estruturais de Home, Empresa e Política vêm hoje do fallback via
  `getHomeContent()`, `getCompanyContent()`, `getPrivacyPolicy()`. Migrar para
  singletons no CMS altera só o data layer.

## Rotas

| Rota                          | Renderização                     |
| ----------------------------- | -------------------------------- |
| `/`, `/empresa`, `/solucoes`, `/segmentos`, `/conteudos`, `/contato`, `/politica-de-privacidade` | Estática + ISR (5 min) |
| `/solucoes/[slug]`, `/segmentos/[slug]`, `/conteudos/[slug]` | SSG via `generateStaticParams` + on-demand para novos slugs; slug inexistente → `notFound()` (404 real) |
| `/solicitar-cotacao`          | Dinâmica (lê `?solucao=&segmento=`) |
| `/api/quote`                  | Route Handler (POST)             |
| `/sitemap.xml`, `/robots.txt` | Gerados a partir do data layer / ambiente |

## Design system

- Tokens em `src/app/globals.css` (`:root`) expostos ao Tailwind via
  `@theme inline`: `background`, `surface`, `ink`, `muted`, `accent`,
  `accent-foreground`, `line`, `success`, `error` (+ variações).
- Utilitários de componente: `container-site`, `section-y`, `eyebrow`,
  `heading-display`, `heading-page`, `heading-section`, `text-lead`, `bg-grid`.
- Botões: `buttonClassName(variant, surface)` com `primary | secondary | ghost`
  e superfícies `light | dark`.
- `cn()` apenas junta classes completas (nunca fragmentos), evitando classes
  inválidas como `p-3transition-all`.
- Visuais industriais neutros (`IndustrialVisual`) em SVG decorativo, sem
  texto, até a chegada das fotos; `Media` troca automaticamente para
  `next/image` quando há imagem.

## Responsividade

Mobile-first. Grids e flex com `min-w-0`; decorativos absolutos dentro de
wrappers `overflow-clip` locais. Não há `overflow-x: hidden` global. O teste de
overflow compara `scrollWidth` × `innerWidth` (≤ 1px) e lista os elementos
causadores quando falha.

## Segurança

- Headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`; `poweredByHeader: false`.
- API: validação server-side, limite de 16 KB, honeypot, timeout do webhook,
  HMAC opcional, logs sem dados pessoais.
- IDs de GTM/GA4 validados por regex antes de entrar em snippets inline.
- JSON-LD serializado com escape de `<`.
- CSP não configurada nesta etapa (ver `infrastructure.md`).
