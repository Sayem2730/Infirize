const services = [
  {
    title: "Web development",
    text: "Fast, accessible sites built with modern tools.",
  },
  {
    title: "Software",
    text: "Custom apps and dashboards that fit how you work.",
  },
  {
    title: "Branding",
    text: "A clear identity that people remember.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-ink px-6 py-32 text-white">
      <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-bold uppercase leading-none">
        Services
      </h2>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <article
            key={s.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-transform hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <h3 className="font-display text-2xl font-bold">{s.title}</h3>
            <p className="mt-3 text-white/70">{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
