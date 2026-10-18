"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function LiveCount({ initial }: { initial: number }) {
  const [shown, setShown] = useState(0);
  const [target, setTarget] = useState(initial);
  const [pulse, setPulse] = useState(false);
  const targetRef = useRef(initial);
  const shownRef = useRef(0);
  const frameRef = useRef(0);
  const numberRef = useRef<HTMLSpanElement>(null);

  const animate = useCallback((from: number, to: number) => {
    cancelAnimationFrame(frameRef.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      shownRef.current = to;
      setShown(to);
      return;
    }
    const DURATION = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const v = Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3)));
      shownRef.current = v;
      setShown(v);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }, []);

  // First count-up on load
  useEffect(() => {
    animate(0, initial);
    return () => cancelAnimationFrame(frameRef.current);
  }, [animate, initial]);

  // Auto-update when projects are added
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/project-count", { cache: "no-store" });
        const data = await res.json();
        if (typeof data.count !== "number" || data.count === targetRef.current) return;
        const prev = targetRef.current;
        targetRef.current = data.count;
        setTarget(data.count);
        animate(shownRef.current, data.count);
        if (data.count > prev) {
          setPulse(true);
          setTimeout(() => setPulse(false), 1400);
        }
      } catch {
        /* keep showing the last known number */
      }
    };
    const id = setInterval(check, 30000);
    window.addEventListener("focus", check);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", check);
    };
  }, [animate]);

  // Number drifts with the cursor
  useEffect(() => {
    const el = numberRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      el.style.transform = `translate(${-dx * 40}px, ${-dy * 28}px) rotate(${dx * 3}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (target <= 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <span
        ref={numberRef}
        aria-label={`${target} projects delivered`}
        className="relative z-0 select-none font-display text-[clamp(14rem,40vw,36rem)] font-bold leading-none tabular-nums transition-transform duration-300 ease-out"
        style={{
          color: pulse ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.18)",
          WebkitTextStroke: "4px rgba(255,255,255,1)",
          textShadow: pulse
            ? "0 0 90px rgba(255,255,255,0.7)"
            : "0 0 60px rgba(255,255,255,0.35)",
          transitionProperty: "transform, color, text-shadow",
        }}
      >
        {shown}
      </span>
      <button
        type="button"
        onClick={() => animate(0, targetRef.current)}
        className="pointer-events-auto relative z-20 -mt-4 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.3em] text-white sm:text-base"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        Projects delivered
      </button>
    </div>
  );
}
