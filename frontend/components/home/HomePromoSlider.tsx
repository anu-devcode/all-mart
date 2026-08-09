"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { brandAssets } from "@/components/public/PageHeroBackground";

type PromoSlide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  image: string;
  tone: "orange" | "dark" | "soft";
};

const slides: PromoSlide[] = [
  {
    id: "fresh-week",
    eyebrow: "This week’s deals",
    title: "Fresh produce up to 15% off",
    body: "Seasonal fruits and vegetables at your nearest All Mart branch — while stocks last.",
    cta: "Shop fresh",
    href: "/shop?category=Fresh%20%26%20Vegetables",
    image: brandAssets.citrus,
    tone: "orange",
  },
  {
    id: "branch-hours",
    eyebrow: "Company update",
    title: "Extended weekend hours in Bole",
    body: "All Mart Bole now opens until 9 PM on Saturdays for easier family shopping.",
    cta: "View branches",
    href: "/branches",
    image: brandAssets.branch,
    tone: "dark",
  },
  {
    id: "household",
    eyebrow: "Home essentials",
    title: "Household restock weekend",
    body: "Detergents, cleaning, and everyday home care — check live stock by branch.",
    cta: "Browse household",
    href: "/shop?category=Household",
    image: brandAssets.household,
    tone: "soft",
  },
  {
    id: "pickup",
    eyebrow: "Service highlight",
    title: "Free in-store pickup across Addis",
    body: "Order online, pick up at your branch. Simulated checkout ready when you are.",
    cta: "Start shopping",
    href: "/shop",
    image: brandAssets.aisle,
    tone: "orange",
  },
];

const AUTO_MS = 6500;

export function HomePromoSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [wipe, setWipe] = useState(false);
  const touchX = useRef<number | null>(null);
  const firstPaint = useRef(true);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const go = useCallback((next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, reduced]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Brand-orange wipe whenever the active slide changes (skip first paint)
  useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      return;
    }
    if (reduced) return;
    setWipe(true);
    const t = window.setTimeout(() => setWipe(false), 780);
    return () => window.clearTimeout(t);
  }, [index, reduced]);

  const slide = slides[index];

  return (
    <div
      className="px-4 py-10 md:py-12"
      aria-roledescription="carousel"
      aria-label="Promotions and updates"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
              Highlights
            </p>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-zinc-900 md:text-xl">
              Offers & company news
            </h2>
          </div>
          <p className="hidden text-xs text-zinc-500 sm:block">
            {paused ? "Paused" : "Auto-plays gently"} · {index + 1}/{slides.length}
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-[1.5rem] border border-zinc-200/80 bg-white shadow-[0_16px_48px_rgba(17,17,17,0.06)]"
          onTouchStart={(e) => {
            touchX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) < 40) return;
            if (dx < 0) next();
            else prev();
          }}
        >
          <div className={`slide-brand-wipe ${wipe ? "is-active" : ""}`} aria-hidden />
          <div className={`slide-brand-flash ${wipe ? "is-active" : ""}`} aria-hidden />

          <div className="relative grid min-h-[220px] grid-cols-1 md:min-h-[260px] md:grid-cols-[1.05fr_0.95fr]">
            {/* Text */}
            <div className="relative z-[1] order-1 flex flex-col justify-center px-6 py-7 md:order-1 md:px-9 md:py-9">
              {slides.map((s, i) => (
                <div
                  key={s.id}
                  className={[
                    "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    i === index
                      ? "relative opacity-100 translate-y-0"
                      : "pointer-events-none absolute inset-x-6 top-7 opacity-0 translate-y-3 md:inset-x-9 md:top-9",
                  ].join(" ")}
                  aria-hidden={i !== index}
                >
                  <span
                    className={[
                      "inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]",
                      s.tone === "orange"
                        ? "bg-[color:var(--allmart-orange)]/12 text-[color:var(--allmart-orange)]"
                        : s.tone === "dark"
                          ? "bg-zinc-900/8 text-zinc-700"
                          : "bg-amber-50 text-amber-800",
                    ].join(" ")}
                  >
                    {s.eyebrow}
                  </span>
                  <h3 className="mt-3 max-w-md text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">{s.body}</p>
                  <Link
                    href={s.href}
                    className="btn-float mt-5 inline-flex rounded-full bg-[color:var(--allmart-orange)] px-5 py-2.5 text-sm font-extrabold text-white"
                  >
                    {s.cta}
                  </Link>
                </div>
              ))}

              {/* Progress rail */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex gap-1.5">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-label={`Show slide ${i + 1}: ${s.title}`}
                      aria-current={i === index}
                      onClick={() => go(i)}
                      className={[
                        "h-1.5 rounded-full transition-all duration-500",
                        i === index
                          ? "w-7 bg-[color:var(--allmart-orange)]"
                          : "w-1.5 bg-zinc-200 hover:bg-zinc-300",
                      ].join(" ")}
                    />
                  ))}
                </div>
                {!reduced && (
                  <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      key={`${index}-${paused}`}
                      className={[
                        "absolute inset-y-0 left-0 rounded-full bg-[color:var(--allmart-orange)]/50",
                        paused ? "w-0" : "promo-progress",
                      ].join(" ")}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Image */}
            <div className="relative order-2 min-h-[180px] md:min-h-full">
              {slides.map((s, i) => (
                <div
                  key={s.id}
                  className={[
                    "absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    i === index ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                >
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    quality={85}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 45vw"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-white/10" />
                </div>
              ))}

              <div className="absolute bottom-3 right-3 z-10 flex gap-2 md:bottom-4 md:right-4">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/90 text-zinc-800 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/90 text-zinc-800 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Live region for screen readers */}
          <div className="sr-only" aria-live="polite">
            {slide.title}. {slide.body}
          </div>
        </div>
      </div>
    </div>
  );
}
