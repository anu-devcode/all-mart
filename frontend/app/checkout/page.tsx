"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { PageHeroBackground, brandAssets } from "@/components/public/PageHeroBackground";
import { Reveal } from "@/components/motion/Reveal";
import { formatEtb } from "@/lib/format";

export default function CheckoutPage() {
  const { cart, cartItemsDetailed, placeOrder, orders, lastOrderId } = useAllMart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "telebirr" | "chapa">("cod");
  const [submitting, setSubmitting] = useState(false);

  const totalEtb = cartItemsDetailed.reduce((sum, it) => sum + it.lineTotalEtb, 0);

  const latestPlacedOrder = useMemo(() => {
    if (!lastOrderId) return null;
    return orders.find((o) => o.id === lastOrderId) ?? null;
  }, [orders, lastOrderId]);

  const orderToShow = latestPlacedOrder;

  async function onPlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!cart || cartItemsDetailed.length === 0) return;

    setSubmitting(true);
    try {
      placeOrder({ customerName, customerPhone, paymentMethod });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 h-11 w-full rounded-full border border-zinc-200 bg-white/90 px-4 text-sm outline-none transition focus:border-[color:var(--allmart-orange)] focus:ring-4 focus:ring-[color:var(--allmart-orange)]/15";

  if (!cart || cartItemsDetailed.length === 0) {
    if (orderToShow) {
      return (
        <div className="pb-20">
          <PageHeroBackground src={brandAssets.storeInterior} alt="Checkout success" minHeightClassName="min-h-[240px] md:min-h-[280px]">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Order Confirmed</h1>
              <p className="mt-3 text-sm text-white/85">Your simulated order was placed successfully.</p>
            </div>
          </PageHeroBackground>
          <div className="section-panel surface-panel relative -mt-6 px-4 py-12 backdrop-blur-sm">
            <Reveal>
              <div className="mx-auto max-w-xl float-glass rounded-[1.75rem] border border-[color:var(--allmart-orange)]/25 p-8">
                <div className="text-sm font-bold text-[color:var(--allmart-orange)]">Order placed successfully</div>
                <div className="mt-3 text-sm text-zinc-800">
                  Order ID: <span className="font-extrabold">{orderToShow.id}</span>
                </div>
                <div className="mt-1 text-sm text-zinc-800">
                  Status: <span className="font-extrabold">{orderToShow.status}</span>
                </div>
                <div className="mt-1 text-sm text-zinc-800">
                  Payment:{" "}
                  <span className="font-extrabold">
                    {orderToShow.paymentStatus} · {orderToShow.paymentMethod.toUpperCase()}
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/shop"
                    className="btn-float rounded-full bg-[color:var(--allmart-orange)] px-5 py-3 text-sm font-extrabold text-white"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/"
                    className="btn-float-ghost rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-800"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      );
    }

    return (
      <div className="pb-20">
        <PageHeroBackground src={brandAssets.storeInterior} alt="Checkout" minHeightClassName="min-h-[240px] md:min-h-[280px]">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Checkout</h1>
            <p className="mt-3 text-sm text-white/85">Complete your simulated order.</p>
          </div>
        </PageHeroBackground>
        <div className="section-panel surface-panel relative -mt-6 px-4 py-12 backdrop-blur-sm">
          <Reveal>
            <div className="mx-auto max-w-xl float-glass rounded-[1.75rem] p-8 text-center">
              <div className="text-lg font-extrabold text-zinc-900">Nothing to checkout</div>
              <p className="mt-2 text-sm text-zinc-600">Your cart is empty. Add items first.</p>
              <Link
                href="/shop"
                className="btn-float mt-6 inline-flex rounded-full bg-[color:var(--allmart-orange)] px-6 py-3 text-sm font-extrabold text-white"
              >
                Back to Shop
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <PageHeroBackground src={brandAssets.storeInterior} alt="Checkout" minHeightClassName="min-h-[240px] md:min-h-[280px]">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Checkout</h1>
          <p className="mt-3 max-w-xl text-sm text-white/85">
            Simulated order — creates a mock order and updates local inventory.
          </p>
        </div>
      </PageHeroBackground>

      <div className="section-panel surface-panel relative -mt-6 px-4 py-12 backdrop-blur-sm">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="float-glass rounded-[1.5rem] p-6 md:p-7">
              {orderToShow ? (
                <div className="rounded-2xl bg-[color:var(--allmart-orange)]/10 p-5">
                  <div className="text-sm font-bold text-[color:var(--allmart-orange)]">Order placed successfully</div>
                  <div className="mt-2 text-sm text-zinc-800">
                    Order ID: <span className="font-extrabold">{orderToShow.id}</span>
                  </div>
                  <div className="mt-1 text-sm text-zinc-800">
                    Status: <span className="font-extrabold">{orderToShow.status}</span>
                  </div>
                  <div className="mt-1 text-sm text-zinc-800">
                    Payment:{" "}
                    <span className="font-extrabold">
                      {orderToShow.paymentStatus} · {orderToShow.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/shop"
                      className="btn-float rounded-full bg-[color:var(--allmart-orange)] px-5 py-3 text-sm font-extrabold text-white"
                    >
                      Continue Shopping
                    </Link>
                    <Link
                      href="/"
                      className="btn-float-ghost rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-800"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={onPlaceOrder} className="space-y-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-500">
                    <span className="rounded-full bg-[color:var(--allmart-orange)] px-2.5 py-1 text-white">1</span>
                    Customer
                    <span className="mx-1 text-zinc-300">→</span>
                    <span className="rounded-full bg-zinc-200 px-2.5 py-1 text-zinc-600">2</span>
                    Payment
                    <span className="mx-1 text-zinc-300">→</span>
                    <span className="rounded-full bg-zinc-200 px-2.5 py-1 text-zinc-600">3</span>
                    Place order
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-500" htmlFor="customerName">
                      Full Name
                    </label>
                    <input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={inputClass}
                      placeholder="e.g. John Smith"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500" htmlFor="customerPhone">
                      Phone Number
                    </label>
                    <input
                      id="customerPhone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className={inputClass}
                      placeholder="+251-9..."
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500" htmlFor="address">
                      Address (House No, Kebele, Woreda)
                    </label>
                    <input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={inputClass}
                      placeholder="Addis Ababa"
                    />
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-zinc-500">Payment method (mock)</div>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {(
                        [
                          { id: "cod", label: "Cash on Delivery" },
                          { id: "telebirr", label: "Telebirr" },
                          { id: "chapa", label: "Chapa" },
                        ] as const
                      ).map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={[
                            "rounded-2xl border px-3 py-3 text-left text-sm font-bold transition",
                            paymentMethod === method.id
                              ? "border-[color:var(--allmart-orange)] bg-[color:var(--allmart-orange)]/10 text-[color:var(--allmart-orange)] shadow-[0_10px_24px_rgba(255,106,0,0.12)]"
                              : "border-zinc-200 bg-white/80 text-zinc-700 hover:bg-white",
                          ].join(" ")}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={submitting}
                    type="submit"
                    className="btn-float w-full rounded-full bg-[color:var(--allmart-orange)] px-4 py-3.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Placing..." : "Place Order (Mock Success)"}
                  </button>
                  <p className="text-xs text-zinc-500">
                    No delivery integration in this prototype. Selected payment:{" "}
                    <span className="font-bold text-zinc-700">{paymentMethod.toUpperCase()}</span>.
                  </p>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="float-glass sticky top-28 rounded-[1.5rem] p-6">
              <h2 className="text-sm font-extrabold text-zinc-900">Order Summary</h2>
              <div className="mt-4 space-y-3">
                {cartItemsDetailed.map((it) => (
                  <div key={it.product.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-zinc-900">{it.product.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {it.qty} × {formatEtb(it.unitPriceEtb)}
                      </div>
                    </div>
                    <div className="text-sm font-extrabold text-[color:var(--allmart-orange)]">
                      {formatEtb(it.lineTotalEtb)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-zinc-200/80 pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-zinc-700">Total</div>
                  <div className="text-lg font-extrabold text-zinc-900">{formatEtb(totalEtb)}</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
