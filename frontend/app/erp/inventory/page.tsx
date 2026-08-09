"use client";

import React, { useMemo, useState } from "react";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { RequirePermission } from "@/components/rbac/RequirePermission";
import { StockEditor } from "@/components/erp/StockEditor";

function Badge({ tone, children }: { tone: "orange" | "green" | "zinc"; children: React.ReactNode }) {
  const cls =
    tone === "green"
      ? "bg-[color:var(--allmart-green)]/15 text-[color:var(--allmart-green)]"
      : tone === "orange"
        ? "bg-[color:var(--allmart-orange)]/15 text-[color:var(--allmart-orange)]"
        : "bg-zinc-100 text-zinc-600";
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-bold ${cls}`}>{children}</span>
  );
}

export default function ErpInventoryPage() {
  const { products, branches, activeBranchId, upsertProduct } = useAllMart();

  const shelfCodes = useMemo(() => {
    const set = new Set(products.map((p) => p.shelfCode).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const [selectedShelfCode, setSelectedShelfCode] = useState<string | null>(shelfCodes[0] ?? null);
  const effectiveSelectedShelfCode = selectedShelfCode && shelfCodes.includes(selectedShelfCode) ? selectedShelfCode : shelfCodes[0] ?? null;

  const productsOnShelf = useMemo(() => {
    if (!effectiveSelectedShelfCode) return [];
    return products.filter((p) => p.shelfCode === effectiveSelectedShelfCode && p.isActive);
  }, [products, effectiveSelectedShelfCode]);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(productsOnShelf[0]?.id ?? null);
  const effectiveSelectedProductId =
    selectedProductId && productsOnShelf.some((p) => p.id === selectedProductId) ? selectedProductId : productsOnShelf[0]?.id ?? null;

  const selectedProduct = useMemo(() => products.find((p) => p.id === effectiveSelectedProductId) ?? null, [products, effectiveSelectedProductId]);

  const lowStockThreshold = 2;
  const lowStockProducts = useMemo(() => {
    return products
      .filter((p) => p.isActive)
      .map((p) => ({ p, stock: p.stockByBranch[activeBranchId] ?? 0 }))
      .filter((x) => x.stock > 0 && x.stock <= lowStockThreshold)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 6);
  }, [products, activeBranchId]);

  return (
    <RequirePermission permission="inventory">
      <div className="space-y-5">
        <div>
          <div className="text-sm font-semibold text-zinc-500">Inventory Management</div>
          <div className="mt-1 text-xl font-extrabold text-zinc-900">Stock levels & shelf mapping concept</div>
          <div className="mt-1 text-sm text-zinc-600">
            Low stock alerts for active branch are calculated from mock product stock.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-zinc-900">Shelf / Storage Map</div>
              <div className="text-xs font-semibold text-zinc-500">Click shelf to filter</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {shelfCodes.map((code) => {
                const count = products.filter((p) => p.shelfCode === code && p.isActive).length;
                const isSelected = code === effectiveSelectedShelfCode;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedShelfCode(code)}
                    className={[
                      "rounded-xl border p-3 text-left transition",
                      isSelected ? "border-[color:var(--allmart-orange)] bg-[color:var(--allmart-orange)]/10" : "border-zinc-200 bg-white hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    <div className="text-sm font-extrabold text-zinc-900">{code}</div>
                    <div className="mt-1 text-xs font-bold text-zinc-500">{count} products</div>
                  </button>
                );
              })}
              {shelfCodes.length === 0 && (
                <div className="col-span-3 rounded-xl border border-dashed border-zinc-200 p-8 text-center text-sm font-semibold text-zinc-500">
                  No shelf data
                </div>
              )}
            </div>

            <div className="mt-5">
              <div className="text-sm font-extrabold text-zinc-900">Low Stock Alerts</div>
              <div className="mt-3 space-y-3">
                {lowStockProducts.length === 0 ? (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-600">
                    No low stock items for this branch.
                  </div>
                ) : (
                  lowStockProducts.map(({ p, stock }) => (
                    <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-extrabold text-zinc-900">{p.name}</div>
                        <div className="mt-1 text-xs text-zinc-500">{p.shelfCode}</div>
                      </div>
                      <Badge tone="orange">{stock} left</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-extrabold text-zinc-900">Stock Editor</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Selected shelf: <span className="font-extrabold text-zinc-800">{effectiveSelectedShelfCode ?? "-"}</span>
                </div>
              </div>
              <div className="text-xs font-semibold text-zinc-500">
                Active branch actions update mock inventory immediately.
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-zinc-500">Product on shelf</label>
              <select
                value={effectiveSelectedProductId ?? ""}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                disabled={productsOnShelf.length === 0}
              >
                {productsOnShelf.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {!selectedProduct ? (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm font-semibold text-zinc-600">
                Select a shelf with products to edit stock.
              </div>
            ) : (
              <StockEditor
                key={selectedProduct.id}
                product={selectedProduct}
                branches={branches}
                activeBranchId={activeBranchId}
                onSaveStockByBranch={(nextStockByBranch) => {
                  upsertProduct({ ...selectedProduct, stockByBranch: nextStockByBranch });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}

