# Tracking e atribuição

## Carregamento de scripts

| GTM | GA4 | Resultado                                  |
| --- | --- | ------------------------------------------ |
| ✔   | —   | Carrega GTM                                |
| —   | ✔   | Carrega gtag.js direto                     |
| ✔   | ✔   | Carrega **somente** GTM (GA4 via GTM)      |
| —   | —   | Nenhum script de terceiros                 |

IDs validados por formato (`GTM-XXXX`, `G-XXXX`) em `src/lib/config/env.ts`.
Implementação: `src/components/tracking/TrackingScripts.tsx`.

> LGPD: não há cookie banner nesta etapa porque nenhum tracker está ativo.
> Antes de ativar GTM/GA4/Ads/Meta Pixel, definir o mecanismo de consentimento
> (ex.: Consent Mode v2 no GTM) e atualizar a Política de Privacidade.

## API

```ts
import { trackEvent } from "@/lib/analytics/events";
trackEvent("click_whatsapp", { cta_location: "footer" });
```

Sempre empurra `{ event, ...params }` para `window.dataLayer`. Em modo GA4
direto também chama `gtag('event', …)`. Parâmetros vazios são removidos.
Componentes nunca chamam gtag/GTM diretamente — usam `trackEvent`,
`TrackedLink` ou `TrackView`.

## Eventos

| Evento                    | Quando                                                     | Parâmetros                                  |
| ------------------------- | ---------------------------------------------------------- | ------------------------------------------- |
| `form_start`              | Primeira digitação em qualquer campo (uma vez por montagem)| `form`, `form_location`, `solution`, `segment` |
| `form_submit`             | Passou na validação client-side e o envio começou          | idem                                        |
| `form_success`            | **Somente** quando a API retorna `status: "delivered"`     | idem                                        |
| `form_error`              | Erro de validação no servidor, falha de entrega ou rede    | idem + `reason`                             |
| `click_solicitar_cotacao` | Clique em qualquer CTA de cotação                          | `cta_location`, `solution`, `segment`       |
| `click_whatsapp`          | Clique em link wa.me                                       | `cta_location`                              |
| `click_phone`             | Clique em `tel:`                                           | `cta_location`                              |
| `click_email`             | Clique em `mailto:`                                        | `cta_location`                              |
| `view_solution`           | Visualização de `/solucoes/[slug]`                         | `solution`                                  |
| `view_segment`            | Visualização de `/segmentos/[slug]`                        | `segment`                                   |
| `download_material`       | Reservado para materiais técnicos (sem uso nesta etapa)    | `material`                                  |

O carregamento de página **não** é contabilizado como lead. O stub de
desenvolvimento **não** gera `form_success`.

Sugestão de conversão principal no GA4/Ads: `form_success`.

## Atribuição (first/last-touch)

`src/features/quote/attribution-client.ts`, executado a cada navegação:

| Dado              | Armazenamento  | Regra                                                          |
| ----------------- | -------------- | -------------------------------------------------------------- |
| `first_touch`     | localStorage   | Gravado na primeira visita; **nunca sobrescrito**              |
| `last_touch`      | localStorage   | Atualizado quando há UTM/gclid/fbclid ou referrer externo      |
| `origin_url`      | sessionStorage | Primeira URL da sessão                                          |
| `conversion_page` | —              | URL no momento do envio                                         |
| `referrer`        | —              | Referrer externo da página atual                                |

Cada touch: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`,
`utm_term`, `gclid`, `fbclid`, `referrer`, `landing_page`,
`client_captured_at` (informativo).

O servidor sanitiza tudo (`sanitizeAttribution`) e define o **timestamp
oficial** (`submitted_at`). O horário do navegador nunca é usado como oficial.

## Testes

`tests/e2e/tracking.spec.ts` intercepta o dataLayer. WhatsApp/telefone/e-mail
são testados apenas quando configurados. `form_success` é testado com resposta
`delivered` mockada; o teste de stub garante que ele não dispara.
