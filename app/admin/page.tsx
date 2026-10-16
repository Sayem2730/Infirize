"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserClient } from "../lib/supabase-browser";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function AdminPage() {
  const db = getBrowserClient();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!db) return;
    db.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = db.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [db]);

  return (
    // Covers the public header/footer; data-lenis-prevent keeps normal scrolling.
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[999] overflow-y-auto bg-[#07090d] text-white"
    >
      {!db ? (
        <div className="grid min-h-dvh place-items-center p-6">
          <div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8">
            <h1 className="font-display text-2xl font-bold">Supabase is not connected</h1>
            <p className="mt-3 text-sm text-white/70">
              Add <code className="text-glow">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="text-glow">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
              <code className="text-glow">.env.local</code>, then restart{" "}
              <code className="text-glow">npm run dev</code>.
            </p>
          </div>
        </div>
      ) : !ready ? (
        <div className="grid min-h-dvh place-items-center text-sm text-white/50">Loading...</div>
      ) : session ? (
        <Dashboard db={db} email={session.user.email ?? ""} />
      ) : (
        <Login db={db} />
      )}
    </div>
  );
}
