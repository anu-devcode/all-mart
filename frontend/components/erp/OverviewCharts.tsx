"use client";

import React, { useId, useMemo, useState } from "react";
import { formatEtb } from "@/lib/format";

type Point = { label: string; value: number };

/** Lightweight SVG line chart — no chart library. */
export function RevenueLineChart({
  points,
  height = 220,
}: {
  points: Point[];
  height?: number;
}) {
  const gradId = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);

  const { path, area, dots, max, min } = useMemo(() => {
    const values = points.map((p) => p.value);
    const maxV = Math.max(...values, 1);
    const minV = Math.min(...values, 0);
    const pad = (maxV - minV) * 0.12 || maxV * 0.08;
    const top = maxV + pad;
    const bottom = Math.max(0, minV - pad);
    const span = top - bottom || 1;
    const w = 100;
    const h = 100;
    const coords = points.map((p, i) => {
      const x = points.length === 1 ? 50 : (i / (points.length - 1)) * w;
      const y = h - ((p.value - bottom) / span) * h;
      return { x, y, ...p };
    });
    const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`).join(" ");
    const areaPath = `${line} L ${coords[coords.length - 1]?.x ?? 0} ${h} L ${coords[0]?.x ?? 0} ${h} Z`;
    return { path: line, area: areaPath, dots: coords, max: top, min: bottom };
  }, [points]);

  return (
    <div className="relative">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
        role="img"
        aria-label="Revenue over time"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`rev-fill-${gradId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF6A00" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={`rev-stroke-${gradId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF8A3D" />
            <stop offset="100%" stopColor="#FF6A00" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="#e4e4e7"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path d={area} fill={`url(#rev-fill-${gradId})`} />
        <path
          d={path}
          fill="none"
          stroke={`url(#rev-stroke-${gradId})`}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {dots.map((d, i) => (
          <g key={d.label}>
            <circle
              cx={d.x}
              cy={d.y}
              r={hover === i ? 2.2 : 1.4}
              fill="#FF6A00"
              stroke="#fff"
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
              className="transition-[r] duration-200"
            />
            <rect
              x={d.x - (100 / Math.max(points.length, 1)) / 2}
              y="0"
              width={100 / Math.max(points.length, 1)}
              height="100"
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          </g>
        ))}
      </svg>

      <div className="mt-2 flex justify-between gap-1 px-0.5">
        {points.map((p, i) => (
          <span
            key={p.label}
            className={[
              "flex-1 truncate text-center text-[10px] font-semibold",
              hover === i ? "text-[color:var(--allmart-orange)]" : "text-zinc-400",
            ].join(" ")}
          >
            {p.label}
          </span>
        ))}
      </div>

      {hover != null && points[hover] ? (
        <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs shadow-lg">
          <span className="font-bold text-zinc-900">{formatEtb(points[hover].value)}</span>
          <span className="ml-2 text-zinc-500">{points[hover].label}</span>
        </div>
      ) : null}

      <div className="sr-only">
        Max {formatEtb(max)}, min {formatEtb(min)}
      </div>
    </div>
  );
}

export function BranchCompareChart({
  rows,
}: {
  rows: Array<{ id: string; name: string; revenue: number; orders: number; share: number }>;
}) {
  const max = Math.max(1, ...rows.map((r) => r.revenue));
  const tones = ["#FF6A00", "#0EA5E9", "#10B981"];

  return (
    <div className="space-y-4">
      {rows.map((r, i) => (
        <div key={r.id} className="group">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: tones[i % tones.length] }}
              />
              <span className="truncate text-sm font-extrabold text-zinc-900">
                {r.name.replace("All Mart ", "")}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-extrabold text-zinc-900">{formatEtb(r.revenue)}</div>
              <div className="text-[10px] font-semibold text-zinc-500">
                {r.orders} orders · {r.share}%
              </div>
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:brightness-110"
              style={{
                width: `${Math.max(4, Math.round((r.revenue / max) * 100))}%`,
                background: `linear-gradient(90deg, ${tones[i % tones.length]}, ${tones[i % tones.length]}CC)`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
