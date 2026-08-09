"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

/**
 * Soft page enter animation on route change.
 * Header/footer stay mounted; only main content remounts with the key.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    // Nudge scroll to top smoothly on navigation (App Router may already do this)
    const y = window.scrollY;
    if (y > 8) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, reduced]);

  return (
    <div key={pathname} className={reduced ? undefined : "page-transition"}>
      {!reduced && <div className="page-progress" aria-hidden />}
      {children}
    </div>
  );
}
