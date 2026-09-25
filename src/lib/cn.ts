/**
 * Junta classes condicionais com espaço simples. Só aceita strings
 * completas (detectáveis pelo Tailwind) — nunca concatenar fragmentos.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
