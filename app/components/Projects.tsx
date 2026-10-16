import SiteImage from "./SiteImage";
import Marquee from "./Marquee";
import { getProjects } from "../lib/content";
import type { Project } from "../lib/types";

// Shown until Supabase is connected.
const fallback: Project[] = [
  {
    id: "1",
    title: "Project one",
    tag: "Website",
    text: "Replace this with a short description of the project and the result.",
    image_url: "/images/projects/project-1.jpg",
    link_url: null,
    sort_order: 1,
    published: true,
  },
  {
    id: "2",
    title: "Project two",
    tag: "Web app",
    text: "Replace this with a short description of the project and the result.",
    image_url: "/images/projects/project-2.jpg",
    link_url: null,
    sort_order: 2,
    published: true,
  },
  {
    id: "3",
    title: "Project three",
    tag: "Branding",
    text: "Replace this with a short description of the project and the result.",
    image_url: "/images/projects/project-3.jpg",
    link_url: null,
    sort_order: 3,
    published: true,
  },
];

function Card({ p }: { p: Project }) {
  return (
    <article className="group mr-6 w-[min(80vw,420px)] shrink-0">
      <SiteImage
        src={p.image_url}
        alt={`${p.title} preview`}
        sizes="420px"
        className="aspect-[4/3] rounded-2xl transition-transform group-hover:-translate-y-2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
      />
      <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-accent">{p.tag}</p>
      <h3 className="mt-1 font-display text-2xl font-bold">{p.title}</h3>
      <p className="mt-2 line-clamp-3 text-ink/70">{p.text}</p>
      {p.link_url?.startsWith("http") && (
        <a
          href={p.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold underline underline-offset-4 hover:text-accent"
        >
          View project ↗
        </a>
      )}
    </article>
  );
}

export default async function Projects() {
  const projects = (await getProjects()) ?? fallback;

  // Repeat the list so one half of the track is always wider than the screen.
  const reps = Math.max(1, Math.ceil(5 / Math.max(1, projects.length)));
  const half = Array.from({ length: reps }, () => projects).flat();

  return (
    <section id="projects" className="overflow-hidden bg-paper px-6 py-32 text-ink">
      <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-bold uppercase leading-none">
        Projects
      </h2>

      {projects.length === 0 ? (
        <p className="mt-16 text-lg text-ink/70">New projects are coming soon.</p>
      ) : (
        <div className="-mx-6 mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto">
          <Marquee speed={60}>
            <div className="flex pl-6">
              {half.map((p, i) => (
                <Card key={`a-${i}-${p.id}`} p={p} />
              ))}
            </div>
            <div className="flex pl-6" aria-hidden="true" inert>
              {half.map((p, i) => (
                <Card key={`b-${i}-${p.id}`} p={p} />
              ))}
            </div>
          </Marquee>
        </div>
      )}
    </section>
  );
}
