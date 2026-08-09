"use client";

import React, { useMemo, useState } from "react";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { PageHeroBackground, brandAssets } from "@/components/public/PageHeroBackground";
import { BranchSelectCard } from "@/components/public/BranchSelectCard";
import { BranchBulletin } from "@/components/branches/BranchBulletin";
import { Reveal } from "@/components/motion/Reveal";
import { SectionShell } from "@/components/motion/SectionShell";
import { isBranchOpen } from "@/lib/branchHours";

export default function BranchesPage() {
  const { branches, activeBranchId, orders } = useAllMart();
  const active = branches.find((b) => b.id === activeBranchId);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  const openCount = useMemo(() => branches.filter((b) => isBranchOpen(b)).length, [branches]);
  const closedCount = branches.length - openCount;

  const popularBranchId = useMemo(() => {
    const tally = new Map<string, number>();
    for (const o of orders) tally.set(o.branchId, (tally.get(o.branchId) ?? 0) + 1);
    let best = branches[0]?.id ?? "";
    let max = -1;
    for (const b of branches) {
      const n = tally.get(b.id) ?? 0;
      if (n > max) {
        max = n;
        best = b.id;
      }
    }
    // Default popular to Bole when ties / empty
    return max <= 0 ? "b-bole" : best;
  }, [orders, branches]);

  const branchImages = [brandAssets.branch, brandAssets.shelves, brandAssets.aisle];

  const visible = useMemo(() => {
    return branches.filter((b) => {
      const open = isBranchOpen(b);
      if (filter === "open") return open;
      if (filter === "closed") return !open;
      return true;
    });
  }, [branches, filter]);

  return (
    <div className="pb-20">
      <PageHeroBackground src={brandAssets.buildingExterior} alt="All Mart building">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange-soft)]">
            Shopping flow · Step 1
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Choose your branch
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
            Lock stock and cart to one Addis Ababa store. Pickup is free and usually ready in about 15 minutes after
            checkout.
            {active ? ` You’re currently set to ${active.name}.` : ""}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              {openCount} open now
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-lg">
              <span className="h-2 w-2 rounded-full bg-white" />
              {closedCount} closed
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
              ⏱ ~15 min pickup
            </span>
          </div>
        </div>
      </PageHeroBackground>

      <SectionShell className="section-panel surface-panel relative -mt-6 px-4 pb-4 pt-10 md:pt-12">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal variant="fade">
            <BranchBulletin />
          </Reveal>
        </div>
      </SectionShell>

      <div className="surface-panel relative px-4 py-10 md:py-12">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal variant="fade">
            <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_auto]">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:p-5">
                <div className="text-sm font-extrabold text-zinc-900">How pickup works</div>
                <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {[
                    { n: "1", t: "Select branch", d: "Stock locks to that store" },
                    { n: "2", t: "Add to cart", d: "Only live availability" },
                    { n: "3", t: "Checkout & collect", d: "Ready in ~15 minutes" },
                  ].map((s) => (
                    <li key={s.n} className="flex gap-3 rounded-xl bg-zinc-50 px-3 py-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--allmart-orange)] text-xs font-extrabold text-white">
                        {s.n}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-zinc-900">{s.t}</div>
                        <div className="text-xs text-zinc-500">{s.d}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
                {(
                  [
                    { id: "all", label: "All branches" },
                    { id: "open", label: "Open now" },
                    { id: "closed", label: "Closed" },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={[
                      "rounded-full px-4 py-2.5 text-xs font-extrabold transition",
                      filter === f.id
                        ? "bg-[color:var(--allmart-orange)] text-white"
                        : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((b) => {
              const idx = branches.findIndex((x) => x.id === b.id);
              return (
                <Reveal key={b.id} delay={(Math.min(Math.max(idx, 0), 3) as 0 | 1 | 2 | 3)} variant="up">
                  <BranchSelectCard
                    branch={b}
                    imageSrc={branchImages[idx % branchImages.length]}
                    tone="light"
                    popular={b.id === popularBranchId}
                  />
                </Reveal>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
              No branches match this filter right now.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
