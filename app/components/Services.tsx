"use client";

import { useEffect, useRef } from "react";

type ServiceItem = { no: string; title: string; text: string; glyph: string };

const fallbackServices: ServiceItem[] = [
  {
    no: "01",
    title: "Web development",
    text: "Fast, accessible websites built with modern tools. We take a project from first sketch to a live, launch-ready site you can be proud of.",
    glyph: "</>",
  },
  {
    no: "02",
    title: "Software and web apps",
    text: "Custom dashboards, portals and apps shaped around how your team actually works, built to scale as you grow.",
    glyph: "{ }",
  },
  {
    no: "03",
    title: "Branding",
    text: "A clear identity, from logo to colors and type, that makes your business easy to recognize and hard to forget.",
    glyph: "i.",
  },
  {
    no: "04",
    title: "Care and support",
    text: "After launch we keep your site fast, secure and up to date, and show your team how to manage content with confidence.",
    glyph: "+",
  },
];

// How many viewport heights of scrolling each card gets
const VH_PER_CARD = 85;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Services({ items }: { items?: ServiceItem[] }) {
  const services: ServiceItem[] = items ?? fallbackServices;
  // Extra scroll after the last card lands, so it holds for a moment
  const SPAN = services.length + 0.3;
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cardH = 300;
    let frame = 0;

    const measure = () => {
      const first = cardRefs.current[0];
      if (first) cardH = first.offsetHeight;
    };

    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      const P = p * SPAN;
      const move = mq.matches ? 0 : 1;

      const stepY = cardH * 0.86; // how far a card is pushed up per new card
      const offscreen = cardH + 90;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const k = P - i; // 0..1 entering, 1..2 pushed to back slot, 2..3 leaving
        const kin = clamp(k, 0, 1);
        const e = easeOut(kin);

        const y = k < 1 ? (1 - e) * offscreen * move : -(k - 1) * stepY;
        const settle = clamp(k - 1, 0, 2);
        const rz = i % 2 === 0 ? -1.3 : 1.3;
        const rx = 2 + (1 - e) * 12 * move;
        const scale = 1 - settle * 0.035;
        const fadeOut = 1 - clamp((k - 2) / 0.7, 0, 1);
        const fadeIn = move ? 1 : kin;

        el.style.transform = `perspective(1400px) translate3d(-50%, ${y}px, 0) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${scale})`;
        el.style.opacity = String(fadeIn * fadeOut);
        el.style.filter =
          settle > 0 ? `brightness(${1 - settle * 0.1})` : "none";
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [SPAN]);

  return (
    <section id="services" className="bg-paper px-3 pb-3 sm:px-4 sm:pb-4">
      <div
        ref={trackRef}
        className="relative rounded-3xl bg-ink"
        style={{ height: `calc(100dvh + ${SPAN * VH_PER_CARD}dvh)` }}
      >
        <div className="sticky top-0 h-dvh overflow-hidden">
          <h2 className="pointer-events-none relative z-30 pt-8 text-center font-sans text-[clamp(3rem,9vw,9.5rem)] font-medium uppercase leading-none tracking-tight text-white">
            Services
          </h2>

          {services.map((s, i) => (
            <article
              key={s.no}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{ opacity: 0, zIndex: i + 1 }}
              className="absolute bottom-10 left-1/2 flex h-[clamp(250px,38dvh,340px)] w-[min(92vw,680px)] flex-col overflow-hidden rounded-2xl bg-[#e7e8ec] p-6 text-ink shadow-[0_20px_50px_rgba(0,0,0,0.35)] will-change-transform sm:p-8"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 right-2 select-none font-[family-name:var(--font-outfit)] text-[10rem] leading-none text-ink/[0.07]"
              >
                {s.glyph}
              </span>

              <p className="relative text-[11px] font-semibold text-accent">
                {s.no}
              </p>
              <h3 className="relative mt-3 font-sans text-[clamp(1.4rem,2.6vw,1.9rem)] font-medium tracking-tight">
                {s.title}
              </h3>
              <p className="relative mt-3 max-w-[30rem] text-[13px] leading-relaxed text-ink/65">
                {s.text}
              </p>
              <a
                href="#contact"
                className="relative mt-auto w-fit rounded-full bg-ink px-5 py-2.5 text-xs font-medium text-white transition-transform hover:scale-105 motion-reduce:transition-none"
              >
                More information
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
