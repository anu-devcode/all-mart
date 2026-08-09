import Image from "next/image";
import Link from "next/link";
import React from "react";

type BrandLockupProps = {
  href?: string | null;
  /** light = over dark hero; dark = over white / scrolled surfaces */
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  /** Denser sizing for navbar / tight chrome */
  compact?: boolean;
};

const sizeClass = {
  sm: {
    compact: "h-10 w-[7.25rem] sm:h-11 sm:w-[8rem]",
    normal: "h-11 w-[8rem] sm:h-12 sm:w-[8.75rem]",
  },
  md: {
    compact: "h-12 w-[8.75rem]",
    normal: "h-[3.25rem] w-[9.5rem] sm:h-14 sm:w-[10.5rem]",
  },
  lg: {
    compact: "h-14 w-[10.5rem]",
    normal: "h-16 w-[12rem] sm:h-[4.5rem] sm:w-[13.5rem]",
  },
} as const;

/**
 * Official ALL MART mark — unbounded, no plate/pill.
 * Uses transparent logo-clear asset (same artwork, white plate removed).
 */
export function BrandLockup({
  href = "/",
  tone = "dark",
  size = "md",
  showTagline = false,
  className = "",
  compact = false,
}: BrandLockupProps) {
  const onDark = tone === "light";
  const frame = sizeClass[size][compact ? "compact" : "normal"];

  const inner = (
    <span className={`group inline-flex max-w-full items-center gap-2.5 ${className}`}>
      <span
        className={[
          "relative inline-block shrink-0 overflow-visible transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-90",
          frame,
          // Soft lift on dark heroes only — never a white box
          onDark ? "drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)]" : "",
        ].join(" ")}
      >
        <Image
          src="/assets/logo-clear.png"
          alt="ALL MART"
          fill
          priority
          sizes={size === "sm" ? "140px" : size === "md" ? "180px" : "240px"}
          className="object-contain object-left select-none"
        />
      </span>

      {showTagline ? (
        <span
          className={[
            "hidden flex-col leading-none sm:flex",
            onDark ? "text-white/55" : "text-zinc-500",
          ].join(" ")}
        >
          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em]">Digital Retail</span>
          <span className="mt-1 text-[0.58rem] font-medium tracking-wide">Addis Ababa</span>
        </span>
      ) : null}
    </span>
  );

  if (href == null) return inner;

  return (
    <Link
      href={href}
      aria-label="ALL MART Home"
      className="inline-flex max-w-full shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--allmart-orange)]/45 focus-visible:ring-offset-2"
    >
      {inner}
    </Link>
  );
}
