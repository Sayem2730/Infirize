"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

type Recipient = { id: string; email: string; label: string; active: boolean };
type Status = { gmail: boolean; secretKey: boolean };

const input =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-glow focus:outline-none";
const ghost =
  "rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/5 disabled:opacity-30";

export default function AlertsManager({ db }: { db: SupabaseClient }) {
  const [items, setItems] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [label, setLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await db.from("notify_emails").select("*").order("created_at");
    if (error) setError(error.message);
    else setItems(data as Recipient[]);
    setLoading(false);
  }, [db]);

  const call = useCallback(
    async (action: "status" | "test") => {
      const { data } = await db.auth.getSession();
      const res = await fetch("/api/notify-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session?.access_token ?? ""}`,
        },
        body: JSON.stringify({ action }),
      });
      const json = await res.json().catch(() => ({}));
      return { res, json };
    },
    [db],
  );

  useEffect(() => {
    load();
    call("status")
      .then(({ json }) => {
        if ("gmail" in json) setStatus(json as Status);
      })
      .catch(() => {});
  }, [load, call]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError("Enter a valid email address");
      return;
    }
    setAdding(true);
    setError("");
    const { error } = await db.from("notify_emails").insert({ email: clean, label: label.trim() });
    if (error) setError(error.code === "23505" ? "That email is already on the list" : error.message);
    else {
      setEmail("");
      setLabel("");
      await load();
    }
    setAdding(false);
  }

  async function toggle(r: Recipient) {
    setItems((prev) => prev.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x)));
    const { error } = await db.from("notify_emails").update({ active: !r.active }).eq("id", r.id);
    if (error) {
      setError(error.message);
      load();
    }
  }

  async function remove(r: Recipient) {
    const { error } = await db.from("notify_emails").delete().eq("id", r.id);
    if (error) setError(error.message);
    setConfirmId(null);
    load();
  }

  async function sendTest() {
    setTesting(true);
    setTestMsg(null);
    try {
      const { res, json } = await call("test");
      setTestMsg(
        res.ok
          ? { ok: true, text: `Test email sent to ${json.count} address(es). Check the inbox and the spam folder.` }
          : { ok: false, text: json.error ?? "Could not send the test email." },
      );
    } catch {
      setTestMsg({ ok: false, text: "Could not reach the server." });
    }
    setTesting(false);
  }

  const chip = (ok: boolean | undefined, yes: string, no: string) => (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        ok ? "bg-glow/15 text-glow" : "bg-red-500/15 text-red-300"
      }`}
    >
      {ok ? yes : no}
    </span>
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Email alerts</h1>
      <p className="mt-2 max-w-xl text-white/55">
        Everyone on this list gets an email when someone sends a message through your contact
        form. They can reply straight to the sender.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {chip(status?.gmail, "Gmail sender ready", "Gmail sender not set up")}
        {chip(status?.secretKey, "Server key ready", "Server key missing")}
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </p>
      )}

      <form onSubmit={add} className="mt-8 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-[1fr_220px_auto]">
        <input
          className={input}
          type="email"
          required
          placeholder="name@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <input
          className={input}
          placeholder="Label (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          aria-label="Label"
        />
        <button
          type="submit"
          disabled={adding}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {adding ? "Adding..." : "Add email"}
        </button>
      </form>

      {loading ? (
        <p className="mt-8 text-sm text-white/50">Loading...</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/55">
          No emails yet. Add one above to start getting alerts.
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{r.email}</p>
                {r.label && <p className="text-xs text-white/50">{r.label}</p>}
              </div>
              <button className={ghost} onClick={() => toggle(r)}>
                {r.active ? "Active · pause" : "Paused · resume"}
              </button>
              {confirmId === r.id ? (
                <>
                  <button className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => remove(r)}>
                    Yes, remove
                  </button>
                  <button className={ghost} onClick={() => setConfirmId(null)}>No</button>
                </>
              ) : (
                <button className={`${ghost} hover:border-red-400/50 hover:text-red-300`} onClick={() => setConfirmId(r.id)}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          onClick={sendTest}
          disabled={testing}
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/5 disabled:opacity-60"
        >
          {testing ? "Sending..." : "Send test email"}
        </button>
        {testMsg && (
          <p role="status" className={`text-sm ${testMsg.ok ? "text-glow" : "text-red-300"}`}>
            {testMsg.text}
          </p>
        )}
      </div>
    </div>
  );
}
