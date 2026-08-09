"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { brandAssets } from "@/components/public/PageHeroBackground";

type BulletinSlide = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  image: string;
  accent?: string;
};

const AUTO_MS = 5600;

const slides: BulletinSlide[] = [
  {
    id: "hours",
    kicker: "Hours",
    title: "Weekend hours extended",
    body: "Shop later on Saturdays at select Addis Ababa branches — same live stock, free pickup.",
    cta: "See open branches",
    href: "/branches",
    image: brandAssets.branch,
    accent: "Sat · later close",
  },
  {
    id: "pickup",
    kicker: "Pickup",
    title: "Ready in about 15 minutes",
    body: "Order online, collect in-store. No delivery fee — your cart locks to the branch you choose.",
    cta: "Start an order",
    href: "/shop",
    image: brandAssets.aisle,
    accent: "Free pickup",
  },
  {
    id: "fresh",
    kicker: "Fresh desk",
    title: "Produce restocked daily",
    body: "Morning deliveries across Gerji, Jemo, Ayat, and Bisrate Gabriel. Check live availability before you reserve.",
    cta: "Shop fresh",
    href: "/shop?category=Fresh%20%26%20Vegetables",
    image: brandAssets.produceMarket,
    accent: "Daily restock",
  },
  {
    id: "service",
    kicker: "Service",
    title: "One branch. Accurate stock.",
    body: "Switching stores clears the cart so prices and shelves always match the location you visit.",
    cta: "Choose your branch",
    href: "/branches",
    image: brandAssets.shelves,
    accent: "Stock locked",
  },
];

/**
 * Editorial branch bulletin — full-bleed imagery, minimal chrome.
 * Replaces the old frosted “ad card” carousel.
 */
export function BranchBulletin() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const go = useCallback((next: number, direction: "next" | "prev" = "next") => {
    setDir(direction);
    setIndex(((next % slides.length) + slides.length) % slides.length);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => go(index + 1, "next"), AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, reduced, index, go]);

  const slide = slides[index];
  const pad = String(index + 1).padStart(2, "0");
  const total = String(slides.length).padStart(2, "0");

  return (
    <div
      className="branch-bulletin group relative isolate overflow-hidden rounded-[1.75rem] bg-[#0c0c0c] shadow-[0_28px_80px_rgba(0,0,0,0.28)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Branch updates"
    >
      {/* Full-bleed slides */}
      <div className="relative aspect-[16/11] min-h-[280px] w-full sm:aspect-[21/9] sm:min-h-[300px] md:min-h-[340px]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={[
              "absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              i === index ? "z-[1] opacity-100" : "z-0 opacity-0",
              i === index ? (dir === "next" ? "scale-100" : "scale-100") : "scale-105",
            ].join(" ")}
            aria-hidden={i !== index}
          >
            <Image
              src={s.image}
              alt=""
              fill
              priority={i === 0}
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1152px"
            />
          </div>
        ))}

        {/* Cinematic grade — left readable, image still dominant */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-black via-black/75 to-black/15 md:via-black/55 md:to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-transparent to-black/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_top_right,rgba(255,106,0,0.18),transparent_50%)]"
        />

        {/* Content */}
        <div className="absolute inset-0 z-[3] flex min-w-0 flex-col justify-between p-4 sm:p-7 md:p-9">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="h-8 w-1 shrink-0 rounded-full bg-[color:var(--allmart-orange)]" aria-hidden />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[color:var(--allmart-orange)]">
                  All Mart · Branch desk
                </p>
                <p className="mt-0.5 truncate text-[11px] font-medium text-white/45">
                  Updates for shoppers in Addis Ababa
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <span className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-sm">
                {slide.accent}
              </span>
            </div>
          </div>

          <div className="min-w-0 max-w-xl">
            <div
              key={`copy-${tick}`}
              className={reduced ? undefined : "branch-bulletin-copy"}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/50">{slide.kicker}</p>
              <h2 className="mt-2 text-xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-3xl md:text-4xl">
                {slide.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/70 md:text-[15px] md:leading-7">
                {slide.body}
              </p>
              <Link
                href={slide.href}
                className="btn-float mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--allmart-orange)] px-5 py-2.5 text-sm font-extrabold text-white"
              >
                {slide.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* Controls — editorial, not a widget chrome bar */}
          <div className="mt-5 flex min-w-0 flex-col gap-3 border-t border-white/10 pt-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4 sm:pt-4">
            <div className="flex items-baseline gap-3 font-extrabold tracking-tight text-white">
              <span className="text-2xl text-[color:var(--allmart-orange)] tabular-nums">{pad}</span>
              <span className="text-sm text-white/30">/</span>
              <span className="text-sm text-white/45 tabular-nums">{total}</span>
              <span className="ml-2 hidden text-xs font-semibold uppercase tracking-[0.2em] text-white/35 sm:inline">
                {slide.kicker}
              </span>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              {!reduced && (
                <div className="relative hidden h-[2px] w-28 overflow-hidden rounded-full bg-white/15 sm:block md:w-40">
                  <div
                    key={`${index}-${paused}-${tick}`}
                    className={[
                      "absolute inset-y-0 left-0 rounded-full bg-[color:var(--allmart-orange)]",
                      paused ? "w-0" : "branch-bulletin-progress",
                    ].join(" ")}
                  />
                </div>
              )}

              <div className="flex gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Show update ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => go(i, i > index ? "next" : "prev")}
                    className={[
                      "h-1 rounded-full transition-all duration-500",
                      i === index ? "w-8 bg-[color:var(--allmart-orange)]" : "w-2 bg-white/25 hover:bg-white/45",
                    ].join(" ")}
                  />
                ))}
              </div>

              <div className="ml-1 flex gap-1">
                <button
                  type="button"
                  aria-label="Previous update"
                  onClick={() => go(index - 1, "prev")}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-lg text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next update"
                  onClick={() => go(index + 1, "next")}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg text-white transition hover:border-[color:var(--allmart-orange)]/50 hover:bg-[color:var(--allmart-orange)]"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {slide.title}. {slide.body}
      </div>
    </div>
  );
}
