"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Branch } from "@/lib/types";
import { formatBranchHours, isBranchOpen } from "@/lib/branchHours";
import { useAllMart } from "@/components/providers/AllMartProvider";

/** Compact branch row used in denser layouts. */
export function BranchCard({ branch }: { branch: Branch }) {
  const router = useRouter();
  const { products, activeBranchId, setActiveBranchId } = useAllMart();
  const isActive = branch.id === activeBranchId;
  const open = isBranchOpen(branch);
  const inStockCount = useMemo(
    () => products.filter((p) => p.isActive && (p.stockByBranch[branch.id] ?? 0) > 0).length,
    [products, branch.id],
  );

  return (
    <div
      className={[
        "rounded-2xl border p-4 transition",
        isActive
          ? "border-[color:var(--allmart-orange)] bg-orange-50/80"
          : "border-white/20 bg-white/12 text-white backdrop-blur-xl",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`text-sm font-extrabold ${isActive ? "text-zinc-900" : ""}`}>{branch.name}</div>
          <div className={`mt-1 flex gap-1.5 text-xs ${isActive ? "text-zinc-600" : "text-white/75"}`}>
            <span aria-hidden>📍</span>
            <span>{branch.address}</span>
          </div>
          <div className={`mt-2 flex items-center gap-2 text-[11px] font-semibold ${isActive ? "text-zinc-500" : "text-white/55"}`}>
            <span className={`inline-flex items-center gap-1 ${open ? "text-[color:var(--allmart-green)]" : ""}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-[color:var(--allmart-green)]" : "bg-zinc-400"}`} />
              {open ? "Open" : "Closed"}
            </span>
            <span>· {formatBranchHours(branch)}</span>
          </div>
        </div>
        <div className="rounded-full bg-[color:var(--allmart-orange)] px-3 py-1 text-xs font-bold text-white">
          {inStockCount} items
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveBranchId(branch.id)}
          className={`rounded-xl px-3 py-2 text-xs font-bold ${
            isActive ? "bg-white text-[color:var(--allmart-orange)]" : "bg-white/15 text-white"
          }`}
        >
          {isActive ? "Selected" : "Select this branch"}
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveBranchId(branch.id);
            router.push("/shop");
          }}
          className="rounded-xl bg-[color:var(--allmart-orange)] px-3 py-2 text-xs font-extrabold text-white"
        >
          Shop
        </button>
      </div>
    </div>
  );
}
