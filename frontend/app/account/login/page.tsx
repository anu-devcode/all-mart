"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AuthShell, authInputClass, authLabelClass } from "@/components/auth/AuthShell";
import { AuthSpinner } from "@/components/auth/AuthSpinner";
import { setAuthFlash } from "@/components/auth/AuthFlashBanner";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { useAuth } from "@/components/providers/AuthProvider";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function CustomerAccountLoginPage() {
  const router = useRouter();
  const { customerLogin, customerSocialLogin, customer, authReady } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authReady && customer) router.replace("/account");
  }, [authReady, customer, router]);

  async function finishOk(flash: string) {
    setSuccess(true);
    setAuthFlash(flash);
    await wait(450);
    router.push("/account");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    await wait(700);
    const result = customerLogin(email, password);
    if (!result.ok) {
      setLoading(false);
      setError(result.error);
      return;
    }
    await finishOk("Welcome back 👋");
  }

  async function onSocial(provider: "google" | "telegram") {
    if (loading || success) return;
    setError(null);
    setLoading(true);
    await wait(650);
    const result = customerSocialLogin(provider);
    if (!result.ok) {
      setLoading(false);
      setError(result.error);
      return;
    }
    await finishOk(provider === "google" ? "Signed in with Google 👋" : "Signed in with Telegram 👋");
  }

  const busy = loading || success || !authReady;

  return (
    <AuthShell
      eyebrow="Shopper account"
      title="Log in"
      subtitle="Orders, wishlist, and your pickup branch — separate from the staff ERP portal."
      footer={
        <>
          New here?{" "}
          <Link href="/account/signup" className="font-bold text-[color:var(--allmart-orange)] hover:underline">
            Create an account
          </Link>
          <span className="mt-2 block text-[11px] text-white/35">
            Staff / admin?{" "}
            <Link href="/staff/login" className="font-semibold text-white/55 underline-offset-2 hover:text-white hover:underline">
              ERP portal sign-in
            </Link>
          </span>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className={authLabelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
            placeholder="you@email.com"
            required
            disabled={busy}
          />
        </div>
        <div>
          <label className={authLabelClass} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
            placeholder="••••••••"
            required
            disabled={busy}
          />
        </div>

        {error ? (
          <div className="animate-[auth-shake_0.35s_ease] rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-[color:var(--allmart-orange)]/35 bg-[color:var(--allmart-orange)]/15 px-3 py-2.5 text-center text-sm font-bold text-white">
            Welcome back 👋
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="btn-float flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--allmart-orange)] text-sm font-extrabold text-white transition disabled:opacity-70"
        >
          {loading && !success ? (
            <>
              <AuthSpinner />
              Signing in…
            </>
          ) : success ? (
            "Welcome back 👋"
          ) : (
            "Log in"
          )}
        </button>

        <p className="text-center text-[11px] text-white/35">
          Demo: <span className="text-white/55">sara@allmart.et</span> / <span className="text-white/55">demo123</span>
        </p>
      </form>

      <div className="mt-5">
        <SocialAuthButtons
          mode="login"
          disabled={busy}
          onGoogle={() => void onSocial("google")}
          onTelegram={() => void onSocial("telegram")}
        />
      </div>
    </AuthShell>
  );
}
