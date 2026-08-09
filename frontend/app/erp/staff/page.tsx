"use client";

import React, { useMemo, useState } from "react";
import { RequirePermission } from "@/components/rbac/RequirePermission";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { roleDefinitions, type RoleId, type Staff } from "@/lib/types";

export default function ErpStaffPage() {
  const { staff, branches, upsertStaff, deleteStaff } = useAllMart();
  const roleIds = useMemo(() => Object.keys(roleDefinitions) as RoleId[], []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const [form, setForm] = useState<{ name: string; roleId: RoleId; branchId: string; email: string }>({
    name: "",
    roleId: "staff",
    branchId: branches[0]?.id ?? "b-bole",
    email: "",
  });

  function openAdd() {
    setEditing(null);
    setForm({
      name: "",
      roleId: "staff",
      branchId: branches[0]?.id ?? "b-bole",
      email: "",
    });
    setModalOpen(true);
  }

  function openEdit(s: Staff) {
    setEditing(s);
    setForm({ name: s.name, roleId: s.roleId, branchId: s.branchId, email: s.email ?? "" });
    setModalOpen(true);
  }

  function save() {
    const nextId = editing?.id ?? `s-${Date.now()}`;
    upsertStaff({
      id: nextId,
      name: form.name.trim() || "Staff",
      roleId: form.roleId,
      branchId: form.branchId,
      email: form.email.trim() || undefined,
    });
    setModalOpen(false);
  }

  const sorted = useMemo(() => staff.slice().sort((a, b) => a.name.localeCompare(b.name)), [staff]);

  return (
    <RequirePermission permission="staff">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-zinc-500">Staff Management</div>
            <div className="mt-1 text-xl font-extrabold text-zinc-900">Roles & branch assignment</div>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="rounded-xl bg-[color:var(--allmart-orange)] px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
          >
            Add Staff
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
          <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="text-left text-xs font-extrabold text-zinc-500">
                  <th className="py-3 pr-3">Staff</th>
                  <th className="py-3 pr-3">Role</th>
                  <th className="py-3 pr-3">Branch</th>
                  <th className="py-3 pr-3">Email</th>
                  <th className="py-3 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sorted.map((s) => {
                  const branchName = branches.find((b) => b.id === s.branchId)?.name ?? "-";
                  const tone =
                    s.roleId === "admin"
                      ? "bg-[color:var(--allmart-orange)]/15 text-[color:var(--allmart-orange)]"
                      : s.roleId === "manager"
                        ? "bg-[color:var(--allmart-green)]/15 text-[color:var(--allmart-green)]"
                        : "bg-zinc-100 text-zinc-700";
                  return (
                    <tr key={s.id} className="border-t border-zinc-100">
                      <td className="py-3 pr-3 font-extrabold text-zinc-900">{s.name}</td>
                      <td className="py-3 pr-3">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${tone}`}>
                          {roleDefinitions[s.roleId].label}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-zinc-700">{branchName}</td>
                      <td className="py-3 pr-3 text-zinc-700">{s.email ?? "-"}</td>
                      <td className="py-3 pr-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(s)}
                            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-extrabold text-zinc-800 hover:bg-zinc-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteStaff(s.id)}
                            className="rounded-lg bg-zinc-50 px-3 py-2 text-xs font-extrabold text-zinc-700 hover:bg-zinc-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm font-semibold text-zinc-600">
                      No staff
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-extrabold text-zinc-900">{editing ? "Edit Staff" : "Add Staff"}</div>
                  <div className="mt-1 text-sm text-zinc-600">Update role and branch assignment.</div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-extrabold text-zinc-700 hover:bg-zinc-50"
                  type="button"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4">
                <div>
                  <div className="text-xs font-semibold text-zinc-500">Name</div>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-500">Role</div>
                  <select
                    value={form.roleId}
                    onChange={(e) => setForm((f) => ({ ...f, roleId: e.target.value as RoleId }))}
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  >
                    {roleIds.map((rid) => (
                      <option key={rid} value={rid}>
                        {roleDefinitions[rid].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-500">Branch</div>
                  <select
                    value={form.branchId}
                    onChange={(e) => setForm((f) => ({ ...f, branchId: e.target.value }))}
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-500">Email (optional)</div>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)]"
                    placeholder="e.g. staff@example.com"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-800 hover:bg-zinc-50"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="rounded-xl bg-[color:var(--allmart-orange)] px-4 py-3 text-sm font-extrabold text-white hover:opacity-95"
                  type="button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequirePermission>
  );
}

