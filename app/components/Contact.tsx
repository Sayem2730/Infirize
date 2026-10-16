"use client";

import { useState } from "react";

const field =
  "mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white focus:outline-none";

export default function Contact() {
  const [sent, setSent] = useState(false);

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
            {/* TODO: replace with your real email */}
            <a
              href="mailto:hello@yourdomain.com"
              className="mt-6 inline-block font-display text-2xl font-bold underline underline-offset-4 hover:text-glow"
            >
              hello@yourdomain.com
            </a>
          </div>

          {sent ? (
            <p role="status" className="text-xl font-semibold">
              Thanks! Your message is ready to send once the form is connected.
            </p>
          ) : (
            <form
              // TODO: connect to a backend or a form service before launch
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              <div>
                <label htmlFor="name" className="text-sm font-semibold">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
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
                  placeholder="What are you building?"
                  className={field}
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-accent px-8 py-3 font-semibold text-white transition-transform hover:scale-105 motion-reduce:transition-none"
              >
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
