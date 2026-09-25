/**
 * Adaptador de rate limit para o endpoint de cotação.
 *
 * Em ambiente serverless (Vercel), um Map() em memória NÃO é proteção
 * confiável: cada instância tem memória própria e é descartada a qualquer
 * momento. Por isso não há implementação em memória aqui.
 *
 * PENDÊNCIA DE PRODUÇÃO: implementar `RateLimiter` com um provider
 * persistente (ex.: Upstash Redis, Vercel KV/Marketplace, Cloudflare) e
 * retorná-lo em `getRateLimiter()`. Enquanto isso, a proteção contra spam
 * depende de honeypot + validação server-side (ver docs/infrastructure.md).
 */

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export interface RateLimiter {
  readonly name: string;
  /** `key` deve ser um identificador não pessoal (ex.: hash do IP). */
  check(key: string): Promise<RateLimitResult>;
}

/** Sem provider configurado: não limita, mas deixa explícito que está inativo. */
const disabledRateLimiter: RateLimiter = {
  name: "disabled",
  async check() {
    return { allowed: true };
  },
};

export function getRateLimiter(): RateLimiter {
  return disabledRateLimiter;
}
