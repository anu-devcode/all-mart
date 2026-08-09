"use client";

import React, { useMemo, useState } from "react";
import { RequirePermission } from "@/components/rbac/RequirePermission";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { roleDefinitions, type RoleId, type Staff } from "@/lib/types";

export default function ErpRolesPage() {
  const { staff, branches, upsertStaff } = useAllMart();
  const staffSorted = useMemo(() => staff.slice().sort((a, b) => a.name.localeCompare(b.name)), [staff]);

  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffSorted[0]?.id ?? "");

  const selectedStaff: Staff | null = useMemo(
    () => staff.find((s) => s.id === selectedStaffId) ?? null,
    [staff, selectedStaffId],
  );

  const selectedRoleId = (selectedStaff?.roleId ?? "staff") as RoleId;
  const permissions = roleDefinitions[selectedRoleId].permissions;

  function assignRole(roleId: RoleId) {
    if (!selectedStaff) return;
    upsertStaff({ ...selectedStaff, roleId });
  }

  return (
    <RequirePermission permission="roles">
      <div className="space-y-5">
        <div>
          <div className="text-sm font-semibold text-zinc-500">RBAC Role Assignment</div>
          <div className="mt-1 text-xl font-extrabold text-zinc-900">Permissions preview</div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-extrabold text-zinc-900">Assign roles</div>
            <div className="mt-3">
              <label className="text-xs font-semibold text-zinc-500" htmlFor="staffSelect">
                Staff member
              </label>
              <select
                id="staffSelect"
                className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                disabled={staffSorted.length === 0}
              >
                {staffSorted.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({roleDefinitions[s.roleId].label})
                  </option>
                ))}
              </select>
            </div>

            {!selectedStaff ? (
              <div className="mt-6 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm font-semibold text-zinc-600">
                Add staff in <span className="font-extrabold text-zinc-700">ERP → Staff</span>.
              </div>
            ) : (
              <>
                <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="text-sm font-extrabold text-zinc-900">{selectedStaff.name}</div>
                  <div className="mt-1 text-xs text-zinc-600">
                    Branch: {branches.find((b) => b.id === selectedStaff.branchId)?.name ?? "-"}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-zinc-500" htmlFor="roleSelect">
                    Role
                  </label>
                  <select
                    id="roleSelect"
                    value={selectedRoleId}
                    onChange={(e) => assignRole(e.target.value as RoleId)}
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  >
                    {(Object.keys(roleDefinitions) as RoleId[]).map((rid) => (
                      <option key={rid} value={rid}>
                        {roleDefinitions[rid].label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-extrabold text-zinc-900">Permissions</div>
            <div className="mt-2 text-sm font-bold text-[color:var(--allmart-orange)]">
              {roleDefinitions[selectedRoleId].label}
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(
                [
                  "dashboard",
                  "products",
                  "inventory",
                  "orders",
                  "payments",
                  "branches",
                  "staff",
                  "roles",
                  "reports",
                ] as const
              ).map((perm) => {
                const allowed = permissions.includes(perm);
                return (
                  <div
                    key={perm}
                    className={[
                      "rounded-xl border p-3",
                      allowed ? "border-[color:var(--allmart-orange)] bg-[color:var(--allmart-orange)]/10" : "border-zinc-200 bg-white",
                    ].join(" ")}
                  >
                    <div className="text-sm font-extrabold text-zinc-900">{perm}</div>
                    <div className="mt-1 text-xs font-bold">
                      {allowed ? (
                        <span className="text-[color:var(--allmart-green)]">Allowed</span>
                      ) : (
                        <span className="text-zinc-500">Denied</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl bg-zinc-50 p-4 text-xs text-zinc-600">
              Prototype note: RBAC is enforced from your signed-in staff role. Use different demo accounts on the staff login page to preview Admin / Manager / Staff access.
            </div>
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}

