"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Message } from "../../lib/types";

export default function MessagesInbox({
  db,
  onChange,
}: {
  db: SupabaseClient;
  onChange: () => void;
}) {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const load = useCallback(
    () =>
      db
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) setError(error.message);
          else setItems(data as Message[]);
          setLoading(false);
        }),
    [db],
  );

  useEffect(() => {
    load();
  }, [load]);

  const open = items.find((m) => m.id === openId) ?? null;

  async function select(m: Message) {
    setOpenId(m.id);
    setConfirm(false);
    if (!m.read) {
      setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
      await db.from("messages").update({ read: true }).eq("id", m.id);
      onChange();
    }
  }

  async function remove(m: Message) {
    const { error } = await db.from("messages").delete().eq("id", m.id);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== m.id));
    setOpenId(null);
    setConfirm(false);
    onChange();
  }

  const when = (iso: string) =>
    new Date(iso).toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Messages</h1>
      <p className="mt-2 text-white/55">Everything sent through your contact form.</p>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-white/50">Loading...</p>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-12 text-center text-white/55">
          No messages yet.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 lg:grid-cols-[360px_1fr]">
          <ul className="max-h-[70dvh] space-y-2 overflow-y-auto pr-1">
            {items.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => select(m)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    openId === m.id
                      ? "border-glow/60 bg-white/[0.08]"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {!m.read && <span className="size-2 shrink-0 rounded-full bg-glow" aria-label="Unread" />}
                    <span className="truncate text-sm font-semibold">{m.name}</span>
                    <span className="ml-auto shrink-0 text-[11px] text-white/40">{when(m.created_at)}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-white/50">{m.message}</p>
                </button>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
            {open ? (
              <>
                <h2 className="font-display text-2xl font-bold">{open.name}</h2>
                <p className="mt-1 text-sm text-white/55">
                  {open.email} · {when(open.created_at)}
                </p>
                <p className="mt-6 whitespace-pre-wrap text-white/85">{open.message}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${open.email}?subject=${encodeURIComponent("Re: your message to InfirizeTech")}`}
                    className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Reply by email
                  </a>
                  {confirm ? (
                    <>
                      <button onClick={() => remove(open)} className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white">
                        Yes, delete
                      </button>
                      <button onClick={() => setConfirm(false)} className="rounded-full px-4 py-2.5 text-sm font-semibold text-white/70">
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirm(true)}
                      className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:border-red-400/50 hover:text-red-300"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-white/45">Select a message to read it.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
