"use client";

import { useEffect, useRef } from "react";

// Scrolls its children sideways forever. The children must be two identical halves.
export default function Marquee({
  children,
  speed = 60,
}: {
  children: React.ReactNode;
  speed?: number; // pixels per second
}) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let last = performance.now();
    let paused = false;
    let visible = true;
    let raf = 0;

    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (!paused && visible) {
        const half = el.scrollWidth / 2;
        x -= (speed * dt) / 1000;
        if (-x >= half) x += half;
        el.style.transform = `translate3d(${x}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [speed]);

  return (
    <div ref={track} className="flex w-max will-change-transform">
      {children}
    </div>
  );
}
