"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { StickySiteBackground } from "@/components/layout/StickySiteBackground";
import { PageTransition } from "@/components/motion/PageTransition";

export function RouteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrivatePortal =
    pathname.startsWith("/erp") || pathname.startsWith("/staff") || pathname.startsWith("/admin");
  const isCustomerAuth =
    pathname.startsWith("/account/login") ||
    pathname.startsWith("/account/signup") ||
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/signup" ||
    pathname.startsWith("/signup/");
  const isAuthPage = isCustomerAuth || pathname.startsWith("/staff/login");

  if (isPrivatePortal || isCustomerAuth) {
    return (
      <div
        className={[
          "min-w-0 flex-1 overflow-x-clip",
          isAuthPage ? "auth-route flex h-[100dvh] min-h-0 flex-col overflow-hidden" : "",
        ].join(" ")}
      >
        <PageTransition>{children}</PageTransition>
      </div>
    );
  }

  return (
    <>
      <PublicHeader />
      <div className="relative min-w-0 flex-1 overflow-x-clip">
        <StickySiteBackground />
        <div className="relative z-10 -mt-[100svh] min-h-[100svh] overflow-x-clip">
          <PageTransition>
            <div className="sticky-scroll-layer min-w-0">{children}</div>
          </PageTransition>
          <PublicFooter />
        </div>
      </div>
    </>
  );
}
