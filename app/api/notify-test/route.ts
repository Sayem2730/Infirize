import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mailStatus, notifyRecipients } from "../../lib/mail";

export async function POST(req: Request) {
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !key) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Only the admin account may use this.
  const asUser = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: isAdmin, error } = await asUser.rpc("is_admin");
  if (error || isAdmin !== true) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  let action = "status";
  try {
    action = String((await req.json()).action ?? "status");
  } catch {}

  if (action === "status") return NextResponse.json(mailStatus());

  const result = await notifyRecipients({
    subject: "Test alert from your Infirize dashboard",
    text: "If you can read this, email alerts are working.",
    html: "<p>If you can read this, <strong>email alerts are working</strong>.</p>",
  });
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
