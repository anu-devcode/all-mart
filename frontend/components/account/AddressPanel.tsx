"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { AccountMiniMap } from "@/components/account/AccountMiniMap";
import { IconLocate } from "@/components/account/AccountIcons";
import { useCustomerAccount } from "@/components/providers/CustomerAccountProvider";
import { ADDIS_DEFAULT, ADDIS_SUBCITIES, type SavedAddress } from "@/lib/customerAccount";

const emptyForm = {
  label: "Home",
  line1: "",
  subcity: "Gerji",
  city: "Addis Ababa",
  phone: "",
  lat: ADDIS_DEFAULT.lat,
  lng: ADDIS_DEFAULT.lng,
  isDefault: true,
};

export function AddressPanel({ active }: { active: boolean }) {
  const { account, saveAddress, deleteAddress, setDefaultAddress, locateMe, updateProfile } =
    useCustomerAccount();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [locating, setLocating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const addresses = account?.addresses ?? [];
  const preview = addresses.find((a) => a.isDefault) ?? addresses[0];
  const mapLat = openForm ? form.lat : preview?.lat ?? ADDIS_DEFAULT.lat;
  const mapLng = openForm ? form.lng : preview?.lng ?? ADDIS_DEFAULT.lng;

  useEffect(() => {
    if (!active) return;
    if (addresses.length === 0) setOpenForm(true);
  }, [active, addresses.length]);

  function startEdit(a: SavedAddress) {
    setEditingId(a.id);
    setForm({
      label: a.label,
      line1: a.line1,
      subcity: a.subcity,
      city: a.city,
      phone: a.phone ?? "",
      lat: a.lat,
      lng: a.lng,
      isDefault: a.isDefault,
    });
    setOpenForm(true);
    setMsg(null);
  }

  function startNew() {
    setEditingId(null);
    setForm({ ...emptyForm, isDefault: addresses.length === 0 });
    setOpenForm(true);
    setMsg(null);
  }

  async function onLocate() {
    setLocating(true);
    setMsg(null);
    const res = await locateMe();
    setLocating(false);
    if ("error" in res) {
      setMsg(res.error);
      return;
    }
    setForm((f) => ({ ...f, lat: res.lat, lng: res.lng }));
    setMsg("Location pinned from your device.");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.line1.trim()) {
      setMsg("Add a street or landmark.");
      return;
    }
    saveAddress({
      id: editingId ?? undefined,
      label: form.label,
      line1: form.line1,
      subcity: form.subcity,
      city: form.city,
      phone: form.phone,
      lat: form.lat,
      lng: form.lng,
      isDefault: form.isDefault,
    });
    if (form.phone) updateProfile({ phone: form.phone });
    setMsg("Address saved.");
    setOpenForm(false);
    setEditingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-zinc-500">Pin where you want pickup reminders and future delivery.</p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="shrink-0 rounded-full bg-[color:var(--allmart-orange)] px-4 py-2 text-xs font-extrabold text-white"
        >
          Add address
        </button>
      </div>

      <AccountMiniMap lat={mapLat} lng={mapLng} active={active} title="Saved address map" />

      <div className="space-y-2">
        {addresses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center text-sm text-zinc-500">
            No addresses yet. Add one and pin it on the map.
          </div>
        ) : (
          addresses.map((a) => (
            <div
              key={a.id}
              className="account-card flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-extrabold text-zinc-900">{a.label}</span>
                  {a.isDefault ? (
                    <span className="rounded-full bg-[color:var(--allmart-orange)]/10 px-2 py-0.5 text-[10px] font-bold text-[color:var(--allmart-orange)]">
                      Default
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 truncate text-sm text-zinc-600">
                  {a.line1} · {a.subcity}, {a.city}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-zinc-400">
                  {a.lat.toFixed(4)}, {a.lng.toFixed(4)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {!a.isDefault ? (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(a.id)}
                    className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
                  >
                    Make default
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => startEdit(a)}
                  className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteAddress(a.id)}
                  className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {openForm ? (
        <form
          onSubmit={onSubmit}
          className="account-panel-enter space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-[var(--shadow-float)] md:p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-zinc-900">{editingId ? "Edit address" : "New address"}</h3>
            <button type="button" onClick={() => setOpenForm(false)} className="text-xs font-bold text-zinc-400 hover:text-zinc-700">
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Label">
              <input
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                className={inputClass}
                placeholder="Home, Work…"
              />
            </Field>
            <Field label="Sub-city">
              <select
                value={form.subcity}
                onChange={(e) => setForm((f) => ({ ...f, subcity: e.target.value }))}
                className={inputClass}
              >
                {ADDIS_SUBCITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Street / landmark">
                <input
                  value={form.line1}
                  onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                  className={inputClass}
                  placeholder="Near Gerji Mebrat Hayel…"
                  required
                />
              </Field>
            </div>
            <Field label="Phone (optional)">
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={inputClass}
                placeholder="09…"
              />
            </Field>
            <Field label="City">
              <input
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onLocate}
              disabled={locating}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-white disabled:opacity-60"
            >
              <IconLocate />
              {locating ? "Locating…" : "Use my location"}
            </button>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                className="rounded border-zinc-300 text-[color:var(--allmart-orange)] focus:ring-[color:var(--allmart-orange)]"
              />
              Set as default
            </label>
          </div>

          {msg ? <p className="text-xs font-semibold text-[color:var(--allmart-orange)]">{msg}</p> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-[color:var(--allmart-orange)] py-3 text-sm font-extrabold text-white sm:w-auto sm:px-6"
          >
            Save address
          </button>
        </form>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "h-11 w-full min-w-0 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[color:var(--allmart-orange)] focus:ring-4 focus:ring-[color:var(--allmart-orange)]/15";
