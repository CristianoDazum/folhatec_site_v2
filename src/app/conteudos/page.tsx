import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteCta } from "@/components/sections/QuoteCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { getArticles } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/types/navigation";

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Início", path: "/" },
  { name: "Conteúdos", path: "/conteudos" },
];

export const metadata: Metadata = buildMetadata({
  title: "Conteúdos técnicos",
  description:
    "Conteúdos sobre etiquetas, materiais, impressão, ribbons, equipamentos e aplicações de identificação na indústria.",
  path: "/conteudos",
});

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <>
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Conteúdos"
        title="Conhecimento técnico sobre identificação industrial."
        description="Materiais, aplicações, impressão e boas práticas para escolher a identificação adequada à sua operação."
      />

      <section aria-label="Artigos" className="section-y">
        <div className="container-site">
          {articles.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Novos conteúdos em breve."
              description="Estamos preparando materiais sobre etiquetas, materiais, impressão e aplicações industriais. Enquanto isso, fale com a equipe da FolhaTec sobre a sua necessidade."
            >
              <QuoteCta location="articles_empty" />
              <ButtonLink href="/solucoes" variant="secondary">
                Conhecer soluções
              </ButtonLink>
            </EmptyState>
          )}
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    </>
  );
}
