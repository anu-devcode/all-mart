"use client";

import React, { useEffect, useState } from "react";

const FLASH_KEY = "allmart_auth_flash";

export function setAuthFlash(message: string) {
  try {
    sessionStorage.setItem(FLASH_KEY, message);
  } catch {
    /* ignore */
  }
}

export function takeAuthFlash(): string | null {
  try {
    const msg = sessionStorage.getItem(FLASH_KEY);
    if (msg) sessionStorage.removeItem(FLASH_KEY);
    return msg;
  } catch {
    return null;
  }
}

/**
 * One-shot success toast after login / signup.
 */
export function AuthFlashBanner() {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const msg = takeAuthFlash();
    if (!msg) return;
    queueMicrotask(() => {
      setMessage(msg);
      setVisible(true);
    });
    const hide = window.setTimeout(() => setVisible(false), 3200);
    const clear = window.setTimeout(() => setMessage(null), 3800);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(clear);
    };
  }, []);

  if (!message) return null;

  return (
    <div
      role="status"
      className={[
        "pointer-events-none fixed left-1/2 top-28 z-[70] w-[min(100%-1.5rem,28rem)] -translate-x-1/2 px-1 transition duration-500 md:top-32",
        visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
      ].join(" ")}
    >
      <div className="truncate rounded-full border border-[color:var(--allmart-orange)]/30 bg-[#111]/95 px-4 py-2.5 text-center text-sm font-bold text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-5">
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[color:var(--allmart-orange)]" aria-hidden />
        {message}
      </div>
    </div>
  );
}
