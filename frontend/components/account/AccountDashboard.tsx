"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState, useTransition } from "react";
import { AddressPanel } from "@/components/account/AddressPanel";
import {
  IconBell,
  IconGift,
  IconHeart,
  IconHome,
  IconOrders,
  IconPin,
  IconSettings,
  IconShop,
} from "@/components/account/AccountIcons";
import { ProfileAvatar } from "@/components/account/ProfileAvatar";
import { NotificationsPanel } from "@/components/account/NotificationsPanel";
import { ReferralPanel } from "@/components/account/ReferralPanel";
import { SettingsPanel } from "@/components/account/SettingsPanel";
import { AuthFlashBanner } from "@/components/auth/AuthFlashBanner";
import { Reveal } from "@/components/motion/Reveal";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCustomerAccount } from "@/components/providers/CustomerAccountProvider";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { formatEtb } from "@/lib/format";

type TabId = "overview" | "addresses" | "orders" | "referral" | "notifications" | "settings";

const tabs: Array<{ id: TabId; label: string; Icon: React.FC<{ className?: string }>; blurb: string }> = [
  { id: "overview", label: "Overview", Icon: IconHome, blurb: "Your pickup hub at a glance" },
  { id: "addresses", label: "Addresses", Icon: IconPin, blurb: "Saved places with map pins" },
  { id: "orders", label: "Orders", Icon: IconOrders, blurb: "Recent pickup simulations" },
  { id: "referral", label: "Refer", Icon: IconGift, blurb: "Invite friends and earn credit" },
  { id: "notifications", label: "Alerts", Icon: IconBell, blurb: "Orders, promos, and account news" },
  { id: "settings", label: "Settings", Icon: IconSettings, blurb: "Photo, alerts, language & branch" },
];

