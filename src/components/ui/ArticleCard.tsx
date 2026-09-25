import Link from "next/link";
import type { Article } from "@/types/content";
import { formatDate } from "@/lib/format";
import { Media } from "./Media";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group relative flex min-w-0 flex-col rounded-[var(--radius-card)] border border-line bg-surface p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)] focus-within:border-accent/60">
      <Media
        image={article.image}
        visual="labels"
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="aspect-[16/10] rounded-[1.1rem]"
      />
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          {article.category ? <span className="eyebrow">{article.category.title}</span> : null}
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-tight">
          <Link
            href={`/conteudos/${article.slug}`}
            className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-['']"
          >
            {article.title}
          </Link>
        </h2>
        {article.excerpt ? <p className="mt-3 text-sm leading-6 text-muted">{article.excerpt}</p> : null}
      </div>
    </article>
  );
}
