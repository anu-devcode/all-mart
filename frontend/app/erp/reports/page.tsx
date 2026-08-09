"use client";

import React, { useMemo } from "react";
import { RequirePermission } from "@/components/rbac/RequirePermission";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { formatEtb } from "@/lib/format";

function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(0, ...values);
  return (
    <div className="mt-4 max-w-full overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch]">
      <div className="flex min-w-0 items-end gap-2">
        {values.map((v, idx) => {
          const h = max === 0 ? 0 : Math.round((v / max) * 120);
          return (
            <div key={idx} className="min-w-[46px] text-center">
              <div
                className="rounded-lg bg-[color:var(--allmart-orange)]/20"
                style={{ height: h || 10 }}
                title={`${labels[idx]}: ${formatEtb(v)}`}
              />
              <div className="mt-2 text-[10px] font-bold text-zinc-500">{labels[idx]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ErpReportsPage() {
  const { orders } = useAllMart();

  const completedRevenue = useMemo(
    () => orders.filter((o) => o.status === "Completed").reduce((sum, o) => sum + o.totalEtb, 0),
    [orders],
  );
  const pendingCount = useMemo(() => orders.filter((o) => o.status === "Pending").length, [orders]);

  const { labels, values } = useMemo(() => {
    const days = 7;
    const now = new Date();
    const points = Array.from({ length: days }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().slice(0, 10);
      return { key, value: 0 };
    });

    const byKey = new Map(points.map((p) => [p.key, p.value]));

    for (const o of orders) {
      const key = new Date(o.placedAtIso).toISOString().slice(0, 10);
      if (byKey.has(key)) {
        byKey.set(key, (byKey.get(key) ?? 0) + o.totalEtb);
      }
    }

    const finalValues = points.map((p) => byKey.get(p.key) ?? 0);
    const finalLabels = points.map((p) => p.key.slice(5)); // MM-DD

    return { labels: finalLabels, values: finalValues };
  }, [orders]);

  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.totalEtb, 0), [orders]);

  return (
    <RequirePermission permission="reports">
      <div className="space-y-5">
        <div>
          <div className="text-sm font-semibold text-zinc-500">Reports & Analytics</div>
          <div className="mt-1 text-xl font-extrabold text-zinc-900">Sales analytics</div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="text-xs font-semibold text-zinc-500">Total Revenue</div>
            <div className="mt-1 text-2xl font-extrabold text-zinc-900">{formatEtb(totalRevenue)}</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="text-xs font-semibold text-zinc-500">Completed Revenue</div>
            <div className="mt-1 text-2xl font-extrabold text-zinc-900">{formatEtb(completedRevenue)}</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="text-xs font-semibold text-zinc-500">Pending Orders</div>
            <div className="mt-1 text-2xl font-extrabold text-zinc-900">{pendingCount}</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="text-xs font-semibold text-zinc-500">Orders (count)</div>
            <div className="mt-1 text-2xl font-extrabold text-zinc-900">{orders.length}</div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold text-zinc-900">Revenue (last 7 days)</div>
            <div className="text-xs font-semibold text-zinc-500">Mock chart</div>
          </div>
          <BarChart values={values} labels={labels} />
        </div>
      </div>
    </RequirePermission>
  );
}

