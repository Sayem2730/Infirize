const projects = [
  {
    title: "Project one",
    tag: "Website",
    text: "Replace this with a short description of the project and the result.",
  },
  {
    title: "Project two",
    tag: "Web app",
    text: "Replace this with a short description of the project and the result.",
  },
  {
    title: "Project three",
    tag: "Branding",
    text: "Replace this with a short description of the project and the result.",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="bg-paper px-6 py-32 text-ink">
      <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-bold uppercase leading-none">
        Projects
      </h2>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <article key={p.title} className="group">
            <div className="aspect-[4/3] rounded-2xl bg-accent transition-transform group-hover:-translate-y-2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0" />
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-accent">
              {p.tag}
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold">{p.title}</h3>
            <p className="mt-2 text-ink/70">{p.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
