"use client";

import React, { useState } from "react";
import { IconCopy, IconGift } from "@/components/account/AccountIcons";
import { useCustomerAccount } from "@/components/providers/CustomerAccountProvider";
import { formatEtb } from "@/lib/format";

export function ReferralPanel() {
  const { account, applyReferralBoost } = useCustomerAccount();
  const [copied, setCopied] = useState(false);

  if (!account) return null;

  const shareText = `Shop All Mart with my code ${account.referralCode} — free pickup in Addis Ababa!`;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/account/signup?ref=${encodeURIComponent(account.referralCode)}`
      : `/account/signup?ref=${account.referralCode}`;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(account!.referralCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "All Mart referral", text: shareText, url: shareUrl });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[color:var(--allmart-orange)]/20 bg-gradient-to-br from-[#111] to-[#1a120c] p-5 text-white md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--allmart-orange)]/20 text-[color:var(--allmart-orange)]">
            <IconGift className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold">Invite & earn</h2>
            <p className="mt-1 text-sm text-white/60">
              Share your code. When a friend places their first order, you both get store credit.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Your code</div>
            <div className="mt-1 font-mono text-xl font-extrabold tracking-wider text-[color:var(--allmart-orange)]">
              {account.referralCode}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 sm:flex-none"
            >
              <IconCopy />
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={share}
              className="flex-1 rounded-xl bg-[color:var(--allmart-orange)] px-4 py-3 text-sm font-extrabold text-white sm:flex-none"
            >
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Friends joined" value={String(account.referralCount)} />
        <Stat label="Rewards earned" value={formatEtb(account.referralRewardEtb)} />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <h3 className="text-sm font-extrabold text-zinc-900">How it works</h3>
        <ol className="mt-3 space-y-2 text-sm text-zinc-600">
          <li className="flex gap-2">
            <span className="font-extrabold text-[color:var(--allmart-orange)]">1</span>
            Share your personal code with friends in Addis.
          </li>
          <li className="flex gap-2">
            <span className="font-extrabold text-[color:var(--allmart-orange)]">2</span>
            They sign up and place a pickup order.
          </li>
          <li className="flex gap-2">
            <span className="font-extrabold text-[color:var(--allmart-orange)]">3</span>
            You both unlock 50 ETB credit (prototype simulation).
          </li>
        </ol>
        <button
          type="button"
          onClick={applyReferralBoost}
          className="mt-4 w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-xs font-extrabold text-zinc-700 hover:bg-zinc-100"
        >
          Simulate a successful referral
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="mt-1 text-xl font-extrabold text-zinc-900">{value}</div>
    </div>
  );
}
