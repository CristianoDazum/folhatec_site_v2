import type { CompanyContent, HomeContent } from "@/types/content";

/**
 * Textos estruturais da Home e da Empresa.
 *
 * Baseados exclusivamente no briefing (headline, complemento, pilares e
 * abordagem de posicionamento). Não contêm datas, números, clientes,
 * certificações ou capacidades — esses dados dependem de validação.
 */
export const fallbackHomeContent: HomeContent = {
  hero: {
    eyebrow: "Identificação industrial · B2B",
    title: "Soluções em etiquetas e identificação para sua",
    highlight: "operação não parar.",
    description:
      "Projetos personalizados, conhecimento técnico e compromisso com prazo para atender diferentes necessidades da indústria.",
    highlights: ["Aplicação industrial", "Especificação técnica", "Compromisso com prazo"],
    image: null,
  },
  positioning: {
    eyebrow: "Mais do que um produto",
    title: "Uma etiqueta pode parecer um detalhe. Na operação, ela não é.",
    description:
      "Dentro de uma operação industrial, a identificação é essencial para rastreabilidade, logística e liberação do produto. Por isso, cada aplicação é tratada a partir das suas particularidades — e não como a venda de uma bobina de etiquetas.",
    items: [
      { label: "Identificação", description: null },
      { label: "Rastreabilidade", description: null },
      { label: "Produção", description: null },
      { label: "Logística", description: null },
      { label: "Expedição", description: null },
      { label: "Liberação do produto", description: null },
    ],
  },
  solutionsIntro: {
    eyebrow: "Soluções",
    title: "A necessidade vem antes da solução.",
    description:
      "Um portfólio organizado para facilitar a escolha e abrir espaço para uma conversa técnica quando a aplicação exigir mais contexto.",
    items: [],
  },
  applications: {
    eyebrow: "Aplicação",
    title: "Cada ambiente traz uma pergunta diferente.",
    description:
      "Umidade, refrigeração, temperatura, transporte e exposição a produtos químicos mudam a especificação. O projeto parte das condições reais de uso.",
    items: [
      { label: "Umidade", description: null },
      { label: "Refrigeração", description: null },
      { label: "Temperatura", description: null },
      { label: "Transporte", description: null },
      { label: "Ambientes agressivos", description: null },
      { label: "Aplicação interna ou externa", description: null },
    ],
    image: null,
  },
  segmentsIntro: {
    eyebrow: "Segmentos",
    title: "Navegue pela aplicação, não apenas pelo produto.",
    description:
      "Uma estrutura pensada para falar a linguagem de diferentes operações industriais.",
    items: [],
  },
  differentiators: {
    eyebrow: "Como trabalhamos",
    title: "Conhecimento aplicado à operação.",
    description: null,
    items: [
      {
        label: "Conhecimento técnico",
        description: "Entender aplicações, materiais e particularidades de cada projeto.",
      },
      {
        label: "Compromisso",
        description: "Cumprir aquilo que foi acordado, principalmente qualidade e prazo.",
      },
      {
        label: "Qualidade",
        description: "Entregar consistentemente aquilo que foi especificado.",
      },
      {
        label: "Agilidade",
        description: "Responder às demandas inesperadas do ritmo industrial.",
      },
      {
        label: "Relacionamento",
        description: "Atendimento próximo e consultivo, com entendimento da operação do cliente.",
      },
      {
        label: "Inovação",
        description: "Manter a abordagem tecnicamente atualizada para cada aplicação.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Próximo passo",
    title: "Tem uma necessidade específica de identificação?",
    description:
      "Conte como é a sua aplicação. A equipe da FolhaTec avalia o cenário e retorna com a solução adequada.",
  },
};

export const fallbackCompanyContent: CompanyContent = {
  hero: {
    eyebrow: "Empresa",
    title: "Parceira técnica para a identificação da sua operação.",
    description:
      "A FolhaTec atua com soluções de identificação para operações industriais, unindo conhecimento técnico, atendimento próximo e compromisso com qualidade e prazo.",
    image: null,
  },
  // História oficial pendente de envio pela FolhaTec — seção oculta.
  history: null,
  pillars: {
    eyebrow: "Pilares",
    title: "O que orienta cada atendimento.",
    description: null,
    items: [
      { label: "Compromisso", description: "Cumprir aquilo que foi acordado, principalmente qualidade e prazo." },
      { label: "Conhecimento técnico", description: "Entender aplicações, materiais e particularidades de cada projeto." },
      { label: "Qualidade", description: "Entregar consistentemente aquilo que foi especificado." },
      { label: "Agilidade", description: "Responder às demandas inesperadas das operações industriais." },
      { label: "Relacionamento", description: "Atendimento próximo, consultivo e voltado ao longo prazo." },
      { label: "Inovação", description: "Abordagem tecnicamente atualizada, aplicada a cada projeto." },
    ],
  },
  service: {
    eyebrow: "Forma de atendimento",
    title: "A conversa começa pela aplicação.",
    description:
      "Antes de indicar um produto, a FolhaTec procura entender onde a identificação será usada, quais condições ela vai enfrentar e qual é o impacto dela no processo.",
    items: [
      { label: "Entender a operação", description: "Aplicação, ambiente, volume e ritmo do processo." },
      { label: "Especificar com critério", description: "Material, impressão e formato adequados ao uso real." },
      { label: "Acompanhar o fornecimento", description: "Proximidade para ajustar o que for necessário." },
    ],
  },
  commitment: {
    eyebrow: "Qualidade e prazo",
    title: "Compromisso com o que foi combinado.",
    description:
      "Em uma operação industrial, a falta de uma etiqueta pode impedir a expedição de um produto. Por isso, qualidade e prazo são tratados como parte da solução — e não como detalhe do pedido.",
    items: [],
  },
  relationship: {
    eyebrow: "Relacionamento",
    title: "Parcerias construídas pedido após pedido.",
    description:
      "Atendimento próximo e consultivo para entender a operação de cada cliente e acompanhar a evolução das suas demandas ao longo do tempo.",
    items: [],
  },
  // Estrutura/operação depende de fotos e dados validados — seção oculta.
  structure: null,
  finalCta: {
    eyebrow: "Vamos conversar",
    title: "Conte qual é a aplicação da sua operação.",
    description:
      "Envie sua solicitação e a equipe da FolhaTec retorna para entender o cenário e indicar a solução adequada.",
  },
};
