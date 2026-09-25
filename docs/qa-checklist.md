# QA

## Automático

```bash
npm run check        # lint + typecheck + build
npm run test:e2e     # Playwright (build + servidor na porta 3100)
npm run check:full   # tudo
git diff --check
```

Cobertura E2E (`tests/e2e`):

| Arquivo               | Cobre                                                         |
| --------------------- | ------------------------------------------------------------- |
| `routes.spec.ts`      | 16 rotas (200, 1 H1, sem TODO/Lorem/undefined/null, sem console.error/pageerror), 404 reais, estado vazio, links internos, links de canal vazios |
| `navigation.spec.ts`  | Header, dropdown (mouse, clique, teclado, Escape, foco, blur), aria-current, skip link, menu mobile (aria, foco, Escape, trap, scroll lock, fechar ao navegar) |
| `quote.spec.ts`       | CTA Home, solução→cotação, segmento→cotação, solução+segmento, contexto inválido, validação, stub, sucesso mockado, double submit, erro, atribuição, API (validação, contexto, JSON, 415, 413, honeypot, 405) |
| `tracking.spec.ts`    | Sem scripts de terceiros sem IDs, view_solution, view_segment, click_solicitar_cotacao, form_start único, form_submit, canais condicionais |
| `responsive.spec.ts`  | Overflow em 390/768/1440 (todas as páginas + 404) e Home em 360/430/1024/1366/1920; menu e formulário a 360 |
| `seo.spec.ts`         | title, description, canonical, OG, H1, hierarquia, unicidade, noindex, Organization/Breadcrumb JSON-LD, sem Product, robots, sitemap |
| `content.spec.ts`     | Home e Empresa com fallback, história/estrutura ocultas, sem anos/números inventados, autoridade desativada, nenhum texto técnico interno visível |
| `config-content.spec.ts` | Unitários: validação da URL de produção, normalização de Home, Empresa e Authority |
| `production.spec.ts`  | Build real de produção: falha com URL local; com URL pública, canonical/OG/JSON-LD/robots/sitemap sem localhost, página indexável, API 503 sem webhook |
| `a11y.spec.ts`        | axe WCAG 2.1 A/AA em todas as páginas (desktop e mobile), formulário com erros, menu mobile aberto |

Observação: `workers: 2` no Playwright. Em Windows, 4+ Chromium iniciando ao
mesmo tempo travavam no carregamento de assets locais (o servidor respondia
normalmente); a cobertura é a mesma.

## Manual (visual)

Larguras: **360, 390, 430, 768, 1024, 1366, 1440, 1920**.

Páginas: Home, Empresa, Soluções, uma solução, Segmentos, um segmento,
Conteúdos, Contato, Solicitar cotação (com e sem contexto), Política, 404.

- [ ] Sem rolagem horizontal
- [ ] Hierarquia de títulos legível; headline do hero sem quebras estranhas
- [ ] CTA "Solicitar cotação" visível na primeira dobra (mobile e desktop)
- [ ] Cards alinhados, sem textos cortados
- [ ] Menu mobile: abre, rola, fecha; foco visível
- [ ] Dropdown desktop por mouse e teclado
- [ ] Formulário: erros legíveis, teclado numérico no telefone, consentimento
- [ ] Estados de foco visíveis em todos os links/botões
- [ ] `prefers-reduced-motion` desativa animações
- [ ] Zoom 200% sem perda de conteúdo
- [ ] Leitor de tela: landmarks (banner, navegação principal/mobile, main, contentinfo)

## Antes de cada entrega de conteúdo real

- [ ] Nenhum dado do folder de 2011 publicado sem validação
- [ ] Imagens com `alt` descritivo e dimensões corretas
- [ ] Links de WhatsApp/telefone/e-mail testados em celular real
