import { createClient } from "@supabase/supabase-js";
import type { Project } from "./types";

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Always reads fresh data (no cache), so dashboard edits show up on the next page load.
// Returns null when Supabase is not set up or fails, so pages can show defaults.
export async function getProjects(): Promise<Project[] | null> {
  const db = serverClient();
  if (!db) return null;
  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error) return null;
  return data as Project[];
}

export type ServiceRow = { id: string; title: string; text: string; sort_order: number };

// Same as getProjects: fresh read, null when Supabase is not set up or fails.
export async function getServices(): Promise<ServiceRow[] | null> {
  const db = serverClient();
  if (!db) return null;
  const { data, error } = await db.from("services").select("*").order("sort_order");
  if (error) return null;
  return data as ServiceRow[];
}
