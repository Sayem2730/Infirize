"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Project } from "../../lib/types";
import { removeImage, uploadImage } from "../../lib/upload";

const input =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-glow focus:outline-none";
const label = "mb-2 block text-xs font-semibold uppercase tracking-wider text-white/55";
const ghost =
  "rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/5 disabled:opacity-30";

type Draft = Partial<Project>;

function ProjectForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: Draft;
  onCancel: () => void;
  onSave: (v: Draft) => Promise<string | null>;
}) {
  const [v, setV] = useState<Draft>({
    title: "",
    tag: "Website",
    text: "",
    link_url: "",
    image_url: null,
    published: true,
    ...initial,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  async function pick(file?: File) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setV((s) => ({ ...s, image_url: url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const msg = await onSave(v);
    if (msg) {
      setError(msg);
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex justify-end bg-black/60" onMouseDown={onCancel}>
      <form
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
        className="h-full w-full max-w-lg space-y-5 overflow-y-auto border-l border-white/10 bg-[#0d1117] p-6 md:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">
            {initial.id ? "Edit project" : "New project"}
          </h2>
          <button type="button" onClick={onCancel} className={ghost}>
            Close
          </button>
        </div>

        <div>
          <span className={label}>Image</span>
          <div className="overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/[0.03]">
            <div className="aspect-[4/3]">
              {v.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-sm text-white/40">
                  No image yet
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className={`${ghost} cursor-pointer`}>
              {uploading ? "Uploading..." : v.image_url ? "Replace image" : "Upload image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  pick(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {v.image_url && (
              <button
                type="button"
                className={ghost}
                onClick={() => setV((s) => ({ ...s, image_url: null }))}
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-white/40">
            JPG, PNG or WebP. It is resized and compressed automatically.
          </p>
        </div>

        <div>
          <label htmlFor="p-title" className={label}>Title</label>
          <input id="p-title" className={input} value={v.title ?? ""} onChange={(e) => setV((s) => ({ ...s, title: e.target.value }))} required />
        </div>
        <div>
          <label htmlFor="p-tag" className={label}>Tag</label>
          <input id="p-tag" className={input} value={v.tag ?? ""} placeholder="Website, Web app, Branding..." onChange={(e) => setV((s) => ({ ...s, tag: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="p-text" className={label}>Description</label>
          <textarea id="p-text" rows={4} className={input} value={v.text ?? ""} onChange={(e) => setV((s) => ({ ...s, text: e.target.value }))} />
        </div>
        <div>
          <label htmlFor="p-link" className={label}>Link (optional)</label>
          <input id="p-link" className={input} value={v.link_url ?? ""} placeholder="https://..." onChange={(e) => setV((s) => ({ ...s, link_url: e.target.value }))} />
        </div>

        <label className="flex items-center gap-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={v.published ?? true}
            onChange={(e) => setV((s) => ({ ...s, published: e.target.checked }))}
            className="size-4 accent-[#087bff]"
          />
          Show on the website
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save project"}
          </button>
          <button type="button" onClick={onCancel} className="rounded-full px-5 py-3 text-sm font-semibold text-white/70 hover:text-white">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProjectsManager({
  db,
  onChange,
}: {
  db: SupabaseClient;
  onChange: () => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await db.from("projects").select("*").order("sort_order");
    if (error) setError(error.message);
    else setProjects(data as Project[]);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(v: Draft): Promise<string | null> {
    const row = {
      title: (v.title ?? "").trim(),
      tag: (v.tag ?? "").trim(),
      text: (v.text ?? "").trim(),
      link_url: v.link_url?.trim() || null,
      image_url: v.image_url ?? null,
      published: v.published ?? true,
    };
    if (!row.title) return "Please add a title";
    if (row.link_url && !/^https?:\/\//.test(row.link_url)) {
      return "The link must start with https://";
    }

    if (v.id) {
      const { error } = await db.from("projects").update(row).eq("id", v.id);
      if (error) return error.message;
      const old = projects.find((p) => p.id === v.id)?.image_url;
      if (old && old !== row.image_url) await removeImage(old);
    } else {
      const max = projects.reduce((m, p) => Math.max(m, p.sort_order), 0);
      const { error } = await db.from("projects").insert({ ...row, sort_order: max + 1 });
      if (error) return error.message;
    }
    setEditing(null);
    await load();
    onChange();
    return null;
  }

  async function move(i: number, dir: -1 | 1) {
    const next = [...projects];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    setProjects(next);
    await Promise.all(
      next.map((p, idx) => db.from("projects").update({ sort_order: idx + 1 }).eq("id", p.id)),
    );
  }

  async function togglePublished(p: Project) {
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)));
    const { error } = await db.from("projects").update({ published: !p.published }).eq("id", p.id);
    if (error) {
      setError(error.message);
      load();
    }
  }

  async function remove(p: Project) {
    const { error } = await db.from("projects").delete().eq("id", p.id);
    if (error) {
      setError(error.message);
      return;
    }
    await removeImage(p.image_url);
    setConfirmId(null);
    await load();
    onChange();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Projects</h1>
          <p className="mt-2 text-white/55">Add, edit, reorder and hide the projects on your site.</p>
        </div>
        <button
          onClick={() => setEditing({})}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          + New project
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-white/50">Loading...</p>
      ) : projects.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-12 text-center text-white/55">
          No projects yet. Click &ldquo;New project&rdquo; to add your first one.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p, i) => (
            <article key={p.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <div className="relative aspect-[4/3]">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-brand opacity-70" />
                )}
                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    p.published ? "bg-glow text-ink" : "bg-black/70 text-white/70"
                  }`}
                >
                  {p.published ? "Live" : "Hidden"}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-glow">{p.tag}</p>
                <h3 className="mt-1 font-display text-xl font-bold">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/55">{p.text}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button className={ghost} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
                  <button className={ghost} disabled={i === projects.length - 1} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
                  <button className={ghost} onClick={() => setEditing(p)}>Edit</button>
                  <button className={ghost} onClick={() => togglePublished(p)}>{p.published ? "Hide" : "Show"}</button>
                  {confirmId === p.id ? (
                    <>
                      <button className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => remove(p)}>Yes, delete</button>
                      <button className={ghost} onClick={() => setConfirmId(null)}>No</button>
                    </>
                  ) : (
                    <button className={`${ghost} hover:border-red-400/50 hover:text-red-300`} onClick={() => setConfirmId(p.id)}>Delete</button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <ProjectForm initial={editing} onCancel={() => setEditing(null)} onSave={save} />
      )}
    </div>
  );
}
