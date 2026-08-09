"use client";

import React, { useMemo, useState } from "react";
import {
  OrderStatusBadge,
  PaymentMethodChip,
  PaymentStatusBadge,
  nextOrderStatuses,
} from "@/components/erp/StatusBadges";
import { RequirePermission } from "@/components/rbac/RequirePermission";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { formatEtb, formatShortDate } from "@/lib/format";
import {
  ORDER_STATUSES,
  paymentMethodLabel,
  type Order,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/types";

export default function ErpOrdersPage() {
  const {
    orders,
    branches,
    products,
    updateOrderStatus,
    updatePaymentStatus,
    updateOrderNotes,
  } = useAllMart();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [branchFilter, setBranchFilter] = useState<"all" | string>("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | PaymentStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: orders.length };
    for (const s of ORDER_STATUSES) base[s] = 0;
    for (const o of orders) base[o.status] = (base[o.status] ?? 0) + 1;
    return base;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .slice()
      .sort((a, b) => b.placedAtIso.localeCompare(a.placedAtIso))
      .filter((o) => {
        if (statusFilter !== "all" && o.status !== statusFilter) return false;
        if (branchFilter !== "all" && o.branchId !== branchFilter) return false;
        if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) return false;
        if (!q) return true;
        const branch = branches.find((b) => b.id === o.branchId)?.name ?? "";
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.toLowerCase().includes(q) ||
          branch.toLowerCase().includes(q)
        );
      });
  }, [orders, query, statusFilter, branchFilter, paymentFilter, branches]);

  const selected = useMemo(
    () => (selectedId ? orders.find((o) => o.id === selectedId) ?? null : null),
    [orders, selectedId],
  );

  function openOrder(o: Order) {
    setSelectedId(o.id);
    setNotesDraft(o.notes ?? "");
  }

  function branchName(id: string) {
    return branches.find((b) => b.id === id)?.name.replace("All Mart ", "") ?? "—";
  }

  return (
    <RequirePermission permission="orders">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
              Fulfillment
            </p>
            <h1 className="mt-1 text-xl font-extrabold text-zinc-900 md:text-2xl">Order management</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Track pickup orders end-to-end — confirm, prepare, collect, or cancel.
            </p>
          </div>
        </div>

        {/* Status KPI chips */}
        <div className="flex flex-wrap gap-2">
          {(["all", ...ORDER_STATUSES] as const).map((s) => {
            const active = statusFilter === s;
            const label = s === "all" ? "All" : s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition",
                  active
                    ? "bg-[color:var(--allmart-orange)] text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                ].join(" ")}
              >
                {label}
                <span
                  className={[
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    active ? "bg-white/20 text-white" : "bg-white text-zinc-500",
                  ].join(" ")}
                >
                  {counts[s] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer, phone, order ID…"
            className="h-11 min-w-0 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-[color:var(--allmart-orange)] focus:ring-4 focus:ring-[color:var(--allmart-orange)]/15 sm:col-span-2 lg:col-span-1"
          />
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-11 min-w-0 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 outline-none"
          >
            <option value="all">All branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as "all" | PaymentStatus)}
            className="h-11 min-w-0 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 outline-none"
          >
            <option value="all">All payments</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Placed</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const next = nextOrderStatuses(o.status);
                  return (
                    <tr key={o.id} className="border-b border-zinc-50 last:border-0 hover:bg-orange-50/30">
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => openOrder(o)}
                          className="font-extrabold text-zinc-900 hover:text-[color:var(--allmart-orange)]"
                        >
                          {o.id}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-zinc-800">{o.customerName}</div>
                        <div className="text-[11px] text-zinc-400">{o.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-zinc-600">{branchName(o.branchId)}</td>
                      <td className="px-4 py-3.5">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col items-start gap-1">
                          <PaymentStatusBadge status={o.paymentStatus} />
                          <PaymentMethodChip method={o.paymentMethod} />
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-500">{formatShortDate(o.placedAtIso)}</td>
                      <td className="px-4 py-3.5 text-right font-extrabold text-zinc-900">
                        {formatEtb(o.totalEtb)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openOrder(o)}
                            className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[11px] font-bold text-zinc-700 hover:bg-zinc-50"
                          >
                            Details
                          </button>
                          {next.slice(0, 2).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => updateOrderStatus(o.id, s)}
                              className={[
                                "rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold",
                                s === "Cancelled"
                                  ? "border border-rose-200 bg-rose-50 text-rose-700"
                                  : "bg-[color:var(--allmart-orange)] text-white",
                              ].join(" ")}
                            >
                              {s === "Cancelled" ? "Cancel" : s}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm font-semibold text-zinc-500">
                      No orders match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail drawer */}
        {selected ? (
          <div className="fixed inset-0 z-50 flex justify-end">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close details"
              onClick={() => setSelectedId(null)}
            />
            <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
              <div className="sticky top-0 z-10 border-b border-zinc-100 bg-white px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Order</div>
                    <div className="mt-1 text-lg font-extrabold text-zinc-900">{selected.id}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="rounded-lg bg-zinc-100 px-2.5 py-1.5 text-xs font-bold text-zinc-600"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <OrderStatusBadge status={selected.status} />
                  <PaymentStatusBadge status={selected.paymentStatus} />
                </div>
              </div>

              <div className="space-y-5 px-5 py-5">
                <section>
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-400">Customer</div>
                  <div className="mt-1 text-sm font-extrabold text-zinc-900">{selected.customerName}</div>
                  <div className="text-sm text-zinc-500">{selected.customerPhone}</div>
                  <div className="mt-2 text-sm text-zinc-600">
                    Branch: <span className="font-bold">{branchName(selected.branchId)}</span>
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">
                    Placed {formatShortDate(selected.placedAtIso)} · Updated{" "}
                    {formatShortDate(selected.updatedAtIso)}
                  </div>
                </section>

                <section>
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-400">Items</div>
                  <ul className="mt-2 space-y-2">
                    {selected.items.map((it) => {
                      const product = products.find((p) => p.id === it.productId);
                      return (
                        <li
                          key={`${selected.id}-${it.productId}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-zinc-900">
                              {product?.name ?? it.productId}
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              {it.qty} × {formatEtb(it.unitPriceEtb)}
                            </div>
                          </div>
                          <div className="text-sm font-extrabold text-zinc-900">
                            {formatEtb(it.qty * it.unitPriceEtb)}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-[color:var(--allmart-orange)]/10 px-3 py-2.5">
                    <span className="text-sm font-bold text-zinc-700">Total</span>
                    <span className="text-base font-extrabold text-[color:var(--allmart-orange)]">
                      {formatEtb(selected.totalEtb)}
                    </span>
                  </div>
                </section>

                <section>
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-400">Payment</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <PaymentMethodChip method={selected.paymentMethod} />
                    <span className="text-xs text-zinc-500">
                      {paymentMethodLabel[selected.paymentMethod]}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["Unpaid", "Paid", "Failed", "Refunded"] as PaymentStatus[]).map((ps) => (
                      <button
                        key={ps}
                        type="button"
                        disabled={selected.paymentStatus === ps}
                        onClick={() => updatePaymentStatus(selected.id, ps)}
                        className={[
                          "rounded-lg px-3 py-1.5 text-[11px] font-extrabold",
                          selected.paymentStatus === ps
                            ? "bg-zinc-200 text-zinc-500"
                            : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                        ].join(" ")}
                      >
                        Mark {ps}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                    Fulfillment controls
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {nextOrderStatuses(selected.status).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateOrderStatus(selected.id, s)}
                        className={[
                          "rounded-xl px-3.5 py-2 text-xs font-extrabold",
                          s === "Cancelled"
                            ? "border border-rose-200 bg-rose-50 text-rose-700"
                            : "bg-[color:var(--allmart-orange)] text-white",
                        ].join(" ")}
                      >
                        Move to {s}
                      </button>
                    ))}
                    {nextOrderStatuses(selected.status).length === 0 ? (
                      <span className="text-xs text-zinc-500">No further fulfillment actions.</span>
                    ) : null}
                  </div>
                </section>

                <section>
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-400">Staff notes</div>
                  <textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                    placeholder="Pickup instructions, customer preferences…"
                  />
                  <button
                    type="button"
                    onClick={() => updateOrderNotes(selected.id, notesDraft)}
                    className="mt-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-extrabold text-white"
                  >
                    Save notes
                  </button>
                </section>
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </RequirePermission>
  );
}
