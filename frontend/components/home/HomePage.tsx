"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { ProductCard } from "@/components/public/ProductCard";
import { brandAssets, categoryIcons, categoryImages } from "@/components/public/PageHeroBackground";
import { Reveal } from "@/components/motion/Reveal";
import { SectionShell } from "@/components/motion/SectionShell";
import { HomePromoSlider } from "@/components/home/HomePromoSlider";
import { HeroJourney } from "@/components/home/HeroJourney";
import { BranchSelectCard } from "@/components/public/BranchSelectCard";

const trustItems = [
  { title: "Live branch stock", body: "See what’s available before you add to cart." },
  { title: "Free in-store pickup", body: "Order online, collect at your Addis branch." },
  { title: "Priced in ETB", body: "Clear local pricing on every product." },
  { title: "Fast simulated checkout", body: "Place a mock order in under a minute." },
];

export function HomePage() {
  const { products, branches, activeBranchId, orders } = useAllMart();
  const activeBranch = branches.find((b) => b.id === activeBranchId);

  const featured = useMemo(() => products.filter((p) => p.isActive).slice(0, 8), [products]);
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set).slice(0, 6);
  }, [products]);
  const inStockCount = useMemo(() => {
    return products.filter((p) => p.isActive && (p.stockByBranch[activeBranchId] ?? 0) > 0).length;
  }, [products, activeBranchId]);

  const popularBranchId = useMemo(() => {
    const tally = new Map<string, number>();
    for (const o of orders) tally.set(o.branchId, (tally.get(o.branchId) ?? 0) + 1);
    let best = "b-bole";
    let max = -1;
    for (const b of branches) {
      const n = tally.get(b.id) ?? 0;
      if (n > max) {
        max = n;
        best = b.id;
      }
    }
    return max <= 0 ? "b-bole" : best;
  }, [orders, branches]);

  return (
    <div className="pb-0">
      {/* Hero — brand-first, minimal capture */}
      <section className="relative flex min-h-[88svh] flex-col justify-end px-4 pb-16 pt-36 md:min-h-[92svh] md:justify-center md:pb-24 md:pt-32">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-xl">
            <p className="animate-rise text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              All <span className="text-[color:var(--allmart-orange)]">Mart</span>
            </p>

            <h1 className="animate-rise animate-rise-delay-1 mt-5 text-xl font-semibold leading-snug tracking-tight text-white/90 sm:text-2xl md:text-3xl md:leading-snug">
              Fresh groceries. Ready for pickup.
            </h1>

            <p className="animate-rise animate-rise-delay-2 mt-4 max-w-md text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
              Live stock at your Addis Ababa branch — order in minutes, collect free.
            </p>

            <div className="animate-rise animate-rise-delay-3 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="btn-float rounded-full bg-[color:var(--allmart-orange)] px-7 py-3.5 text-sm font-extrabold text-white"
              >
                Start shopping
              </Link>
              <Link
                href="/branches"
                className="btn-float-ghost rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md"
              >
                Choose branch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — after the first viewport */}
      <SectionShell className="section-panel surface-panel px-4 py-10 md:py-12">
        <div className="mx-auto w-full max-w-6xl">
          <HeroJourney />
        </div>
      </SectionShell>

      {/* Trust / conversion strip */}
      <SectionShell className="surface-panel px-4 py-10 md:py-12">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((t, idx) => (
            <Reveal key={t.title} delay={(Math.min(idx, 3) as 0 | 1 | 2 | 3)} variant="up">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(17,17,17,0.04)]">
                <div className="h-1 w-8 rounded-full bg-[color:var(--allmart-orange)]" />
                <div className="mt-3 text-sm font-extrabold text-zinc-900">{t.title}</div>
                <p className="mt-1 text-xs leading-5 text-zinc-600">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="surface-panel">
        <HomePromoSlider />
      </SectionShell>

      {/* Categories */}
      <SectionShell className="surface-panel px-4 py-14 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal variant="fade">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
                  Catalog
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
                  Shop by category
                </h2>
                <p className="mt-2 text-sm text-zinc-600">Jump straight to what you need for today’s shop.</p>
              </div>
              <Link
                href="/shop"
                className="shrink-0 text-sm font-bold text-[color:var(--allmart-orange)] hover:underline"
              >
                View all
              </Link>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {categories.map((c, idx) => {
              const img = categoryImages[c] ?? brandAssets.produceMarket;
              const icon = categoryIcons[c] ?? "🛒";
              return (
                <Reveal
                  key={c}
                  delay={(Math.min(idx, 4) as 0 | 1 | 2 | 3 | 4)}
                  variant={idx % 2 === 0 ? "up" : "scale"}
                >
                  <Link
                    href={`/shop?category=${encodeURIComponent(c)}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200/60 shadow-[var(--shadow-float)] md:aspect-[16/11]"
                  >
                    <Image
                      src={img}
                      alt={c}
                      fill
                      quality={85}
                      className="img-zoom object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    {/* Category icon overlay */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-xl shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-[color:var(--allmart-orange)]/90 group-hover:border-[color:var(--allmart-orange)] md:left-4 md:top-4 md:h-12 md:w-12 md:text-2xl"
                    >
                      <span className="drop-shadow-sm">{icon}</span>
                    </div>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-2 -top-1 select-none text-6xl opacity-[0.18] transition duration-500 group-hover:opacity-[0.28] group-hover:scale-110 md:text-7xl"
                    >
                      {icon}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                      <div className="text-sm font-extrabold text-white md:text-base">{c}</div>
                      <div className="mt-1 text-[11px] font-semibold text-white/75">Shop now →</div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </SectionShell>

      {/* Featured products */}
      <SectionShell className="surface-panel-strong px-4 py-14 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal variant="fade">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
                  Bestsellers
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
                  Popular at {activeBranch?.name.replace("All Mart ", "") ?? "your branch"}
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Stock shown for your active branch — switch anytime in the header.
                </p>
              </div>
              <Link
                href="/shop"
                className="btn-float inline-flex self-start rounded-full bg-[color:var(--allmart-orange)] px-5 py-2.5 text-sm font-extrabold text-white sm:self-auto"
              >
                Open full shop
              </Link>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, idx) => (
              <Reveal key={p.id} delay={(Math.min(idx % 4, 3) as 0 | 1 | 2 | 3)} variant="scale">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* Branches — shopping flow picker */}
      <SectionShell className="px-4 py-16 md:py-20">
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <Reveal variant="up">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange-soft)]">
              Step 1 · Choose location
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Select a branch to shop
            </h2>
            <p className="mt-3 max-w-xl text-sm text-white/70">
              Stock and cart are tied to one branch. Free pickup is usually ready in about 15 minutes.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {branches.map((b, idx) => {
              const imgs = [brandAssets.branch, brandAssets.shelves, brandAssets.teamShop];
              return (
                <Reveal key={b.id} delay={(Math.min(idx, 3) as 0 | 1 | 2 | 3)} variant="up">
                  <BranchSelectCard
                    branch={b}
                    imageSrc={imgs[idx % imgs.length]}
                    tone="dark"
                    popular={b.id === popularBranchId}
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </SectionShell>

      {/* Final conversion band */}
      <SectionShell className="surface-panel-strong px-4 py-14 md:py-16">
        <Reveal variant="scale">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 rounded-[1.5rem] border border-[color:var(--allmart-orange)]/20 bg-gradient-to-br from-white to-orange-50/80 p-6 shadow-[var(--shadow-float)] md:flex-row md:items-center md:p-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
                Ready when you are
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
                Start your branch shop in seconds
              </h2>
              <p className="mt-2 max-w-xl text-sm text-zinc-600">
                Browse {inStockCount}+ available items at {activeBranch?.name ?? "your branch"}, add to cart, and
                simulate checkout for free pickup.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="btn-float rounded-full bg-[color:var(--allmart-orange)] px-6 py-3.5 text-sm font-extrabold text-white"
              >
                Go to shop
              </Link>
              <Link
                href="/account/signup"
                className="btn-float-ghost rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-sm font-bold text-zinc-800"
              >
                Create account
              </Link>
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </div>
  );
}
