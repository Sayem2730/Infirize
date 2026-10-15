"use client";

import { useEffect, useRef } from "react";

type Coin = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  fill: string;
  ink: string;
  glyph: string;
};

const GLYPHS = ["i.", "t.", "<>", "{}", "i", "t"];
const GRAVITY = 2200;
const MAX_COINS = 70;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export default function CoinField({
  floorOffset = 56,
}: {
  floorOffset?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue("--c-accent").trim() || "#3d5afe";
    const ink = css.getPropertyValue("--c-ink").trim() || "#0b1020";

    const palette = [
      { fill: "#ffffff", ink: accent },
      { fill: `color-mix(in srgb, ${accent} 14%, white)`, ink: accent },
      { fill: `color-mix(in srgb, ${accent} 38%, white)`, ink: ink },
      { fill: ink, ink: "#ffffff" },
      { fill: `color-mix(in srgb, ${accent} 45%, ${ink})`, ink: "#ffffff" },
      { fill: `color-mix(in srgb, ${accent} 70%, white)`, ink: "#ffffff" },
    ];

    let width = 0;
    let height = 0;
    let floor = 0;
    let radius = 18;
    let coins: Coin[] = [];
    let dragged: Coin | null = null;
    const pointer = { x: -9999, y: -9999, active: false, mouse: false };

    const makeCoin = (x: number, y: number, pop = false): Coin => {
      const p = palette[Math.floor(Math.random() * palette.length)];
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * (pop ? 500 : 300),
        vy: pop ? -250 : 0,
        r: radius,
        rot: Math.random() * Math.PI * 2,
        fill: p.fill,
        ink: p.ink,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      };
    };

    const step = (dt: number) => {
      const sub = 2;
      const hh = dt / sub;

      for (let s = 0; s < sub; s++) {
        for (const c of coins) {
          if (c === dragged) {
            c.vx = clamp((pointer.x - c.x) * 18, -3000, 3000);
            c.vy = clamp((pointer.y - c.y) * 18, -3000, 3000);
            c.x += c.vx * hh;
            c.y += c.vy * hh;
            continue;
          }

          c.vy += GRAVITY * hh;
          c.vx *= 1 - 0.1 * hh;

          if (pointer.active && pointer.mouse && !dragged) {
            const dx = c.x - pointer.x;
            const dy = c.y - pointer.y;
            const d = Math.hypot(dx, dy);
            const R = 120;
            if (d > 0.01 && d < R) {
              const f = 1 - d / R;
              c.vx += (dx / d) * f * 4200 * hh;
              c.vy += (dy / d) * f * 4200 * hh;
            }
          }

          c.x += c.vx * hh;
          c.y += c.vy * hh;
          c.rot += (c.vx / c.r) * hh * 0.8;

          if (c.x < c.r) {
            c.x = c.r;
            c.vx = Math.abs(c.vx) * 0.5;
          } else if (c.x > width - c.r) {
            c.x = width - c.r;
            c.vx = -Math.abs(c.vx) * 0.5;
          }

          if (c.y > floor - c.r) {
            c.y = floor - c.r;
            if (c.vy > 0) c.vy = c.vy > 140 ? -c.vy * 0.4 : 0;
            c.vx *= Math.max(0, 1 - 4 * hh);
          }
        }

        for (let iter = 0; iter < 2; iter++) {
          for (let i = 0; i < coins.length; i++) {
            for (let j = i + 1; j < coins.length; j++) {
              const a = coins[i];
              const b = coins[j];
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const minD = a.r + b.r;
              const d2 = dx * dx + dy * dy;
              if (d2 >= minD * minD || d2 === 0) continue;

              const d = Math.sqrt(d2);
              const nx = dx / d;
              const ny = dy / d;
              const overlap = minD - d;
              const wa = a === dragged ? 0 : 1;
              const wb = b === dragged ? 0 : 1;
              const total = wa + wb;
              if (total === 0) continue;

              a.x -= (nx * overlap * wa) / total;
              a.y -= (ny * overlap * wa) / total;
              b.x += (nx * overlap * wb) / total;
              b.y += (ny * overlap * wb) / total;

              const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
              if (vn < 0) {
                const e = vn < -60 ? 0.35 : 0;
                const j2 = (-(1 + e) * vn) / total;
                a.vx -= j2 * nx * wa;
                a.vy -= j2 * ny * wa;
                b.vx += j2 * nx * wb;
                b.vy += j2 * ny * wb;
              }
            }
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const c of coins) {
        ctx.save();
        ctx.translate(c.x, c.y);

        ctx.shadowColor = "rgba(0,0,0,0.22)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = c.fill;
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        const g = ctx.createRadialGradient(
          -c.r * 0.35,
          -c.r * 0.4,
          c.r * 0.1,
          0,
          0,
          c.r,
        );
        g.addColorStop(0, "rgba(255,255,255,0.35)");
        g.addColorStop(1, "rgba(0,0,0,0.12)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(0,0,0,0.14)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.strokeStyle = "rgba(0,0,0,0.08)";
        ctx.beginPath();
        ctx.arc(0, 0, c.r * 0.74, 0, Math.PI * 2);
        ctx.stroke();

        ctx.rotate(c.rot);
        ctx.fillStyle = c.ink;
        ctx.globalAlpha = 0.75;
        const size = c.glyph.length > 1 ? c.r * 0.72 : c.r * 0.95;
        ctx.font = `600 ${size}px ui-rounded, "SF Pro Rounded", system-ui, sans-serif`;
        ctx.fillText(c.glyph, 0, 1);

        ctx.restore();
      }
    };

    const init = () => {
      radius = clamp(width * 0.0105, 14, 22);
      const count = Math.round(clamp(width / 55, 14, 40));
      coins = [];
      for (let i = 0; i < count; i++) {
        coins.push(
          makeCoin(
            radius + Math.random() * (width - radius * 2),
            -radius - Math.random() * height * 1.2,
          ),
        );
      }
      if (reduce) {
        for (let i = 0; i < 700; i++) step(1 / 60);
        draw();
      }
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      floor = height - floorOffset;
      if (coins.length === 0) init();
      for (const c of coins) c.x = clamp(c.x, c.r, width - c.r);
      if (reduce) draw();
    };

    let raf = 0;
    let running = false;
    let last = 0;

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const local = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMove = (e: PointerEvent) => {
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.mouse = e.pointerType === "mouse";
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;

      if (e.pointerType !== "mouse") {
        for (const c of coins) {
          const dx = c.x - p.x;
          const dy = c.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d > 0.01 && d < 170) {
            const f = 1 - d / 170;
            c.vx += (dx / d) * f * 900;
            c.vy -= f * 600;
          }
        }
        return;
      }

      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        if (Math.hypot(c.x - p.x, c.y - p.y) <= c.r * 1.25) {
          dragged = c;
          root.setPointerCapture(e.pointerId);
          return;
        }
      }
      if (coins.length < MAX_COINS) coins.push(makeCoin(p.x, p.y, true));
    };
    const onUp = (e: PointerEvent) => {
      if (dragged) {
        dragged.vx = clamp(dragged.vx, -2500, 2500);
        dragged.vy = clamp(dragged.vy, -2500, 2500);
        dragged = null;
      }
      if (root.hasPointerCapture(e.pointerId)) {
        root.releasePointerCapture(e.pointerId);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(root);

    let io: IntersectionObserver | null = null;
    if (!reduce) {
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      });
      io.observe(root);

      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      root.addEventListener("pointerdown", onDown);
      root.addEventListener("pointerup", onUp);
      root.addEventListener("pointercancel", onUp);
    }

    return () => {
      stop();
      ro.disconnect();
      io?.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
    };
  }, [floorOffset]);

  return (
    <div ref={rootRef} className="absolute inset-0 touch-pan-y select-none">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
