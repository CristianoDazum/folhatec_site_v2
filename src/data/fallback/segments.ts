import type { Segment } from "@/types/content";
import { emptySeo, serviceDifferentiators } from "./shared";

/**
 * Segmentos citados no briefing (seção 8). Desafios listados conforme o
 * briefing; nenhum cliente, número ou norma é citado.
 */
export const fallbackSegments: Segment[] = [
  {
    slug: "alimentos",
    title: "Alimentos e pescados",
    shortDescription:
      "Identificação para operações com umidade, refrigeração, grandes volumes e prazos curtos.",
    description:
      "Em alimentos, pescados e frigoríficos, a identificação acompanha processos com umidade, refrigeração e grandes volumes, muitas vezes com janelas curtas de expedição. A etiqueta representa um custo pequeno na operação, mas a sua falta pode impedir a liberação do produto.",
    image: null,
    visual: "food",
    challenges: [
      { label: "Umidade", description: "Etiquetas que precisam se manter aplicadas e legíveis em ambientes úmidos." },
      { label: "Refrigeração", description: "Aplicação e permanência em produtos resfriados ou congelados." },
      { label: "Rastreabilidade", description: "Informações de lote e origem acompanhando o produto." },
      { label: "Grandes volumes", description: "Fornecimento compatível com o ritmo da produção." },
      { label: "Prazos curtos", description: "Demandas inesperadas que não podem parar a expedição." },
    ],
    applications: [
      { label: "Identificação de produtos", description: null },
      { label: "Controle de lotes", description: null },
      { label: "Expedição", description: null },
    ],
    relatedSolutionSlugs: ["etiquetas", "ribbons", "equipamentos", "solucoes-especiais"],
    differentiators: serviceDifferentiators,
    faq: [],
    whatsappMessage:
      "Olá, vim pelo site da FolhaTec e gostaria de falar sobre identificação para alimentos e pescados.",
    order: 1,
    updatedAt: null,
    seo: {
      ...emptySeo,
      title: "Identificação para alimentos e pescados",
      description:
        "Etiquetas e soluções de identificação para operações de alimentos, pescados e frigoríficos, com umidade, refrigeração e prazos curtos.",
    },
  },
  {
    slug: "logistica",
    title: "Logística e transporte",
    shortDescription:
      "Identificação para expedição, rastreamento e leitura de códigos ao longo do transporte.",
    description:
      "Na logística e no transporte, a identificação acompanha o volume em diferentes etapas: separação, expedição, transporte e recebimento. A especificação precisa considerar a leitura dos códigos e as condições a que a etiqueta estará exposta no caminho.",
    image: null,
    visual: "logistics",
    challenges: [
      { label: "Identificação de volumes", description: "Informação clara em cada etapa do fluxo." },
      { label: "Rastreamento", description: "Acompanhamento do volume do envio ao recebimento." },
      { label: "Expedição", description: "Etiquetagem no ritmo da separação de pedidos." },
      { label: "Códigos de barras", description: "Impressão com leitura confiável." },
      { label: "Resistência no transporte", description: "Atrito, manuseio e variação de ambiente." },
    ],
    applications: [
      { label: "Etiquetagem de volumes", description: null },
      { label: "Expedição e recebimento", description: null },
      { label: "Leitura de códigos", description: null },
    ],
    relatedSolutionSlugs: ["etiquetas", "ribbons", "equipamentos"],
    differentiators: serviceDifferentiators,
    faq: [],
    whatsappMessage:
      "Olá, vim pelo site da FolhaTec e gostaria de falar sobre identificação para logística.",
    order: 2,
    updatedAt: null,
    seo: {
      ...emptySeo,
      title: "Identificação para logística e transporte",
      description:
        "Etiquetas e soluções de identificação para expedição, rastreamento e leitura de códigos em operações de logística e transporte.",
    },
  },
  {
    slug: "quimico",
    title: "Químico",
    shortDescription:
      "Identificação para ambientes agressivos e processos com requisitos técnicos específicos.",
    description:
      "Aplicações do setor químico podem envolver ambientes agressivos, contato com produtos e requisitos técnicos particulares. A especificação parte das condições reais do processo para indicar uma identificação que permaneça legível e aplicada.",
    image: null,
    visual: "chemical",
    challenges: [
      { label: "Resistência", description: "Identificação que suporta as condições do processo." },
      { label: "Ambientes agressivos", description: "Exposição a produtos e condições severas." },
      { label: "Requisitos técnicos", description: "Especificação alinhada às exigências da aplicação." },
      { label: "Identificação", description: "Informação legível durante todo o ciclo do produto." },
    ],
    applications: [
      { label: "Identificação de produtos", description: null },
      { label: "Controle de processo", description: null },
    ],
    relatedSolutionSlugs: ["etiquetas", "ribbons", "solucoes-especiais"],
    differentiators: serviceDifferentiators,
    faq: [],
    whatsappMessage:
      "Olá, vim pelo site da FolhaTec e gostaria de falar sobre identificação para o setor químico.",
    order: 3,
    updatedAt: null,
    seo: {
      ...emptySeo,
      title: "Identificação para a indústria química",
      description:
        "Soluções de identificação para ambientes agressivos e processos químicos com requisitos técnicos específicos.",
    },
  },
  {
    slug: "industria",
    title: "Indústria",
    shortDescription:
      "Identificação para borracha, plásticos e demais operações industriais.",
    description:
      "A indústria reúne cenários muito diferentes entre si. Por isso, a conversa começa pela aplicação, pelas condições de uso e pelo objetivo da identificação — seja em produção, estoque ou expedição.",
    image: null,
    visual: "industry",
    challenges: [
      { label: "Processos diferentes", description: "Cada linha tem suas próprias condições de uso." },
      { label: "Identificação", description: "Produtos, componentes e volumes identificados com clareza." },
      { label: "Rastreabilidade", description: "Informação que acompanha o produto no processo." },
      { label: "Aplicações específicas", description: "Demandas que exigem uma solução sob medida." },
    ],
    applications: [
      { label: "Produção", description: null },
      { label: "Estoque", description: null },
      { label: "Expedição", description: null },
    ],
    relatedSolutionSlugs: ["etiquetas", "ribbons", "equipamentos", "solucoes-especiais"],
    differentiators: serviceDifferentiators,
    faq: [],
    whatsappMessage:
      "Olá, vim pelo site da FolhaTec e gostaria de falar sobre identificação para a minha indústria.",
    order: 4,
    updatedAt: null,
    seo: {
      ...emptySeo,
      title: "Identificação para operações industriais",
      description:
        "Soluções de identificação para borracha, plásticos e demais operações industriais, a partir da aplicação e das condições de uso.",
    },
  },
];
