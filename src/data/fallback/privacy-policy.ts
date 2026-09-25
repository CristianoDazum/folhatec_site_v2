import type { PrivacyPolicyContent } from "@/types/content";

/**
 * Política de Privacidade — VERSÃO ESTRUTURAL PARA HOMOLOGAÇÃO.
 *
 * ATENÇÃO: este texto precisa de revisão e aprovação jurídica antes do
 * lançamento (ver docs/go-live-checklist.md). Ele descreve apenas o que o
 * site efetivamente faz nesta base técnica: formulário de cotação e registro
 * de origem da visita (UTM, gclid, fbclid, referrer). Ao ativar GTM/GA4 ou
 * outras ferramentas, a seção de cookies deve ser atualizada.
 *
 * `updatedAt` permanece `null` até existir uma versão aprovada.
 */
export const fallbackPrivacyPolicy: PrivacyPolicyContent = {
  title: "Política de Privacidade",
  intro:
    "Esta política explica como a FolhaTec trata os dados pessoais enviados por meio deste site, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).",
  sections: [
    {
      title: "Dados coletados",
      paragraphs: [
        "Ao solicitar uma cotação ou entrar em contato pelo formulário, podem ser coletados: nome, empresa, telefone ou WhatsApp, e-mail e a mensagem enviada.",
        "Para entender como o visitante chegou ao site, também podem ser registradas informações de origem da visita, como a página de entrada, a página do envio, o site de referência e parâmetros de campanha (por exemplo, utm_source, gclid e fbclid).",
      ],
    },
    {
      title: "Finalidade",
      paragraphs: [
        "Os dados são utilizados para responder à solicitação enviada, elaborar propostas comerciais e manter o contato relacionado ao atendimento.",
        "As informações de origem da visita são utilizadas para avaliar a efetividade dos canais de divulgação do site.",
      ],
    },
    {
      title: "Consentimento",
      paragraphs: [
        "O envio do formulário depende da concordância expressa com esta política. O consentimento pode ser revogado a qualquer momento pelos canais de contato informados no site.",
      ],
    },
    {
      title: "Cookies e tecnologias de medição",
      paragraphs: [
        "O site utiliza armazenamento local do navegador para registrar a origem da visita e associá-la à solicitação de cotação. Ferramentas de medição de audiência, quando ativadas, serão descritas nesta seção.",
      ],
    },
    {
      title: "Direitos do titular",
      paragraphs: [
        "O titular pode solicitar confirmação da existência de tratamento, acesso, correção, anonimização, portabilidade ou eliminação dos seus dados, além de informações sobre compartilhamento, nos termos da LGPD.",
      ],
    },
    {
      title: "Segurança e retenção",
      paragraphs: [
        "São adotadas medidas técnicas e administrativas para proteger os dados pessoais. Os dados são mantidos pelo tempo necessário ao atendimento da finalidade para a qual foram coletados ou pelo prazo exigido por lei.",
      ],
    },
  ],
  updatedAt: null,
};
