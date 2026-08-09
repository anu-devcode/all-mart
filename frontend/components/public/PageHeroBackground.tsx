"use client";

import React from "react";
import { Reveal } from "@/components/motion/Reveal";

/** High-quality Unsplash retail photography (local copies). */
export const brandAssets = {
  logo: "/assets/logo.png",
  hero: "/assets/hq/hero-produce.jpg",
  aisle: "/assets/hq/aisle-bright.jpg",
  produceMarket: "/assets/hq/produce-market.jpg",
  shelves: "/assets/hq/shelves.jpg",
  citrus: "/assets/hq/citrus.jpg",
  freshFruit: "/assets/hq/fresh-fruit.jpg",
  vegetables: "/assets/hq/vegetables.jpg",
  beverages: "/assets/hq/beverages.jpg",
  household: "/assets/hq/household.jpg",
  snacks: "/assets/hq/snacks.jpg",
  personalCare: "/assets/hq/personal-care.jpg",
  packedFood: "/assets/hq/packed-food.jpg",
  teamShop: "/assets/hq/team-shop.jpg",
  branch: "/assets/hq/branch.jpg",
  // Legacy aliases used across pages
  designBoard: "/assets/hq/produce-market.jpg",
  team: "/assets/hq/team-shop.jpg",
  aisleContact: "/assets/hq/aisle-bright.jpg",
  shelfStaff: "/assets/hq/shelves.jpg",
  buildingExterior: "/assets/hq/branch.jpg",
  storeInterior: "/assets/hq/aisle-bright.jpg",
  storeAtrium: "/assets/hq/hero-produce.jpg",
  promoCategories: "/assets/hq/citrus.jpg",
  storefront: "/assets/hq/shelves.jpg",
  erpReference: "/assets/erp-dashboard-reference.png",
} as const;

export const categoryImages: Record<string, string> = {
  "Fresh & Vegetables": brandAssets.vegetables,
  "Packed Food": brandAssets.packedFood,
  Household: brandAssets.household,
  "Personal Care": brandAssets.personalCare,
  Beverages: brandAssets.beverages,
  "Snacks & Food": brandAssets.snacks,
  "Bakery & Dairy": brandAssets.freshFruit,
};

export const categoryIcons: Record<string, string> = {
  "Fresh & Vegetables": "🥬",
  Beverages: "🧃",
  "Snacks & Food": "🍿",
  Household: "🧹",
  "Personal Care": "🧴",
  "Bakery & Dairy": "🥖",
  "Packed Food": "🥫",
};

export type BrandAssetKey = keyof typeof brandAssets;

/**
 * Page title band — sits over the site-wide sticky background (no local image).
 */
export function PageHeroBackground({
  children,
  className = "",
  minHeightClassName = "min-h-[280px] md:min-h-[340px]",
  // Kept for call-site compatibility; sticky scene owns imagery now.
  src: _src,
  alt: _alt,
  overlayClassName: _overlay,
}: {
  src?: string;
  alt?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
  className?: string;
  minHeightClassName?: string;
}) {
  void _src;
  void _alt;
  void _overlay;

  return (
    <section className={`relative min-w-0 max-w-full overflow-x-clip ${minHeightClassName} ${className}`}>
      <div className="relative z-10 mx-auto flex h-full w-full min-w-0 max-w-6xl items-end px-4 pb-12 pt-36 sm:pt-40 md:pb-16 md:pt-44">
        <Reveal variant="up">
          <div className="min-w-0 w-full">{children}</div>
        </Reveal>
      </div>
    </section>
  );
}
