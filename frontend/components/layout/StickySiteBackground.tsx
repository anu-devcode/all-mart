"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { brandAssets } from "@/components/public/PageHeroBackground";

/** Prefer calmer, less-busy scenes so content stays readable. */
function sceneForPath(pathname: string): { src: string; alt: string } {
  if (pathname === "/") return { src: brandAssets.aisle, alt: "All Mart aisle" };
  if (pathname.startsWith("/shop") || pathname.startsWith("/product")) {
    return { src: brandAssets.shelves, alt: "Store shelves" };
  }
  if (pathname.startsWith("/branches")) return { src: brandAssets.branch, alt: "All Mart branch" };
  if (pathname.startsWith("/about")) return { src: brandAssets.teamShop, alt: "All Mart team" };
  if (pathname.startsWith("/contact")) return { src: brandAssets.aisle, alt: "Store aisle" };
  if (pathname.startsWith("/cart") || pathname.startsWith("/checkout")) {
    return { src: brandAssets.shelves, alt: "Store shelves" };
  }
  if (pathname.startsWith("/account")) {
    return { src: brandAssets.branch, alt: "All Mart storefront" };
  }
  if (pathname.startsWith("/wishlist")) {
    return { src: brandAssets.freshFruit, alt: "Fresh products" };
  }
  return { src: brandAssets.aisle, alt: "All Mart store" };
}

/**
 * Fixed full-viewport scene — stays still while page content scrolls over it.
 */
export function StickySiteBackground() {
  const pathname = usePathname();
  const scene = useMemo(() => sceneForPath(pathname), [pathname]);

  return (
    <>
      {/* Spacer keeps layout height so content can sit over the fixed layer */}
      <div className="pointer-events-none h-[100svh] w-full" aria-hidden />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0">
          <Image
            key={scene.src}
            src={scene.src}
            alt=""
            fill
            priority
            quality={85}
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[#0c0c0c]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/80 via-[#0c0c0c]/55 to-[#0c0c0c]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/70 via-transparent to-[#0c0c0c]/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,106,0,0.12),transparent_50%)]" />
      </div>
    </>
  );
}
