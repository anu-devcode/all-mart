"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { PageHeroBackground, brandAssets } from "@/components/public/PageHeroBackground";
import { Reveal } from "@/components/motion/Reveal";
import { formatEtb } from "@/lib/format";

export default function CartPage() {
  const { cart, cartItemsDetailed, branches, updateCartQty, clearCart } = useAllMart();
  const branch = cart ? branches.find((b) => b.id === cart.branchId) : null;
  const totalEtb = cartItemsDetailed.reduce((sum, it) => sum + it.lineTotalEtb, 0);

  if (!cart || cartItemsDetailed.length === 0) {
    return (
      <div className="pb-20">
        <PageHeroBackground src={brandAssets.promoCategories} alt="Cart" minHeightClassName="min-h-[240px] md:min-h-[280px]">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Cart</h1>
            <p className="mt-3 text-sm text-white/85">Your picks for the active branch.</p>
          </div>
        </PageHeroBackground>
        <div className="section-panel surface-panel relative -mt-6 px-4 py-12 backdrop-blur-sm">
          <Reveal>
            <div className="mx-auto max-w-xl float-glass rounded-[1.75rem] p-8 text-center">
              <div className="text-lg font-extrabold text-zinc-900">Your cart is empty</div>
              <p className="mt-2 text-sm text-zinc-600">Add items from the shop to simulate checkout.</p>
              <Link
                href="/shop"
                className="btn-float mt-6 inline-flex rounded-full bg-[color:var(--allmart-orange)] px-6 py-3 text-sm font-extrabold text-white"
              >
                Go to Shop
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeroBackground src={brandAssets.promoCategories} alt="Cart" minHeightClassName="min-h-[240px] md:min-h-[280px]">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Cart</h1>
            <p className="mt-3 text-sm text-white/85">
              Ordering from <span className="font-bold text-white">{branch?.name}</span>
            </p>
          </div>
          <button
            onClick={clearCart}
            className="btn-float-ghost self-start rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur sm:self-auto"
            type="button"
          >
            Clear cart
          </button>
        </div>
      </PageHeroBackground>

      <div className="section-panel surface-panel relative -mt-6 px-4 py-12 backdrop-blur-sm">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal>
            <div className="float-glass rounded-[1.5rem] p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-zinc-900">Items</div>
                <div className="text-sm text-zinc-600">{cartItemsDetailed.length} products</div>
              </div>
              <div className="mt-4 space-y-3">
                {cartItemsDetailed.map((it) => (
                  <div
                    key={it.product.id}
                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/70 bg-white/60 p-3 shadow-sm sm:flex-nowrap sm:gap-4 sm:p-3.5"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-16 sm:w-16">
                      {it.product.imageUrl ? (
                        <Image
                          src={it.product.imageUrl}
                          alt={it.product.name}
                          fill
                          unoptimized={it.product.imageUrl.endsWith(".svg")}
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1 basis-[calc(100%-4.5rem)] sm:basis-auto">
                      <div className="truncate text-sm font-extrabold text-zinc-900">{it.product.name}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
                        <span>{formatEtb(it.unitPriceEtb)} each</span>
                        <span className="font-extrabold text-[color:var(--allmart-orange)] sm:hidden">
                          {formatEtb(it.lineTotalEtb)}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        className="h-9 w-9 rounded-full border border-zinc-200 bg-white text-lg font-bold text-zinc-800 transition hover:bg-zinc-50"
                        onClick={() => updateCartQty(it.product.id, it.qty - 1)}
                        aria-label="Decrease"
                        type="button"
                      >
                        −
                      </button>
                      <div className="w-8 text-center text-sm font-extrabold text-zinc-900">{it.qty}</div>
                      <button
                        className="h-9 w-9 rounded-full border border-zinc-200 bg-white text-lg font-bold text-zinc-800 transition hover:bg-zinc-50"
                        onClick={() => updateCartQty(it.product.id, it.qty + 1)}
                        aria-label="Increase"
                        type="button"
                      >
                        +
                      </button>
                    </div>
                    <div className="hidden w-24 shrink-0 text-right text-sm font-extrabold text-[color:var(--allmart-orange)] sm:block">
                      {formatEtb(it.lineTotalEtb)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="float-glass sticky top-28 rounded-[1.5rem] p-6">
              <div className="text-sm font-extrabold text-zinc-900">Order Summary</div>
              <div className="mt-5 flex items-center justify-between text-sm text-zinc-700">
                <span>Subtotal</span>
                <span className="font-extrabold text-zinc-900">{formatEtb(totalEtb)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                <span>Branch</span>
                <span className="font-semibold text-zinc-700">{branch?.name}</span>
              </div>
              <Link
                href="/checkout"
                className="btn-float mt-6 block rounded-full bg-[color:var(--allmart-orange)] px-4 py-3.5 text-center text-sm font-extrabold text-white"
              >
                Proceed to Checkout
              </Link>
              <p className="mt-3 text-xs leading-5 text-zinc-500">
                Checkout is simulated and updates mock ERP inventory + orders.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
