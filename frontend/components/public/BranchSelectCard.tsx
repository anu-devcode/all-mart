"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import type { Branch } from "@/lib/types";
import { formatBranchHours, isBranchOpen } from "@/lib/branchHours";
import { useAllMart } from "@/components/providers/AllMartProvider";

type BranchSelectCardProps = {
  branch: Branch;
  imageSrc: string;
  /** light = on frosted panels; dark = over sticky photo scenes */
  tone?: "light" | "dark";
  popular?: boolean;
};

function mapEmbedSrc(branch: Branch) {
  if (branch.lat == null || branch.lng == null) return null;
  const delta = 0.012;
  const left = branch.lng - delta;
  const right = branch.lng + delta;
  const top = branch.lat + delta;
  const bottom = branch.lat - delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${branch.lat}%2C${branch.lng}`;
}

/**
 * Interactive branch picker for the shopping flow.
 */
export function BranchSelectCard({
  branch,
  imageSrc,
  tone = "light",
  popular = false,
}: BranchSelectCardProps) {
  const router = useRouter();
  const { products, activeBranchId, setActiveBranchId } = useAllMart();
  const isActive = branch.id === activeBranchId;
  const open = isBranchOpen(branch);
  const mapSrc = useMemo(() => mapEmbedSrc(branch), [branch]);

  const stockSkus = useMemo(
    () => products.filter((p) => p.isActive && (p.stockByBranch[branch.id] ?? 0) > 0).length,
    [products, branch.id],
  );

  function selectOnly() {
    setActiveBranchId(branch.id);
  }

  function selectAndShop() {
    setActiveBranchId(branch.id);
    router.push("/shop");
  }

  const isDark = tone === "dark";

  return (
    <article
      className={[
        "group flex h-full flex-col overflow-hidden rounded-[1.35rem] border transition duration-500",
        isDark
          ? isActive
            ? "border-[color:var(--allmart-orange)] bg-white/15 ring-2 ring-[color:var(--allmart-orange)]/45 backdrop-blur-md"
            : "border-white/15 bg-white/10 backdrop-blur-md hover:bg-white/14"
          : isActive
            ? "border-[color:var(--allmart-orange)] bg-white shadow-[0_20px_48px_rgba(255,106,0,0.14)] ring-2 ring-[color:var(--allmart-orange)]/30"
            : "border-zinc-200/90 bg-white shadow-[0_12px_32px_rgba(17,17,17,0.06)] hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_20px_44px_rgba(17,17,17,0.1)]",
      ].join(" ")}
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

        <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
          <span
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)]",
              open ? "bg-emerald-500" : "bg-rose-600",
            ].join(" ")}
          >
            <span className="relative flex h-2.5 w-2.5">
              {open ? (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
              ) : null}
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            {open ? "Open now" : "Closed"}
          </span>

          {popular ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-zinc-900 shadow-sm">
              ★ Most popular
            </span>
          ) : null}

          {isActive ? (
            <span className="rounded-full bg-[color:var(--allmart-orange)] px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-sm">
              Selected
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-end justify-between gap-2">
          <div className="rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
            ⏱ Pickup ready in ~15 mins
          </div>
          <div className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-zinc-800 backdrop-blur">
            {stockSkus} in stock
          </div>
        </div>
      </div>

      <div className={`flex flex-1 flex-col p-4 md:p-5 ${isDark ? "text-white" : "text-zinc-900"}`}>
        <h3 className="text-lg font-extrabold tracking-tight">{branch.name}</h3>
        <p className={`mt-1 text-xs font-semibold ${isDark ? "text-white/55" : "text-zinc-400"}`}>
          Free in-store pickup · {branch.city}
        </p>

        <div className={`mt-4 space-y-2.5 text-xs leading-5 ${isDark ? "text-white/75" : "text-zinc-600"}`}>
          <p className="flex gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[color:var(--allmart-orange)]/15 text-[10px]">
              📍
            </span>
            <span>
              {branch.address}
              <span className={isDark ? "text-white/45" : "text-zinc-400"}> · {branch.city}</span>
            </span>
          </p>
          <p className="flex gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[color:var(--allmart-orange)]/15 text-[10px]">
              🕒
            </span>
            <span>
              {formatBranchHours(branch)}
              <span className={open ? " text-emerald-500 font-bold" : " text-rose-500 font-bold"}>
                {" "}
                · {open ? "Open" : "Closed"}
              </span>
            </span>
          </p>
          {branch.phone ? (
            <p className="flex gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[color:var(--allmart-orange)]/15 text-[10px]">
                📞
              </span>
              <span>{branch.phone}</span>
            </p>
          ) : null}
        </div>

        {/* Mini map preview */}
        {mapSrc ? (
          <div
            className={[
              "relative mt-4 overflow-hidden rounded-xl border",
              isDark ? "border-white/15" : "border-zinc-200",
            ].join(" ")}
          >
            <div className="pointer-events-none absolute left-2 top-2 z-[1] rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold text-zinc-700 shadow-sm">
              📍 Map preview
            </div>
            <iframe
              title={`Map of ${branch.name}`}
              src={mapSrc}
              className="h-28 w-full grayscale-[20%] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : null}

        <div className="mt-auto grid grid-cols-1 gap-2 pt-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={selectOnly}
            disabled={isActive}
            className={[
              "rounded-xl px-3 py-2.5 text-sm font-bold transition",
              isActive
                ? isDark
                  ? "cursor-default bg-white/20 text-white"
                  : "cursor-default bg-orange-50 text-[color:var(--allmart-orange)]"
                : isDark
                  ? "border border-white/25 bg-white/10 text-white hover:bg-white/20"
                  : "border border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100",
            ].join(" ")}
          >
            {isActive ? "Selected branch" : "Select this branch"}
          </button>
          <button
            type="button"
            onClick={selectAndShop}
            className="btn-float rounded-xl bg-[color:var(--allmart-orange)] px-3 py-2.5 text-sm font-extrabold text-white"
          >
            Shop this branch
          </button>
        </div>
      </div>
    </article>
  );
}
