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
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-[0_6px_20px_rgba(17,17,17,0.04)] transition duration-400 hover:-translate-y-1 hover:border-[color:var(--allmart-orange)]/25 hover:shadow-[0_20px_48px_rgba(17,17,17,0.1)] sm:rounded-2xl sm:shadow-[0_8px_30px_rgba(17,17,17,0.04)]">
      <button
        type="button"
        onClick={onWishlist}
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wished}
        className={[
          "absolute right-1.5 top-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full shadow-sm backdrop-blur transition duration-300 sm:right-2.5 sm:top-2.5 sm:h-9 sm:w-9",
          wished
            ? "scale-105 bg-rose-500 text-white"
            : "bg-white/95 text-zinc-500 hover:scale-105 hover:text-rose-500",
        ].join(" ")}
      >
        <HeartIcon filled={wished} />
      </button>

      <Link href={`/product/${product.id}`} className="relative block min-w-0">
        <div className="relative aspect-square overflow-hidden bg-zinc-50">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              unoptimized={isSvg}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgBroken(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-[10px] font-semibold text-zinc-400 sm:text-xs">
              No image
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition group-hover:opacity-100 sm:h-16" />

          <div className="absolute left-1.5 top-1.5 flex max-w-[70%] flex-col gap-1 sm:left-2.5 sm:top-2.5 sm:gap-1.5">
            {inStock ? (
              <span
                className={[
                  "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm sm:rounded-md sm:px-2 sm:py-1 sm:text-[10px]",
                  lowStock ? "bg-amber-500" : "bg-[color:var(--allmart-green)]",
                ].join(" ")}
              >
                {lowStock ? "Low" : "In stock"}
              </span>
            ) : (
              <span className="rounded bg-zinc-800/85 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm sm:rounded-md sm:px-2 sm:py-1 sm:text-[10px]">
                Sold out
              </span>
            )}
          </div>

          <span className="absolute bottom-1.5 left-1.5 hidden max-w-[calc(100%-0.75rem)] truncate rounded bg-white/95 px-1.5 py-0.5 text-[9px] font-bold text-zinc-600 shadow-sm backdrop-blur sm:bottom-auto sm:left-auto sm:right-2.5 sm:top-12 sm:block sm:rounded-md sm:px-2 sm:py-1 sm:text-[10px]">
            {product.category.split(" ")[0]}
          </span>

          <span className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-2 rounded-full bg-white/95 py-2 text-center text-[11px] font-bold text-zinc-800 opacity-0 shadow-md backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
            View details
          </span>
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-4">
        <Link href={`/product/${product.id}`} className="min-w-0">
          <h3 className="line-clamp-2 text-[12px] font-bold leading-snug text-zinc-900 transition group-hover:text-[color:var(--allmart-orange)] sm:text-sm">
            {product.name}
          </h3>
          <p className="mt-0.5 hidden line-clamp-1 text-xs text-zinc-500 sm:mt-1 sm:block">{product.description}</p>
        </Link>

        <div className="mt-auto pt-2 sm:pt-3">
          <div className="flex items-end justify-between gap-1.5">
            <div className="min-w-0">
              <div className="truncate text-[13px] font-extrabold tracking-tight text-zinc-900 sm:text-lg">
                {formatEtb(product.priceEtb)}
              </div>
              <div className="mt-0.5 text-[10px] font-medium text-zinc-500 sm:text-[11px]">
                {inStock ? (
                  <span className={lowStock ? "text-amber-600" : "text-[color:var(--allmart-green)]"}>
                    <span className="sm:hidden">{stock} left</span>
                    <span className="hidden sm:inline">{stock} left at branch</span>
                  </span>
                ) : (
                  <span className="text-zinc-400">Unavailable</span>
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
              "mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-[11px] font-extrabold transition duration-300 sm:mt-3 sm:h-11 sm:gap-2 sm:rounded-xl sm:text-sm",
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
                <span className="sm:hidden">Added</span>
                <span className="hidden sm:inline">Added</span>
              </>
            ) : inStock ? (
              <>
                <CartIcon />
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add to cart</span>
              </>
            ) : (
              <>
                <span className="sm:hidden">Sold out</span>
                <span className="hidden sm:inline">Out of stock</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" aria-hidden>
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
    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
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
