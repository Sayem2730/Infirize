import CoinField from "./CoinField";
import HeroHeadline from "./HeroHeadline";

const rows = [
  ["Tech", "that"],
  ["moves", "your"],
  ["business", "forward."],
];

export default function Hero() {
  return (
    <section className="bg-paper p-3 sm:p-4">
      <div className="relative h-[calc(100dvh-1.5rem)] min-h-[600px] overflow-hidden rounded-3xl bg-accent text-white sm:h-[calc(100dvh-2rem)]">
        <CoinField floorOffset={56} />

        <div className="pointer-events-none relative z-10 h-full px-6 pt-28 sm:px-10 sm:pt-32">
          <HeroHeadline rows={rows} />

          <p className="absolute right-6 top-[62%] w-56 text-xs leading-relaxed text-white/80 sm:right-10 sm:w-72">
            InfirizeTech is a web and software studio. We design and build
            fast, modern websites and apps for founders and growing teams.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-14 h-px bg-white/35 sm:inset-x-10"
        />

        <div className="pointer-events-none absolute inset-x-6 bottom-5 z-10 flex items-center justify-between text-[11px] uppercase tracking-wide sm:inset-x-10">
          <span>
            <span className="text-white/60">Based in: </span>Malaysia
          </span>
          <span className="hidden text-white/60 sm:block">
            Drag the coins · click to drop one
          </span>
          <span>
            <span className="text-white/60">Say hello: </span>
            <a
              href="mailto:hello@yourdomain.com"
              className="pointer-events-auto underline-offset-4 hover:underline"
            >
              hello@yourdomain.com
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
