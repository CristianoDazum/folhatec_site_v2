# Modelo de conteúdo

Tipos do frontend: `src/types/content.ts`. Schemas do CMS: `sanity/schemaTypes`.
Normalização: `src/lib/sanity/normalize.ts`.

## Regras de normalização

| Sanity                               | Frontend                              |
| ------------------------------------ | ------------------------------------- |
| `slug.current`                       | `slug: string`                        |
| `relatedSegments[]->` (referências)  | `relatedSegmentSlugs: string[]` (sem órfãos/duplicados) |
| `relatedSolutions[]->`               | `relatedSolutionSlugs: string[]`      |
| `faq[]->`                            | `FaqItem[]` (itens incompletos descartados) |
| `image{asset->}`                     | `ContentImage { url, alt, width, height, blurDataUrl }` ou `null` |
| string vazia                         | `null`                                |
| `whatsapp`                           | apenas dígitos (10–15) ou `null`      |
| `socialLinks[].url`                  | somente http(s)                       |
| `body` (Portable Text)               | blocos `block` + imagens achatadas; demais tipos descartados |
| documento sem slug/título/descrição  | descartado                            |

## SiteSettings (singleton `siteSettings`)

Fonte única para Header, Footer, Contato, formulário, JSON-LD e WhatsApp.

| Campo               | Tipo                 | Fallback atual |
| ------------------- | -------------------- | -------------- |
| `name`              | string               | "FolhaTec"     |
| `legalName`         | string \| null       | null           |
| `cnpj`              | string \| null       | null           |
| `tagline`           | string \| null       | texto do briefing |
| `description`       | string               | texto do briefing |
| `logo`              | ContentImage \| null | null (wordmark tipográfico) |
| `contact.phone`     | string \| null       | null           |
| `contact.whatsapp`  | dígitos \| null      | null           |
| `contact.email`     | string \| null       | null           |
| `contact.address`   | PostalAddress \| null| null           |
| `contact.businessHours` | string \| null   | null           |
| `socialLinks`       | SocialLink[]         | []             |
| `showFloatingWhatsApp` | boolean           | false          |

## Solution (`solution`) → `/solucoes/[slug]`

`slug`, `title`, `eyebrow`, `shortDescription`, `description`, `image`,
`visual`, `applications[]`, `technicalOptions[]`, `relatedSegmentSlugs[]`,
`differentiators[]`, `faq[]`, `whatsappMessage`, `order`, `updatedAt`, `seo`.

Seções vazias não são renderizadas. `technicalOptions` no fallback lista
**fatores avaliados na especificação** (em forma de pergunta), não
capacidades. Especificações reais entram somente após validação.

## Segment (`segment`) → `/segmentos/[slug]`

`slug`, `title`, `shortDescription`, `description` (contexto), `image`,
`visual`, `challenges[]`, `applications[]`, `relatedSolutionSlugs[]`,
`differentiators[]`, `faq[]`, `whatsappMessage`, `order`, `updatedAt`, `seo`.

## Article (`article`) → `/conteudos/[slug]`

`slug`, `title`, `excerpt`, `category` (lista fixa do briefing), `publishedAt`
(só publica quando `<= now()`), `updatedAt`, `image`, `body` (Portable Text),
`author` (opcional), `faq[]`, `seo`.

## FAQ (`faq`)

Documento reutilizável `{ question, answer }` referenciado por soluções,
segmentos e artigos. Com itens, a página exibe o accordion e o JSON-LD FAQPage.

## SeoFields (`seo`)

`title`, `description`, `ogImage`, `noIndex`. Quando vazios, a página usa
título/descrição próprios. `noIndex` também remove o item do sitemap.

## Provas de autoridade (desativadas)

`AuthorityContent` com blocos `{ enabled, title, items }` para
`clientLogos`, `testimonials`, `cases`, `statistics`, `certifications`.
Todos `enabled: false` no fallback. Schemas prontos em
`sanity/schemaTypes/authority.ts`, não registrados. Para ativar:
1. registrar os tipos em `sanity/schemaTypes/index.ts`;
2. criar query + normalização em `src/lib/sanity`;
3. implementar `getAuthority()` no `sanityProvider`.

## Textos de página

`HomeContent`, `CompanyContent`, `PrivacyPolicyContent` — hoje no fallback
(`src/data/fallback/pages.ts`, `privacy-policy.ts`). `CompanyContent.history`
e `structure` estão `null` (seções ocultas) até o envio da história oficial e
de fotos/dados de estrutura.

## Adicionar uma nova solução ou segmento

- **CMS**: criar o documento com slug — a rota passa a existir
  automaticamente (ISR), entra no menu, no footer e no sitemap.
- **Fallback**: adicionar um objeto ao array em `src/data/fallback/*.ts`.
- Opcional: incluir o slug em `tests/e2e/helpers.ts` para cobertura E2E.
