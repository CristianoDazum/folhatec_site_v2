# Go-live

Critérios de aceite do briefing (seção 28) + pendências técnicas desta base.

## Conteúdo e negócio

- [ ] Dados institucionais confirmados e cadastrados (`client-content-checklist.md`)
- [ ] Portfólio atual validado; nenhuma informação técnica antiga não validada
- [ ] Fotos reais aplicadas (hero, soluções, segmentos, empresa)
- [ ] Política de Privacidade com **aprovação jurídica** (`src/data/fallback/privacy-policy.ts` ou CMS) e `updatedAt` preenchido
- [ ] Todos os textos revisados e aprovados pela FolhaTec
- [ ] Nenhum conteúdo provisório

## Integrações

- [ ] `QUOTE_WEBHOOK_URL` e `QUOTE_WEBHOOK_SECRET` em Production
- [ ] Envio real testado ponta a ponta (lead chega com atribuição)
- [ ] WhatsApp testado em celular (mensagem contextual correta)
- [ ] Sanity: projeto, dataset, CORS, usuários administrativos com permissões mínimas
- [ ] Singletons publicados no Studio: Configurações do site, Página inicial, Página Empresa
- [ ] Provas de autoridade: habilitar blocos em `authoritySettings` somente com autorização/validação
- [ ] GTM publicado; GA4 configurado dentro do GTM; conversão `form_success`
- [ ] Mecanismo de consentimento definido antes de ativar trackers (LGPD)
- [ ] Política atualizada com as ferramentas efetivamente ativas

## Técnico

- [ ] `NEXT_PUBLIC_SITE_ENV=production` somente no ambiente Production
- [ ] `NEXT_PUBLIC_SITE_URL` = domínio final (HTTPS, sem barra final) — obrigatório; o build falha sem ele
- [ ] Preview/staging continuam `noindex` (verificar `robots.txt`)
- [ ] Rate limit persistente implementado (`infrastructure.md`)
- [ ] CSP definida conforme trackers
- [ ] `npm run check:full` verde no CI
- [ ] Lighthouse/Core Web Vitals aceitáveis com as fotos reais

## Migração e SEO

- [ ] Inventário de URLs do site atual e páginas indexadas
- [ ] Redirects 301 implementados (`next.config.ts` → `redirects()`)
- [ ] Backup completo do site atual
- [ ] Search Console: propriedade verificada, sitemap novo enviado
- [ ] Monitorar 404 e cobertura nas semanas seguintes ao lançamento
