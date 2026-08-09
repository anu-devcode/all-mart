"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { PageHeroBackground, brandAssets } from "@/components/public/PageHeroBackground";
import { Reveal } from "@/components/motion/Reveal";
import { formatEtb } from "@/lib/format";

export default function WishlistPage() {
  const {
    wishlistProducts,
    wishlistCount,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    activeBranchId,
    branches,
  } = useAllMart();

  const branch = branches.find((b) => b.id === activeBranchId);

  if (wishlistCount === 0) {
    return (
      <div className="pb-20">
        <PageHeroBackground src={brandAssets.freshFruit} alt="Wishlist" minHeightClassName="min-h-[240px] md:min-h-[280px]">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Wishlist</h1>
            <p className="mt-3 text-sm text-white/85">Save products you love and add them when you’re ready.</p>
          </div>
        </PageHeroBackground>
        <div className="section-panel surface-panel relative -mt-6 px-4 py-12 backdrop-blur-sm">
          <Reveal>
            <div className="mx-auto max-w-xl float-glass rounded-[1.75rem] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <HeartEmpty />
              </div>
              <div className="mt-4 text-lg font-extrabold text-zinc-900">Your wishlist is empty</div>
              <p className="mt-2 text-sm text-zinc-600">Tap the heart on any product card to save it here.</p>
              <Link
                href="/shop"
                className="btn-float mt-6 inline-flex rounded-full bg-[color:var(--allmart-orange)] px-6 py-3 text-sm font-extrabold text-white"
              >
                Browse shop
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeroBackground src={brandAssets.freshFruit} alt="Wishlist" minHeightClassName="min-h-[240px] md:min-h-[280px]">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Wishlist</h1>
            <p className="mt-3 text-sm text-white/85">
              {wishlistCount} saved · stock shown for{" "}
              <span className="font-bold text-white">{branch?.name ?? "your branch"}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={clearWishlist}
            className="btn-float-ghost self-start rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur sm:self-auto"
          >
            Clear wishlist
          </button>
        </div>
      </PageHeroBackground>

      <div className="section-panel surface-panel relative -mt-6 px-4 py-12 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl space-y-3">
          {wishlistProducts.map((product, idx) => {
            const stock = product.stockByBranch[activeBranchId] ?? 0;
            const inStock = stock > 0;
            return (
              <Reveal key={product.id} delay={(Math.min(idx, 3) as 0 | 1 | 2 | 3)} variant="up">
                <div className="float-glass flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
                  <Link
                    href={`/product/${product.id}`}
                    className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-24 sm:w-24"
                  >
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt="" fill className="object-cover" sizes="96px" />
                    ) : null}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-sm font-extrabold text-zinc-900 hover:text-[color:var(--allmart-orange)]"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-1 text-xs text-zinc-500">{product.category}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-base font-extrabold text-zinc-900">{formatEtb(product.priceEtb)}</span>
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-bold",
                          inStock ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500",
                        ].join(" ")}
                      >
                        {inStock ? `${stock} in stock` : "Out of stock here"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      disabled={!inStock}
                      onClick={() => addToCart(product.id, 1)}
                      className={[
                        "rounded-full px-4 py-2.5 text-xs font-extrabold",
                        inStock
                          ? "bg-[color:var(--allmart-orange)] text-white"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-400",
                      ].join(" ")}
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      className="rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeartEmpty() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-6.7-4.35-9.33-7.7C.5 10.55 1.1 6.8 4.05 5.2c1.85-1 4.1-.55 5.45 1.05C10.85 4.65 13.1 4.2 14.95 5.2c2.95 1.6 3.55 5.35 1.38 8.1C18.7 16.65 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
