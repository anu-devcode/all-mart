"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { roleDefinitions, type Permission } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  permission: Permission;
  icon: React.ReactNode;
};

function Icon({ d, paths }: { d?: string; paths?: string[] }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0" aria-hidden>
      {d ? <path d={d} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /> : null}
      {paths?.map((p) => (
        <path key={p} d={p} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

const navItems: NavItem[] = [
  {
    href: "/erp",
    label: "Dashboard",
    permission: "dashboard",
    icon: (
      <Icon
        paths={[
          "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z",
        ]}
      />
    ),
  },
  {
    href: "/erp/orders",
    label: "Orders",
    permission: "orders",
    icon: <Icon paths={["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"]} />,
  },
  {
    href: "/erp/payments",
    label: "Payments",
    permission: "payments",
    icon: <Icon paths={["M12 3v18", "M17 8H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]} />,
  },
  {
    href: "/erp/products",
    label: "Products",
    permission: "products",
    icon: <Icon paths={["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z", "M3.27 6.96 12 12.01l8.73-5.05", "M12 22.08V12"]} />,
  },
  {
    href: "/erp/inventory",
    label: "Inventory",
    permission: "inventory",
    icon: <Icon paths={["M3 7h18", "M5 7v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7", "M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"]} />,
  },
  {
    href: "/erp/branches",
    label: "Branches",
    permission: "branches",
    icon: <Icon paths={["M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z", "M12 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"]} />,
  },
  {
    href: "/erp/staff",
    label: "Staff",
    permission: "staff",
    icon: <Icon paths={["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]} />,
  },
  {
    href: "/erp/reports",
    label: "Reports",
    permission: "reports",
    icon: <Icon paths={["M4 19V5", "M4 19h16", "M8 17V9", "M12 17v-5", "M16 17V7"]} />,
  },
  {
    href: "/erp/roles",
    label: "Settings",
    permission: "roles",
    icon: <Icon paths={["M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z", "M19.4 15a1.7 1.7 0 0 0 .34 1.86l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.56 1.7 1.7 0 0 0-1.86.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.1 1.7 1.7 0 0 0-.34-1.86l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.1 1.56 1.7 1.7 0 0 0 1.86-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.24.3.45.64.6 1 .13.32.32.6.6.82.27.2.6.32.94.35H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51.83Z"]} />,
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/erp") return pathname === "/erp";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ERPLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { hasPermission } = useAllMart();
  const { authReady, isStaffAuthenticated, staffSession, staffLogout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!authReady) return;
    if (!isStaffAuthenticated) {
      router.replace("/staff/login");
    }
  }, [authReady, isStaffAuthenticated, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const pageTitle = useMemo(() => {
    const match = navItems.find((item) => isActivePath(pathname, item.href));
    return match?.label ?? "Dashboard";
  }, [pathname]);

  if (!authReady || !isStaffAuthenticated || !staffSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-4">
        <div className="rounded-2xl border border-white/10 bg-[#171717] px-6 py-8 text-center shadow-sm">
          <div className="text-sm font-extrabold text-white">Checking staff access...</div>
          <div className="mt-2 text-xs text-zinc-400">ERP is restricted to authenticated staff accounts.</div>
          <Link
            href="/staff/login"
            className="mt-4 inline-block text-sm font-bold text-[color:var(--allmart-orange)] hover:underline"
          >
            Go to staff login
          </Link>
        </div>
      </div>
    );
  }

  const roleLabel = roleDefinitions[staffSession.roleId].label;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/8 px-4 py-5">
        <BrandLockup tone="light" size="sm" showTagline={false} href="/erp" />
        <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
          ERP Console
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="ERP modules">
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Menu</div>
        {navItems.map((item) => {
          const allowed = hasPermission(item.permission);
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={allowed ? item.href : "#"}
              aria-disabled={!allowed}
              aria-current={active ? "page" : undefined}
              onClick={(e) => {
                if (!allowed) e.preventDefault();
              }}
              className={[
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                !allowed
                  ? "cursor-not-allowed text-zinc-600"
                  : active
                    ? "bg-[color:var(--allmart-orange)] text-white shadow-[0_10px_28px_rgba(255,106,0,0.28)]"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <span className={active ? "text-white" : "text-zinc-400 group-hover:text-white"}>{item.icon}</span>
              <span className="min-w-0 truncate">{item.label}</span>
              {!allowed ? <span className="ml-auto text-[10px] font-bold text-zinc-600">Locked</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/8 p-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
          <div className="text-xs font-extrabold text-white">{staffSession.name}</div>
          <div className="mt-0.5 text-[11px] text-zinc-400">
            {roleLabel} · {staffSession.email}
          </div>
          <button
            type="button"
            onClick={() => {
              staffLogout();
              router.replace("/staff/login");
            }}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="erp-shell min-h-screen max-w-[100%] overflow-x-clip bg-[#F4F4F5]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-white/5 bg-[#0F0F0F] lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[248px] bg-[#0F0F0F] shadow-2xl">{sidebar}</aside>
        </div>
      ) : null}

      <div className="min-w-0 max-w-full lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 lg:hidden"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                </svg>
              </button>
              <div className="min-w-0">
                <div className="truncate text-base font-extrabold tracking-tight text-zinc-900 sm:text-lg md:text-xl">
                  {pageTitle}
                </div>
                <div className="hidden text-xs text-zinc-500 sm:block">
                  All Mart Digital Retail · {roleLabel} access
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
              <label className="relative hidden md:block">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.2-3.2" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="Search modules…"
                  className="h-10 w-44 rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-800 outline-none ring-[color:var(--allmart-orange)]/30 placeholder:text-zinc-400 focus:bg-white focus:ring-2 lg:w-72"
                />
              </label>

              <button
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600"
                aria-label="Notifications"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 19a2 2 0 0 0 4 0" strokeLinecap="round" />
                </svg>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[color:var(--allmart-orange)]" />
              </button>

              <div className="hidden items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--allmart-orange)] text-xs font-extrabold text-white">
                  {staffSession.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="max-w-[7rem] pr-1 leading-tight lg:max-w-none">
                  <div className="truncate text-xs font-extrabold text-zinc-900">{staffSession.name}</div>
                  <div className="text-[10px] font-semibold text-zinc-500">{roleLabel}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 max-w-full overflow-x-clip px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
          <div className="erp-content mx-auto w-full min-w-0 max-w-[1400px]">
            {pathname === "/erp" ? (
              children
            ) : (
              <div className="min-w-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-[0_8px_24px_rgba(17,17,17,0.04)] sm:p-4 md:p-6">
                {children}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
