"use client";

import React, { useState } from "react";
import type { Branch, BranchId, Product } from "@/lib/types";

export function StockEditor({
  product,
  branches,
  activeBranchId,
  onSaveStockByBranch,
}: {
  product: Product;
  branches: Branch[];
  activeBranchId: BranchId;
  onSaveStockByBranch: (nextStockByBranch: Record<string, number>) => void;
}) {
  const [draftStocks, setDraftStocks] = useState<Record<string, number>>(() => ({ ...product.stockByBranch }));

  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-xl bg-zinc-50 p-4">
        <div className="text-sm font-extrabold text-zinc-900">{product.name}</div>
        <div className="mt-1 text-xs text-zinc-500">
          Category: {product.category} · Shelf: {product.shelfCode}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {branches.map((b) => {
          const value = draftStocks[b.id] ?? 0;
          const isActiveBranch = b.id === activeBranchId;
          return (
            <div
              key={b.id}
              className={
                isActiveBranch
                  ? "rounded-xl border border-[color:var(--allmart-orange)] bg-[color:var(--allmart-orange)]/5 p-3"
                  : "rounded-xl border border-zinc-200 bg-white p-3"
              }
            >
              <div className="text-xs font-bold text-zinc-700">{b.name.split(" ").pop()}</div>
              <input
                value={value}
                inputMode="numeric"
                onChange={(e) =>
                  setDraftStocks((d) => ({
                    ...d,
                    [b.id]: Number(e.target.value),
                  }))
                }
                className="mt-2 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          const nextStockByBranch = branches.reduce((acc, b) => {
            acc[b.id] = Math.max(0, Number(draftStocks[b.id]) || 0);
            return acc;
          }, {} as Record<string, number>);
          onSaveStockByBranch(nextStockByBranch);
        }}
        className="w-full rounded-xl bg-[color:var(--allmart-orange)] px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
      >
        Save Stock Changes
      </button>

      <div className="text-xs text-zinc-500">
        Prototype note: shelfCode is a product attribute. In a real system, shelves would be separate entities with many-to-many mapping.
      </div>
    </div>
  );
}

