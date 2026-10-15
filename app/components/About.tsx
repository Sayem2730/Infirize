export default function About() {
  return (
    <section id="about" className="bg-paper px-4 py-6 sm:px-6">
      <div className="relative flex min-h-[85dvh] items-center justify-center overflow-hidden rounded-3xl bg-ink/5 px-6 py-24 text-ink">
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

        {/* Letter construction sketch: anchors, handles, guide wedge */}
        <svg
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
            <path
              d="M190 50 H310 M190 60 V160"
              strokeWidth="1"
            />
            <path
              d="M20 440 H480"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
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

        <p className="relative max-w-5xl text-center font-[family-name:var(--font-outfit)] text-[clamp(2.2rem,5.6vw,5rem)] font-normal leading-[1.06] tracking-tight">
          We design and build fast, beautiful websites and software that turn
          visitors into customers.
        </p>
      </div>
    </section>
  );
}
