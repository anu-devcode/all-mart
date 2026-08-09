export function formatEtb(amount: number) {
  return `${amount.toLocaleString("en-US")} ETB`;
}

export function formatShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

