"use client";

import React, { useMemo, useState } from "react";
import { RequirePermission } from "@/components/rbac/RequirePermission";
import { useAllMart } from "@/components/providers/AllMartProvider";
import type { Product, ProductCategory } from "@/lib/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold text-zinc-500">{label}</div>
      {children}
    </div>
  );
}

export default function ErpProductsPage() {
  const { products, branches, upsertProduct, deleteProduct, activeBranchId } = useAllMart();
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [form, setForm] = useState<{
    name: string;
    category: ProductCategory | string;
    description: string;
    priceEtb: number;
    shelfCode: string;
    isActive: boolean;
    stockByBranch: Record<string, number>;
  }>({
    name: "",
    category: categories[0] ?? "Fresh & Vegetables",
    description: "",
    priceEtb: 0,
    shelfCode: "A1",
    isActive: true,
    stockByBranch: {},
  });

  function openAdd() {
    const stockByBranch: Record<string, number> = {};
    for (const b of branches) stockByBranch[b.id] = 0;
    setEditing(null);
    setForm({
      name: "",
      category: categories[0] ?? "Fresh & Vegetables",
      description: "",
      priceEtb: 0,
      shelfCode: "A1",
      isActive: true,
      stockByBranch,
    });
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      priceEtb: p.priceEtb,
      shelfCode: p.shelfCode,
      isActive: p.isActive,
      stockByBranch: { ...p.stockByBranch },
    });
    setModalOpen(true);
  }

  const visibleProducts = useMemo(() => products.slice().sort((a, b) => a.name.localeCompare(b.name)), [products]);

  function save() {
    const nextId = editing?.id ?? `p-${Date.now()}`;
    const product: Product = {
      id: nextId,
      name: form.name.trim(),
      category: form.category as ProductCategory,
      description: form.description.trim(),
      priceEtb: Math.max(0, Number(form.priceEtb) || 0),
      shelfCode: form.shelfCode.trim() || "A1",
      isActive: form.isActive,
      // Prototype: keep images optional. Inventory UI is the key.
      imageUrl: editing?.imageUrl,
      stockByBranch: branches.reduce((acc, b) => {
        acc[b.id] = Math.max(0, Number(form.stockByBranch[b.id]) || 0);
        return acc;
      }, {} as Record<string, number>),
    };

    upsertProduct(product);
    setModalOpen(false);
  }

  return (
    <RequirePermission permission="products">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-zinc-500">Products Management</div>
            <div className="mt-1 text-xl font-extrabold text-zinc-900">Add / Edit products</div>
          </div>
          <button
            className="w-full shrink-0 rounded-xl bg-[color:var(--allmart-orange)] px-4 py-3 text-sm font-extrabold text-white hover:opacity-95 sm:w-auto"
            onClick={openAdd}
            type="button"
          >
            Add Product
          </button>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-3 sm:p-4 overflow-hidden">
          <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="text-left text-xs font-extrabold text-zinc-500">
                  <th className="py-3 pr-3">Product</th>
                  <th className="py-3 pr-3">Category</th>
                  <th className="py-3 pr-3">Price</th>
                  <th className="py-3 pr-3">Shelf</th>
                  <th className="py-3 pr-3">Stock (active branch)</th>
                  <th className="py-3 pr-3">Status</th>
                  <th className="py-3 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {visibleProducts.map((p) => {
                  const stock = p.stockByBranch[activeBranchId] ?? 0;
                  return (
                    <tr key={p.id} className="border-t border-zinc-100">
                      <td className="py-3 pr-3 font-extrabold text-zinc-900">{p.name}</td>
                      <td className="py-3 pr-3 text-zinc-700">{p.category}</td>
                      <td className="py-3 pr-3 text-zinc-700">{p.priceEtb.toLocaleString()} ETB</td>
                      <td className="py-3 pr-3 text-zinc-700">{p.shelfCode}</td>
                      <td className="py-3 pr-3">
                        {stock > 0 ? (
                          <span className="rounded-full bg-[color:var(--allmart-green)]/15 px-2 py-1 text-xs font-bold text-[color:var(--allmart-green)]">
                            {stock}
                          </span>
                        ) : (
                          <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-500">0</span>
                        )}
                      </td>
                      <td className="py-3 pr-3">
                        {p.isActive ? (
                          <span className="rounded-full bg-zinc-50 px-2 py-1 text-xs font-bold text-zinc-700">Active</span>
                        ) : (
                          <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-500">Hidden</span>
                        )}
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-extrabold text-zinc-800 hover:bg-zinc-50"
                            type="button"
                            onClick={() => openEdit(p)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-lg bg-zinc-50 px-3 py-2 text-xs font-extrabold text-zinc-700 hover:bg-zinc-100"
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {visibleProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm font-semibold text-zinc-600">
                      No products
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-zinc-500">
            Prototype note: stock and product changes are stored in localStorage only.
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-extrabold text-zinc-900">{editing ? "Edit Product" : "Add Product"}</div>
                  <div className="mt-1 text-sm text-zinc-600">Update category, price, shelf code and per-branch stock.</div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-extrabold text-zinc-700 hover:bg-zinc-50"
                  type="button"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Name">
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Price (ETB)">
                  <input
                    value={form.priceEtb}
                    onChange={(e) => setForm((f) => ({ ...f, priceEtb: Number(e.target.value) }))}
                    inputMode="numeric"
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  />
                </Field>
                <Field label="Shelf Code">
                  <input
                    value={form.shelfCode}
                    onChange={(e) => setForm((f) => ({ ...f, shelfCode: e.target.value }))}
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                    placeholder="e.g. A1"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      rows={3}
                      className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                    />
                  </Field>
                </div>

                <Field label="Active">
                  <select
                    value={form.isActive ? "yes" : "no"}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.value === "yes" }))}
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  >
                    <option value="yes">Active (visible in Shop)</option>
                    <option value="no">Hidden</option>
                  </select>
                </Field>

                <div className="md:col-span-2 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                  <div className="text-sm font-extrabold text-zinc-900">Stock by Branch</div>
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {branches.map((b) => (
                      <div key={b.id}>
                        <div className="text-xs font-bold text-zinc-700">{b.name.split(" ").pop()}</div>
                        <input
                          value={form.stockByBranch[b.id] ?? 0}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              stockByBranch: { ...f.stockByBranch, [b.id]: Number(e.target.value) },
                            }))
                          }
                          inputMode="numeric"
                          className="mt-2 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <button
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-800 hover:bg-zinc-50"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-[color:var(--allmart-orange)] px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
                  type="button"
                  onClick={save}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequirePermission>
  );
}

