"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

const input =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-glow focus:outline-none";

export default function Login({ db }: { db: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-brand opacity-25 blur-3xl"
      />
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur"
      >
        <p className="font-display text-lg font-bold">Infirize</p>
        <h1 className="mt-6 font-display text-3xl font-bold">Admin sign in</h1>
        <p className="mt-2 text-sm text-white/55">Manage your website content.</p>

        <label htmlFor="email" className="mt-8 mb-2 block text-xs font-semibold uppercase tracking-wider text-white/55">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
        />

        <label htmlFor="password" className="mt-5 mb-2 block text-xs font-semibold uppercase tracking-wider text-white/55">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
        />

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-7 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
