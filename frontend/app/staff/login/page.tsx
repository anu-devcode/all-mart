"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { useAuth } from "@/components/providers/AuthProvider";
import { brandAssets } from "@/components/public/PageHeroBackground";
import { staffCredentials } from "@/lib/staffAuth";
import { roleDefinitions } from "@/lib/types";
import Image from "next/image";

export default function StaffLoginPage() {
  const router = useRouter();
  const { authReady, isStaffAuthenticated, staffLogin } = useAuth();
  const [email, setEmail] = useState("admin@allmart.et");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authReady && isStaffAuthenticated) {
      router.replace("/erp");
    }
  }, [authReady, isStaffAuthenticated, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = staffLogin(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/erp");
  }

  return (
    <div className="auth-shell relative flex h-full min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain bg-zinc-950">
      <Image src={brandAssets.storeAtrium} alt="" fill className="object-cover opacity-40" sizes="100vw" priority />
      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-[color:var(--allmart-orange)]/30" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-2xl md:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-zinc-950 p-8 text-white md:p-10">
            <div className="flex flex-col gap-3">
              <BrandLockup tone="light" size="md" showTagline={false} href={null} />
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--allmart-orange)]">
                Staff & Admin Portal
              </div>
            </div>
            <h1 className="mt-8 text-3xl font-extrabold tracking-tight">ERP secure sign-in</h1>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Separate from shopper accounts. Customer emails and social logins cannot access this portal — only
              authorized Admin, Manager, and Staff credentials.
            </p>

            <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-white/50">Demo staff accounts</div>
              {staffCredentials.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => {
                    setEmail(a.email);
                    setPassword(a.password);
                    setError(null);
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-left text-xs hover:bg-white/10"
                >
                  <span>
                    <span className="font-bold text-white">{roleDefinitions[a.roleId].label}</span>
                    <span className="mt-0.5 block text-white/60">{a.email}</span>
                  </span>
                  <span className="text-white/40">{a.password}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="text-xs font-bold uppercase tracking-wide text-[color:var(--allmart-orange)]">
              Staff only · /staff/login
            </div>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-900">Sign in to ERP</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Shopper login is at{" "}
              <Link href="/account/login" className="font-semibold text-[color:var(--allmart-orange)] hover:underline">
                /account/login
              </Link>
              . Staff credentials will not work there.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500" htmlFor="staffEmail">
                  Work email
                </label>
                <input
                  id="staffEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500" htmlFor="staffPassword">
                  Password
                </label>
                <input
                  id="staffPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  required
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !authReady}
                className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {submitting ? "Signing in..." : "Sign in to Dashboard"}
              </button>
            </form>

            <div className="mt-6 space-y-2 rounded-xl bg-zinc-50 p-4 text-xs text-zinc-600">
              <p>
                Looking for the shopper account?{" "}
                <Link href="/account/login" className="font-bold text-[color:var(--allmart-orange)] hover:underline">
                  Customer login
                </Link>{" "}
                /{" "}
                <Link href="/account/signup" className="font-bold text-[color:var(--allmart-orange)] hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="text-zinc-400">Google & Telegram sign-in are for shoppers only — not available here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
