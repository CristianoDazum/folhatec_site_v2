import type {
  Article,
  AuthorityContent,
  CompanyContent,
  HomeContent,
  Segment,
  SiteSettings,
  Solution,
} from "@/types/content";

/**
 * Contrato que qualquer fonte de conteúdo precisa cumprir.
 * Implementações: fallback local (`fallback-provider.ts`) e Sanity
 * (`src/lib/sanity/provider.ts`).
 */
export interface ContentProvider {
  readonly name: "sanity" | "fallback";
  getSiteSettings(): Promise<SiteSettings>;
  getSolutions(): Promise<Solution[]>;
  getSegments(): Promise<Segment[]>;
  getArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  getAuthority(): Promise<AuthorityContent>;
  getHomeContent(): Promise<HomeContent>;
  getCompanyContent(): Promise<CompanyContent>;
}
