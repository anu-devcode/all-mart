"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

type Step = {
  id: string;
  step: string;
  title: string;
  body: string;
  hint: string;
  href: string;
  cta: string;
  icon: React.ReactNode;
};

const steps: Step[] = [
  {
    id: "branch",
    step: "01",
    title: "Choose a branch",
    body: "Pick Gerji, Jemo, or Ayat so stock matches the store you’ll visit.",
    hint: "Takes ~10 seconds",
    href: "/branches",
    cta: "Select branch",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    id: "browse",
    step: "02",
    title: "Browse live stock",
    body: "Only add items available at your selected Addis Ababa branch.",
    hint: "Live availability",
    href: "/shop",
    cta: "Open shop",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M4 7h16l-1.2 11.2A2 2 0 0 1 16.8 20H7.2a2 2 0 0 1-2-1.8L4 7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "pickup",
    step: "03",
    title: "Pickup free",
    body: "Checkout online, then collect at your branch — usually ready in ~15 minutes.",
    hint: "Free pickup",
    href: "/cart",
    cta: "View cart",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M9 7V5h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function StepCard({
  step,
  active,
  onActivate,
  light,
}: {
  step: Step;
  active: boolean;
  onActivate: () => void;
  light: boolean;
}) {
  return (
    <div
      role="group"
      aria-labelledby={`journey-step-${step.id}`}
      onMouseEnter={onActivate}
      onFocusCapture={onActivate}
      className={[
        "group relative h-full min-w-0 rounded-2xl border p-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-5",
        light
          ? active
            ? "border-[color:var(--allmart-orange)]/50 bg-orange-50/60 shadow-[0_12px_32px_rgba(255,106,0,0.12)]"
            : "border-zinc-200 bg-white hover:border-zinc-300"
          : active
            ? "border-[color:var(--allmart-orange)]/55 bg-white/14 shadow-[0_16px_40px_rgba(255,106,0,0.18)]"
            : "border-white/12 bg-white/8 hover:border-white/25 hover:bg-white/12",
      ].join(" ")}
    >
      <button type="button" onClick={onActivate} className="w-full min-w-0 text-left" aria-current={active ? "step" : undefined}>
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={[
              "relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition-all duration-500",
              active
                ? "bg-[color:var(--allmart-orange)] text-white shadow-[0_0_0_6px_rgba(255,106,0,0.2)]"
                : light
                  ? "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200"
                  : "bg-white/10 text-white ring-1 ring-white/20 group-hover:bg-white/15",
            ].join(" ")}
          >
            {active ? step.icon : step.step}
          </span>
          <div className="min-w-0 flex-1">
            <div
              className={[
                "text-[10px] font-bold uppercase tracking-[0.18em]",
                light ? "text-zinc-400" : "text-white/45",
              ].join(" ")}
            >
              Step {step.step}
            </div>
            <div
              id={`journey-step-${step.id}`}
              className={["text-sm font-extrabold leading-snug", light ? "text-zinc-900" : "text-white"].join(" ")}
            >
              {step.title}
            </div>
          </div>
        </div>

        <p className={["mt-3 text-xs leading-5", light ? "text-zinc-600" : "text-white/70"].join(" ")}>{step.body}</p>
      </button>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className={["text-[10px] font-semibold", light ? "text-zinc-400" : "text-white/45"].join(" ")}>
          {step.hint}
        </span>
        <Link
          href={step.href}
          className={[
            "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-extrabold transition",
            active
              ? "bg-[color:var(--allmart-orange)] text-white"
              : light
                ? "bg-zinc-100 text-zinc-700 group-hover:bg-zinc-200"
                : "bg-white/10 text-white/80 group-hover:bg-white/15",
          ].join(" ")}
        >
          {step.cta}
          <span aria-hidden>→</span>
        </Link>
      </div>

      <span
        className={[
          "pointer-events-none absolute inset-x-4 bottom-0 h-0.5 origin-left rounded-full bg-[color:var(--allmart-orange)] transition-transform duration-700",
          active ? "scale-x-100" : "scale-x-0",
        ].join(" ")}
        aria-hidden
      />
    </div>
  );
}

/**
 * Interactive how-it-works stepper — CSS-first for performance.
 */
export function HeroJourney({ tone = "light" }: { tone?: "light" | "dark" }) {
  const light = tone === "light";
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % steps.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      className="min-w-0 max-w-full"
      onMouseEnter={() => setPaused(true)}
      onFocusCapture={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange)]">
            How it works
          </p>
          <p className={["mt-1 text-sm font-semibold", light ? "text-zinc-700" : "text-white/80"].join(" ")}>
            Three steps from branch to pickup
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
          {steps.map((s, i) => (
            <span
              key={s.id}
              className={[
                "h-1 rounded-full transition-all duration-500",
                i === active
                  ? "w-6 bg-[color:var(--allmart-orange)]"
                  : light
                    ? "w-1.5 bg-zinc-200"
                    : "w-1.5 bg-white/25",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {/* Desktop: 3-column with connector */}
      <div className="relative hidden md:block">
        <div
          className={[
            "pointer-events-none absolute left-[16%] right-[16%] top-[2.15rem] h-px",
            light ? "bg-zinc-200" : "bg-white/15",
          ].join(" ")}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-[16%] top-[2.15rem] h-px origin-left bg-[color:var(--allmart-orange)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: "68%", transform: `scaleX(${active / Math.max(steps.length - 1, 1)})` }}
          aria-hidden
        />

        <ol className="grid grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <li key={s.id} className="min-w-0">
              <StepCard step={s} active={i === active} onActivate={() => setActive(i)} light={light} />
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile: same cards stacked full-width (no horizontal overflow) */}
      <div className="md:hidden">
        <ol className="flex flex-col gap-3">
          {steps.map((s, i) => (
            <li key={s.id} className="min-w-0">
              <StepCard step={s} active={i === active} onActivate={() => setActive(i)} light={light} />
            </li>
          ))}
        </ol>

        <div className="mt-4 flex justify-center gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to step ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => setActive(i)}
              className={[
                "h-1.5 rounded-full transition-all",
                i === active
                  ? "w-5 bg-[color:var(--allmart-orange)]"
                  : light
                    ? "w-1.5 bg-zinc-300"
                    : "w-1.5 bg-white/30",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
