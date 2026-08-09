"use client";

import Link from "next/link";
import React from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/**
 * Full-bleed customer auth surface — dark + All Mart orange.
 * Single scroll container (document scroll is locked on auth routes).
 */
export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="auth-shell relative flex h-full min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain bg-[#0c0c0c] text-white [scrollbar-gutter:stable]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,106,0,0.22),transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(255,106,0,0.1),transparent_45%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-md min-w-0 flex-1 flex-col justify-center px-4 py-8 sm:py-10">
        <div className="mb-7 flex flex-col items-center text-center sm:mb-8">
          <BrandLockup tone="light" size="md" showTagline={false} href="/" />
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">{title}</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">{subtitle}</p>
        </div>

        <div className="auth-panel rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-7">
          {children}
        </div>

        {footer ? <div className="mt-6 text-center text-sm text-white/55">{footer}</div> : null}

        <div className="mt-8 pb-2 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white"
          >
            Continue without account
            <span aria-hidden className="text-[color:var(--allmart-orange)]">
              →
            </span>
          </Link>
          <p className="mt-1.5 text-[11px] text-white/30">Browse & shop — no signup required</p>
        </div>
      </div>
    </div>
  );
}

export const authInputClass =
  "mt-1.5 h-12 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[color:var(--allmart-orange)] focus:bg-white/[0.09] focus:ring-4 focus:ring-[color:var(--allmart-orange)]/20";

export const authLabelClass = "text-xs font-semibold text-white/50";
