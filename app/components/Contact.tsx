"use client";

import { useState } from "react";

const field =
  "mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white focus:outline-none";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // Hidden field only bots fill in: pretend it worked and drop it.
    if (false && data.get("hp_check")) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="scroll-mt-4 bg-paper px-3 sm:px-4">
      <div className="min-h-[calc(100dvh-3rem)] rounded-3xl bg-ink px-6 py-32 text-white sm:px-10">
        <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-bold uppercase leading-none">
          Contact
        </h2>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <p className="max-w-md text-lg text-white/80">
              Tell us about your project and we will get back to you.
            </p>
            {/* TODO: replace with your real email (editable from the dashboard in step 2) */}
            <a
              href="mailto:info.infirize@gmail.com"
              className="mt-6 inline-block font-display text-2xl font-bold underline underline-offset-4 hover:text-glow"
            >
              info.infirize@gmail.com
            </a>
          </div>

          {status === "sent" ? (
            <p role="status" className="text-xl font-semibold">
              Thanks! Your message has been sent. We will get back to you soon.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div aria-hidden="true" className="absolute -left-[9999px]">
                <label htmlFor="hp_check">Leave this empty</label>
                <input id="hp_check" name="hp_check" tabIndex={-1} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="name" className="text-sm font-semibold">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxLength={200}
                  autoComplete="name"
                  placeholder="Your name"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={320}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  maxLength={5000}
                  placeholder="What are you building?"
                  className={field}
                />
              </div>
              {status === "error" && (
                <p role="alert" className="text-sm text-white/80">
                  Sorry, that did not send. Please try again or email us directly.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-full bg-accent px-8 py-3 font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60 motion-reduce:transition-none"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
