import type { Branch, Order, Product, Staff, BranchId } from "./types";

export type MockStore = {
  branches: Branch[];
  products: Product[];
  orders: Order[];
  staff: Staff[];
};

const branchIds = ["b-bole", "b-kirkos", "b-yeka"] as const satisfies BranchId[];

export const initialBranches: Branch[] = [
  {
    id: branchIds[0],
    name: "All Mart Gerji",
    city: "Addis Ababa",
    address: "Gerji Mebrat Hayel · Plus code 2R45+C36",
    openHour: 8,
    closeHour: 21,
    phone: "011 629 5876",
    lat: 8.9955,
    lng: 38.8098,
  },
  {
    id: branchIds[1],
    name: "All Mart Jemo",
    city: "Addis Ababa",
    address: "Jemo · Plus code XP67+HWF",
    openHour: 8,
    closeHour: 21,
    phone: "099 149 1959",
    lat: 8.9572,
    lng: 38.7154,
  },
  {
    id: branchIds[2],
    name: "All Mart Ayat",
    city: "Addis Ababa",
    address: "ALL MART PLUS · Ayat Zone 3 · Plus code 2V9F+298",
    openHour: 7,
    closeHour: 21,
    phone: "099 149 1959",
    lat: 9.0224,
    lng: 38.8772,
  },
];

function stock(a: number, b: number, c: number) {
  return {
    [branchIds[0]]: a,
    [branchIds[1]]: b,
    [branchIds[2]]: c,
  };
}

export const initialProducts: Product[] = [
  {
    id: "p-banana",
    name: "Fresh Banana",
    category: "Fresh & Vegetables",
    description: "Sweet fresh bananas (sold by piece).",
    priceEtb: 12,
    imageUrl: "/images/products/banana.jpg",
    shelfCode: "A1",
    stockByBranch: stock(18, 12, 0),
    isActive: true,
  },
  {
    id: "p-red-apple",
    name: "Red Apple",
    category: "Fresh & Vegetables",
    description: "Crisp red apples for daily snacking.",
    priceEtb: 26,
    imageUrl: "/images/products/apple.jpg",
    shelfCode: "A2",
    stockByBranch: stock(10, 0, 8),
    isActive: true,
  },
  {
    id: "p-sunflower-oil",
    name: "Sunflower Oil",
    category: "Packed Food",
    description: "Cooking-grade sunflower oil, 1L.",
    priceEtb: 320,
    imageUrl: "/images/products/oil.jpg",
    shelfCode: "B1",
    stockByBranch: stock(6, 4, 9),
    isActive: true,
  },
  {
    id: "p-tide",
    name: "Tide Washing Powder",
    category: "Household",
    description: "Laundry detergent powder (1kg).",
    priceEtb: 210,
    imageUrl: "/images/products/detergent.jpg",
    shelfCode: "C3",
    stockByBranch: stock(3, 1, 5),
    isActive: true,
  },
  {
    id: "p-dermol-shampoo",
    name: "Dermo Shampoo",
    category: "Personal Care",
    description: "Hair care shampoo for everyday use.",
    priceEtb: 385,
    imageUrl: "/images/products/shampoo.jpg",
    shelfCode: "D2",
    stockByBranch: stock(8, 2, 7),
    isActive: true,
  },
  {
    id: "p-juice",
    name: "Fruit Juice 1L",
    category: "Beverages",
    description: "Refreshing bottled fruit juice (1L).",
    priceEtb: 140,
    imageUrl: "/images/products/juice.jpg",
    shelfCode: "E1",
    stockByBranch: stock(12, 7, 6),
    isActive: true,
  },
  {
    id: "p-soda",
    name: "Sparkling Soda",
    category: "Beverages",
    description: "Carbonated soda (330ml).",
    priceEtb: 25,
    imageUrl: "/images/products/soda.jpg",
    shelfCode: "E2",
    stockByBranch: stock(20, 15, 11),
    isActive: true,
  },
  {
    id: "p-chips",
    name: "Potato Chips",
    category: "Snacks & Food",
    description: "Crunchy chips (50g).",
    priceEtb: 55,
    imageUrl: "/images/products/chips.jpg",
    shelfCode: "F1",
    stockByBranch: stock(14, 9, 3),
    isActive: true,
  },
  {
    id: "p-chocolate",
    name: "Chocolate Bar",
    category: "Snacks & Food",
    description: "Milk chocolate bar (70g).",
    priceEtb: 75,
    imageUrl: "/images/products/chocolate.jpg",
    shelfCode: "F2",
    stockByBranch: stock(9, 6, 2),
    isActive: true,
  },
  {
    id: "p-bread",
    name: "Sandwich Bread",
    category: "Bakery & Dairy",
    description: "Fresh bread for sandwiches (500g).",
    priceEtb: 85,
    imageUrl: "/images/products/bread.jpg",
    shelfCode: "G1",
    stockByBranch: stock(7, 2, 5),
    isActive: true,
  },
  {
    id: "p-margarine",
    name: "Margarine Spread",
    category: "Bakery & Dairy",
    description: "Butter-like spread (200g).",
    priceEtb: 160,
    imageUrl: "/images/products/margarine.jpg",
    shelfCode: "G2",
    stockByBranch: stock(0, 4, 6),
    isActive: true,
  },
  {
    id: "p-beans",
    name: "Canned Beans",
    category: "Packed Food",
    description: "Ready-to-cook canned beans (400g).",
    priceEtb: 95,
    imageUrl: "/images/products/beans.jpg",
    shelfCode: "B2",
    stockByBranch: stock(5, 9, 1),
    isActive: true,
  },
];

