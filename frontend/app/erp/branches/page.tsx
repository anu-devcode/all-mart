"use client";

import React, { useMemo, useState } from "react";
import { RequirePermission } from "@/components/rbac/RequirePermission";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { formatEtb } from "@/lib/format";
import type { Branch } from "@/lib/types";

export default function ErpBranchesPage() {
  const { branches, orders, upsertBranch, deleteBranch } = useAllMart();
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState<{ name: string; city: string; address: string }>({
    name: "",
    city: "Addis Ababa",
    address: "",
  });

  const revenueByBranch = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of branches) map[b.id] = 0;
    for (const o of orders) map[o.branchId] = (map[o.branchId] ?? 0) + o.totalEtb;
    return map;
  }, [branches, orders]);

  function save() {
    const next: Branch = {
      id: `b-${Date.now()}`,
      name: form.name.trim() || "New Branch",
      city: form.city.trim() || "Addis Ababa",
      address: form.address.trim() || "-",
      openHour: 8,
      closeHour: 20,
    };
    upsertBranch(next);
    setModalOpen(false);
    setForm({ name: "", city: "Addis Ababa", address: "" });
  }

  return (
    <RequirePermission permission="branches">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-zinc-500">Branch Management</div>
            <div className="mt-1 text-xl font-extrabold text-zinc-900">Multi-branch operations</div>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-xl bg-[color:var(--allmart-orange)] px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
          >
            Add Branch
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
          <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="text-left text-xs font-extrabold text-zinc-500">
                  <th className="py-3 pr-3">Branch</th>
                  <th className="py-3 pr-3">City</th>
                  <th className="py-3 pr-3">Address</th>
                  <th className="py-3 pr-3">Revenue</th>
                  <th className="py-3 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {branches.map((b) => (
                  <tr key={b.id} className="border-t border-zinc-100">
                    <td className="py-3 pr-3 font-extrabold text-zinc-900">{b.name}</td>
                    <td className="py-3 pr-3 text-zinc-700">{b.city}</td>
                    <td className="py-3 pr-3 text-zinc-700">{b.address}</td>
                    <td className="py-3 pr-3 font-extrabold text-[color:var(--allmart-orange)]">
                      {formatEtb(revenueByBranch[b.id] ?? 0)}
                    </td>
                    <td className="py-3 pr-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteBranch(b.id)}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-extrabold text-zinc-700 hover:bg-zinc-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {branches.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm font-semibold text-zinc-600">
                      No branches
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-extrabold text-zinc-900">Add Branch</div>
                  <div className="mt-1 text-sm text-zinc-600">Prototype: new branch auto-adds stock keys to products.</div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-extrabold text-zinc-700 hover:bg-zinc-50"
                  type="button"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-zinc-500">Name</div>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-500">City</div>
                  <input
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-500">Address</div>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-800 hover:bg-zinc-50"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="rounded-xl bg-[color:var(--allmart-orange)] px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
                  type="button"
                >
                  Save Branch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequirePermission>
  );
}

