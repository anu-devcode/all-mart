"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { ProfileAvatar } from "@/components/account/ProfileAvatar";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCustomerAccount } from "@/components/providers/CustomerAccountProvider";
import { ProductSearchBox } from "@/components/public/ProductSearchBox";

const primaryLinks: Array<{ href: string; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/branches", label: "Branches" },
];

const secondaryLinks: Array<{ href: string; label: string }> = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const { branches, activeBranchId, setActiveBranchId, cartCount, wishlistCount } = useAllMart();
  const { customer, customerLogout } = useAuth();
  const { account } = useCustomerAccount();
  const activeBranch = branches.find((b) => b.id === activeBranchId);
  const branchShort = activeBranch?.name.replace("All Mart ", "") ?? "Branch";

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef<HTMLDivElement | null>(null);

  // Solid shell once scrolled, or when overlays need readable contrast
  const solid = scrolled || menuOpen || accountOpen;

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 max-w-full px-3 pt-3 md:px-6 md:pt-4">
      <div className="pointer-events-auto mx-auto w-full max-w-6xl min-w-0">
        <div className={`nav-shell overflow-visible rounded-2xl ${solid ? "is-scrolled" : "is-top"}`}>
          {/* Trust strip — fades out at the very top for a cleaner hero */}
          <div
            className={[
              "nav-trust flex flex-wrap items-center justify-center gap-x-4 gap-y-1 overflow-hidden px-3 text-[10px] font-semibold transition-all duration-500 sm:justify-between sm:px-4 sm:text-[11px]",
              solid
                ? "max-h-12 border-b border-zinc-100/90 py-1.5 text-zinc-500 opacity-100"
                : "max-h-0 border-b border-transparent py-0 text-white/70 opacity-0",
            ].join(" ")}
            aria-hidden={!solid}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <span className="text-[color:var(--allmart-orange)]">★</span> 1000+ customers
              </span>
              <span className="hidden text-zinc-300 sm:inline">·</span>
              <span>Fresh daily stock</span>
              <span className="hidden text-zinc-300 sm:inline">·</span>
              <span className="inline-flex items-center gap-1 text-zinc-700">
                <span aria-hidden>🚚</span> Pickup from branch
              </span>
            </div>
            <span className="hidden text-zinc-400 md:inline">Addis Ababa · ETB</span>
          </div>

          {/* Main bar */}
          <div className="flex min-w-0 flex-col gap-2 px-2.5 py-2 sm:px-3 md:px-3.5 md:py-2.5">
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5 md:gap-3">
              <div className="flex shrink-0 items-center self-center">
                <BrandLockup
                  tone={solid ? "dark" : "light"}
                  size="sm"
                  compact
                  showTagline={false}
                />
              </div>

              <div className="hidden min-w-0 items-center sm:flex">
                <label className="sr-only" htmlFor="branch-select">
                  Pickup location
                </label>
                <div
                  className={[
                    "flex max-w-[11.5rem] items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-colors duration-400 lg:max-w-[14rem]",
                    solid
                      ? "border border-zinc-200 bg-zinc-50"
                      : "border border-white/25 bg-white/10 backdrop-blur-md",
                  ].join(" ")}
                >
                  <span className="text-sm" aria-hidden>
                    📍
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className={[
                        "truncate text-[9px] font-bold uppercase tracking-wide",
                        solid ? "text-zinc-400" : "text-white/55",
                      ].join(" ")}
                    >
                      Pickup from
                    </div>
                    <select
                      id="branch-select"
                      className={[
                        "w-full cursor-pointer truncate bg-transparent text-xs font-bold outline-none",
                        solid ? "text-zinc-800" : "text-white",
                      ].join(" ")}
                      value={activeBranchId}
                      onChange={(e) => setActiveBranchId(e.target.value)}
                      title={`Pickup from ${activeBranch?.name}, Addis Ababa`}
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id} className="text-zinc-900">
                          {b.name.replace("All Mart ", "")} · Addis Ababa
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <ProductSearchBox
                id="nav-search"
                size="sm"
                tone={solid ? "nav-solid" : "nav-top"}
                className="ml-auto hidden min-w-0 flex-1 md:block lg:max-w-xl"
              />

              <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5 md:ml-0">
                <div className="relative hidden sm:block" ref={accountRef}>
                  <button
                    type="button"
                    onClick={() => setAccountOpen((v) => !v)}
                    className={[
                      "flex h-9 items-center gap-1.5 rounded-full px-2 text-xs font-semibold transition",
                      solid ? "text-zinc-600 hover:bg-zinc-100" : "text-white/85 hover:bg-white/10",
                    ].join(" ")}
                    aria-expanded={accountOpen}
                    aria-haspopup="menu"
                  >
                    {customer ? (
                      <ProfileAvatar
                        name={customer.name}
                        src={account?.avatarDataUrl}
                        size="xs"
                        className={
                          solid
                            ? "ring-1 ring-zinc-200"
                            : "ring-1 ring-white/35"
                        }
                      />
                    ) : (
                      <span
                        className={[
                          "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold",
                          solid ? "bg-zinc-100 text-zinc-700" : "bg-white/20 text-white",
                        ].join(" ")}
                      >
                        ?
                      </span>
                    )}
                  </button>
                  {accountOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-[calc(100%+0.4rem)] z-50 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-[0_16px_40px_rgba(17,17,17,0.12)]"
                    >
                      {customer ? (
                        <>
                          <div className="border-b border-zinc-100 px-3 py-2">
                            <div className="truncate text-xs font-bold text-zinc-900">{customer.name}</div>
                            <div className="truncate text-[11px] text-zinc-500">{customer.email}</div>
                          </div>
                          <Link
                            href="/account"
                            role="menuitem"
                            className="block px-3 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                            onClick={() => setAccountOpen(false)}
                          >
                            My account
                          </Link>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              customerLogout();
                              setAccountOpen(false);
                            }}
                            className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                          >
                            Log out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/account/login"
                            role="menuitem"
                            className="block px-3 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                            onClick={() => setAccountOpen(false)}
                          >
                            Log in
                          </Link>
                          <Link
                            href="/account/signup"
                            role="menuitem"
                            className="block px-3 py-2.5 text-sm font-semibold text-[color:var(--allmart-orange)] hover:bg-orange-50"
                            onClick={() => setAccountOpen(false)}
                          >
                            Sign up
                          </Link>
                        </>
                      )}
                      <div className="border-t border-zinc-100 py-1">
                        {secondaryLinks.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            role="menuitem"
                            className="block px-3 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                            onClick={() => setAccountOpen(false)}
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/wishlist"
                  className={[
                    "relative flex h-9 w-9 items-center justify-center rounded-full transition",
                    solid
                      ? "bg-zinc-100 text-zinc-700 hover:bg-rose-50 hover:text-rose-500"
                      : "bg-white/15 text-white hover:bg-white/25",
                  ].join(" ")}
                  aria-label={`Wishlist, ${wishlistCount} items`}
                >
                  <HeartNavIcon />
                  {wishlistCount > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  ) : null}
                </Link>

                <Link
                  href="/cart"
                  className="btn-float relative flex h-9 items-center gap-1.5 rounded-full bg-[color:var(--allmart-orange)] pl-3 pr-2 text-sm font-bold text-white"
                  aria-label={`Cart, ${cartCount} items`}
                >
                  <CartIcon />
                  <span className="min-w-[1.35rem] rounded-full bg-white px-1.5 py-0.5 text-center text-[11px] font-extrabold text-[color:var(--allmart-orange)]">
                    {cartCount}
                  </span>
                </Link>

                <button
                  type="button"
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full md:hidden",
                    solid ? "bg-zinc-100 text-zinc-800" : "bg-white/15 text-white backdrop-blur-md",
                  ].join(" ")}
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  aria-label="Open menu"
                >
                  <MenuIcon open={menuOpen} />
                </button>
              </div>
            </div>

            <ProductSearchBox
              id="nav-search-mobile"
              size="sm"
              tone={solid ? "nav-solid" : "nav-top"}
              className="md:hidden"
            />

            <nav
              className={[
                "nav-links-row relative hidden items-center pt-2 md:flex",
                solid ? "border-t border-zinc-100" : "border-t border-white/15",
              ].join(" ")}
            >
              <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
                {primaryLinks.map((l) => {
                  const active = pathname === l.href;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={[
                        "rounded-full px-3 py-1.5 text-sm transition-colors",
                        active
                          ? solid
                            ? "bg-[color:var(--allmart-orange)]/10 font-bold text-[color:var(--allmart-orange)]"
                            : "bg-white/15 font-bold text-white"
                          : solid
                            ? "font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                            : "font-medium text-white/70 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </div>
              <span
                className={[
                  "ml-auto max-w-[14rem] truncate text-[11px] font-semibold lg:max-w-none",
                  solid ? "text-zinc-400" : "text-white/55",
                ].join(" ")}
              >
                📍 Pickup · {branchShort}, Addis Ababa
              </span>
            </nav>
          </div>

          {menuOpen && (
            <div className="border-t border-zinc-100 px-3 py-3 md:hidden">
              <div className="mb-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">📍 Pickup from</div>
                <select
                  id="branch-select-mobile"
                  className="mt-1 h-10 w-full rounded-lg border border-zinc-200 bg-white px-2 text-sm font-semibold text-zinc-800 outline-none"
                  value={activeBranchId}
                  onChange={(e) => setActiveBranchId(e.target.value)}
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} · Addis Ababa
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-[11px] font-semibold text-zinc-600">🚚 Pickup from branch · no delivery yet</p>
              </div>

              <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-semibold text-zinc-500">
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[color:var(--allmart-orange)]">
                  1000+ customers
                </span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1">Fresh daily stock</span>
              </div>

              <div className="flex flex-col gap-0.5">
                {[...primaryLinks, { href: "/wishlist", label: `Wishlist (${wishlistCount})` }, { href: "/cart", label: `Cart (${cartCount})` }, ...secondaryLinks].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 border-t border-zinc-100 pt-3">
                {customer ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account"
                      className="rounded-xl bg-[color:var(--allmart-orange)] px-3 py-2.5 text-center text-sm font-bold text-white"
                    >
                      Account
                    </Link>
                    <button
                      type="button"
                      onClick={customerLogout}
                      className="rounded-xl bg-zinc-100 px-3 py-2.5 text-sm font-semibold text-zinc-800"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/account/login" className="rounded-xl border border-zinc-200 px-3 py-2.5 text-center text-sm font-semibold">
                      Log in
                    </Link>
                    <Link
                      href="/account/signup"
                      className="rounded-xl bg-[color:var(--allmart-orange)] px-3 py-2.5 text-center text-sm font-bold text-white"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 5h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.35" fill="currentColor" />
      <circle cx="17" cy="20" r="1.35" fill="currentColor" />
    </svg>
  );
}

function HeartNavIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-6.7-4.35-9.33-7.7C.5 10.55 1.1 6.8 4.05 5.2c1.85-1 4.1-.55 5.45 1.05C10.85 4.65 13.1 4.2 14.95 5.2c2.95 1.6 3.55 5.35 1.38 8.1C18.7 16.65 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      )}
    </svg>
  );
}
