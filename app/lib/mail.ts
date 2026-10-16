import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

type Result = { ok: true; count: number } | { ok: false; error: string };

export function secretClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function mailStatus() {
  return {
    gmail: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
    secretKey: Boolean(process.env.SUPABASE_SECRET_KEY),
  };
}

// Emails every active recipient (they are blind-copied, so addresses stay private).
export async function notifyRecipients(opts: {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<Result> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return { ok: false, error: "Gmail is not set up (GMAIL_USER / GMAIL_APP_PASSWORD)." };

  const db = secretClient();
  if (!db) return { ok: false, error: "SUPABASE_SECRET_KEY is not set." };

  const { data, error } = await db.from("notify_emails").select("email").eq("active", true);
  if (error) return { ok: false, error: error.message };
  const list = (data ?? []).map((r) => r.email as string);
  if (list.length === 0) return { ok: false, error: "No active recipients on the list yet." };

  try {
    const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transport.sendMail({
      from: `"Infirize website" <${user}>`,
      to: user,
      bcc: list,
      replyTo: opts.replyTo,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    return { ok: true, count: list.length };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not send the email." };
  }
}
