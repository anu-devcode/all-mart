"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { formatEtb } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const { activeBranchId, addToCart, isInWishlist, toggleWishlist } = useAllMart();
  const [imgBroken, setImgBroken] = useState(false);
  const [added, setAdded] = useState(false);
  const [pending, setPending] = useState(false);

  const stock = product.stockByBranch[activeBranchId] ?? 0;
  const inStock = stock > 0;
  const lowStock = inStock && stock <= 3;
  const wished = isInWishlist(product.id);

  const imgSrc = useMemo(() => {
    if (!product.imageUrl || imgBroken) return null;
    return product.imageUrl;
  }, [product.imageUrl, imgBroken]);

  const isSvg = Boolean(imgSrc?.endsWith(".svg"));

  function onAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || pending) return;
    setPending(true);
    addToCart(product.id, 1);
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      setPending(false);
    }, 1200);
  }

  function onWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_8px_30px_rgba(17,17,17,0.04)] transition duration-400 hover:-translate-y-1 hover:border-[color:var(--allmart-orange)]/25 hover:shadow-[0_20px_48px_rgba(17,17,17,0.1)]">
      <button
        type="button"
        onClick={onWishlist}
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wished}
        className={[
          "absolute right-2.5 top-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition duration-300",
          wished
            ? "bg-rose-500 text-white scale-105"
            : "bg-white/95 text-zinc-500 hover:text-rose-500 hover:scale-105",
        ].join(" ")}
      >
        <HeartIcon filled={wished} />
      </button>

      <Link href={`/product/${product.id}`} className="relative block">
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 sm:aspect-square">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              unoptimized={isSvg}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgBroken(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-xs font-semibold text-zinc-400">
              No image
            </div>
          )}

          {/* Overlay gradient for readability */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />

          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
            {inStock ? (
              <span
                className={[
                  "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm",
                  lowStock ? "bg-amber-500" : "bg-[color:var(--allmart-green)]",
                ].join(" ")}
              >
                {lowStock ? "Low stock" : "In stock"}
              </span>
            ) : (
              <span className="rounded-md bg-zinc-800/85 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Sold out
              </span>
            )}
          </div>

          <span className="absolute right-2.5 top-12 rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold text-zinc-600 shadow-sm backdrop-blur">
            {product.category.split(" ")[0]}
          </span>

          {/* Quick view hint */}
          <span className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-white/95 py-2 text-center text-[11px] font-bold text-zinc-800 opacity-0 shadow-md backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View details
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <Link href={`/product/${product.id}`} className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-zinc-900 transition group-hover:text-[color:var(--allmart-orange)]">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{product.description}</p>
        </Link>

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-lg font-extrabold tracking-tight text-zinc-900">
                {formatEtb(product.priceEtb)}
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-zinc-500">
                {inStock ? (
                  <span className={lowStock ? "text-amber-600" : "text-[color:var(--allmart-green)]"}>
                    {stock} left at branch
                  </span>
                ) : (
                  <span className="text-zinc-400">Unavailable here</span>
                )}
              </div>
            </div>
          </div>

          <button
            disabled={!inStock || pending}
            onClick={onAdd}
            type="button"
            aria-label={inStock ? `Add ${product.name} to cart` : `${product.name} out of stock`}
            className={[
              "mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition duration-300",
              inStock
                ? added
                  ? "bg-[color:var(--allmart-green)] text-white shadow-[0_10px_24px_rgba(20,184,106,0.28)]"
                  : "btn-float bg-[color:var(--allmart-orange)] text-white"
                : "cursor-not-allowed bg-zinc-100 text-zinc-400 shadow-none",
            ].join(" ")}
          >
            {added ? (
              <>
                <CheckIcon />
                Added
              </>
            ) : inStock ? (
              <>
                <CartIcon />
                Add to cart
              </>
            ) : (
              "Out of stock"
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 21s-6.7-4.35-9.33-7.7C.5 10.55 1.1 6.8 4.05 5.2c1.85-1 4.1-.55 5.45 1.05C10.85 4.65 13.1 4.2 14.95 5.2c2.95 1.6 3.55 5.35 1.38 8.1C18.7 16.65 12 21 12 21Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 5h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
