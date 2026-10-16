"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import ProjectsManager from "./ProjectsManager";
import MessagesInbox from "./MessagesInbox";
import AlertsManager from "./AlertsManager";
import ServicesManager from "./ServicesManager";

type Tab = "overview" | "projects" | "messages" | "alerts" | "services";
type Toast = { name: string; text: string };

const icons = {
  overview: "M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  projects: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4",
  messages: "M3 6h18v12H3zM3 7l9 7 9-7",
  services: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  alerts: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0",
};

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export default function Dashboard({ db, email }: { db: SupabaseClient; email: string }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [counts, setCounts] = useState({ projects: 0, unread: 0, messages: 0 });
  const [toast, setToast] = useState<Toast | null>(null);
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");

  const refresh = useCallback(async () => {
    const [p, u, m] = await Promise.all([
      db.from("projects").select("id", { count: "exact", head: true }),
      db.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
      db.from("messages").select("id", { count: "exact", head: true }),
    ]);
    setCounts({ projects: p.count ?? 0, unread: u.count ?? 0, messages: m.count ?? 0 });
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Desktop notification permission (browser only)
  useEffect(() => {
    setPerm(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  }, []);

  // Live alerts: runs whenever a new message is saved
  useEffect(() => {
    const channel = db
      .channel("new-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new as { name: string; message: string };
          refresh();
          setToast({ name: m.name, text: m.message });
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("New message on your website", {
              body: `${m.name}: ${m.message.slice(0, 100)}`,
            });
          }
        },
      )
      .subscribe();
    return () => {
      db.removeChannel(channel);
    };
  }, [db, refresh]);

  // Hide the pop-up after a few seconds
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 9000);
    return () => clearTimeout(t);
  }, [toast]);

  // Unread count in the browser tab title
  useEffect(() => {
    document.title = counts.unread
      ? `(${counts.unread}) New message | Admin | Infirize`
      : "Admin | Infirize";
  }, [counts.unread]);

  async function enableAlerts() {
    if (typeof Notification === "undefined") return;
    setPerm(await Notification.requestPermission());
  }

  const nav: { id: Tab; label: string; badge?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects" },
    { id: "messages", label: "Messages", badge: counts.unread },
    { id: "services", label: "Services" },
    { id: "alerts", label: "Email alerts" },
  ];

  return (
    <div className="min-h-dvh md:flex">
      <aside className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.02] p-4 md:sticky md:top-0 md:h-dvh md:w-64 md:shrink-0 md:border-b-0 md:border-r md:p-6">
        <div className="flex items-center justify-between md:block">
          <p className="font-display text-lg font-bold">Infirize</p>
          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-glow md:mt-2 md:inline-block">
            Admin
          </span>
        </div>

        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              aria-current={tab === n.id ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                tab === n.id
                  ? "bg-accent text-white"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon d={icons[n.id]} />
              {n.label}
              {!!n.badge && (
                <span className="ml-auto rounded-full bg-glow px-2 py-0.5 text-[11px] font-bold text-ink">
                  {n.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto hidden space-y-2 md:block">
          {perm === "default" && (
            <button
              onClick={enableAlerts}
              className="w-full rounded-xl border border-glow/40 px-3 py-2.5 text-left text-sm font-semibold text-glow transition hover:bg-glow/10"
            >
              Enable desktop alerts
            </button>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/5"
          >
            View live site ↗
          </a>
          <p className="truncate px-1 text-xs text-white/40">{email}</p>
          <button
            onClick={() => db.auth.signOut()}
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-white/65 transition hover:bg-white/5 hover:text-white"
          >
            Sign out
          </button>
        </div>
        <button
          onClick={() => db.auth.signOut()}
          className="rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/65 md:hidden"
        >
          Sign out
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-10">
        <div className="mx-auto max-w-6xl">
          {tab === "overview" && (
            <div>
              <h1 className="font-display text-3xl font-bold md:text-4xl">Welcome back</h1>
              <p className="mt-2 text-white/55">Here is what is happening on your website.</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Projects", value: counts.projects, go: "projects" as Tab },
                  { label: "Unread messages", value: counts.unread, go: "messages" as Tab },
                  { label: "All messages", value: counts.messages, go: "messages" as Tab },
                ].map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setTab(c.go)}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left transition hover:border-white/25"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      {c.label}
                    </p>
                    <p className="mt-3 font-display text-5xl font-bold">{c.value}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-brand/10 p-6 text-sm text-white/70">
                Changes you save here appear on the live website when you reload it.
              </div>
            </div>
          )}
          {tab === "projects" && <ProjectsManager db={db} onChange={refresh} />}
          {tab === "messages" && (
            <MessagesInbox key={counts.messages} db={db} onChange={refresh} />
          )}
          {tab === "services" && <ServicesManager db={db} />}
          {tab === "alerts" && <AlertsManager db={db} />}
        </div>
      </main>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-20 w-[min(92vw,360px)] rounded-2xl border border-glow/40 bg-[#0d1117] p-5 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-glow" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-glow">
                New message
              </p>
              <p className="mt-1 truncate font-semibold">{toast.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-white/60">{toast.text}</p>
              <button
                onClick={() => {
                  setTab("messages");
                  setToast(null);
                }}
                className="mt-3 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white"
              >
                Open inbox
              </button>
            </div>
            <button
              onClick={() => setToast(null)}
              aria-label="Dismiss"
              className="text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
