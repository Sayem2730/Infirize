import { getProjects } from "../lib/content";

export default async function AboutStats() {
  const projects = await getProjects();

  const stats = [
    ...(projects
      ? [{ value: String(projects.length), suffix: "", label: "Projects delivered" }]
      : []),
    { value: "5", suffix: "", label: "Core services" },
    { value: "18", suffix: "+", label: "Industries served" },
    { value: "12", suffix: "hr", label: "Priority support reply" },
  ];

  return (
    <section className="mx-3 my-3 rounded-[2rem] bg-paper px-6 py-16 sm:mx-5 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-ink/60">
          <span className="h-px w-6 bg-ink/50" />
          Small team. No shortcuts.
        </p>

        <h2 className="mt-8 font-serif text-5xl font-black leading-[0.95] tracking-tighter text-ink md:text-7xl lg:text-8xl">
          Building websites. Solving business problems{" "}
          <span className="font-normal italic text-ink/50">since 2026.</span>
        </h2>

        <div className="mt-10 grid grid-cols-2 border-t border-ink/15 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border-l border-ink/15 px-6 py-8 first:border-l-0"
            >
              <div className="text-6xl font-bold tracking-tight text-ink md:text-7xl">
                {s.value}
                <span className="text-[color:var(--c-accent)]">{s.suffix}</span>
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-ink/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
