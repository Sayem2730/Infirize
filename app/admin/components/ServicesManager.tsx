"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

type Service = { id: string; title: string; text: string; sort_order: number };

const input =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-glow focus:outline-none";
const ghost =
  "rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/5 disabled:opacity-30";

export default function ServicesManager({ db }: { db: SupabaseClient }) {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Service | "new" | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await db.from("services").select("*").order("sort_order");
    if (error) setError(error.message);
    else setItems(data as Service[]);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    load();
  }, [load]);

  function openForm(s: Service | "new") {
    setEditing(s);
    setTitle(s === "new" ? "" : s.title);
    setText(s === "new" ? "" : s.text);
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please add a title");
      return;
    }
    setSaving(true);
    setError("");
    const res =
      editing === "new"
        ? await db.from("services").insert({
            title: title.trim(),
            text: text.trim(),
            sort_order: items.length,
          })
        : await db
            .from("services")
            .update({ title: title.trim(), text: text.trim() })
            .eq("id", (editing as Service).id);
    if (res.error) setError(res.error.message);
    else {
      setEditing(null);
      await load();
    }
    setSaving(false);
  }

  async function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    const results = await Promise.all(
      next.map((s, idx) => db.from("services").update({ sort_order: idx }).eq("id", s.id)),
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) setError(failed.error.message);
    load();
  }

  async function remove(s: Service) {
    const { error } = await db.from("services").delete().eq("id", s.id);
    if (error) setError(error.message);
    setConfirmId(null);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Services</h1>
          <p className="mt-2 max-w-xl text-white/55">
            These are the cards in the Services section of your website, in this order.
          </p>
        </div>
        <button
          onClick={() => openForm("new")}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          + New service
        </button>
      </div>

      {error && !editing && (
        <p role="alert" className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </p>
      )}

      {editing && (
        <form onSubmit={save} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="font-semibold">{editing === "new" ? "New service" : "Edit service"}</h2>
          <input
            className={input}
            placeholder="Title (e.g. Web design)"
            value={title}
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Title"
          />
          <textarea
            className={`${input} min-h-28`}
            placeholder="Short description"
            value={text}
            maxLength={400}
            onChange={(e) => setText(e.target.value)}
            aria-label="Description"
          />
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/5">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-white/50">Loading...</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/55">
          No services yet. Click &ldquo;New service&rdquo; to add one.
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((s, i) => (
            <li key={s.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="w-8 text-sm font-semibold text-glow">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{s.title}</p>
                <p className="line-clamp-1 text-xs text-white/50">{s.text}</p>
              </div>
              <button className={ghost} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button className={ghost} onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</button>
              <button className={ghost} onClick={() => openForm(s)}>Edit</button>
              {confirmId === s.id ? (
                <>
                  <button className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => remove(s)}>Yes, delete</button>
                  <button className={ghost} onClick={() => setConfirmId(null)}>No</button>
                </>
              ) : (
                <button className={`${ghost} hover:border-red-400/50 hover:text-red-300`} onClick={() => setConfirmId(s.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
