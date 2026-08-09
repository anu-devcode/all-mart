"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { safeJsonParse } from "@/lib/storage";
import {
  findStaffByEmail,
  findStaffCredential,
  isStaffEmail,
  type StaffCredential,
} from "@/lib/staffAuth";
import type { RoleId } from "@/lib/types";

export type CustomerUser = {
  id: string;
  name: string;
  email: string;
  provider?: CustomerAuthProvider;
};

export type CustomerAuthProvider = "email" | "google" | "telegram";

type StoredCustomer = CustomerUser & {
  password?: string;
  providerId?: string;
};

export type StaffSession = {
  staffId: string;
  name: string;
  email: string;
  roleId: RoleId;
  branchId: string;
};

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  authReady: boolean;

  // Customer (shopper account — public site only)
  customer: CustomerUser | null;
  customerLogin: (email: string, password: string) => AuthResult;
  customerSignup: (args: { name: string; email: string; password: string }) => AuthResult;
  customerSocialLogin: (provider: "google" | "telegram") => AuthResult;
  customerLogout: () => void;

  // Staff / ERP (separate portal — never shares customer session)
  staffSession: StaffSession | null;
  isStaffAuthenticated: boolean;
  staffLogin: (email: string, password: string) => AuthResult;
  staffLogout: () => void;
};

const STORAGE_CUSTOMERS_KEY = "allmart_customers_v2";
const STORAGE_CUSTOMERS_LEGACY_KEY = "allmart_customers_v1";
const STORAGE_CUSTOMER_SESSION_KEY = "allmart_customer_session_v1";
const STORAGE_STAFF_SESSION_KEY = "allmart_staff_session_v1";

const DEMO_CUSTOMER: StoredCustomer = {
  id: "c-demo",
  name: "Sara Demo",
  email: "sara@allmart.et",
  password: "demo123",
  provider: "email",
};

const SOCIAL_PROFILES: Record<
  "google" | "telegram",
  { id: string; name: string; email: string; providerId: string }
> = {
  google: {
    id: "c-google-demo",
    name: "Sara Google",
    email: "sara.google@allmart.et",
    providerId: "google-demo-001",
  },
  telegram: {
    id: "c-telegram-demo",
    name: "Sara Telegram",
    email: "sara.telegram@allmart.et",
    providerId: "tg-demo-001",
  },
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toStaffSession(cred: StaffCredential): StaffSession {
  return {
    staffId: cred.staffId,
    name: cred.name,
    email: cred.email,
    roleId: cred.roleId,
    branchId: cred.branchId,
  };
}

function toCustomerSession(user: StoredCustomer): CustomerUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider ?? "email",
  };
}

