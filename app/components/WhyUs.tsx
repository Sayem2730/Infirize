const points = [
  {
    n: "01",
    title: "Fast, modern builds",
    body: "We build with Next.js and modern tooling, so your site loads quickly and is easy to grow.",
  },
  {
    n: "02",
    title: "Security-minded development",
    body: "Security is part of how we write code from the start, not something added at the end.",
  },
  {
    n: "03",
    title: "Built for founders",
    body: "Clear communication and plain language. You always know what's being built and why.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-paper px-6 py-24 text-ink sm:px-10">
      <div className="mx-auto max-w-6xl">
        <span className="inline-block rounded-2xl bg-white px-5 py-3 text-sm font-medium shadow-sm">
          Why Infirize
        </span>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold uppercase leading-[0.95]">
            Tech that <span className="text-accent">moves your business</span>{" "}
            forward
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink/70">
            We combine design, engineering and security into one focused
            workflow, so what we build looks sharp, runs fast and stays safe.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl bg-accent p-8 text-white sm:min-h-[420px]">
            <span className="text-xs uppercase tracking-wide text-white/70">
              Based in Malaysia
            </span>
            <p className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold uppercase leading-[0.95]">
              Design.
              <br />
              Build.
              <br />
              Secure.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <ul className="space-y-8">
              {points.map((p) => (
                <li key={p.n} className="flex gap-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-xl font-bold text-white">
                    {p.n}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
