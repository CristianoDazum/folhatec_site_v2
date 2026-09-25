# Infraestrutura

## Ambientes

| Ambiente    | `NEXT_PUBLIC_SITE_ENV` | Indexação | Webhook ausente        |
| ----------- | ---------------------- | --------- | ---------------------- |
| Local       | `development`          | noindex   | stub (nada enviado)    |
| Staging     | `staging`              | noindex   | stub                   |
| Preview Vercel | qualquer            | **sempre noindex** (`VERCEL_ENV=preview`) | conforme env |
| Produção    | `production`           | index     | **erro 503**           |

## Webhook de cotação

- `QUOTE_WEBHOOK_URL`: endpoint HTTPS que recebe o lead (CRM, automação,
  e-mail transacional, planilha etc.).
- `QUOTE_WEBHOOK_SECRET`: se definido, o corpo é assinado com HMAC SHA-256 no
  header `x-folhatec-signature: sha256=<hex>`. O receptor deve recalcular a
  assinatura sobre o corpo bruto e comparar em tempo constante.
- Timeout: 8 s (`WEBHOOK_TIMEOUT_MS`). Resposta 2xx = entregue.
- Logs nunca contêm dados pessoais nem credenciais.

Payload (`QuoteLead`):

```json
{
  "submitted_at": "2026-09-25T13:00:00.000Z",
  "site": { "url": "https://…", "env": "production" },
  "contact": { "name": "…", "company": "…", "phone": "…", "email": "…" },
  "message": "…",
  "context": { "solution": "etiquetas", "segment": "alimentos" },
  "consent": { "privacy_policy": true, "accepted_at": "…" },
  "attribution": {
    "first_touch": { "utm_source": "…", "landing_page": "…", "referrer": null, "client_captured_at": "…" },
    "last_touch": { "…": "…" },
    "origin_url": "…",
    "conversion_page": "…",
    "referrer": null
  }
}
```

## Rate limit — PENDÊNCIA DE PRODUÇÃO

`src/features/quote/server/rate-limit.ts` define a interface `RateLimiter`. Não
há implementação em memória: em serverless cada instância tem memória própria,
então um `Map()` não protege de fato.

Antes do go-live, implementar com um provider persistente (ex.: Upstash Redis
/ Vercel Marketplace) — sugestão: 5 envios / 10 min por hash de IP — e
retorná-lo em `getRateLimiter()`. Até lá, a proteção é honeypot + validação
server-side + limite de tamanho. A ausência do provider não impede
desenvolvimento nem testes.

## Sanity

- Frontend: `@sanity/client` com `perspective: "published"`, CDN quando não há
  token, `next.revalidate = 300` e tags `sanity`, `solution`, `segment`,
  `article`, `siteSettings` (prontas para revalidação on-demand via webhook
  do Sanity → `revalidateTag`, a implementar se necessário).
- Imagens servidas de `cdn.sanity.io` por `next/image` (AVIF/WebP).
- Studio: pacote separado em `sanity/`.

## Headers de segurança

Definidos em `next.config.ts`. **CSP pendente**: definir após escolher as
ferramentas de tracking (GTM exige nonce ou hashes para scripts inline).

## Deploy na Vercel

1. Node 24; build `npm run build`; framework Next.js.
2. Variáveis por ambiente (Production / Preview) conforme tabela acima.
3. Domínio final → `NEXT_PUBLIC_SITE_URL` (sem barra final).
4. Redirects 301 do site antigo em `next.config.ts` (`redirects()`), após o
   inventário de URLs (ver `go-live-checklist.md`).

## Git

O `.gitignore` exclui `node_modules`, `.next`, `out`, `.env*`, `.vercel`,
relatórios de teste e `*.tsbuildinfo`. Não usar Git LFS para build ou
dependências — esses arquivos nunca entram no repositório.
