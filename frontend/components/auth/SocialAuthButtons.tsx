"use client";

import React from "react";

type SocialAuthButtonsProps = {
  onGoogle: () => void;
  onTelegram: () => void;
  disabled?: boolean;
  mode?: "login" | "signup";
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
      <path
        fill="#2AABEE"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.55 7.3c-.12.53-.42.66-.85.41l-2.35-1.73-1.13 1.09c-.13.13-.23.23-.47.23l.17-2.4 4.37-3.95c.19-.17-.04-.26-.29-.1l-5.4 3.4-2.33-.73c-.5-.16-.51-.5.11-.74l9.1-3.51c.42-.16.79.1.72.73z"
      />
    </svg>
  );
}

/**
 * Prototype social sign-in for shopper accounts only (not staff/ERP).
 */
export function SocialAuthButtons({
  onGoogle,
  onTelegram,
  disabled,
  mode = "login",
}: SocialAuthButtonsProps) {
  const verb = mode === "signup" ? "Continue" : "Continue";

  return (
    <div className="space-y-3">
      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          disabled={disabled}
          onClick={onGoogle}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white px-3 text-sm font-bold text-zinc-800 transition hover:bg-zinc-100 disabled:opacity-60"
        >
          <GoogleIcon />
          {verb} with Google
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onTelegram}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#2AABEE]/40 bg-[#229ED9] px-3 text-sm font-bold text-white transition hover:bg-[#1f8fc4] disabled:opacity-60"
        >
          <TelegramIcon />
          {verb} with Telegram
        </button>
      </div>

      <p className="text-center text-[10px] leading-4 text-white/30">
        Prototype social sign-in for shoppers only — staff must use the ERP portal.
      </p>
    </div>
  );
}
