"use client";

import Link from "next/link";
import React, { FormEvent, useMemo, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionShell } from "@/components/motion/SectionShell";
import { PageHeroBackground, brandAssets } from "@/components/public/PageHeroBackground";
import { useAllMart } from "@/components/providers/AllMartProvider";
import { osmEmbedSrc, osmOpenUrl } from "@/lib/customerAccount";
import { formatBranchHours } from "@/lib/branchHours";
import { companyContact } from "@/lib/companyContact";
import { SocialIconLinks } from "@/components/brand/SocialIconLinks";

const topics = ["General question", "Order / pickup help", "Branch feedback", "Partnership", "Other"] as const;

export default function ContactPage() {
  const { branches, activeBranchId } = useAllMart();
  const active = branches.find((b) => b.id === activeBranchId) ?? branches[0];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState<(typeof topics)[number]>("General question");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapBranchId, setMapBranchId] = useState(active?.id ?? "");

  const mapBranch = useMemo(
    () => branches.find((b) => b.id === mapBranchId) ?? active,
    [branches, mapBranchId, active],
  );

  const mapSrc = useMemo(() => {
    if (!mapBranch?.lat || !mapBranch?.lng) return null;
    return osmEmbedSrc(mapBranch.lat, mapBranch.lng, 0.016);
  }, [mapBranch]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setSent(true);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setTopic("General question");
  }

  const inputClass =
    "mt-1.5 h-11 w-full min-w-0 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-[color:var(--allmart-orange)] focus:ring-4 focus:ring-[color:var(--allmart-orange)]/15";

  return (
    <div className="w-full max-w-full overflow-x-clip pb-20">
      <PageHeroBackground src={brandAssets.aisleContact} alt="Contact All Mart">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--allmart-orange-soft)]">
            Contact
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            We’re here to help
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            Reach All Mart at Gerji Mebrat Hayel or any pickup branch — call, email, or send a message below.
          </p>
        </div>
      </PageHeroBackground>

      {/* Quick contacts */}
      <SectionShell className="section-panel surface-panel px-4 py-10 md:py-12">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Call",
              value: companyContact.phoneMobile,
              href: `tel:${companyContact.phoneMobileTel}`,
              hint: `Also Gerji: ${companyContact.phoneLandline}`,
            },
            {
              label: "Email",
              value: companyContact.email,
              href: `mailto:${companyContact.email}`,
              hint: "We reply within one business day",
            },
            {
              label: "Visit HQ",
              value: "Gerji Mebrat Hayel",
              href: "/branches",
              hint: companyContact.city,
            },
            {
              label: "Website",
              value: companyContact.websiteLabel,
              href: companyContact.website,
              hint: companyContact.hoursNote,
              external: true,
            },
          ].map((c, idx) => (
            <Reveal key={c.label} delay={(Math.min(idx, 3) as 0 | 1 | 2 | 3)} variant="up">
              <a
                href={c.href}
                target={"external" in c && c.external ? "_blank" : undefined}
                rel={"external" in c && c.external ? "noreferrer noopener" : undefined}
                className="block h-full rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[var(--shadow-float)] transition hover:-translate-y-0.5 hover:border-[color:var(--allmart-orange)]/35"
              >
                <div className="text-[11px] font-bold uppercase tracking-wide text-[color:var(--allmart-orange)]">
                  {c.label}
                </div>
                <div className="mt-2 text-sm font-extrabold text-zinc-900 break-all">{c.value}</div>
                <p className="mt-1 text-xs text-zinc-500">{c.hint}</p>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-6xl flex-col items-start justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Follow All Mart</div>
            <p className="mt-1 text-sm text-zinc-600">Facebook · TikTok @allmartsupermarket1 · Website</p>
          </div>
          <SocialIconLinks tone="light" />
        </div>
      </SectionShell>

      {/* Form + map */}
      <SectionShell className="surface-panel px-4 py-12 md:py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <Reveal variant="up">
            <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-5 shadow-[var(--shadow-float)] sm:p-6 md:p-7">
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-900">Send a message</h2>
              <p className="mt-1 text-sm text-zinc-500">Tell us how we can help — fields marked required.</p>

              {sent ? (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5">
                  <div className="text-sm font-extrabold text-emerald-800">Message sent</div>
                  <p className="mt-1 text-sm text-emerald-700">
                    Thanks — in production this would reach our team. For now it’s a local simulation.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-4 text-xs font-bold text-[color:var(--allmart-orange)] hover:underline"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Name *</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                        placeholder="Your name"
                        required
                        disabled={sending}
                      />
                    </label>
                    <label className="block min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Email *</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="you@email.com"
                        required
                        disabled={sending}
                      />
                    </label>
                    <label className="block min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Phone</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                        placeholder="09…"
                        disabled={sending}
                      />
                    </label>
                    <label className="block min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Topic</span>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value as (typeof topics)[number])}
                        className={inputClass}
                        disabled={sending}
                      >
                        {topics.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="block min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">Message *</span>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="mt-1.5 w-full min-w-0 resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[color:var(--allmart-orange)] focus:ring-4 focus:ring-[color:var(--allmart-orange)]/15"
                      placeholder="How can we help?"
                      required
                      disabled={sending}
                    />
                  </label>

                  {error ? (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-700">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-float w-full rounded-xl bg-[color:var(--allmart-orange)] py-3.5 text-sm font-extrabold text-white disabled:opacity-70 sm:w-auto sm:px-8"
                  >
                    {sending ? "Sending…" : "Send message"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={1} variant="fade">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-zinc-900">Find a branch</h2>
                <p className="mt-1 text-sm text-zinc-500">Select a store to preview its map pin.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setMapBranchId(b.id)}
                    className={[
                      "rounded-full px-3.5 py-2 text-xs font-extrabold transition",
                      mapBranch?.id === b.id
                        ? "bg-[color:var(--allmart-orange)] text-white"
                        : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    {b.name.replace("All Mart ", "")}
                  </button>
                ))}
              </div>

              {mapBranch ? (
                <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-[var(--shadow-float)]">
                  {mapSrc ? (
                    <div className="relative aspect-[16/11] bg-zinc-100 sm:aspect-[16/10]">
                      <iframe
                        title={`Map of ${mapBranch.name}`}
                        src={mapSrc}
                        className="absolute inset-0 h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/11] items-center justify-center bg-zinc-100 text-sm text-zinc-400">
                      Map unavailable
                    </div>
                  )}
                  <div className="p-4 sm:p-5">
                    <div className="text-sm font-extrabold text-zinc-900">{mapBranch.name}</div>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">{mapBranch.address}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-zinc-600">
                      <span>{formatBranchHours(mapBranch)}</span>
                      {mapBranch.phone ? <a href={`tel:${mapBranch.phone.replace(/\D/g, "")}`}>{mapBranch.phone}</a> : null}
                    </div>
                    {mapBranch.lat != null && mapBranch.lng != null ? (
                      <a
                        href={osmOpenUrl(mapBranch.lat, mapBranch.lng)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-xs font-bold text-[color:var(--allmart-orange)] hover:underline"
                      >
                        Open in OpenStreetMap →
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                Prefer shopping first?{" "}
                <Link href="/shop" className="font-bold text-[color:var(--allmart-orange)] hover:underline">
                  Browse the shop
                </Link>{" "}
                or{" "}
                <Link href="/branches" className="font-bold text-[color:var(--allmart-orange)] hover:underline">
                  choose a branch
                </Link>
                .
              </div>
            </div>
          </Reveal>
        </div>
      </SectionShell>
    </div>
  );
}
