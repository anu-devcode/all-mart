import type { RoleId, StaffId } from "./types";

export type StaffCredential = {
  email: string;
  password: string;
  staffId: StaffId;
  name: string;
  roleId: RoleId;
  branchId: string;
};

/** Demo staff accounts for the ERP portal (not for public customers). */
export const staffCredentials: StaffCredential[] = [
  {
    email: "admin@allmart.et",
    password: "admin123",
    staffId: "s-1",
    name: "Admin A.",
    roleId: "admin",
    branchId: "b-bole",
  },
  {
    email: "manager@allmart.et",
    password: "manager123",
    staffId: "s-2",
    name: "Manager B.",
    roleId: "manager",
    branchId: "b-kirkos",
  },
  {
    email: "staff@allmart.et",
    password: "staff123",
    staffId: "s-3",
    name: "Staff C.",
    roleId: "staff",
    branchId: "b-bole",
  },
];

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** True if this email belongs to the staff/ERP directory (not shopper accounts). */
export function isStaffEmail(email: string) {
  const normalized = normalizeEmail(email);
  return staffCredentials.some((a) => a.email.toLowerCase() === normalized);
}

export function findStaffByEmail(email: string) {
  const normalized = normalizeEmail(email);
  return staffCredentials.find((a) => a.email.toLowerCase() === normalized) ?? null;
}

export function findStaffCredential(email: string, password: string) {
  const normalized = normalizeEmail(email);
  return (
    staffCredentials.find(
      (a) => a.email.toLowerCase() === normalized && a.password === password,
    ) ?? null
  );
}