function loadCustomers(): StoredCustomer[] {
  const current = safeJsonParse<StoredCustomer[]>(localStorage.getItem(STORAGE_CUSTOMERS_KEY), []);
  if (current.length) return current;
  const legacy = safeJsonParse<StoredCustomer[]>(localStorage.getItem(STORAGE_CUSTOMERS_LEGACY_KEY), []);
  return legacy.map((c) => ({ ...c, provider: c.provider ?? "email" }));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [customers, setCustomers] = useState<StoredCustomer[]>([]);
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [staffSession, setStaffSession] = useState<StaffSession | null>(null);

  useEffect(() => {
    const storedCustomers = loadCustomers();
    const storedCustomerSession = safeJsonParse<CustomerUser | null>(
      localStorage.getItem(STORAGE_CUSTOMER_SESSION_KEY),
      null,
    );
    const storedStaffSession = safeJsonParse<StaffSession | null>(
      localStorage.getItem(STORAGE_STAFF_SESSION_KEY),
      null,
    );

    const withDemo = storedCustomers.some((c) => c.email === DEMO_CUSTOMER.email)
      ? storedCustomers
      : [DEMO_CUSTOMER, ...storedCustomers];

    queueMicrotask(() => {
      setCustomers(withDemo);
      setCustomer(storedCustomerSession);
      setStaffSession(storedStaffSession);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!authReady) return;
    localStorage.setItem(STORAGE_CUSTOMERS_KEY, JSON.stringify(customers));
  }, [customers, authReady]);

  useEffect(() => {
    if (!authReady) return;
    localStorage.setItem(STORAGE_CUSTOMER_SESSION_KEY, JSON.stringify(customer));
  }, [customer, authReady]);

  useEffect(() => {
    if (!authReady) return;
    localStorage.setItem(STORAGE_STAFF_SESSION_KEY, JSON.stringify(staffSession));
  }, [staffSession, authReady]);

  function customerSignup(args: { name: string; email: string; password: string }): AuthResult {
    const email = args.email.trim().toLowerCase();
    const name = args.name.trim();
    const password = args.password;

    if (!name || !email || password.length < 4) {
      return { ok: false, error: "Enter a name, email, and password (min 4 characters)." };
    }
    if (isStaffEmail(email)) {
      return {
        ok: false,
        error: "Staff emails can’t create shopper accounts. Use the staff portal at /staff/login.",
      };
    }
    if (customers.some((c) => c.email === email)) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const next: StoredCustomer = {
      id: `c-${Date.now()}`,
      name,
      email,
      password,
      provider: "email",
    };
    setCustomers((prev) => [...prev, next]);
    setCustomer(toCustomerSession(next));
    return { ok: true };
  }

  function customerLogin(email: string, password: string): AuthResult {
    const normalized = email.trim().toLowerCase();

    if (isStaffEmail(normalized)) {
      return {
        ok: false,
        error: "Staff credentials can’t sign in here. Use the ERP portal at /staff/login.",
      };
    }

    const found = customers.find(
      (c) => c.email === normalized && c.provider !== "google" && c.provider !== "telegram" && c.password === password,
    );
    if (!found) {
      // Extra clarity if password matches a staff account somehow via same email domain mistakes
      if (findStaffCredential(normalized, password) || findStaffByEmail(normalized)) {
        return {
          ok: false,
          error: "Staff credentials can’t sign in here. Use the ERP portal at /staff/login.",
        };
      }
      return { ok: false, error: "Invalid email or password." };
    }
    setCustomer(toCustomerSession(found));
    return { ok: true };
  }

  function customerSocialLogin(provider: "google" | "telegram"): AuthResult {
    const profile = SOCIAL_PROFILES[provider];
    if (isStaffEmail(profile.email)) {
      return { ok: false, error: "This identity is reserved for staff. Use /staff/login." };
    }

    const existing = customers.find(
      (c) => c.provider === provider && (c.providerId === profile.providerId || c.email === profile.email),
    );

    if (existing) {
      setCustomer(toCustomerSession(existing));
      return { ok: true };
    }

    const next: StoredCustomer = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      provider,
      providerId: profile.providerId,
    };
    setCustomers((prev) => [...prev, next]);
    setCustomer(toCustomerSession(next));
    return { ok: true };
  }

  function customerLogout() {
    setCustomer(null);
  }

  function staffLogin(email: string, password: string): AuthResult {
    const normalized = email.trim().toLowerCase();

    const customerMatch = customers.find(
      (c) => c.email === normalized && c.password === password && (c.provider ?? "email") === "email",
    );
    if (customerMatch && !isStaffEmail(normalized)) {
      return {
        ok: false,
        error: "Shopper accounts can’t access the staff portal. Use Customer login instead.",
      };
    }

    if (!isStaffEmail(normalized)) {
      const knownCustomer = customers.some((c) => c.email === normalized);
      if (knownCustomer) {
        return {
          ok: false,
          error: "Shopper accounts can’t access the staff portal. Use Customer login instead.",
        };
      }
      return { ok: false, error: "Invalid staff credentials. Only ERP accounts can sign in here." };
    }

    const cred = findStaffCredential(email, password);
    if (!cred) {
      return { ok: false, error: "Invalid staff credentials." };
    }
    setStaffSession(toStaffSession(cred));
    return { ok: true };
  }

  function staffLogout() {
    setStaffSession(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      authReady,
      customer,
      customerLogin,
      customerSignup,
      customerSocialLogin,
      customerLogout,
      staffSession,
      isStaffAuthenticated: Boolean(staffSession),
      staffLogin,
      staffLogout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authReady, customer, customers, staffSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider/>");
  return ctx;
}
