"use client";

import React, { useMemo, useState } from "react";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/erp/StatusBadges";
import { RequirePermission } from "@/components/rbac/RequirePermission";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { formatEtb, formatShortDate } from "@/lib/format";
import {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  paymentMethodLabel,
  type PaymentMethod,
  type PaymentStatus,
} from "@/lib/types";

export default function ErpPaymentsPage() {
  const { orders, branches, updatePaymentStatus, updateOrderPaymentMethod, updateOrderStatus } =
    useAllMart();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("all");
  const [methodFilter, setMethodFilter] = useState<"all" | PaymentMethod>("all");

  const stats = useMemo(() => {
    const paid = orders.filter((o) => o.paymentStatus === "Paid");
    const unpaid = orders.filter((o) => o.paymentStatus === "Unpaid");
    const refunded = orders.filter((o) => o.paymentStatus === "Refunded");
    const failed = orders.filter((o) => o.paymentStatus === "Failed");
    return {
      collected: paid.reduce((s, o) => s + o.totalEtb, 0),
      outstanding: unpaid.reduce((s, o) => s + o.totalEtb, 0),
      refunded: refunded.reduce((s, o) => s + o.totalEtb, 0),
      failedCount: failed.length,
      paidCount: paid.length,
      unpaidCount: unpaid.length,
    };
  }, [orders]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .slice()
      .sort((a, b) => b.updatedAtIso.localeCompare(a.updatedAtIso))
      .filter((o) => {
        if (statusFilter !== "all" && o.paymentStatus !== statusFilter) return false;
        if (methodFilter !== "all" && o.paymentMethod !== methodFilter) return false;
        if (!q) return true;
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.toLowerCase().includes(q)
        );
      });
  }, [orders, query, statusFilter, methodFilter]);

  function branchName(id: string) {
    return branches.find((b) => b.id === id)?.name.replace("All Mart ", "") ?? "—";
  }

  return (
    <RequirePermission permission="payments">
      <div className="space-y-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
            Finance
          </p>
          <h1 className="mt-1 text-xl font-extrabold text-zinc-900 md:text-2xl">Payments</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Simulate Telebirr, Chapa, card, and cash-on-pickup settlements for every order.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Collected",
              value: formatEtb(stats.collected),
              hint: `${stats.paidCount} paid orders`,
              tone: "text-emerald-700 bg-emerald-50",
            },
            {
              label: "Outstanding",
              value: formatEtb(stats.outstanding),
              hint: `${stats.unpaidCount} unpaid`,
              tone: "text-amber-800 bg-amber-50",
            },
            {
              label: "Refunded",
              value: formatEtb(stats.refunded),
              hint: "Returned to customer",
              tone: "text-purple-800 bg-purple-50",
            },
            {
              label: "Failed",
              value: String(stats.failedCount),
              hint: "Needs retry / cash",
              tone: "text-rose-700 bg-rose-50",
            },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${card.tone}`}>
                {card.label}
              </div>
              <div className="mt-3 text-2xl font-extrabold text-zinc-900">{card.value}</div>
              <div className="mt-1 text-xs text-zinc-500">{card.hint}</div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search payment by customer or order…"
            className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-[color:var(--allmart-orange)] focus:ring-4 focus:ring-[color:var(--allmart-orange)]/15"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | PaymentStatus)}
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none"
          >
            <option value="all">All statuses</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as "all" | PaymentMethod)}
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none"
          >
            <option value="all">All methods</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {paymentMethodLabel[m]}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Order status</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Controls</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id} className="border-b border-zinc-50 last:border-0 hover:bg-orange-50/30">
                    <td className="px-4 py-3.5 font-extrabold text-zinc-900">{o.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-zinc-800">{o.customerName}</div>
                      <div className="text-[11px] text-zinc-400">{o.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-zinc-600">{branchName(o.branchId)}</td>
                    <td className="px-4 py-3.5">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={o.paymentMethod}
                        onChange={(e) =>
                          updateOrderPaymentMethod(o.id, e.target.value as PaymentMethod)
                        }
                        className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs font-bold text-zinc-700 outline-none"
                      >
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m} value={m}>
                            {paymentMethodLabel[m]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5">
                      <PaymentStatusBadge status={o.paymentStatus} />
                    </td>
                    <td className="px-4 py-3.5 text-zinc-500">{formatShortDate(o.updatedAtIso)}</td>
                    <td className="px-4 py-3.5 text-right font-extrabold text-zinc-900">
                      {formatEtb(o.totalEtb)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {o.paymentStatus !== "Paid" && (
                          <button
                            type="button"
                            onClick={() => updatePaymentStatus(o.id, "Paid")}
                            className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-extrabold text-white"
                          >
                            Mark paid
                          </button>
                        )}
                        {o.paymentStatus === "Unpaid" && (
                          <button
                            type="button"
                            onClick={() => updatePaymentStatus(o.id, "Failed")}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-extrabold text-rose-700"
                          >
                            Failed
                          </button>
                        )}
                        {o.paymentStatus === "Paid" && (
                          <button
                            type="button"
                            onClick={() => {
                              updatePaymentStatus(o.id, "Refunded");
                              if (o.status !== "Cancelled") updateOrderStatus(o.id, "Cancelled");
                            }}
                            className="rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-[11px] font-extrabold text-purple-800"
                          >
                            Refund
                          </button>
                        )}
                        {o.paymentStatus === "Failed" && (
                          <button
                            type="button"
                            onClick={() => updatePaymentStatus(o.id, "Unpaid")}
                            className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[11px] font-extrabold text-zinc-700"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-sm font-semibold text-zinc-500">
                      No payments match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          Prototype: payments are simulated locally. Marking paid can auto-confirm pending orders; refunds cancel the
          order and restore branch stock.
        </p>
      </div>
    </RequirePermission>
  );
}
