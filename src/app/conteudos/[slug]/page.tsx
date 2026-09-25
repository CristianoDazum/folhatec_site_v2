import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Media } from "@/components/ui/Media";
import { RichText } from "@/components/ui/RichText";
import { getArticleBySlug, getArticles, getSiteSettings } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { NOT_FOUND_METADATA, buildMetadata } from "@/lib/seo/metadata";
import type { BreadcrumbItem } from "@/types/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return NOT_FOUND_METADATA;
  return buildMetadata({
    title: article.title,
    description: article.excerpt || article.title,
    path: `/conteudos/${article.slug}`,
    seo: article.seo,
    image: article.image,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, settings] = await Promise.all([getArticleBySlug(slug), getSiteSettings()]);
  if (!article) notFound();

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Início", path: "/" },
    { name: "Conteúdos", path: "/conteudos" },
    { name: article.title, path: `/conteudos/${article.slug}` },
  ];

  return (
    <>
      <article>
        <header className="border-b border-line bg-background">
          <div className="container-site py-10 sm:py-14">
            <Breadcrumbs items={breadcrumbs} />
            <div className="mx-auto mt-10 max-w-3xl">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                {article.category ? <span className="eyebrow">{article.category.title}</span> : null}
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                {article.author ? <span>Por {article.author}</span> : null}
              </div>
              <h1 className="heading-page mt-5">{article.title}</h1>
              {article.excerpt ? <p className="text-lead mt-6">{article.excerpt}</p> : null}
            </div>
          </div>
        </header>

        {article.image ? (
          <div className="container-site mt-10">
            <Media
              image={article.image}
              visual="labels"
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="mx-auto aspect-[16/9] max-w-5xl rounded-[var(--radius-panel)]"
            />
          </div>
        ) : null}

        <div className="container-site section-y">
          <div className="mx-auto max-w-3xl">
            <RichText value={article.body} />
          </div>
        </div>
      </article>

      <FaqSection items={article.faq} />

      <CtaSection
        content={{
          eyebrow: "Aplicação na prática",
          title: "Quer avaliar isso na sua operação?",
          description: "Fale com um especialista da FolhaTec e receba uma indicação para a sua aplicação.",
        }}
        whatsapp={settings.contact.whatsapp}
        location="article_final"
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={articleJsonLd(article, settings)} />
    </>
  );
}
