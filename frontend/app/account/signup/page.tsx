"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { AuthShell, authInputClass, authLabelClass } from "@/components/auth/AuthShell";
import { AuthSpinner } from "@/components/auth/AuthSpinner";
import { setAuthFlash } from "@/components/auth/AuthFlashBanner";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { useAuth } from "@/components/providers/AuthProvider";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function SignupInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referral = searchParams.get("ref");
  const { customerSignup, customerSocialLogin, customer, authReady } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authReady && customer) router.replace("/account");
  }, [authReady, customer, router]);

  function stashReferral() {
    if (!referral) return;
    try {
      sessionStorage.setItem("allmart_pending_referral", referral);
    } catch {
      /* ignore */
    }
  }

  async function finishOk(flash: string) {
    stashReferral();
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
    const result = customerSignup({ name, email, password });
    if (!result.ok) {
      setLoading(false);
      setError(result.error);
      return;
    }
    await finishOk(referral ? `Welcome — code ${referral} applied 👋` : "Welcome to All Mart 👋");
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
    await finishOk(
      provider === "google" ? "Welcome — signed up with Google 👋" : "Welcome — signed up with Telegram 👋",
    );
  }

  const busy = loading || success || !authReady;

  return (
    <AuthShell
      eyebrow="Shopper account"
      title="Create account"
      subtitle="Save your wishlist and track orders — or keep browsing without one."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/account/login" className="font-bold text-[color:var(--allmart-orange)] hover:underline">
            Log in
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
      {referral ? (
        <div className="mb-4 rounded-xl border border-[color:var(--allmart-orange)]/30 bg-[color:var(--allmart-orange)]/10 px-3 py-2.5 text-center text-xs font-bold text-[color:var(--allmart-orange-soft)]">
          Invited with code <span className="font-mono text-white">{referral}</span>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className={authLabelClass} htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={authInputClass}
            placeholder="Your name"
            required
            disabled={busy}
          />
        </div>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
            placeholder="Min. 4 characters"
            required
            minLength={4}
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
            You&apos;re in 👋
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
              Creating account…
            </>
          ) : success ? (
            "You're in 👋"
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <div className="mt-5">
        <SocialAuthButtons
          mode="signup"
          disabled={busy}
          onGoogle={() => void onSocial("google")}
          onTelegram={() => void onSocial("telegram")}
        />
      </div>
    </AuthShell>
  );
}

export default function CustomerAccountSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full min-h-0 flex-1 items-center justify-center bg-[#0c0c0c] text-sm text-white/50">
          Loading…
        </div>
      }
    >
      <SignupInner />
    </Suspense>
  );
}
