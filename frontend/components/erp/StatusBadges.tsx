import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/types";

const orderTone: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-800 ring-amber-200",
  Confirmed: "bg-sky-50 text-sky-800 ring-sky-200",
  Preparing: "bg-violet-50 text-violet-800 ring-violet-200",
  Ready: "bg-orange-50 text-[color:var(--allmart-orange)] ring-orange-200",
  Completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
};

const orderDot: Record<OrderStatus, string> = {
  Pending: "bg-amber-500",
  Confirmed: "bg-sky-500",
  Preparing: "bg-violet-500",
  Ready: "bg-[color:var(--allmart-orange)]",
  Completed: "bg-emerald-500",
  Cancelled: "bg-rose-500",
};

const paymentTone: Record<PaymentStatus, string> = {
  Unpaid: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  Paid: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Failed: "bg-rose-50 text-rose-700 ring-rose-200",
  Refunded: "bg-purple-50 text-purple-800 ring-purple-200",
};

const paymentDot: Record<PaymentStatus, string> = {
  Unpaid: "bg-zinc-400",
  Paid: "bg-emerald-500",
  Failed: "bg-rose-500",
  Refunded: "bg-purple-500",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${orderTone[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${orderDot[status]}`} />
      {status}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${paymentTone[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${paymentDot[status]}`} />
      {status}
    </span>
  );
}

export function PaymentMethodChip({ method }: { method: PaymentMethod }) {
  const labels: Record<PaymentMethod, string> = {
    cod: "Cash pickup",
    telebirr: "Telebirr",
    chapa: "Chapa",
    card: "Card",
  };
  return (
    <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-700">
      {labels[method]}
    </span>
  );
}

/** Next allowed fulfillment statuses from current state */
export function nextOrderStatuses(current: OrderStatus): OrderStatus[] {
  switch (current) {
    case "Pending":
      return ["Confirmed", "Cancelled"];
    case "Confirmed":
      return ["Preparing", "Cancelled"];
    case "Preparing":
      return ["Ready", "Cancelled"];
    case "Ready":
      return ["Completed", "Cancelled"];
    case "Completed":
      return [];
    case "Cancelled":
      return ["Pending"];
    default:
      return [];
  }
}
