"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Home", href: "#main" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 text-white">
        <a
          href="#main"
          className="font-display text-xl font-bold tracking-tight"
        >
          InfirizeTech
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink transition-transform hover:scale-105 motion-reduce:transition-none"
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-open={open}
        inert={!open}
        className="fixed inset-0 z-40 flex -translate-y-full items-center bg-ink px-6 text-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none data-[open=true]:translate-y-0"
      >
        <nav className="w-full">
          <ul className="space-y-2">
            {links.map((link, i) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 font-display text-[clamp(2.5rem,9vw,7rem)] font-bold uppercase leading-none transition-colors hover:text-accent"
                >
                  <span className="text-sm font-normal text-white/40">
                    0{i + 1}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
