"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { PageHeroBackground, brandAssets } from "@/components/public/PageHeroBackground";
import { Reveal } from "@/components/motion/Reveal";
import { formatEtb } from "@/lib/format";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const { products, activeBranchId, addToCart, branches, isInWishlist, toggleWishlist } = useAllMart();

  const product = useMemo(() => products.find((p) => p.id === productId), [products, productId]);
  const [qty, setQty] = useState(1);
  const [imgBroken, setImgBroken] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="pb-20">
        <PageHeroBackground src={brandAssets.shelfStaff} alt="Product" minHeightClassName="min-h-[220px]">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Product</h1>
        </PageHeroBackground>
        <div className="section-panel surface-panel relative -mt-6 px-4 py-12">
          <div className="mx-auto max-w-xl float-glass rounded-[1.75rem] p-8 text-center">
            <div className="text-lg font-extrabold text-zinc-900">Product not found</div>
            <p className="mt-2 text-sm text-zinc-600">This mock product may have been removed.</p>
            <Link
              href="/shop"
              className="btn-float mt-6 inline-flex rounded-full bg-[color:var(--allmart-orange)] px-6 py-3 text-sm font-extrabold text-white"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stock = product.stockByBranch[activeBranchId] ?? 0;
  const inStock = stock > 0;
  const activeBranch = branches.find((b) => b.id === activeBranchId);
  const wished = isInWishlist(product.id);

  function handleAdd() {
    addToCart(product!.id, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="pb-20">
      <PageHeroBackground src={brandAssets.shelfStaff} alt={product.name} minHeightClassName="min-h-[240px] md:min-h-[280px]">
        <div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white">
            ← Back to Shop
          </Link>
          <div className="mt-3 text-sm font-semibold text-[color:var(--allmart-orange-soft)]">{product.category}</div>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white md:text-5xl">{product.name}</h1>
        </div>
      </PageHeroBackground>

      <div className="section-panel surface-panel relative -mt-6 px-4 py-12">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-[1fr_1.05fr]">
          <Reveal>
            <div className="float-glass overflow-hidden rounded-[1.75rem] p-3">
              <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-zinc-100">
                {product.imageUrl && !imgBroken ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    unoptimized={product.imageUrl.endsWith(".svg")}
                    className="object-cover transition duration-700 hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={() => setImgBroken(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-zinc-500">
                    No image
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="space-y-4">
              <div className="float-glass rounded-[1.5rem] p-6">
                <div className="text-3xl font-extrabold text-[color:var(--allmart-orange)]">
                  {formatEtb(product.priceEtb)}
                </div>
                <p className="mt-3 text-sm leading-7 text-zinc-600">{product.description}</p>

                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3">
                  <div className="text-sm font-bold text-zinc-900">
                    Stock · {activeBranch?.name ?? "Active branch"}
                  </div>
                  <div
                    className={[
                      "ml-auto rounded-full px-3 py-1 text-xs font-bold",
                      inStock
                        ? "bg-[color:var(--allmart-green)]/15 text-[color:var(--allmart-green)]"
                        : "bg-zinc-100 text-zinc-500",
                    ].join(" ")}
                  >
                    {inStock ? `${stock} available` : "Out of stock"}
                  </div>
                </div>
              </div>

              <div className="float-glass rounded-[1.5rem] p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-extrabold text-zinc-900">Quantity</div>
                  <div className="flex items-center gap-2">
                    <button
                      className="h-10 w-10 rounded-full border border-zinc-200 bg-white text-lg font-bold text-zinc-800 transition hover:bg-zinc-50"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      type="button"
                    >
                      −
                    </button>
                    <input
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                      className="h-10 w-14 rounded-full border border-zinc-200 bg-white text-center text-sm font-bold text-zinc-800"
                      inputMode="numeric"
                    />
                    <button
                      className="h-10 w-10 rounded-full border border-zinc-200 bg-white text-lg font-bold text-zinc-800 transition hover:bg-zinc-50"
                      onClick={() => setQty((q) => Math.min(stock || 1, q + 1))}
                      aria-label="Increase quantity"
                      disabled={!inStock}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                  <button
                    disabled={!inStock}
                    onClick={handleAdd}
                    type="button"
                    className="btn-float w-full rounded-full bg-[color:var(--allmart-orange)] px-4 py-3.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none"
                  >
                    {added ? "Added to Cart" : "Add to Cart"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-pressed={wished}
                    aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                    className={[
                      "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3.5 text-sm font-extrabold transition",
                      wished
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-rose-200 hover:text-rose-500",
                    ].join(" ")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                      <path
                        d="M12 21s-6.7-4.35-9.33-7.7C.5 10.55 1.1 6.8 4.05 5.2c1.85-1 4.1-.55 5.45 1.05C10.85 4.65 13.1 4.2 14.95 5.2c2.95 1.6 3.55 5.35 1.38 8.1C18.7 16.65 12 21 12 21Z"
                        fill={wished ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {wished ? "Saved" : "Wishlist"}
                  </button>
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                  Checkout is simulated; ERP inventory updates with mock order creation.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-8 w-full max-w-6xl">
          <Reveal>
            <div className="float-glass rounded-[1.5rem] p-6">
              <div className="text-lg font-extrabold text-zinc-900">Availability by Branch</div>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                {branches.map((b) => {
                  const s = product.stockByBranch[b.id] ?? 0;
                  return (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-white/70 bg-white/60 p-4 transition hover:-translate-y-0.5"
                    >
                      <div className="text-sm font-bold text-zinc-900">{b.name}</div>
                      <div className="mt-1 text-xs text-zinc-600">{b.city}</div>
                      <div className="mt-3 text-xs font-bold">
                        {s > 0 ? (
                          <span className="rounded-full bg-[color:var(--allmart-green)]/15 px-3 py-1 text-[color:var(--allmart-green)]">
                            {s} available
                          </span>
                        ) : (
                          <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-500">Out</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
