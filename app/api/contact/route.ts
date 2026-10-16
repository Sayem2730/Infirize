import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { notifyRecipients } from "../../lib/mail";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[c];
  });

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (
    !name || name.length > 200 ||
    !email || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !message || message.length > 5000
  ) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Server is not configured." }, { status: 500 });
  }

  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await db.from("messages").insert({ name, email, message });
  if (error) {
    console.error("Saving message failed:", error.message);
    return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  }

  // The message is saved. A failed email alert must never break the form.
  const result = await notifyRecipients({
    subject: `New website message from ${name}`,
    replyTo: email,
    text: `${name} (${email}) sent a message through the website:\n\n${message}\n\nReply to this email to answer them.`,
    html: `<p><strong>${esc(name)}</strong> (${esc(email)}) sent a message through the website:</p><blockquote style="margin:0;padding:12px 16px;border-left:4px solid #087bff;background:#f3f6fb">${esc(message).replace(/\n/g, "<br>")}</blockquote><p>Reply to this email to answer them.</p>`,
  });
  if (!result.ok) console.warn("Email alert skipped:", result.error);

  return NextResponse.json({ ok: true });
}
