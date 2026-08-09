"use client";

import React from "react";
import { ProfilePhotoCard } from "@/components/account/ProfilePhotoCard";
import { useCustomerAccount } from "@/components/providers/CustomerAccountProvider";
import { useAllMart } from "@/components/providers/AllMartProvider";

export function SettingsPanel() {
  const { account, updateSettings, updateProfile } = useCustomerAccount();
  const { branches, activeBranchId, setActiveBranchId } = useAllMart();

  if (!account) return null;

  const s = account.settings;

  return (
    <div className="space-y-4">
      <ProfilePhotoCard />

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-5">
        <h3 className="text-sm font-extrabold text-zinc-900">Notifications</h3>
        <div className="mt-3 space-y-3">
          <Toggle
            label="Email order updates"
            hint="Confirmations and ready-for-pickup alerts"
            checked={s.emailOrderUpdates}
            onChange={(v) => updateSettings({ emailOrderUpdates: v })}
          />
          <Toggle
            label="SMS order updates"
            hint="Short texts when status changes"
            checked={s.smsOrderUpdates}
            onChange={(v) => updateSettings({ smsOrderUpdates: v })}
          />
          <Toggle
            label="Promo offers"
            hint="Deals and weekend hours — optional"
            checked={s.promoPush}
            onChange={(v) => updateSettings({ promoPush: v })}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-5">
        <h3 className="text-sm font-extrabold text-zinc-900">Preferences</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Language</span>
            <select
              value={s.preferredLanguage}
              onChange={(e) => updateSettings({ preferredLanguage: e.target.value as "en" | "am" })}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ (Amharic)</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Preferred branch</span>
            <select
              value={s.preferredBranchId ?? activeBranchId}
              onChange={(e) => {
                updateSettings({ preferredBranchId: e.target.value });
                setActiveBranchId(e.target.value);
              }}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Phone</span>
            <input
              value={account.phone}
              onChange={(e) => updateProfile({ phone: e.target.value })}
              placeholder="09xxxxxxxx"
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
            />
          </label>
        </div>
      </section>

      <p className="text-xs leading-5 text-zinc-400">
        Preferences are saved on this device for the prototype. Production would sync to your All Mart profile.
      </p>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-3 text-left transition hover:bg-zinc-50"
    >
      <span>
        <span className="block text-sm font-bold text-zinc-900">{label}</span>
        <span className="mt-0.5 block text-xs text-zinc-500">{hint}</span>
      </span>
      <span
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-[color:var(--allmart-orange)]" : "bg-zinc-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
            checked ? "left-5" : "left-0.5",
          ].join(" ")}
        />
      </span>
    </button>
  );
}
