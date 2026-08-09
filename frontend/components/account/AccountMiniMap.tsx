"use client";

import React, { useMemo } from "react";
import { osmEmbedSrc, osmOpenUrl } from "@/lib/customerAccount";

/**
 * Lazy OSM embed — only mounts when `active` so inactive tabs stay light.
 */
export function AccountMiniMap({
  lat,
  lng,
  active,
  title = "Map",
  className = "",
}: {
  lat: number;
  lng: number;
  active: boolean;
  title?: string;
  className?: string;
}) {
  const src = useMemo(() => osmEmbedSrc(lat, lng), [lat, lng]);
  const openHref = useMemo(() => osmOpenUrl(lat, lng), [lat, lng]);

  if (!active) {
    return (
      <div
        className={`flex aspect-[16/10] items-center justify-center rounded-xl bg-zinc-100 text-xs font-semibold text-zinc-400 ${className}`}
      >
        Map loads when you open Addresses
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 ${className}`}>
      <iframe
        title={title}
        src={src}
        className="aspect-[16/10] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={openHref}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-zinc-700 shadow-sm hover:bg-white"
      >
        Open map
      </a>
    </div>
  );
}
