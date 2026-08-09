"use client";

import React, { useId, useRef, useState } from "react";
import { ProfileAvatar } from "@/components/account/ProfileAvatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCustomerAccount } from "@/components/providers/CustomerAccountProvider";
import { fileToAvatarDataUrl } from "@/lib/customerAccount";

export function ProfilePhotoCard() {
  const { customer } = useAuth();
  const { account, setAvatar } = useCustomerAccount();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  if (!customer) return null;

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    setOk(null);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setAvatar(dataUrl);
      setOk("Profile photo updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t upload that image.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <h3 className="text-sm font-extrabold text-zinc-900">Profile photo</h3>
      <p className="mt-0.5 text-xs text-zinc-500">Shown on your account sidebar and in the navbar.</p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <ProfileAvatar name={customer.name} src={account?.avatarDataUrl} size="lg" className="mx-auto sm:mx-0" />

        <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={busy}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <label
              htmlFor={inputId}
              className={[
                "inline-flex cursor-pointer items-center justify-center rounded-xl bg-[color:var(--allmart-orange)] px-4 py-2.5 text-xs font-extrabold text-white",
                busy ? "pointer-events-none opacity-60" : "hover:opacity-95",
              ].join(" ")}
            >
              {busy ? "Uploading…" : account?.avatarDataUrl ? "Change photo" : "Add photo"}
            </label>
            {account?.avatarDataUrl ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setAvatar(null);
                  setOk("Photo removed.");
                  setError(null);
                }}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
              >
                Remove
              </button>
            ) : null}
          </div>
          <p className="text-[11px] text-zinc-400">JPG, PNG, or WebP · cropped square · saved on this device</p>
          {error ? <p className="text-xs font-semibold text-rose-600">{error}</p> : null}
          {ok ? <p className="text-xs font-semibold text-[color:var(--allmart-orange)]">{ok}</p> : null}
        </div>
      </div>
    </section>
  );
}
