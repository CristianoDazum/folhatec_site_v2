# FolhaTec — Site institucional B2B (V2)

Base técnica do novo site da FolhaTec: **especialista técnico em soluções de
identificação para operações industriais**.

Esta versão foi reconstruída do zero (sem reaproveitar código, configuração ou
dependências da V1). Ela está visualmente pronta e preparada para receber o
conteúdo definitivo do cliente — textos, contatos, fotos, portfólio, artigos —
**sem depender dele para compilar, testar e funcionar**.

> Nenhum dado institucional, técnico ou comercial foi inventado. Campos sem
> validação ficam `null` e o elemento correspondente não é renderizado.
> Pendências: [`docs/client-content-checklist.md`](docs/client-content-checklist.md).

## Requisitos

- Node.js **≥ 22.12** (recomendado 24 — ver `.nvmrc`)
- npm 10+

## Instalação e uso

```bash
npm install
npm run dev          # http://localhost:3000
```

Nenhuma variável de ambiente é obrigatória. Sem configuração, o site roda com:
conteúdo do fallback local, `noindex`, sem GTM/GA4 e cotação em modo _stub_.

## Scripts

| Script                | O que faz                                              |
| --------------------- | ------------------------------------------------------ |
| `npm run dev`         | Servidor de desenvolvimento                            |
| `npm run build`       | Build de produção                                      |
| `npm run start`       | Serve o build                                          |
| `npm run lint`        | ESLint (flat config, `eslint-config-next`)             |
| `npm run typecheck`   | `next typegen` + `tsc --noEmit` (TypeScript strict)    |
| `npm run check`       | lint + typecheck + build                               |
| `npm run test:e2e`    | Playwright (faz build e sobe o servidor na porta 3100) |
| `npm run test:e2e:ui` | Playwright em modo interativo                          |
| `npm run check:full`  | `check` + E2E                                          |

Primeira execução dos testes: `npx playwright install chromium`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 6 strict · Tailwind CSS 4 ·
ESLint 9 (flat) · Playwright + axe-core · `@sanity/client` · `@portabletext/react`.

Dependências de runtime: apenas `next`, `react`, `react-dom`, `@sanity/client`
e `@portabletext/react`. Menu, dropdown, accordion, formulário, tracking e
animações são implementados com React/CSS nativos.

## Estrutura

```
src/
  app/                 rotas (App Router), sitemap, robots, API /api/quote
  components/
    layout/            header, navegação, footer, logo, WhatsApp flutuante
    sections/          hero, CTA, FAQ, autoridade, canais de contato
    ui/                botões, cards, ícones, visuais industriais, rich text
    tracking/          GTM/GA4, TrackView, TrackedLink
    seo/               JsonLd
  features/quote/      formulário, validação, atribuição, entrega (server)
  lib/
    content/           DATA LAYER (única fonte de conteúdo para as páginas)
    sanity/            adapter Sanity: client, queries, normalização
    config/            variáveis de ambiente
    analytics/         trackEvent() → window.dataLayer
    seo/               buildMetadata, JSON-LD
  data/fallback/       conteúdo local tipado (sem dados inventados)
  types/               tipos de conteúdo do frontend
sanity/                Sanity Studio (pacote independente)
tests/e2e/             Playwright
docs/                  documentação técnica e checklists
```

Detalhes: [`docs/architecture.md`](docs/architecture.md).

## Conteúdo: fallback e Sanity

```
Página → data layer (src/lib/content) → provider → Sanity (se configurado)
                                                 → fallback local tipado
```

- Sem `NEXT_PUBLIC_SANITY_PROJECT_ID`/`DATASET`: usa `src/data/fallback`.
- Com Sanity: busca via GROQ, normaliza para os tipos de `src/types/content.ts`
  e revalida a cada 5 minutos (ISR).
- Trocar conteúdo = editar o fallback ou o CMS. Páginas não mudam.

Modelo de conteúdo: [`docs/content-model.md`](docs/content-model.md).
Studio: [`sanity/README.md`](sanity/README.md).

## Variáveis de ambiente

Copie `.env.example` para `.env.local`. Resumo:

| Variável                              | Uso                                                   |
| ------------------------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                | URL absoluta (canonical, sitemap, OG, JSON-LD)        |
| `NEXT_PUBLIC_SITE_ENV`                | `development` / `staging` / `production`              |
| `NEXT_PUBLIC_GTM_ID`                  | GTM (tem prioridade sobre GA4)                        |
| `NEXT_PUBLIC_GA4_ID`                  | GA4 direto, somente sem GTM                           |
| `NEXT_PUBLIC_SANITY_*`                | Projeto, dataset e versão da API                      |
| `SANITY_API_TOKEN`                    | Opcional, somente leitura (dataset privado)           |
| `QUOTE_WEBHOOK_URL`                   | Destino dos leads (server-side)                       |
| `QUOTE_WEBHOOK_SECRET`                | Assinatura HMAC SHA-256 do corpo                      |

Somente `NEXT_PUBLIC_SITE_ENV=production` permite indexação — e nunca em
Preview da Vercel (`VERCEL_ENV=preview`).

## Cotação e webhook

`POST /api/quote` valida tudo no servidor (tipo e tamanho do corpo, campos,
e-mail, telefone, consentimento, solução/segmento existentes, honeypot) e
entrega o lead ao webhook com timeout de 8 s.

| Situação                          | Resposta                         | `form_success`? |
| --------------------------------- | -------------------------------- | --------------- |
| Webhook confirmou                 | 200 `delivered`                  | sim             |
| Sem webhook (dev/staging)         | 202 `stub` — nada é enviado      | **não**         |
| Sem webhook em produção           | 503 `delivery_not_configured`    | não             |
| Webhook falhou / timeout          | 502 `delivery_failed`            | não             |
| Honeypot preenchido               | 200 (idêntico), sem entrega      | —               |

Contrato do payload: [`docs/infrastructure.md`](docs/infrastructure.md).

## Tracking

`trackEvent()` (`src/lib/analytics/events.ts`) envia para `window.dataLayer`.
Eventos: `form_start`, `form_submit`, `form_success`, `form_error`,
`click_whatsapp`, `click_phone`, `click_email`, `click_solicitar_cotacao`,
`view_solution`, `view_segment`, `download_material`.
Detalhes e atribuição first/last-touch: [`docs/tracking.md`](docs/tracking.md).

## Testes

176 testes E2E (Chromium) cobrindo rotas, 404, header/dropdown/menu mobile,
fluxos de cotação, API, tracking, overflow em 8 larguras, SEO, JSON-LD,
robots, sitemap e acessibilidade (axe WCAG 2.1 AA). Os testes não usam
credenciais nem enviam dados para serviços externos.
Checklist manual: [`docs/qa-checklist.md`](docs/qa-checklist.md).

## Deploy (Vercel)

1. Importar o repositório na Vercel (framework: Next.js, Node 24).
2. **Production**: `NEXT_PUBLIC_SITE_ENV=production`, `NEXT_PUBLIC_SITE_URL`
   com o domínio final, webhook, Sanity e GTM.
3. **Preview/Staging**: `NEXT_PUBLIC_SITE_ENV=staging` (sempre `noindex`).
4. Configurar rate limit persistente antes do go-live
   ([`docs/infrastructure.md`](docs/infrastructure.md)).
5. Seguir [`docs/go-live-checklist.md`](docs/go-live-checklist.md).
