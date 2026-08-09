"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { SocialIconLinks } from "@/components/brand/SocialIconLinks";
import { useAuth } from "@/components/providers/AuthProvider";
import { companyContact } from "@/lib/companyContact";

const exploreLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/branches", label: "Branches" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicFooter() {
  const { customer } = useAuth();
  const accountLinks = useMemo(
    () =>
      customer
        ? [
            { href: "/account", label: "My account" },
            { href: "/wishlist", label: "Wishlist" },
          ]
        : [
            { href: "/account/login", label: "Log in" },
            { href: "/account/signup", label: "Sign up" },
            { href: "/shop", label: "Continue without account" },
          ],
    [customer],
  );

  return (
    <footer className="relative z-10 overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/95 via-[#0c0c0c]/75 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,106,0,0.16),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="rounded-[1.75rem] border border-white/10 bg-black/35 p-6 backdrop-blur-md md:p-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_0.7fr_0.7fr_1.1fr]">
            <div>
              <BrandLockup tone="light" size="lg" showTagline={false} href="/" />
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/65">{companyContact.tagline}</p>
              <SocialIconLinks className="mt-5" tone="dark" />
              <Link
                href="/shop"
                className="btn-float mt-6 inline-flex rounded-full bg-[color:var(--allmart-orange)] px-5 py-2.5 text-sm font-extrabold text-white"
              >
                Start Shopping
              </Link>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Explore</div>
              <ul className="mt-4 space-y-2.5">
                {exploreLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm font-semibold text-white/75 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Account</div>
              <ul className="mt-4 space-y-2.5">
                {accountLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm font-semibold text-white/75 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Contact</div>
              <div className="mt-4 space-y-2.5 text-sm text-white/70">
                <a
                  href={`tel:${companyContact.phoneMobileTel}`}
                  className="block font-semibold text-white transition hover:text-[color:var(--allmart-orange-soft)]"
                >
                  {companyContact.phoneMobile}
                </a>
                <a
                  href={`tel:${companyContact.phoneLandlineTel}`}
                  className="block text-white/70 transition hover:text-white"
                >
                  {companyContact.phoneLandline}
                  <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/35">Gerji</span>
                </a>
                <a
                  href={`mailto:${companyContact.email}`}
                  className="block break-all transition hover:text-white"
                >
                  {companyContact.email}
                </a>
                <p className="leading-6 text-white/55">{companyContact.hqAddress}</p>
                <a
                  href={companyContact.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex text-xs font-bold text-[color:var(--allmart-orange-soft)] hover:underline"
                >
                  {companyContact.websiteLabel} →
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-white/40">
              © {new Date().getFullYear()} {companyContact.brandName}. All rights reserved.
            </div>
            <div className="text-xs font-semibold tracking-wide text-white/35">
              Gerji · Jemo · Ayat · Bisrate Gabriel · Addis Ababa · ETB
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
