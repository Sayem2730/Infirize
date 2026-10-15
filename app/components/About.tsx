"use client";

import { useEffect, useRef } from "react";

const FIRST =
  "We design and build fast, beautiful websites and software that turn visitors into customers.";
const SECOND =
  "From first sketch to live launch, one small team handles the design, the code and everything in between.";

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span data-w className="inline-block will-change-transform">
            {w}
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const firstRef = useRef<HTMLParagraphElement>(null);
  const secondRef = useRef<HTMLParagraphElement>(null);
  const sketchRef = useRef<SVGSVGElement>(null);
  const shapesRef = useRef<SVGSVGElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const first = firstRef.current;
    const second = secondRef.current;
    const sketch = sketchRef.current;
    const shapes = shapesRef.current;
    if (!section || !first || !second || !sketch || !shapes) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const words1 = Array.from(first.querySelectorAll<HTMLElement>("[data-w]"));
    const words2 = Array.from(second.querySelectorAll<HTMLElement>("[data-w]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total) : 0;
      const move = mq.matches ? 0 : 1;

      words1.forEach((el, i) => {
        const t = clamp((p - 0.28 - i * 0.008) / 0.14);
        el.style.opacity = String(1 - t);
        el.style.transform = `translateY(${-t * 40 * move}px)`;
      });

      words2.forEach((el, i) => {
        const t = clamp((p - 0.56 - i * 0.006) / 0.16);
        el.style.opacity = String(t);
        el.style.transform = `translateY(${(1 - t) * 40 * move}px)`;
      });

      const out = clamp((p - 0.26) / 0.24);
      sketch.style.opacity = String(1 - out);
      sketch.style.transform = `translateX(${-out * 90 * move}px)`;

      const inn = clamp((p - 0.5) / 0.28);
      shapes.style.opacity = String(inn);
      shapes.style.transform = `translateX(${(1 - inn) * 90 * move}px) scale(${
        1 - (1 - inn) * 0.08 * move
      })`;

      const d0 = dots.current[0];
      const d1 = dots.current[1];
      if (d0) d0.style.opacity = p < 0.5 ? "1" : "0.25";
      if (d1) d1.style.opacity = p < 0.5 ? "0.25" : "1";
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const textClass =
    "relative col-start-1 row-start-1 max-w-5xl text-center font-[family-name:var(--font-outfit)] text-[clamp(1.9rem,5.2vw,4.6rem)] font-normal leading-[1.06] tracking-tight";

  return (
    <section ref={sectionRef} id="about" className="relative h-[300dvh] bg-paper">
      <div className="sticky top-0 h-dvh p-4 sm:p-6">
        <div className="relative grid h-full place-items-center overflow-hidden rounded-3xl bg-ink/5 px-6 text-ink">
          {/* Blueprint grid */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full text-ink/15"
          >
            <g stroke="currentColor" strokeWidth="1">
              <line x1="6%" y1="0" x2="6%" y2="100%" />
              <line x1="24%" y1="0" x2="24%" y2="100%" />
              <line x1="36%" y1="0" x2="36%" y2="100%" />
              <line x1="0" y1="20%" x2="100%" y2="20%" />
              <line x1="0" y1="47%" x2="100%" y2="47%" />
              <line x1="0" y1="88%" x2="100%" y2="88%" />
            </g>
          </svg>

          {/* Scene 1: letter construction sketch */}
          <svg
            ref={sketchRef}
            aria-hidden="true"
            viewBox="0 0 500 500"
            className="absolute bottom-[4%] left-[2%] h-[68%] w-auto text-ink/35"
          >
            <polygon
              points="170,40 330,40 250,200"
              fill="currentColor"
              opacity="0.12"
            />
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="250" cy="110" r="60" />
              <path d="M215 240 H285 V440 H215 Z" />
              <path d="M190 50 H310 M190 60 V160" strokeWidth="1" />
              <path d="M20 440 H480" strokeWidth="1" strokeDasharray="4 6" />
            </g>
            <g fill="var(--c-white)" stroke="currentColor" strokeWidth="1.5">
              <rect x="245" y="45" width="10" height="10" />
              <rect x="305" y="105" width="10" height="10" />
              <rect x="245" y="165" width="10" height="10" />
              <rect x="185" y="105" width="10" height="10" />
              <rect x="210" y="235" width="10" height="10" />
              <rect x="280" y="235" width="10" height="10" />
              <rect x="280" y="435" width="10" height="10" />
              <rect x="210" y="435" width="10" height="10" />
              <circle cx="190" cy="50" r="3" />
              <circle cx="310" cy="50" r="3" />
              <circle cx="190" cy="60" r="3" />
              <circle cx="190" cy="160" r="3" />
            </g>
          </svg>

          {/* Scene 2: circle and square */}
          <svg
            ref={shapesRef}
            aria-hidden="true"
            viewBox="0 0 600 700"
            style={{ opacity: 0 }}
            className="absolute -right-[8%] top-[6%] h-[80%] w-auto text-ink/30"
          >
            <circle
              cx="380"
              cy="230"
              r="210"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeWidth="1"
            />
            <rect
              x="60"
              y="300"
              width="340"
              height="340"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>

          <p ref={firstRef} className={textClass}>
            <Words text={FIRST} />
          </p>
          <p ref={secondRef} className={textClass}>
            <Words text={SECOND} />
          </p>

          <div
            aria-hidden="true"
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2"
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                ref={(el) => {
                  dots.current[i] = el;
                }}
                className="h-2 w-2 rounded-full bg-ink transition-opacity"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
