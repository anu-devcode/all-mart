"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { formatEtb } from "@/lib/format";
import type { Product, ProductCategory } from "@/lib/types";
import { categoryIcons } from "@/components/public/PageHeroBackground";

const RECENT_KEY = "allmart_recent_searches_v1";
const MAX_RECENT = 6;

const productEmojiHints: Array<{ match: RegExp; emoji: string }> = [
  { match: /banana/i, emoji: "🍌" },
  { match: /apple/i, emoji: "🍎" },
  { match: /milk|margarine|dairy/i, emoji: "🥛" },
  { match: /bread/i, emoji: "🍞" },
  { match: /oil/i, emoji: "🫒" },
  { match: /chips/i, emoji: "🥔" },
  { match: /chocolate/i, emoji: "🍫" },
  { match: /juice/i, emoji: "🧃" },
  { match: /soda/i, emoji: "🥤" },
  { match: /shampoo|derm/i, emoji: "🧴" },
  { match: /tide|wash|detergent/i, emoji: "🧺" },
  { match: /bean/i, emoji: "🫘" },
];

function emojiForProduct(p: Product) {
  for (const h of productEmojiHints) {
    if (h.match.test(p.name)) return h.emoji;
  }
  return categoryIcons[p.category] ?? "🛒";
}

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string").slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecent(term: string) {
  const q = term.trim();
  if (!q) return;
  const next = [q, ...loadRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

type ProductSearchBoxProps = {
  /** Visual tone for navbar over hero vs light surfaces */
  tone?: "nav-top" | "nav-solid" | "light";
  /** Compact for navbar */
  size?: "sm" | "md";
  className?: string;
  initialQuery?: string;
  /** Keep query in local parent (shop page) */
  onQueryChange?: (q: string) => void;
  id?: string;
};

export function ProductSearchBox({
  tone = "light",
  size = "md",
  className = "",
  initialQuery = "",
  onQueryChange,
  id,
}: ProductSearchBoxProps) {
  const router = useRouter();
  const { products, activeBranchId } = useAllMart();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.filter((p) => p.isActive).map((p) => p.category))) as ProductCategory[];
  }, [products]);

  const q = query.trim().toLowerCase();

  const productHits = useMemo(() => {
    if (!q) {
      return products.filter((p) => p.isActive).slice(0, 5);
    }
    return products
      .filter((p) => p.isActive)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [products, q]);

  const categoryHits = useMemo(() => {
    if (!q) return categories.slice(0, 5);
    return categories.filter((c) => c.toLowerCase().includes(q)).slice(0, 5);
  }, [categories, q]);

  type Row =
    | { kind: "recent"; label: string }
    | { kind: "category"; label: ProductCategory }
    | { kind: "product"; product: Product };

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    if (!q && recent.length) {
      for (const r of recent) out.push({ kind: "recent", label: r });
    }
    for (const c of categoryHits) out.push({ kind: "category", label: c });
    for (const p of productHits) out.push({ kind: "product", product: p });
    return out;
  }, [q, recent, categoryHits, productHits]);

  function goSearch(term: string) {
    const cleaned = term.trim();
    if (cleaned) saveRecent(cleaned);
    setRecent(loadRecent());
    setOpen(false);
    setActiveIndex(-1);
    onQueryChange?.(cleaned);
    router.push(cleaned ? `/shop?q=${encodeURIComponent(cleaned)}` : "/shop");
  }

  function goCategory(cat: ProductCategory) {
    saveRecent(cat);
    setRecent(loadRecent());
    setOpen(false);
    setQuery(cat);
    onQueryChange?.(cat);
    router.push(`/shop?category=${encodeURIComponent(cat)}`);
  }

  function goProduct(p: Product) {
    saveRecent(p.name);
    setRecent(loadRecent());
    setOpen(false);
    router.push(`/product/${p.id}`);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && rows[activeIndex]) {
      const row = rows[activeIndex];
      if (row.kind === "recent") goSearch(row.label);
      else if (row.kind === "category") goCategory(row.label);
      else goProduct(row.product);
      return;
    }
    goSearch(query);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!rows.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % rows.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? rows.length - 1 : i - 1));
    }
  }

  const inputH = size === "sm" ? "h-10" : "h-12";
  const btnH = size === "sm" ? "h-8 top-1" : "h-10 top-1";

  const inputTone =
    tone === "nav-top"
      ? "border border-white/25 bg-white/10 text-white placeholder:text-white/50 backdrop-blur-md focus:border-white/50 focus:bg-white/15 focus:ring-4 focus:ring-white/10"
      : tone === "nav-solid"
        ? "border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:border-[color:var(--allmart-orange)] focus:bg-white focus:ring-4 focus:ring-[color:var(--allmart-orange)]/15"
        : "border border-white/25 bg-white/95 text-zinc-900 placeholder:text-zinc-400 focus:border-[color:var(--allmart-orange)] focus:ring-4 focus:ring-[color:var(--allmart-orange)]/20";

  const showEmptyHint = open && !q && !recent.length && !categoryHits.length;

  return (
    <div ref={rootRef} className={`relative min-w-0 max-w-full ${className}`}>
      <form onSubmit={onSubmit} className="relative min-w-0" role="search">
        <label className="sr-only" htmlFor={id ?? listId}>
          Search products
        </label>
        <input
          id={id ?? listId}
          value={query}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${listId}-listbox`}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          onChange={(e) => {
            setQuery(e.target.value);
            onQueryChange?.(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          placeholder="Search banana 🍌, milk 🥛, oil…"
          className={`${inputH} w-full min-w-0 rounded-full py-2 pl-3 pr-12 text-sm outline-none transition sm:pl-4 sm:pr-24 ${inputTone}`}
        />
        <button
          type="submit"
          className={`absolute right-1 ${btnH} flex items-center gap-1.5 rounded-full bg-[color:var(--allmart-orange)] px-2.5 text-xs font-extrabold text-white transition hover:opacity-95 sm:px-3.5`}
        >
          <SearchIcon />
          <span className="hidden sm:inline">Search</span>
          <span className="sr-only sm:hidden">Search</span>
        </button>
      </form>

      {open ? (
        <div
          id={`${listId}-listbox`}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.45rem)] z-[60] max-h-[min(70vh,420px)] w-full overflow-y-auto overscroll-contain rounded-2xl border border-zinc-200 bg-white py-2 shadow-[0_24px_60px_rgba(17,17,17,0.18)]"
        >
          {!q && recent.length > 0 ? (
            <SectionLabel>Recent searches</SectionLabel>
          ) : null}

          {rows.map((row, idx) => {
            const active = idx === activeIndex;
            if (row.kind === "recent") {
              return (
                <button
                  key={`recent-${row.label}`}
                  id={`${listId}-opt-${idx}`}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => goSearch(row.label)}
                  className={[
                    "flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm",
                    active ? "bg-orange-50" : "hover:bg-zinc-50",
                  ].join(" ")}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                    ⏱
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold text-zinc-800">{row.label}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Recent</span>
                </button>
              );
            }

            if (row.kind === "category") {
              const showHeader = idx === 0 || rows[idx - 1]?.kind !== "category";
              return (
                <React.Fragment key={`cat-${row.label}`}>
                  {showHeader ? <SectionLabel>Categories</SectionLabel> : null}
                  <button
                    id={`${listId}-opt-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => goCategory(row.label)}
                    className={[
                      "flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm",
                      active ? "bg-orange-50" : "hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--allmart-orange)]/10 text-base">
                      {categoryIcons[row.label] ?? "🏷️"}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-semibold text-zinc-800">{row.label}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[color:var(--allmart-orange)]">
                      Category
                    </span>
                  </button>
                </React.Fragment>
              );
            }

            const p = row.product;
            const stock = p.stockByBranch[activeBranchId] ?? 0;
            const showHeader = idx === 0 || rows[idx - 1]?.kind !== "product";
            return (
              <React.Fragment key={`prod-${p.id}`}>
                {showHeader ? (
                  <SectionLabel>{q ? "Product suggestions" : "Popular picks"}</SectionLabel>
                ) : null}
                <button
                  id={`${listId}-opt-${idx}`}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => goProduct(p)}
                  className={[
                    "flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm",
                    active ? "bg-orange-50" : "hover:bg-zinc-50",
                  ].join(" ")}
                >
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100">
                    {p.imageUrl ? (
                      <Image src={p.imageUrl} alt="" fill className="object-cover" sizes="36px" />
                    ) : (
                      <span className="text-base">{emojiForProduct(p)}</span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 truncate font-semibold text-zinc-900">
                      <span aria-hidden>{emojiForProduct(p)}</span>
                      {p.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-zinc-500">
                      {p.category} · {stock > 0 ? `${stock} in stock` : "Out here"}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-extrabold text-zinc-800">{formatEtb(p.priceEtb)}</span>
                </button>
              </React.Fragment>
            );
          })}

          {q && rows.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-zinc-500">
              No matches for “{query.trim()}”. Try a category like Fresh or Beverages.
            </div>
          ) : null}

          {showEmptyHint ? (
            <div className="px-4 py-4 text-sm text-zinc-500">Start typing to find products instantly.</div>
          ) : null}

          {q ? (
            <button
              type="button"
              onClick={() => goSearch(query)}
              className="mt-1 flex w-full items-center justify-between border-t border-zinc-100 px-3.5 py-3 text-left text-sm font-bold text-[color:var(--allmart-orange)] hover:bg-orange-50"
            >
              <span>Search all results for “{query.trim()}”</span>
              <span aria-hidden>→</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3.5 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
      {children}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
