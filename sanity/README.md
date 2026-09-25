# Sanity Studio — FolhaTec

Pacote **independente** do site. O site (`../`) não depende do pacote `sanity`:
ele lê o conteúdo com `@sanity/client` e funciona sem credenciais (fallback local).

## Uso

```bash
cd sanity
cp .env.example .env        # preencher SANITY_STUDIO_PROJECT_ID / DATASET
npm install
npm run dev                 # http://localhost:3333
npm run typecheck
npm run build               # gera sanity/dist (ignorado pelo Git)
npm run deploy              # publica o Studio hospedado (requer login)
```

## Tipos ativos

| Tipo           | Uso                                                        |
| -------------- | ---------------------------------------------------------- |
| `siteSettings` | Singleton institucional (nome, CNPJ, contatos, WhatsApp…)  |
| `solution`     | `/solucoes/[slug]`                                         |
| `segment`      | `/segmentos/[slug]`                                        |
| `article`      | `/conteudos/[slug]` (Portable Text)                        |
| `faq`          | Perguntas reutilizáveis referenciadas pelos demais tipos   |

Preparados e **desativados** (`schemaTypes/authority.ts`): `testimonial`,
`caseStudy`, `certification`, `clientLogo`, `statistic`.

Ver `../docs/content-model.md` para o mapeamento campo a campo.

## Observação sobre `npm audit`

O CLI do Sanity 6.16 traz dependências transitivas com alertas (ex.:
`smol-toml`, `uuid`) usadas apenas no tooling de desenvolvimento/deploy do
Studio — não fazem parte do site publicado. Não usar `npm audit fix --force`
(faria downgrade para Sanity 5). Atualizar quando o Sanity publicar correção.
