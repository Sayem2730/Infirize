import { getProjects } from "../lib/content";
import CountUp from "./CountUp";

export default async function ProjectCount() {
  const projects = await getProjects();
  const count = projects?.length ?? 0;
  if (!count) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center"
    >
      <span
        className="select-none font-display text-[clamp(14rem,38vw,34rem)] font-bold leading-none tabular-nums"
        style={{
          color: "transparent",
          WebkitTextStroke: "2px rgba(255,255,255,0.22)",
        }}
      >
        <CountUp to={count} />
      </span>
      <span className="-mt-4 text-xs uppercase tracking-[0.3em] text-white/50 sm:text-sm">
        Projects delivered
      </span>
    </div>
  );
}
