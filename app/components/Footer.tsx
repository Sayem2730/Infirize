import LocalTime from "./LocalTime";
import Year from "./Year";

const nav = [
  { label: "Home", href: "#main" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

// TODO: replace "#" with your real profile links
const social = [
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
];

// TODO: create these pages, then link them here
const legal = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

const link = "text-sm text-white transition-colors hover:text-white/60";

export default function Footer() {
  return (
    <footer className="bg-paper px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
      <div className="rounded-3xl bg-ink px-6 py-8 text-white sm:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[16rem_9rem_1fr_auto]">
          <div className="col-span-2 md:col-span-1">
            <a
              href="#main"
              className="font-display text-2xl font-bold tracking-tight"
            >
              InfirizeTech
            </a>
          </div>

          <nav aria-label="Footer">
            <ul className="space-y-3">
              {nav.map((n) => (
                <li key={n.label}>
                  <a href={n.href} className={link}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="space-y-3">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} className={link}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="col-span-2 space-y-5 md:col-span-1 md:justify-self-end">
            <div>
              <p className="text-[11px] text-white/50">Contact us</p>
              {/* TODO: replace with your real email */}
              <a href="mailto:hello@yourdomain.com" className={link}>
                hello@yourdomain.com
              </a>
            </div>
            <div>
              <p className="text-[11px] text-white/50">Based in</p>
              <p className="text-sm">
                <LocalTime />
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 items-center gap-x-6 gap-y-4 text-[11px] md:mt-24 md:grid-cols-[16rem_9rem_1fr_auto]">
          <p className="col-span-2 text-white/60 md:col-span-1">
            © <Year /> InfirizeTech. All rights reserved.
          </p>

          <ul className="flex gap-5 uppercase tracking-wide text-white/60 md:col-span-2">
            {legal.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#main"
            className="justify-self-end text-sm text-white transition-colors hover:text-white/60"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
