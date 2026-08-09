"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AccountPage() {
  const router = useRouter();
  const { authReady, customer } = useAuth();

  useEffect(() => {
    if (!authReady) return;
    if (!customer) router.replace("/account/login");
  }, [authReady, customer, router]);

  if (!authReady || !customer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 pt-40 md:pt-44">
        <div className="flex items-center gap-3 text-sm font-semibold text-zinc-500">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-[color:var(--allmart-orange)]" />
          Loading account…
        </div>
      </div>
    );
  }

  return <AccountDashboard />;
}
