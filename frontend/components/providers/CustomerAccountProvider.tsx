"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { safeJsonParse } from "@/lib/storage";
import {
  ADDIS_DEFAULT,
  defaultAccountState,
  type AccountNotification,
  type AccountSettings,
  type CustomerAccountState,
  type SavedAddress,
} from "@/lib/customerAccount";

const STORAGE_KEY = "allmart_customer_accounts_v1";

type AccountsMap = Record<string, CustomerAccountState>;

type CustomerAccountContextValue = {
  ready: boolean;
  account: CustomerAccountState | null;
  unreadCount: number;
  updateProfile: (patch: Partial<Pick<CustomerAccountState, "phone" | "avatarDataUrl">>) => void;
  setAvatar: (dataUrl: string | null) => void;
  saveAddress: (address: Omit<SavedAddress, "id"> & { id?: string }) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  updateSettings: (patch: Partial<AccountSettings>) => void;
  applyReferralBoost: () => void;
  locateMe: () => Promise<{ lat: number; lng: number } | { error: string }>;
};

const CustomerAccountContext = createContext<CustomerAccountContextValue | null>(null);

export function CustomerAccountProvider({ children }: { children: React.ReactNode }) {
  const { authReady, customer } = useAuth();
  const [ready, setReady] = useState(false);
  const [map, setMap] = useState<AccountsMap>({});

  useEffect(() => {
    if (!authReady) return;
    const stored = safeJsonParse<AccountsMap>(localStorage.getItem(STORAGE_KEY), {});
    // Migrate older profiles missing avatarDataUrl
    const migrated: AccountsMap = {};
    for (const [id, raw] of Object.entries(stored)) {
      migrated[id] = {
        ...defaultAccountState("Customer", id),
        ...raw,
        avatarDataUrl: raw.avatarDataUrl ?? null,
        settings: { ...defaultAccountState("Customer", id).settings, ...raw.settings },
      };
    }
    queueMicrotask(() => {
      setMap(migrated);
      setReady(true);
    });
  }, [authReady]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }, [map, ready]);

  // Ensure a profile exists for the signed-in customer
  useEffect(() => {
    if (!ready || !customer) return;
    setMap((prev) => {
      if (prev[customer.id]) return prev;
      return { ...prev, [customer.id]: defaultAccountState(customer.name, customer.id) };
    });
  }, [ready, customer]);

  const account = customer && map[customer.id] ? map[customer.id] : null;

  const patchAccount = useCallback(
    (fn: (prev: CustomerAccountState) => CustomerAccountState) => {
      if (!customer) return;
      setMap((prev) => {
        const current = prev[customer.id] ?? defaultAccountState(customer.name, customer.id);
        return { ...prev, [customer.id]: fn(current) };
      });
    },
    [customer],
  );

  const updateProfile = useCallback(
    (patch: Partial<Pick<CustomerAccountState, "phone" | "avatarDataUrl">>) => {
      patchAccount((prev) => ({ ...prev, ...patch }));
    },
    [patchAccount],
  );

  const setAvatar = useCallback(
    (dataUrl: string | null) => {
      patchAccount((prev) => ({ ...prev, avatarDataUrl: dataUrl }));
    },
    [patchAccount],
  );

  const saveAddress = useCallback(
    (address: Omit<SavedAddress, "id"> & { id?: string }) => {
      patchAccount((prev) => {
        const id = address.id ?? `addr-${Date.now()}`;
        const nextAddr: SavedAddress = {
          id,
          label: address.label.trim() || "Home",
          line1: address.line1.trim(),
          subcity: address.subcity.trim() || "Bole",
          city: address.city.trim() || "Addis Ababa",
          phone: address.phone?.trim(),
          lat: address.lat || ADDIS_DEFAULT.lat,
          lng: address.lng || ADDIS_DEFAULT.lng,
          isDefault: Boolean(address.isDefault) || prev.addresses.length === 0,
        };

        const without = prev.addresses.filter((a) => a.id !== id);
        let addresses = [...without, nextAddr];
        if (nextAddr.isDefault) {
          addresses = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
        }
        return { ...prev, addresses };
      });
    },
    [patchAccount],
  );

  const deleteAddress = useCallback(
    (id: string) => {
      patchAccount((prev) => {
        const addresses = prev.addresses.filter((a) => a.id !== id);
        if (addresses.length && !addresses.some((a) => a.isDefault)) {
          addresses[0] = { ...addresses[0], isDefault: true };
        }
        return { ...prev, addresses };
      });
    },
    [patchAccount],
  );

  const setDefaultAddress = useCallback(
    (id: string) => {
      patchAccount((prev) => ({
        ...prev,
        addresses: prev.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
      }));
    },
    [patchAccount],
  );

  const markNotificationRead = useCallback(
    (id: string) => {
      patchAccount((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      }));
    },
    [patchAccount],
  );

  const markAllNotificationsRead = useCallback(() => {
    patchAccount((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, [patchAccount]);

  const dismissNotification = useCallback(
    (id: string) => {
      patchAccount((prev) => ({
        ...prev,
        notifications: prev.notifications.filter((n) => n.id !== id),
      }));
    },
    [patchAccount],
  );

  const updateSettings = useCallback(
    (patch: Partial<AccountSettings>) => {
      patchAccount((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
    },
    [patchAccount],
  );

  const applyReferralBoost = useCallback(() => {
    // Prototype: simulate a successful referral share conversion
    patchAccount((prev) => ({
      ...prev,
      referralCount: prev.referralCount + 1,
      referralRewardEtb: prev.referralRewardEtb + 50,
      notifications: [
        {
          id: `n-ref-${Date.now()}`,
          title: "Referral reward unlocked",
          body: "A friend joined with your code. +50 ETB credit added.",
          createdAtIso: new Date().toISOString(),
          read: false,
          kind: "referral" as const,
        } satisfies AccountNotification,
        ...prev.notifications,
      ],
    }));
  }, [patchAccount]);

  const locateMe = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return { error: "Location is not available in this browser." };
    }
    return new Promise<{ lat: number; lng: number } | { error: string }>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ error: "Couldn’t get your location. Allow location access and try again." }),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    });
  }, []);

  const unreadCount = useMemo(
    () => account?.notifications.filter((n) => !n.read).length ?? 0,
    [account],
  );

  const value = useMemo<CustomerAccountContextValue>(
    () => ({
      ready,
      account,
      unreadCount,
      updateProfile,
      setAvatar,
      saveAddress,
      deleteAddress,
      setDefaultAddress,
      markNotificationRead,
      markAllNotificationsRead,
      dismissNotification,
      updateSettings,
      applyReferralBoost,
      locateMe,
    }),
    [
      ready,
      account,
      unreadCount,
      updateProfile,
      setAvatar,
      saveAddress,
      deleteAddress,
      setDefaultAddress,
      markNotificationRead,
      markAllNotificationsRead,
      dismissNotification,
      updateSettings,
      applyReferralBoost,
      locateMe,
    ],
  );

  return <CustomerAccountContext.Provider value={value}>{children}</CustomerAccountContext.Provider>;
}

export function useCustomerAccount() {
  const ctx = useContext(CustomerAccountContext);
  if (!ctx) throw new Error("useCustomerAccount must be used within <CustomerAccountProvider/>");
  return ctx;
}
