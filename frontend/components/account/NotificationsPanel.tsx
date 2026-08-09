"use client";

import React from "react";
import { useCustomerAccount } from "@/components/providers/CustomerAccountProvider";
import type { AccountNotification } from "@/lib/customerAccount";

const kindStyle: Record<AccountNotification["kind"], string> = {
  order: "bg-emerald-50 text-emerald-700",
  promo: "bg-orange-50 text-[color:var(--allmart-orange)]",
  system: "bg-zinc-100 text-zinc-600",
  referral: "bg-violet-50 text-violet-700",
};

export function NotificationsPanel() {
  const {
    account,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
  } = useCustomerAccount();

  const notes = account?.notifications ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">Orders, promos, and account updates</p>
        {notes.some((n) => !n.read) ? (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-[color:var(--allmart-orange)] hover:underline"
          >
            Mark all read
          </button>
        ) : null}
      </div>

      <div className="space-y-2">
        {notes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 px-4 py-10 text-center text-sm text-zinc-500">
            You’re all caught up.
          </div>
        ) : (
          notes.map((n) => (
            <article
              key={n.id}
              className={[
                "account-card rounded-2xl border p-4 transition",
                n.read ? "border-zinc-200 bg-white" : "border-[color:var(--allmart-orange)]/25 bg-orange-50/40",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${kindStyle[n.kind]}`}>
                      {n.kind}
                    </span>
                    {!n.read ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--allmart-orange)]" aria-label="Unread" />
                    ) : null}
                  </div>
                  <h3 className="mt-1.5 text-sm font-extrabold text-zinc-900">{n.title}</h3>
                  <p className="mt-1 text-sm leading-5 text-zinc-600">{n.body}</p>
                  <p className="mt-2 text-[11px] font-semibold text-zinc-400">
                    {new Date(n.createdAtIso).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  {!n.read ? (
                    <button
                      type="button"
                      onClick={() => markNotificationRead(n.id)}
                      className="rounded-lg px-2 py-1 text-[11px] font-bold text-zinc-600 hover:bg-white"
                    >
                      Read
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => dismissNotification(n.id)}
                    className="rounded-lg px-2 py-1 text-[11px] font-bold text-zinc-400 hover:bg-white hover:text-zinc-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
