import type { Branch } from "./types";

/** Whether the branch is open right now (Addis Ababa local time approximation via browser TZ). */
export function isBranchOpen(branch: Branch, now = new Date()): boolean {
  const hour = now.getHours() + now.getMinutes() / 60;
  const { openHour, closeHour } = branch;
  if (closeHour > openHour) return hour >= openHour && hour < closeHour;
  // overnight window
  return hour >= openHour || hour < closeHour;
}

export function formatBranchHours(branch: Branch): string {
  const fmt = (h: number) => {
    const hour = Math.floor(h);
    const mins = Math.round((h - hour) * 60);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return mins ? `${h12}:${String(mins).padStart(2, "0")} ${ampm}` : `${h12} ${ampm}`;
  };
  return `${fmt(branch.openHour)} – ${fmt(branch.closeHour)}`;
}
