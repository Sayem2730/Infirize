"use client";

import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

export default function Hero() {
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden bg-accent px-6 pb-16 text-white">
      <div className="absolute inset-0" aria-hidden="true">
        <Hero3D />
      </div>
      <div className="pointer-events-none relative z-10 max-w-6xl">
        <h1 className="font-display text-[clamp(2.8rem,9vw,8rem)] font-bold uppercase leading-[0.95]">
          Tech that moves your business forward.
        </h1>
        <p className="mt-6 max-w-md text-base text-white/80">
          InfirizeTech designs and builds fast, modern websites and software
          for ambitious teams.
        </p>
      </div>
    </section>
  );
}
