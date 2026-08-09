"use client";

import React from "react";
import { socialLinks, type SocialLink } from "@/lib/companyContact";

function SocialIcon({ id }: { id: SocialLink["id"] }) {
  const common = "h-[18px] w-[18px]";
  switch (id) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden>
          <path d="M14 8h3V4.5C16.4 4.3 15.2 4 13.9 4 11.2 4 9.3 5.7 9.3 8.7V11H6v4h3.3V22h4.1v-7H17l.7-4h-4.4V9.1c0-1.1.3-1.9 1.7-1.9Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden>
          <path d="M19.6 7.5a5.7 5.7 0 0 1-3.3-1.1v7.2a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.7a2.7 2.7 0 1 0 1.9 2.6V2.5h2.7c.2 1.7 1.4 3.2 3.2 3.8v1.2Z" />
        </svg>
      );
    case "website":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function SocialIconLinks({
  className = "",
  tone = "dark",
}: {
  className?: string;
  /** dark = on dark footer; light = on light surfaces */
  tone?: "dark" | "light";
}) {
  return (
    <ul className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {socialLinks.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            target={s.id === "email" ? undefined : "_blank"}
            rel={s.id === "email" ? undefined : "noreferrer noopener"}
            aria-label={s.label}
            title={s.label}
            className={[
              "flex h-10 w-10 items-center justify-center rounded-full border transition",
              tone === "dark"
                ? "border-white/15 bg-white/5 text-white/80 hover:border-[color:var(--allmart-orange)]/50 hover:bg-[color:var(--allmart-orange)] hover:text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-[color:var(--allmart-orange)]/40 hover:text-[color:var(--allmart-orange)]",
            ].join(" ")}
          >
            <SocialIcon id={s.id} />
          </a>
        </li>
      ))}
    </ul>
  );
}
