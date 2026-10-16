"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { label: "Home", href: "#main" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

type Theme = "dark" | "light";

function parseAlpha(value: string | undefined) {
  if (value === undefined) return 1;
  return value.endsWith("%") ? parseFloat(value) / 100 : parseFloat(value);
}

function parseColor(value: string): [number, number, number, number] | null {
  const rgb = value.match(
    /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/,
  );
  if (rgb) {
    return [
      parseFloat(rgb[1]),
      parseFloat(rgb[2]),
      parseFloat(rgb[3]),
      parseAlpha(rgb[4]),
    ];
  }
  const srgb = value.match(
    /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/,
  );
  if (srgb) {
    return [
      parseFloat(srgb[1]) * 255,
      parseFloat(srgb[2]) * 255,
      parseFloat(srgb[3]) * 255,
      parseAlpha(srgb[4]),
    ];
  }
  return null;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const headerRef = useRef<HTMLElement>(null);

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

  // Pick light or dark header colors from whatever is behind the logo
  useEffect(() => {
    let frame = 0;

    const detect = (): Theme => {
      const header = headerRef.current;
      const els = document.elementsFromPoint(60, 44);
      for (const el of els) {
        if (header && header.contains(el)) continue;
        const c = parseColor(getComputedStyle(el).backgroundColor);
        if (!c || c[3] < 0.5) continue;
        const lum = (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
        return lum < 0.55 ? "dark" : "light";
      }
      return "light";
    };

    const update = () => {
      frame = 0;
      setTheme(detect());
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const dark = open || theme === "dark";

  return (
    <>
      <header
        ref={headerRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-8 py-7 sm:px-10"
      >
        <a
          href="#main"
          className={`pointer-events-auto font-display text-2xl font-bold tracking-tight transition-colors duration-300 ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          Infirize
        </a>

        <div className="pointer-events-auto flex items-center gap-2">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className={`rounded-full px-4 py-2 text-sm font-medium backdrop-blur transition-colors duration-300 ${
              dark
                ? "bg-white/20 text-white hover:bg-white/30"
                : "bg-ink/10 text-ink hover:bg-ink/20"
            }`}
          >
            Get in touch
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 hover:scale-105 motion-reduce:transition-none ${
              dark ? "bg-white text-ink" : "bg-ink text-white"
            }`}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-lenis-prevent
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
                  className="group flex items-baseline gap-4 font-display text-[clamp(2.5rem,9vw,7rem)] font-bold uppercase leading-none transition-colors hover:text-glow"
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
