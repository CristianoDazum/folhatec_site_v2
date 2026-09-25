import type { Solution } from "@/types/content";
import { emptySeo, serviceDifferentiators } from "./shared";

/**
 * Categorias de solução citadas no briefing (menu e bloco 3 da Home).
 *
 * Os textos descrevem a abordagem consultiva aprovada no briefing, sem
 * especificações técnicas. Materiais, adesivos, resistências, marcas,
 * compatibilidades e prazos só entram após validação da FolhaTec.
 * `technicalOptions` lista fatores avaliados na especificação, formulados
 * como perguntas — não como capacidades declaradas.
 */
export const fallbackSolutions: Solution[] = [
  {
    slug: "etiquetas",
    title: "Etiquetas",
    eyebrow: "Identificação",
    shortDescription:
      "Etiquetas especificadas a partir da aplicação, do ambiente e do processo de cada operação.",
    description:
      "A etiqueta adequada depende de onde e como ela será utilizada. Antes de indicar um material, a FolhaTec procura entender a aplicação, as condições do ambiente e o papel da identificação dentro do processo — da produção à expedição.",
    image: null,
    visual: "labels",
    applications: [
      {
        label: "Identificação de produtos",
        description: "Informações de produto, lote e processo legíveis durante toda a operação.",
      },
      {
        label: "Rastreabilidade",
        description: "Apoio ao controle de lotes e ao acompanhamento do produto ao longo do processo.",
      },
      {
        label: "Logística e expedição",
        description: "Identificação de volumes para separação, transporte e liberação do produto.",
      },
    ],
    technicalOptions: [
      { label: "Material", description: "Qual superfície vai receber a etiqueta?" },
      { label: "Tipo de adesivo", description: "Como a etiqueta precisa se comportar na aplicação?" },
      { label: "Formato e dimensões", description: "Qual espaço e qual informação precisam caber?" },
      { label: "Impressão e acabamento", description: "Como a informação será impressa e lida?" },
      {
        label: "Temperatura e umidade",
        description: "O produto passa por refrigeração, congelamento ou ambientes úmidos?",
      },
      { label: "Exposição química", description: "Haverá contato com produtos agressivos?" },
      { label: "Aplicação interna ou externa", description: "Onde a identificação ficará exposta?" },
    ],
    relatedSegmentSlugs: ["alimentos", "logistica", "quimico", "industria"],
    differentiators: serviceDifferentiators,
    faq: [],
    whatsappMessage: "Olá, vim pelo site da FolhaTec e gostaria de falar sobre etiquetas.",
    order: 1,
    updatedAt: null,
    seo: {
      ...emptySeo,
      title: "Etiquetas para aplicações industriais",
      description:
        "Etiquetas especificadas a partir da aplicação, do ambiente e do processo da sua operação industrial. Solicite uma cotação à FolhaTec.",
    },
  },
  {
    slug: "ribbons",
    title: "Ribbons",
    eyebrow: "Impressão",
    shortDescription:
      "Ribbons para impressão de identificação, indicados conforme equipamento, material e aplicação.",
    description:
      "A qualidade e a durabilidade da impressão dependem da combinação entre ribbon, material da etiqueta e equipamento. A indicação parte dessas variáveis e das condições às quais a identificação estará exposta.",
    image: null,
    visual: "ribbons",
    applications: [
      {
        label: "Impressão de dados variáveis",
        description: "Códigos, lotes, datas e informações de produto impressos durante a operação.",
      },
      {
        label: "Identificação em produção e expedição",
        description: "Impressão no ritmo da linha e da separação de pedidos.",
      },
    ],
    technicalOptions: [
      { label: "Equipamento de impressão", description: "Qual impressora e configuração estão em uso?" },
      { label: "Material da etiqueta", description: "Qual material vai receber a impressão?" },
      {
        label: "Resistência da impressão",
        description: "A impressão vai enfrentar atrito, umidade, temperatura ou produtos químicos?",
      },
      { label: "Volume de impressão", description: "Qual é o ritmo de consumo da operação?" },
    ],
    relatedSegmentSlugs: ["alimentos", "logistica", "quimico", "industria"],
    differentiators: serviceDifferentiators,
    faq: [],
    whatsappMessage: "Olá, vim pelo site da FolhaTec e gostaria de falar sobre ribbons.",
    order: 2,
    updatedAt: null,
    seo: {
      ...emptySeo,
      title: "Ribbons para impressão de identificação",
      description:
        "Ribbons indicados conforme equipamento, material da etiqueta e aplicação. Fale com um especialista da FolhaTec.",
    },
  },
  {
    slug: "equipamentos",
    title: "Equipamentos",
    eyebrow: "Operação",
    shortDescription:
      "Equipamentos de impressão e identificação para apoiar a rotina da operação.",
    description:
      "A escolha de um equipamento envolve volume, ambiente, integração com o processo e compatibilidade com etiquetas e ribbons. A conversa começa pelo cenário de uso para indicar a alternativa adequada.",
    image: null,
    visual: "equipment",
    applications: [
      {
        label: "Impressão de etiquetas na operação",
        description: "Identificação gerada no ponto em que a informação é necessária.",
      },
      {
        label: "Rotina de produção e expedição",
        description: "Apoio a fluxos que dependem de identificação contínua.",
      },
    ],
    technicalOptions: [
      { label: "Volume de impressão", description: "Quantas etiquetas a operação imprime por turno?" },
      { label: "Ambiente de uso", description: "Escritório, linha de produção ou área refrigerada?" },
      {
        label: "Compatibilidade com suprimentos",
        description: "Quais etiquetas e ribbons o equipamento vai utilizar?",
      },
      { label: "Integração com o processo", description: "Como os dados chegam até a impressão?" },
    ],
    relatedSegmentSlugs: ["alimentos", "logistica", "industria"],
    differentiators: serviceDifferentiators,
    faq: [],
    whatsappMessage: "Olá, vim pelo site da FolhaTec e gostaria de falar sobre equipamentos.",
    order: 3,
    updatedAt: null,
    seo: {
      ...emptySeo,
      title: "Equipamentos de impressão e identificação",
      description:
        "Equipamentos de impressão e identificação indicados a partir do cenário de uso da sua operação. Solicite uma cotação.",
    },
  },
  {
    slug: "solucoes-especiais",
    title: "Soluções especiais",
    eyebrow: "Projeto",
    shortDescription:
      "Projetos personalizados para aplicações que não se resolvem com uma solução padronizada.",
    description:
      "Algumas aplicações exigem uma combinação específica de material, formato, impressão e resistência. Nesses casos, o projeto é construído a partir das condições reais da operação e do objetivo da identificação.",
    image: null,
    visual: "special",
    applications: [
      {
        label: "Condições severas de uso",
        description: "Umidade, refrigeração, atrito ou exposição química acima do habitual.",
      },
      {
        label: "Requisitos específicos do processo",
        description: "Formatos, informações ou aplicações que fogem do padrão.",
      },
    ],
    technicalOptions: [],
    relatedSegmentSlugs: ["alimentos", "logistica", "quimico", "industria"],
    differentiators: serviceDifferentiators,
    faq: [],
    whatsappMessage:
      "Olá, vim pelo site da FolhaTec e gostaria de falar sobre um projeto de identificação personalizado.",
    order: 4,
    updatedAt: null,
    seo: {
      ...emptySeo,
      title: "Soluções especiais de identificação",
      description:
        "Projetos de identificação personalizados para aplicações industriais com requisitos específicos. Fale com a FolhaTec.",
    },
  },
];