export const initialStaff: Staff[] = [
  { id: "s-1", name: "Admin A.", roleId: "admin", branchId: branchIds[0], email: "admin@allmart.et" },
  { id: "s-2", name: "Manager B.", roleId: "manager", branchId: branchIds[1], email: "manager@allmart.et" },
  { id: "s-3", name: "Staff C.", roleId: "staff", branchId: branchIds[0], email: "staff@allmart.et" },
  { id: "s-4", name: "Staff D.", roleId: "staff", branchId: branchIds[2], email: "staff2@allmart.et" },
  { id: "s-5", name: "Manager E.", roleId: "manager", branchId: branchIds[0], email: "manager2@allmart.et" },
];

function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const initialOrders: Order[] = [
  {
    id: "o-1001",
    branchId: branchIds[0],
    customerName: "John Smith",
    customerPhone: "+251-9-111-222-333",
    placedAtIso: daysAgoIso(5),
    updatedAtIso: daysAgoIso(4),
    status: "Completed",
    paymentMethod: "telebirr",
    paymentStatus: "Paid",
    items: [
      { productId: "p-soda", qty: 8, unitPriceEtb: 25 },
      { productId: "p-chips", qty: 2, unitPriceEtb: 55 },
    ],
    totalEtb: 8 * 25 + 2 * 55,
  },
  {
    id: "o-1002",
    branchId: branchIds[1],
    customerName: "Alice Johnson",
    customerPhone: "+251-9-444-555-666",
    placedAtIso: daysAgoIso(3),
    updatedAtIso: daysAgoIso(3),
    status: "Preparing",
    paymentMethod: "cod",
    paymentStatus: "Unpaid",
    items: [{ productId: "p-banana", qty: 12, unitPriceEtb: 12 }],
    totalEtb: 12 * 12,
  },
  {
    id: "o-1003",
    branchId: branchIds[2],
    customerName: "Michael Brown",
    customerPhone: "+251-9-222-333-444",
    placedAtIso: daysAgoIso(2),
    updatedAtIso: daysAgoIso(1),
    status: "Ready",
    paymentMethod: "chapa",
    paymentStatus: "Paid",
    items: [
      { productId: "p-sunflower-oil", qty: 1, unitPriceEtb: 320 },
      { productId: "p-beans", qty: 3, unitPriceEtb: 95 },
    ],
    totalEtb: 320 + 3 * 95,
  },
  {
    id: "o-1004",
    branchId: branchIds[0],
    customerName: "Emily Davis",
    customerPhone: "+251-9-777-888-999",
    placedAtIso: daysAgoIso(1),
    updatedAtIso: daysAgoIso(1),
    status: "Pending",
    paymentMethod: "cod",
    paymentStatus: "Unpaid",
    items: [
      { productId: "p-tide", qty: 2, unitPriceEtb: 210 },
      { productId: "p-chocolate", qty: 3, unitPriceEtb: 75 },
    ],
    totalEtb: 2 * 210 + 3 * 75,
  },
  {
    id: "o-1005",
    branchId: branchIds[1],
    customerName: "Sara Bekele",
    customerPhone: "+251-9-101-202-303",
    placedAtIso: daysAgoIso(0),
    updatedAtIso: daysAgoIso(0),
    status: "Confirmed",
    paymentMethod: "card",
    paymentStatus: "Paid",
    notes: "Customer prefers afternoon pickup",
    items: [
      { productId: "p-margarine", qty: 1, unitPriceEtb: 160 },
      { productId: "p-bread", qty: 2, unitPriceEtb: 85 },
    ],
    totalEtb: 160 + 2 * 85,
  },
];

export const initialMockStore = {
  branches: initialBranches,
  products: initialProducts,
  orders: initialOrders,
  staff: initialStaff,
} satisfies MockStore;

