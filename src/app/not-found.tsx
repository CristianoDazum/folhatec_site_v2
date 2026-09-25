import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { NOT_FOUND_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = NOT_FOUND_METADATA;

export default function NotFound() {
  return (
    <section className="relative isolate overflow-clip bg-background">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-60" />
      <div className="container-site flex min-h-[70dvh] flex-col items-start justify-center py-20">
        <p className="eyebrow">Erro 404</p>
        <h1 className="heading-page mt-4 max-w-3xl">Página não encontrada.</h1>
        <p className="text-lead mt-6 max-w-xl">
          O endereço pode ter mudado ou não existir mais. Veja as soluções da FolhaTec ou envie sua
          solicitação diretamente.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">
            Ir para a página inicial
            <Icon name="arrow" size={17} />
          </ButtonLink>
          <ButtonLink href="/solucoes" variant="secondary">
            Conhecer soluções
          </ButtonLink>
          <ButtonLink href="/solicitar-cotacao" variant="secondary">
            Solicitar cotação
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
