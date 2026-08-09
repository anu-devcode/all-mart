"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  Branch,
  BranchId,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Product,
  ProductId,
  RoleId,
  Staff,
  Permission,
} from "@/lib/types";
import { initialMockStore } from "@/lib/mockData";
import { safeJsonParse } from "@/lib/storage";
import { ORDER_STATUSES, roleDefinitions } from "@/lib/types";
import { useAuth } from "@/components/providers/AuthProvider";

type CartItem = { productId: ProductId; qty: number };
type CartState = { branchId: BranchId; items: CartItem[] };

type AllMartContextValue = {
  branches: Branch[];
  products: Product[];
  staff: Staff[];
  orders: Order[];

  activeBranchId: BranchId;
  setActiveBranchId: (branchId: BranchId) => void;

  // Public cart
  cart: CartState | null;
  cartCount: number;
  cartItemsDetailed: Array<{
    product: Product;
    qty: number;
    unitPriceEtb: number;
    lineTotalEtb: number;
  }>;
  addToCart: (productId: ProductId, qty?: number) => void;
  updateCartQty: (productId: ProductId, qty: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlistIds: ProductId[];
  wishlistCount: number;
  wishlistProducts: Product[];
  isInWishlist: (productId: ProductId) => boolean;
  toggleWishlist: (productId: ProductId) => void;
  removeFromWishlist: (productId: ProductId) => void;
  clearWishlist: () => void;

  // Checkout
  lastOrderId: string | null;
  placeOrder: (args: {
    customerName: string;
    customerPhone: string;
    paymentMethod?: PaymentMethod;
    notes?: string;
  }) => string | null;

  // ERP RBAC (driven by authenticated staff session)
  erpRoleId: RoleId;
  erpPermissions: Permission[];
  hasPermission: (permission: Permission) => boolean;

  // Mock mutations (ERP)
  upsertProduct: (product: Product) => void;
  deleteProduct: (productId: ProductId) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => void;
  updateOrderPaymentMethod: (orderId: string, paymentMethod: PaymentMethod) => void;
  updateOrderNotes: (orderId: string, notes: string) => void;
  upsertStaff: (staff: Staff) => void;
  deleteStaff: (staffId: string) => void;
  upsertBranch: (branch: Branch) => void;
  deleteBranch: (branchId: BranchId) => void;
};

const STORAGE_STORE_KEY = "allmart_mock_store_v6";
const STORAGE_CART_KEY = "allmart_cart_v1";
const STORAGE_BRANCH_KEY = "allmart_active_branch_v1";
const STORAGE_WISHLIST_KEY = "allmart_wishlist_v1";

function normalizeOrder(raw: Partial<Order> & { id: string }): Order {
  const status = (ORDER_STATUSES.includes(raw.status as OrderStatus) ? raw.status : "Pending") as OrderStatus;
  const paymentMethod = (raw.paymentMethod ?? "cod") as PaymentMethod;
  const paymentStatus = (raw.paymentStatus ??
    (status === "Completed" ? "Paid" : "Unpaid")) as PaymentStatus;
  return {
    id: raw.id,
    branchId: raw.branchId ?? "b-bole",
    customerName: raw.customerName ?? "Customer",
    customerPhone: raw.customerPhone ?? "",
    items: raw.items ?? [],
    totalEtb: raw.totalEtb ?? 0,
    status,
    paymentMethod,
    paymentStatus,
    notes: raw.notes,
    placedAtIso: raw.placedAtIso ?? new Date().toISOString(),
    updatedAtIso: raw.updatedAtIso ?? raw.placedAtIso ?? new Date().toISOString(),
  };
}

function adjustStockForOrder(
  products: Product[],
  order: Order,
  direction: "reserve" | "restore",
): Product[] {
  const sign = direction === "restore" ? 1 : -1;
  return products.map((p) => {
    const line = order.items.find((it) => it.productId === p.id);
    if (!line) return p;
    const current = p.stockByBranch[order.branchId] ?? 0;
    return {
      ...p,
      stockByBranch: {
        ...p.stockByBranch,
        [order.branchId]: Math.max(0, current + sign * line.qty),
      },
    };
  });
}

const AllMartContext = createContext<AllMartContextValue | null>(null);

export function AllMartProvider({ children }: { children: React.ReactNode }) {
  const { staffSession } = useAuth();
  const [store, setStore] = useState(initialMockStore);
  const [activeBranchId, setActiveBranchIdState] = useState<BranchId>(
    initialMockStore.branches[0]?.id ?? "b-bole",
  );

  const [cart, setCart] = useState<CartState | null>(null);
  const [wishlistIds, setWishlistIds] = useState<ProductId[]>([]);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  // Role comes only from authenticated staff login — never from the public site.
  const erpRoleId: RoleId = staffSession?.roleId ?? "staff";

  // Load persisted state.
  useEffect(() => {
    const persistedStore = safeJsonParse<typeof initialMockStore>(
      localStorage.getItem(STORAGE_STORE_KEY),
      initialMockStore,
    );
    const persistedCart = safeJsonParse<CartState | null>(localStorage.getItem(STORAGE_CART_KEY), null);
    const persistedWishlist = safeJsonParse<ProductId[]>(localStorage.getItem(STORAGE_WISHLIST_KEY), []);

    const persistedBranchId = safeJsonParse<BranchId | null>(
      localStorage.getItem(STORAGE_BRANCH_KEY),
      null,
    );

    queueMicrotask(() => {
      const normalizedBranches = (persistedStore.branches ?? []).map((b) => {
        const seed = initialMockStore.branches.find((x) => x.id === b.id);
        return {
          ...b,
          lat: b.lat ?? seed?.lat,
          lng: b.lng ?? seed?.lng,
          openHour: b.openHour ?? seed?.openHour ?? 8,
          closeHour: b.closeHour ?? seed?.closeHour ?? 21,
        };
      });
      const normalized = {
        ...persistedStore,
        branches: normalizedBranches.length ? normalizedBranches : initialMockStore.branches,
        orders: (persistedStore.orders ?? []).map((o) => normalizeOrder(o as Order)),
      };
      setStore(normalized);
      setCart(persistedCart);
      setWishlistIds(Array.isArray(persistedWishlist) ? persistedWishlist : []);
      if (persistedBranchId) setActiveBranchIdState(persistedBranchId);
    });
  }, []);

  // Persist store.
  useEffect(() => {
    localStorage.setItem(STORAGE_STORE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_BRANCH_KEY, JSON.stringify(activeBranchId));
  }, [activeBranchId]);

  const branches = store.branches;
  const products = store.products;
  const staff = store.staff;
  const orders = store.orders;

  const cartCount = useMemo(() => cart?.items.reduce((sum, it) => sum + it.qty, 0) ?? 0, [cart]);
  const wishlistCount = wishlistIds.length;
  const wishlistProducts = useMemo(
    () => wishlistIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[],
    [wishlistIds, products],
  );

  const cartItemsDetailed = useMemo(() => {
    if (!cart) return [];
    return cart.items
      .map((it) => {
        const product = products.find((p) => p.id === it.productId);
        if (!product) return null;
        const unitPriceEtb = product.priceEtb;
        const lineTotalEtb = unitPriceEtb * it.qty;
        return { product, qty: it.qty, unitPriceEtb, lineTotalEtb };
      })
      .filter(Boolean) as AllMartContextValue["cartItemsDetailed"];
  }, [cart, products]);

  function setActiveBranchId(branchId: BranchId) {
    setActiveBranchIdState(branchId);
    setCart((prev) => {
      if (!prev) return prev;
      if (prev.branchId === branchId) return prev;
      // Keep the prototype simple: cart is branch-specific.
      return null;
    });
  }

  function addToCart(productId: ProductId, qty: number = 1) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const stockInActiveBranch = product.stockByBranch[activeBranchId] ?? 0;
    if (stockInActiveBranch <= 0) return;

    setCart((prev) => {
      const nextBranchId = activeBranchId;
      const base: CartState = prev && prev.branchId === nextBranchId ? prev : { branchId: nextBranchId, items: [] };

      const existing = base.items.find((it) => it.productId === productId);
      const currentQty = existing?.qty ?? 0;
      const nextQty = Math.min(currentQty + qty, stockInActiveBranch);

      const nextItems = existing
        ? base.items.map((it) => (it.productId === productId ? { ...it, qty: nextQty } : it))
        : [...base.items, { productId, qty: nextQty }];

      return { ...base, items: nextItems };
    });
  }

  function updateCartQty(productId: ProductId, qty: number) {
    setCart((prev) => {
      if (!prev) return prev;
      const nextItems = prev.items
        .map((it) => (it.productId === productId ? { ...it, qty } : it))
        .filter((it) => it.qty > 0);
      return { ...prev, items: nextItems };
    });
  }

  function clearCart() {
    setCart(null);
  }

  function isInWishlist(productId: ProductId) {
    return wishlistIds.includes(productId);
  }

  function toggleWishlist(productId: ProductId) {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev],
    );
  }

  function removeFromWishlist(productId: ProductId) {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  }

  function clearWishlist() {
    setWishlistIds([]);
  }

  function placeOrder(args: {
    customerName: string;
    customerPhone: string;
    paymentMethod?: PaymentMethod;
    notes?: string;
  }) {
    if (!cart) return null;
    if (cart.items.length === 0) return null;

    const itemsDetailed = cartItemsDetailed;
    const totalEtb = itemsDetailed.reduce((sum, it) => sum + it.lineTotalEtb, 0);
    const newOrderId = `o-${Date.now()}`;
    const now = new Date().toISOString();

    const branchId = cart.branchId;
    const orderItems: OrderItem[] = cart.items.map((it) => {
      const product = products.find((p) => p.id === it.productId)!;
      return { productId: it.productId, qty: it.qty, unitPriceEtb: product.priceEtb };
    });

    const paymentMethod = args.paymentMethod ?? "cod";
    const newOrder: Order = {
      id: newOrderId,
      branchId,
      customerName: args.customerName.trim(),
      customerPhone: args.customerPhone.trim(),
      items: orderItems,
      totalEtb,
      status: "Pending",
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "Unpaid" : "Paid",
      notes: args.notes?.trim() || undefined,
      placedAtIso: now,
      updatedAtIso: now,
    };

    setStore((prev) => {
      const nextProducts = adjustStockForOrder(prev.products, newOrder, "reserve");
      return { ...prev, products: nextProducts, orders: [newOrder, ...prev.orders] };
    });

    setLastOrderId(newOrderId);
    clearCart();
    return newOrderId;
  }

  const erpPermissions = useMemo(() => {
    if (!staffSession) return [] as Permission[];
    return roleDefinitions[erpRoleId].permissions;
  }, [erpRoleId, staffSession]);

  function hasPermission(permission: Permission) {
    if (!staffSession) return false;
    return erpPermissions.includes(permission);
  }

  function upsertProduct(product: Product) {
    setStore((prev) => {
      const exists = prev.products.some((p) => p.id === product.id);
      const nextProducts = exists ? prev.products.map((p) => (p.id === product.id ? product : p)) : [product, ...prev.products];
      return { ...prev, products: nextProducts };
    });
  }

  function deleteProduct(productId: ProductId) {
    setStore((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== productId) }));
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setStore((prev) => {
      const current = prev.orders.find((o) => o.id === orderId);
      if (!current || current.status === status) return prev;

      let nextProducts = prev.products;
      if (status === "Cancelled" && current.status !== "Cancelled") {
        nextProducts = adjustStockForOrder(prev.products, current, "restore");
      } else if (current.status === "Cancelled" && status !== "Cancelled") {
        nextProducts = adjustStockForOrder(prev.products, current, "reserve");
      }

      const now = new Date().toISOString();
      const nextOrders = prev.orders.map((o) => {
        if (o.id !== orderId) return o;
        const patch: Order = { ...o, status, updatedAtIso: now };
        // Completing a ready/pickup order settles unpaid COD as paid
        if (status === "Completed" && o.paymentStatus === "Unpaid") {
          patch.paymentStatus = "Paid";
        }
        if (status === "Cancelled" && o.paymentStatus === "Paid") {
          // leave Paid until staff explicitly refunds on Payments page
        }
        return patch;
      });

      return { ...prev, products: nextProducts, orders: nextOrders };
    });
  }

  function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus) {
    setStore((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus,
              updatedAtIso: new Date().toISOString(),
              ...(paymentStatus === "Paid" && o.status === "Pending" ? { status: "Confirmed" as OrderStatus } : {}),
            }
          : o,
      ),
    }));
  }

  function updateOrderPaymentMethod(orderId: string, paymentMethod: PaymentMethod) {
    setStore((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId ? { ...o, paymentMethod, updatedAtIso: new Date().toISOString() } : o,
      ),
    }));
  }

  function updateOrderNotes(orderId: string, notes: string) {
    setStore((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId
          ? { ...o, notes: notes.trim() || undefined, updatedAtIso: new Date().toISOString() }
          : o,
      ),
    }));
  }

  function upsertStaff(staffMember: Staff) {
    setStore((prev) => {
      const exists = prev.staff.some((s) => s.id === staffMember.id);
      const nextStaff = exists ? prev.staff.map((s) => (s.id === staffMember.id ? staffMember : s)) : [staffMember, ...prev.staff];
      return { ...prev, staff: nextStaff };
    });
  }

  function deleteStaff(staffId: string) {
    setStore((prev) => ({ ...prev, staff: prev.staff.filter((s) => s.id !== staffId) }));
  }

  function upsertBranch(branch: Branch) {
    setStore((prev) => {
      const exists = prev.branches.some((b) => b.id === branch.id);
      const nextBranches = exists ? prev.branches.map((b) => (b.id === branch.id ? branch : b)) : [branch, ...prev.branches];

      // Also ensure every product has a stock key for new branch.
      const nextProducts = prev.products.map((p) => ({
        ...p,
        stockByBranch: p.stockByBranch[branch.id] === undefined ? { ...p.stockByBranch, [branch.id]: 0 } : p.stockByBranch,
      }));

      return { ...prev, branches: nextBranches, products: nextProducts };
    });
  }

  function deleteBranch(branchId: BranchId) {
    setStore((prev) => {
      const nextBranches = prev.branches.filter((b) => b.id !== branchId);
      const nextProducts = prev.products.map((p) => {
        const { [branchId]: removedStock, ...rest } = p.stockByBranch;
        void removedStock;
        return { ...p, stockByBranch: rest };
      });

      const nextOrders = prev.orders.filter((o) => o.branchId !== branchId);
      const nextStaff = prev.staff.filter((s) => s.branchId !== branchId);

      // If the active branch is deleted, fallback.
      const nextActiveBranchId = nextBranches[0]?.id ?? activeBranchId;
      setActiveBranchIdState(nextActiveBranchId);

      return { ...prev, branches: nextBranches, products: nextProducts, orders: nextOrders, staff: nextStaff };
    });
    setCart(null);
  }

  const value = useMemo<AllMartContextValue>(
    () => ({
      branches,
      products,
      staff,
      orders,
      activeBranchId,
      setActiveBranchId,
      cart,
      cartCount,
      cartItemsDetailed,
      addToCart,
      updateCartQty,
      clearCart,
      wishlistIds,
      wishlistCount,
      wishlistProducts,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
      lastOrderId,
      placeOrder,
      erpRoleId,
      erpPermissions,
      hasPermission,
      upsertProduct,
      deleteProduct,
      updateOrderStatus,
      updatePaymentStatus,
      updateOrderPaymentMethod,
      updateOrderNotes,
      upsertStaff,
      deleteStaff,
      upsertBranch,
      deleteBranch,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [branches, products, staff, orders, activeBranchId, cart, cartItemsDetailed, cartCount, wishlistIds, wishlistCount, wishlistProducts, lastOrderId, erpRoleId, erpPermissions, staffSession],
  );

  return <AllMartContext.Provider value={value}>{children}</AllMartContext.Provider>;
}

export function useAllMart() {
  const ctx = useContext(AllMartContext);
  if (!ctx) throw new Error("useAllMart must be used within <AllMartProvider/>");
  return ctx;
}

