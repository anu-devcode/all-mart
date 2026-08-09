"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import { BranchCompareChart, RevenueLineChart } from "@/components/erp/OverviewCharts";
import { OrderStatusBadge } from "@/components/erp/StatusBadges";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { RequirePermission } from "@/components/rbac/RequirePermission";
import { formatEtb, formatShortDate } from "@/lib/format";

function KpiIcon({ kind }: { kind: "revenue" | "orders" | "products" | "branches" }) {
  const paths: Record<typeof kind, string[]> = {
    revenue: ["M12 3v18", "M17 8H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"],
    orders: ["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"],
    products: [
      "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
      "M3.27 6.96 12 12.01l8.73-5.05",
      "M12 22.08V12",
    ],
    branches: ["M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z", "M12 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"],
  };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      {paths[kind].map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

export default function ErpOverviewPage() {
  const { products, orders, branches } = useAllMart();
  const { staffSession } = useAuth();

  const kpis = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalEtb, 0);
    const totalOrders = orders.length;
    const totalProducts = products.filter((p) => p.isActive).length;
    const activeBranches = branches.length;
    const completed = orders.filter((o) => o.status === "Completed").length;
    return { totalRevenue, totalOrders, totalProducts, activeBranches, completed };
  }, [orders, products, branches]);

  const revenueOverTime = useMemo(() => {
    // Build last 7 day buckets from mock orders; fill gaps for a smooth line
    const days: Array<{ key: string; label: string; value: number }> = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setHours(12, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      days.push({ key, label, value: 0 });
    }
    for (const o of orders) {
      const key = o.placedAtIso.slice(0, 10);
      const bucket = days.find((d) => d.key === key);
      if (bucket) bucket.value += o.totalEtb;
    }
    // Soften empty days with light mock continuity so the chart reads well
    const hasAny = days.some((d) => d.value > 0);
    if (hasAny) {
      let last = days.find((d) => d.value > 0)?.value ?? 0;
      return days.map((d, i) => {
        if (d.value > 0) {
          last = d.value;
          return { label: d.label, value: d.value };
        }
        // gentle bridge for visual continuity (still labelled mock-friendly)
        const bridged = Math.round(last * (0.55 + (i % 3) * 0.08));
        return { label: d.label, value: Math.max(bridged, 40) };
      });
    }
    return days.map((d, i) => ({ label: d.label, value: 120 + i * 35 }));
  }, [orders]);

  const branchPerf = useMemo(() => {
    const map = new Map<string, { revenue: number; orders: number }>();
    for (const b of branches) map.set(b.id, { revenue: 0, orders: 0 });
    for (const o of orders) {
      const row = map.get(o.branchId) ?? { revenue: 0, orders: 0 };
      row.revenue += o.totalEtb;
      row.orders += 1;
      map.set(o.branchId, row);
    }
    const totalRev = Array.from(map.values()).reduce((s, r) => s + r.revenue, 0) || 1;
    return branches
      .map((b) => {
        const row = map.get(b.id) ?? { revenue: 0, orders: 0 };
        return {
          id: b.id,
          name: b.name,
          revenue: row.revenue,
          orders: row.orders,
          share: Math.round((row.revenue / totalRev) * 100),
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [branches, orders]);

  const recentOrders = useMemo(() => {
    const branchName = (id: string) =>
      branches.find((b) => b.id === id)?.name.replace("All Mart ", "") ?? "Branch";
    return [...orders]
      .sort((a, b) => +new Date(b.placedAtIso) - +new Date(a.placedAtIso))
      .slice(0, 8)
      .map((o) => ({
        ...o,
        branchLabel: branchName(o.branchId),
      }));
  }, [orders, branches]);

  const firstName = staffSession?.name?.split(" ")[0] ?? "there";
  const weekTotal = revenueOverTime.reduce((s, p) => s + p.value, 0);

  return (
    <RequirePermission permission="dashboard">
      <div className="space-y-5">
        {/* Header */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
              Overview
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Live snapshot of All Mart retail performance across Addis Ababa.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/erp/orders"
              className="rounded-xl bg-[color:var(--allmart-orange)] px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(255,106,0,0.25)]"
            >
              View orders
            </Link>
            <Link
              href="/erp/reports"
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700"
            >
              Reports
            </Link>
          </div>
        </section>

        {/* KPI cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Revenue",
              value: formatEtb(kpis.totalRevenue),
              hint: "From all mock orders",
              kind: "revenue" as const,
              delta: "+12.4%",
            },
            {
              label: "Total Orders",
              value: String(kpis.totalOrders),
              hint: `${kpis.completed} completed`,
              kind: "orders" as const,
              delta: "+8.1%",
            },
            {
              label: "Total Products",
              value: String(kpis.totalProducts),
              hint: "Active in catalog",
              kind: "products" as const,
              delta: "+3.2%",
            },
            {
              label: "Active Branches",
              value: String(kpis.activeBranches),
              hint: "Addis Ababa locations",
              kind: "branches" as const,
              delta: "Stable",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(17,17,17,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(17,17,17,0.08)]"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[color:var(--allmart-orange)]/5 transition group-hover:bg-[color:var(--allmart-orange)]/10" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    {card.label}
                  </div>
                  <div className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-[1.7rem]">
                    {card.value}
                  </div>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--allmart-orange)]/10 text-[color:var(--allmart-orange)]">
                  <KpiIcon kind={card.kind} />
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs text-zinc-500">{card.hint}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {card.delta}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Revenue line + Branch performance */}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr_1fr]">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(17,17,17,0.04)] md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-zinc-900">Revenue over time</div>
                <div className="mt-0.5 text-xs text-zinc-500">Last 7 days · mock order timeline</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-zinc-900">{formatEtb(weekTotal)}</div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-[color:var(--allmart-orange)]">
                  7-day total
                </div>
              </div>
            </div>
            <div className="mt-4">
              <RevenueLineChart points={revenueOverTime} height={240} />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(17,17,17,0.04)] md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-zinc-900">Branch performance</div>
                <div className="mt-0.5 text-xs text-zinc-500">Compare revenue across locations</div>
              </div>
              <Link
                href="/erp/branches"
                className="text-xs font-bold text-[color:var(--allmart-orange)] hover:underline"
              >
                Manage
              </Link>
            </div>
            <div className="mt-5">
              <BranchCompareChart rows={branchPerf} />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-2 rounded-xl bg-zinc-50 p-3 text-center sm:grid-cols-3">
              {branchPerf.slice(0, 3).map((b) => (
                <div key={b.id}>
                  <div className="truncate text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                    {b.name.replace("All Mart ", "")}
                  </div>
                  <div className="mt-0.5 text-sm font-extrabold text-zinc-900">{b.share}%</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent orders */}
        <section className="min-w-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(17,17,17,0.04)] sm:p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold text-zinc-900">Recent orders</div>
              <div className="mt-0.5 text-xs text-zinc-500">Latest simulated pickups</div>
            </div>
            <Link
              href="/erp/orders"
              className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200"
            >
              See all
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                  <th className="pb-3 pr-3 font-bold">Customer</th>
                  <th className="pb-3 pr-3 font-bold">Branch</th>
                  <th className="pb-3 pr-3 font-bold">Status</th>
                  <th className="pb-3 pr-3 font-bold">Date</th>
                  <th className="pb-3 text-right font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-zinc-50 transition hover:bg-orange-50/40 last:border-0"
                    >
                      <td className="py-3.5 pr-3">
                        <div className="font-extrabold text-zinc-900">{o.customerName}</div>
                        <div className="text-[11px] text-zinc-400">{o.id}</div>
                      </td>
                      <td className="py-3.5 pr-3 font-semibold text-zinc-600">{o.branchLabel}</td>
                      <td className="py-3.5 pr-3">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="py-3.5 pr-3 text-zinc-500">{formatShortDate(o.placedAtIso)}</td>
                      <td className="py-3.5 text-right font-extrabold text-zinc-900">
                        {formatEtb(o.totalEtb)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </RequirePermission>
  );
}
