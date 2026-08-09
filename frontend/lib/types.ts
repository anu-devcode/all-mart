export type BranchId = string;
export type ProductId = string;
export type OrderId = string;
export type StaffId = string;

export type RoleId = "admin" | "manager" | "staff";

export type Permission =
  | "dashboard"
  | "products"
  | "inventory"
  | "orders"
  | "payments"
  | "branches"
  | "staff"
  | "roles"
  | "reports";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

export type PaymentMethod = "cod" | "telebirr" | "chapa" | "card";
export type PaymentStatus = "Unpaid" | "Paid" | "Failed" | "Refunded";

export type ProductCategory =
  | "Fresh & Vegetables"
  | "Beverages"
  | "Snacks & Food"
  | "Household"
  | "Personal Care"
  | "Bakery & Dairy"
  | "Packed Food";

export interface Branch {
  id: BranchId;
  name: string;
  city: string;
  address: string;
  /** Local store hours, 24h clock e.g. 8 and 21 */
  openHour: number;
  closeHour: number;
  phone?: string;
  /** Approximate map pin for mini preview */
  lat?: number;
  lng?: number;
}

export interface Product {
  id: ProductId;
  name: string;
  category: ProductCategory;
  description: string;
  priceEtb: number;
  imageUrl?: string; // Next.js <Image/> compatible URL (local/public or remote)
  shelfCode: string; // e.g. "A1"
  stockByBranch: Record<BranchId, number>;
  isActive: boolean;
}

export interface OrderItem {
  productId: ProductId;
  qty: number;
  unitPriceEtb: number;
}

export interface Order {
  id: OrderId;
  branchId: BranchId;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalEtb: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  placedAtIso: string;
  updatedAtIso: string;
}

export interface Staff {
  id: StaffId;
  name: string;
  roleId: RoleId;
  branchId: BranchId;
  email?: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

export const PAYMENT_METHODS: PaymentMethod[] = ["cod", "telebirr", "chapa", "card"];
export const PAYMENT_STATUSES: PaymentStatus[] = ["Unpaid", "Paid", "Failed", "Refunded"];

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  cod: "Cash on pickup",
  telebirr: "Telebirr",
  chapa: "Chapa",
  card: "Card",
};

export const roleDefinitions: Record<
  RoleId,
  {
    label: string;
    permissions: Permission[];
  }
> = {
  admin: {
    label: "Admin",
    permissions: [
      "dashboard",
      "products",
      "inventory",
      "orders",
      "payments",
      "branches",
      "staff",
      "roles",
      "reports",
    ],
  },
  manager: {
    label: "Manager",
    permissions: ["dashboard", "products", "inventory", "orders", "payments", "reports"],
  },
  staff: {
    label: "Staff",
    permissions: ["dashboard", "products", "orders", "payments"],
  },
};

