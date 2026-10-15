"use client";

import { useEffect, useRef } from "react";

export default function HeroHeadline({ rows }: { rows: string[][] }) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-l]"),
    ).map((outer) => ({
      outer,
      inner: outer.firstElementChild as HTMLElement,
      x: 0,
      y: 0,
      s: 1,
      r: 0,
    }));

    const pointer = { x: 0, y: 0, active: false };
    let raf = 0;

    const frame = () => {
      raf = 0;
      let busy = false;

      const rr = root.getBoundingClientRect();
      const near =
        pointer.active &&
        pointer.x > rr.left - 200 &&
        pointer.x < rr.right + 200 &&
        pointer.y > rr.top - 200 &&
        pointer.y < rr.bottom + 200;

      for (const l of letters) {
        let tx = 0;
        let ty = 0;
        let ts = 1;
        let tr = 0;

        if (near) {
          const rect = l.outer.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const d = Math.hypot(dx, dy) || 0.001;
          const R = Math.max(140, rect.height * 1.5);
          const f = Math.pow(Math.max(0, 1 - d / R), 2);
          if (f > 0) {
            const push = rect.height * 0.22 * f;
            tx = (dx / d) * push;
            ty = (dy / d) * push;
            ts = 1 + f * 0.2;
            tr = (dx / R) * f * 10;
          }
        }

        l.x += (tx - l.x) * 0.18;
        l.y += (ty - l.y) * 0.18;
        l.s += (ts - l.s) * 0.18;
        l.r += (tr - l.r) * 0.18;

        if (
          Math.abs(tx - l.x) > 0.05 ||
          Math.abs(ty - l.y) > 0.05 ||
          Math.abs(ts - l.s) > 0.002 ||
          Math.abs(tr - l.r) > 0.05
        ) {
          busy = true;
        }

        l.inner.style.transform = `translate3d(${l.x}px, ${l.y}px, 0) rotate(${l.r}deg) scale(${l.s})`;
      }

      if (busy || near) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        pointer.active = false;
        kick();
      }
    };
    const onLeave = () => {
      pointer.active = false;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("scroll", kick, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", kick);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <h1 className="font-sans text-[clamp(1.5rem,7.4vw,9rem)] font-medium uppercase leading-[1.02] tracking-tight">
      <span className="sr-only">{rows.map((r) => r.join(" ")).join(" ")}</span>
      <span ref={rootRef} aria-hidden="true" className="block">
        {rows.map(([left, right]) => (
          <span key={left} className="flex justify-between gap-6">
            {[left, right].map((word) => (
              <span key={word} className="inline-flex">
                {word.split("").map((ch, i) => (
                  <span key={i} data-l className="inline-block">
                    <span className="inline-block will-change-transform">
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}
