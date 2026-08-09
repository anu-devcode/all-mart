"use client";

import React from "react";
import type { Permission } from "@/lib/types";
import { useAllMart } from "@/components/providers/AllMartProvider";

export function RequirePermission({
  permission,
  children,
}: {
  permission: Permission;
  children: React.ReactNode;
}) {
  const { hasPermission } = useAllMart();

  if (!hasPermission(permission)) {
    return (
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-zinc-200 bg-white p-8">
        <div className="text-lg font-semibold text-zinc-900">Access denied</div>
        <div className="mt-2 text-sm text-zinc-600">
          Your staff role does not have permission: <span className="font-semibold">{permission}</span>
        </div>
        <div className="mt-6 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">
          Sign in with a different staff account (Admin / Manager / Staff) from the staff login portal to preview other
          access levels.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