export function AccountDashboard() {
  const router = useRouter();
  const { customer, customerLogout } = useAuth();
  const { account, unreadCount, ready } = useCustomerAccount();
  const { orders, wishlistCount, cartCount, activeBranchId, branches, lastOrderId } = useAllMart();
  const [tab, setTab] = useState<TabId>("overview");
  const [pending, startTransition] = useTransition();

  const branch = branches.find((b) => b.id === activeBranchId);
  const myOrders = useMemo(() => orders.slice(0, 6), [orders]);
  const lastOrder = lastOrderId ? orders.find((o) => o.id === lastOrderId) : myOrders[0];
  const defaultAddress = account?.addresses.find((a) => a.isDefault) ?? account?.addresses[0];
  const activeTab = tabs.find((t) => t.id === tab) ?? tabs[0];

  if (!customer) return null;

  const firstName = customer.name.split(" ")[0] ?? customer.name;

  function goTab(id: TabId) {
    startTransition(() => setTab(id));
  }

  function logout() {
    customerLogout();
    router.push("/");
  }

  return (
    <div className="w-full max-w-full overflow-x-clip pb-14 pt-36 sm:pt-40 md:pb-16 md:pt-44 lg:pt-48">
      <AuthFlashBanner />

      <div className="relative z-0 mx-auto w-full max-w-6xl px-3 sm:px-4">
        <Reveal variant="fade">
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[var(--shadow-float)] sm:rounded-[1.5rem]">
            <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-stretch xl:grid-cols-[240px_minmax(0,1fr)]">
              {/* Sidebar — stretches with main column */}
              <aside className="relative flex min-h-0 flex-col bg-[#111] text-white lg:min-h-[min(78vh,860px)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,106,0,0.22),transparent_55%)]"
                />

                <div className="relative border-b border-white/10 px-4 py-4 sm:px-4 sm:py-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
                    My All Mart
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => goTab("settings")}
                      className="shrink-0 rounded-full ring-2 ring-white/20 transition hover:ring-[color:var(--allmart-orange)]"
                      aria-label="Change profile photo"
                      title="Change profile photo"
                    >
                      <ProfileAvatar name={customer.name} src={account?.avatarDataUrl} size="md" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold">Hi, {firstName}</div>
                      <div className="truncate text-[11px] text-white/45">{customer.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                    <MiniStat label="Cart" value={String(cartCount)} />
                    <MiniStat label="Saved" value={String(wishlistCount)} />
                    <MiniStat label="Alerts" value={String(unreadCount)} accent={unreadCount > 0} />
                  </div>
                </div>

                <nav
                  className="relative flex gap-1 overflow-x-auto overscroll-x-contain p-2 sm:p-2.5 lg:flex-1 lg:flex-col lg:gap-0.5 lg:overflow-y-auto lg:overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  aria-label="Account sections"
                >
                  {tabs.map(({ id, label, Icon }) => {
                    const active = tab === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => goTab(id)}
                        className={[
                          "relative flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition lg:w-full lg:text-sm",
                          active
                            ? "bg-[color:var(--allmart-orange)] text-white shadow-[0_8px_20px_rgba(255,106,0,0.35)]"
                            : "text-white/55 hover:bg-white/8 hover:text-white",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{label}</span>
                        {id === "notifications" && unreadCount > 0 ? (
                          <span
                            className={[
                              "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-extrabold",
                              active ? "bg-white/25 text-white" : "bg-[color:var(--allmart-orange)] text-white",
                            ].join(" ")}
                          >
                            {unreadCount}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </nav>

                <div className="relative mt-auto space-y-2 border-t border-white/10 p-3 max-lg:hidden">
                  <Link
                    href="/shop"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--allmart-orange)] px-3 py-2.5 text-xs font-extrabold text-white"
                  >
                    <IconShop className="h-4 w-4" />
                    Continue shopping
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full rounded-xl border border-white/15 px-3 py-2.5 text-xs font-bold text-white/70 transition hover:bg-white/8 hover:text-white"
                  >
                    Log out
                  </button>
                </div>
              </aside>

              {/* Main column */}
              <section className="flex min-w-0 flex-col border-t border-zinc-200 bg-[#f4f4f5] lg:border-t-0 lg:border-l lg:border-zinc-200/80">
                <header className="flex flex-col gap-3 border-b border-zinc-200/80 bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="min-w-0">
                    <h1 className="truncate text-lg font-extrabold tracking-tight text-zinc-900 sm:text-xl">
                      {activeTab.label}
                    </h1>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">{activeTab.blurb}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {tab === "overview" || tab === "orders" ? (
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--allmart-orange)] px-3.5 py-2 text-xs font-extrabold text-white"
                      >
                        <IconShop className="h-3.5 w-3.5" />
                        Shop
                      </Link>
                    ) : null}
                    {tab === "addresses" ? (
                      <span className="hidden text-[11px] font-semibold text-zinc-400 sm:inline">
                        {defaultAddress ? "Default set" : "Add your first pin"}
                      </span>
                    ) : null}
                    {tab === "settings" ? (
                      <span className="hidden text-[11px] font-semibold text-zinc-400 sm:inline">
                        Changes save automatically
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={logout}
                      className="rounded-full border border-zinc-200 px-3.5 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 lg:hidden"
                    >
                      Log out
                    </button>
                  </div>
                </header>

                <div
                  className={[
                    "min-w-0 flex-1 overflow-x-clip p-3 sm:p-4 md:p-5",
                    pending ? "opacity-80" : "account-panel-enter",
                  ].join(" ")}
                >
                  <div className="mx-auto min-w-0 max-w-3xl">
                    {tab === "overview" ? (
                      <Overview
                        branchName={branch?.name.replace("All Mart ", "") ?? "—"}
                        defaultAddress={defaultAddress?.line1}
                        lastOrder={lastOrder}
                        myOrders={myOrders}
                        referralCode={account?.referralCode}
                        reward={account?.referralRewardEtb ?? 0}
                        onTab={goTab}
                        wishlistCount={wishlistCount}
                        cartCount={cartCount}
                        ready={ready}
                      />
                    ) : null}
                    {tab === "addresses" ? <AddressPanel active={tab === "addresses"} /> : null}
                    {tab === "orders" ? <OrdersPanel orders={myOrders} /> : null}
                    {tab === "referral" ? <ReferralPanel /> : null}
                    {tab === "notifications" ? <NotificationsPanel /> : null}
                    {tab === "settings" ? <SettingsPanel /> : null}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg bg-black/30 px-1.5 py-2">
      <div className={`text-sm font-extrabold sm:text-base ${accent ? "text-[color:var(--allmart-orange)]" : "text-white"}`}>
        {value}
      </div>
      <div className="text-[9px] font-semibold uppercase tracking-wide text-white/40 sm:text-[10px]">{label}</div>
    </div>
  );
}

function Overview({
  branchName,
  defaultAddress,
  lastOrder,
  myOrders,
  referralCode,
  reward,
  onTab,
  wishlistCount,
  cartCount,
  ready,
}: {
  branchName: string;
  defaultAddress?: string;
  lastOrder?: { id: string; items: unknown[]; totalEtb: number; status: string } | null;
  myOrders: Array<{ id: string; status: string; totalEtb: number; items: unknown[] }>;
  referralCode?: string;
  reward: number;
  onTab: (t: TabId) => void;
  wishlistCount: number;
  cartCount: number;
  ready: boolean;
}) {
  const actions = [
    { label: "Shop", meta: "Browse stock", href: "/shop", Icon: IconShop },
    { label: "Wishlist", meta: `${wishlistCount} saved`, href: "/wishlist", Icon: IconHeart },
    { label: "Branch", meta: branchName, href: "/branches", Icon: IconPin },
    { label: "Cart", meta: `${cartCount} items`, href: "/cart", Icon: IconShop },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="account-card group rounded-2xl border border-zinc-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-[color:var(--allmart-orange)]/40 sm:p-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[color:var(--allmart-orange)] transition group-hover:bg-[color:var(--allmart-orange)] group-hover:text-white sm:h-10 sm:w-10">
              <a.Icon />
            </div>
            <div className="mt-2.5 text-sm font-extrabold text-zinc-900 sm:mt-3">{a.label}</div>
            <div className="mt-0.5 truncate text-[11px] font-semibold text-zinc-500">{a.meta}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-zinc-900">Latest order</h3>
            <button
              type="button"
              onClick={() => onTab("orders")}
              className="text-xs font-bold text-[color:var(--allmart-orange)]"
            >
              All orders
            </button>
          </div>
          {lastOrder ? (
            <div className="mt-3 rounded-xl bg-zinc-50 px-3.5 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-zinc-900">{lastOrder.id}</div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    {lastOrder.items.length} items · {formatEtb(lastOrder.totalEtb)}
                  </div>
                </div>
                <span className="rounded-full bg-[color:var(--allmart-orange)]/10 px-2.5 py-1 text-[11px] font-bold text-[color:var(--allmart-orange)]">
                  {lastOrder.status}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">
              No orders yet.{" "}
              <Link href="/shop" className="font-bold text-[color:var(--allmart-orange)]">
                Start shopping
              </Link>
            </p>
          )}
          {myOrders.length > 1 ? (
            <ul className="mt-2 divide-y divide-zinc-100">
              {myOrders.slice(1, 4).map((o) => (
                <li key={o.id} className="flex justify-between gap-2 py-2 text-sm">
                  <span className="truncate font-semibold text-zinc-700">{o.id}</span>
                  <span className="shrink-0 text-xs font-semibold text-zinc-400">{o.status}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          <button
            type="button"
            onClick={() => onTab("addresses")}
            className="account-card flex w-full items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-left transition hover:border-[color:var(--allmart-orange)]/35"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[color:var(--allmart-orange)]">
              <IconPin />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-zinc-900">Pickup address</div>
              <p className="mt-0.5 truncate text-xs text-zinc-500">
                {ready ? defaultAddress ?? "Add a saved place with map pin" : "Loading…"}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTab("referral")}
            className="account-card flex w-full items-start gap-3 rounded-2xl border border-zinc-200 bg-gradient-to-br from-orange-50 to-white p-4 text-left transition hover:border-[color:var(--allmart-orange)]/35"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--allmart-orange)] text-white">
              <IconGift />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold text-zinc-900">Referral · {referralCode ?? "—"}</div>
              <p className="mt-0.5 text-xs text-zinc-500">
                {reward > 0 ? `${formatEtb(reward)} earned` : "Invite friends · earn 50 ETB each"}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTab("notifications")}
            className="account-card flex w-full items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-left transition hover:border-[color:var(--allmart-orange)]/35"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
              <IconBell />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-zinc-900">Alerts & updates</div>
              <p className="mt-0.5 text-xs text-zinc-500">Order status, promos, and account news</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function OrdersPanel({
  orders,
}: {
  orders: Array<{ id: string; status: string; totalEtb: number; items: unknown[]; placedAtIso?: string }>;
}) {
  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-10 text-center text-sm text-zinc-500">
          No orders yet —{" "}
          <Link href="/shop" className="font-bold text-[color:var(--allmart-orange)]">
            browse the shop
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {orders.map((o) => (
            <li
              key={o.id}
              className="account-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3.5"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-extrabold text-zinc-900">{o.id}</div>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {o.items.length} items · {formatEtb(o.totalEtb)}
                </div>
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-bold text-zinc-700">{o.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
