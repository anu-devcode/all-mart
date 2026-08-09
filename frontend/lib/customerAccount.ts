import type { BranchId } from "@/lib/types";

export type SavedAddress = {
  id: string;
  label: string;
  line1: string;
  subcity: string;
  city: string;
  phone?: string;
  lat: number;
  lng: number;
  isDefault: boolean;
};

export type AccountNotification = {
  id: string;
  title: string;
  body: string;
  createdAtIso: string;
  read: boolean;
  kind: "order" | "promo" | "system" | "referral";
};

export type AccountSettings = {
  emailOrderUpdates: boolean;
  smsOrderUpdates: boolean;
  promoPush: boolean;
  preferredLanguage: "en" | "am";
  preferredBranchId?: BranchId;
};

export type CustomerAccountState = {
  phone: string;
  /** Compressed data-URL avatar (JPEG/WebP), or null */
  avatarDataUrl: string | null;
  addresses: SavedAddress[];
  notifications: AccountNotification[];
  settings: AccountSettings;
  referralCode: string;
  referralCount: number;
  referralRewardEtb: number;
};

/** Addis Ababa center fallback */
export const ADDIS_DEFAULT = { lat: 9.03, lng: 38.74 };

export const ADDIS_SUBCITIES = [
  "Bole",
  "Kirkos",
  "Yeka",
  "Arada",
  "Addis Ketema",
  "Lideta",
  "Nifas Silk-Lafto",
  "Kolfe Keranio",
  "Gulele",
  "Akaky Kaliti",
] as const;

export function makeReferralCode(name: string, id: string) {
  const base = name
    .trim()
    .split(/\s+/)[0]
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 6);
  const tail = id.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase() || "AM01";
  return `${base || "MART"}-${tail}`;
}

export function defaultAccountState(name: string, id: string): CustomerAccountState {
  return {
    phone: "",
    avatarDataUrl: null,
    addresses: [],
    notifications: [
      {
        id: "n-welcome",
        title: "Welcome to All Mart",
        body: "Your account is ready. Save a pickup address and start shopping.",
        createdAtIso: new Date().toISOString(),
        read: false,
        kind: "system",
      },
      {
        id: "n-referral",
        title: "Invite friends, earn ETB",
        body: "Share your referral code — you both get rewards after their first order.",
        createdAtIso: new Date(Date.now() - 3600_000).toISOString(),
        read: false,
        kind: "referral",
      },
      {
        id: "n-fresh",
        title: "Fresh restock nearby",
        body: "Produce was restocked this morning at your preferred branch.",
        createdAtIso: new Date(Date.now() - 86_400_000).toISOString(),
        read: true,
        kind: "promo",
      },
    ],
    settings: {
      emailOrderUpdates: true,
      smsOrderUpdates: true,
      promoPush: false,
      preferredLanguage: "en",
    },
    referralCode: makeReferralCode(name, id),
    referralCount: 0,
    referralRewardEtb: 0,
  };
}

export function osmEmbedSrc(lat: number, lng: number, delta = 0.014) {
  const left = lng - delta;
  const right = lng + delta;
  const top = lat + delta;
  const bottom = lat - delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function osmOpenUrl(lat: number, lng: number) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}

/** Resize + compress an image file to a small data URL for localStorage. */
export function fileToAvatarDataUrl(file: File, maxSize = 256, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file (JPG, PNG, or WebP)."));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error("Image is too large. Use a file under 8MB."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn’t read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Couldn’t load that image."));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const crop = Math.min(img.width, img.height);
        const sx = (img.width - crop) / 2;
        const sy = (img.height - crop) / 2;
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported."));
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, maxSize, maxSize);
        ctx.drawImage(img, sx, sy, crop, crop, 0, 0, maxSize, maxSize);
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          if (dataUrl.length > 450_000) {
            const tighter = canvas.toDataURL("image/jpeg", 0.65);
            resolve(tighter);
            return;
          }
          resolve(dataUrl);
        } catch {
          reject(new Error("Couldn’t process that image."));
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
