export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-IN", { notation: "compact" }).format(n);
}