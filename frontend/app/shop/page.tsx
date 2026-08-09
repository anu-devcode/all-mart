"use client";

import Link from "next/link";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { ProductCard } from "@/components/public/ProductCard";
import { ProductSearchBox } from "@/components/public/ProductSearchBox";
import { PageHeroBackground, brandAssets } from "@/components/public/PageHeroBackground";
import { Reveal } from "@/components/motion/Reveal";
import type { ProductCategory } from "@/lib/types";

function ShopInner() {
  const { products } = useAllMart();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const qFromUrl = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(qFromUrl);

  useEffect(() => {
    setSearch(qFromUrl);
  }, [qFromUrl]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set) as ProductCategory[];
  }, [products]);

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    return products
      .filter((p) => p.isActive)
      .filter((p) => (categoryFromUrl ? p.category === categoryFromUrl : true))
      .filter((p) => {
        if (!normalizedSearch) return true;
        return p.name.toLowerCase().includes(normalizedSearch) || p.category.toLowerCase().includes(normalizedSearch);
      });
  }, [products, categoryFromUrl, normalizedSearch]);

  return (
    <div className="pb-20">
      <PageHeroBackground src={brandAssets.shelfStaff} alt="All Mart shelves" minHeightClassName="min-h-[280px] md:min-h-[340px]">
        <div className="w-full">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">Shop</h1>
          <p className="mt-3 max-w-xl text-sm text-white/85">Browse products and add to cart — stock updates with your selected branch.</p>
          <div className="mt-6 w-full max-w-lg">
            <ProductSearchBox
              id="shop-search"
              size="md"
              tone="light"
              initialQuery={qFromUrl}
              onQueryChange={setSearch}
            />
            <p className="mt-2 text-xs font-medium text-white/70">
              Customers can find products instantly — improving sales with smarter search.
            </p>
          </div>
        </div>
      </PageHeroBackground>

      <div className="section-panel surface-panel relative -mt-6 px-4 pb-6 pt-10">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-[minmax(0,250px)_minmax(0,1fr)]">
          <Reveal>
            <aside className="float-glass rounded-2xl p-4 md:sticky md:top-28">
              <div className="text-sm font-extrabold text-zinc-900">Categories</div>
              <div className="mt-3 flex gap-2 overflow-x-auto overscroll-x-contain pb-1 md:block md:space-y-2 md:overflow-visible md:pb-0">
                <Link
                  href="/shop"
                  className={[
                    "shrink-0 rounded-full px-3.5 py-2.5 text-sm font-bold transition md:block",
                    !categoryFromUrl
                      ? "bg-[color:var(--allmart-orange)] text-white shadow-[0_10px_24px_rgba(255,106,0,0.28)]"
                      : "bg-white/70 text-zinc-700 hover:bg-white",
                  ].join(" ")}
                >
                  All
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c}
                    href={`/shop?category=${encodeURIComponent(c)}`}
                    className={[
                      "shrink-0 rounded-full px-3.5 py-2.5 text-sm font-bold transition md:block",
                      categoryFromUrl === c
                        ? "bg-[color:var(--allmart-orange)] text-white shadow-[0_10px_24px_rgba(255,106,0,0.28)]"
                        : "bg-white/70 text-zinc-700 hover:bg-white",
                    ].join(" ")}
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </aside>
          </Reveal>

          <section className="min-w-0">
            <Reveal>
              <div className="text-sm text-zinc-600">
                Showing <span className="font-bold text-zinc-900">{filtered.length}</span> items
              </div>
            </Reveal>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, idx) => (
                <Reveal key={p.id} delay={(Math.min(idx % 3, 2) as 0 | 1 | 2)}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="float-glass mt-8 rounded-2xl p-8 text-center text-sm font-semibold text-zinc-600">
                No products match your search.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-6xl px-4 py-28 text-sm text-zinc-600">Loading shop...</div>}>
      <ShopInner />
    </Suspense>
  );
}
