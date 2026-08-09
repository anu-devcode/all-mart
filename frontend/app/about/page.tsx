"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionShell } from "@/components/motion/SectionShell";
import { PageHeroBackground, brandAssets } from "@/components/public/PageHeroBackground";
import { useAllMart } from "@/components/providers/AllMartProvider";

const values = [
  {
    title: "Branch-true stock",
    body: "What you see is what’s on the shelf at your chosen Addis Ababa store — no guessing.",
  },
  {
    title: "Free pickup",
    body: "Order online, collect in about 15 minutes. No delivery fee in this prototype flow.",
  },
  {
    title: "Priced in ETB",
    body: "Clear local pricing on every product, built for everyday shopping in Ethiopia.",
  },
];

const milestones = [
  { label: "Branches", value: "3+" },
  { label: "City", value: "Addis" },
  { label: "Pickup", value: "~15m" },
  { label: "Opens", value: "7–8 AM" },
];

export default function AboutPage() {
  const { branches } = useAllMart();

  return (
    <div className="w-full max-w-full overflow-x-clip pb-20">
      <PageHeroBackground src={brandAssets.teamShop} alt="All Mart team">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange-soft)]">
            About All Mart
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Digital retail for Addis Ababa
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            All Mart connects neighborhood branches with live stock, so families can reserve groceries and pick up
            fresh — fast.
          </p>
        </div>
      </PageHeroBackground>

      {/* Story */}
      <SectionShell className="section-panel surface-panel px-4 py-12 md:py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal variant="up">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] shadow-[var(--shadow-float)]">
              <Image
                src={brandAssets.aisle}
                alt="All Mart aisle"
                fill
                quality={85}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={1} variant="fade">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
                Our story
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
                Built for how Addis shops
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 md:text-[15px]">
                We started with a simple idea: check stock before you leave home, then collect from a branch you
                trust. This prototype shows that full path — choose a store, browse live availability, and simulate
                checkout for free pickup.
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-600 md:text-[15px]">
                From Gerji to Jemo to Ayat, every cart is locked to one location so prices and shelves stay accurate.
              </p>
              <Link
                href="/branches"
                className="btn-float mt-6 inline-flex rounded-full bg-[color:var(--allmart-orange)] px-5 py-3 text-sm font-extrabold text-white"
              >
                See our branches
              </Link>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* Stats strip */}
      <SectionShell className="surface-panel px-4 py-8 md:py-10">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4">
          {milestones.map((m, idx) => (
            <Reveal key={m.label} delay={(Math.min(idx, 3) as 0 | 1 | 2 | 3)} variant="up">
              <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 text-center shadow-sm">
                <div className="text-2xl font-extrabold tracking-tight text-[color:var(--allmart-orange)] md:text-3xl">
                  {m.value}
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-zinc-400">{m.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* Values */}
      <SectionShell className="surface-panel px-4 py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal variant="fade">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
                What we stand for
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
                Simple promises, every shop
              </h2>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {values.map((v, idx) => (
              <Reveal key={v.title} delay={(Math.min(idx, 2) as 0 | 1 | 2)} variant="up">
                <div className="h-full rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[var(--shadow-float)] md:p-6">
                  <div className="h-1 w-8 rounded-full bg-[color:var(--allmart-orange)]" />
                  <h3 className="mt-4 text-base font-extrabold text-zinc-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* Branches snapshot */}
      <SectionShell className="surface-panel-strong px-4 py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal variant="fade">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
                  Locations
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
                  Across Addis Ababa
                </h2>
              </div>
              <Link href="/branches" className="text-sm font-bold text-[color:var(--allmart-orange)] hover:underline">
                View all branches →
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {branches.map((b, idx) => (
              <Reveal key={b.id} delay={(Math.min(idx, 2) as 0 | 1 | 2)} variant="up">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-extrabold text-zinc-900">{b.name.replace("All Mart ", "")}</div>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{b.address}</p>
                  {b.phone ? <p className="mt-2 text-xs font-semibold text-zinc-700">{b.phone}</p> : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* CTA */}
      <SectionShell className="surface-panel px-4 py-12 md:py-14">
        <Reveal variant="scale">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 rounded-[1.5rem] border border-[color:var(--allmart-orange)]/20 bg-gradient-to-br from-white to-orange-50/80 p-6 md:flex-row md:items-center md:p-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
                Ready when you are
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
                Start your next shop
              </h2>
              <p className="mt-2 max-w-lg text-sm text-zinc-600">
                Pick a branch, browse live stock, and reserve for free pickup — no account required to explore.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="btn-float rounded-full bg-[color:var(--allmart-orange)] px-6 py-3.5 text-sm font-extrabold text-white"
              >
                Go to shop
              </Link>
              <Link
                href="/contact"
                className="btn-float-ghost rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-sm font-bold text-zinc-800"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </div>
  );
}
