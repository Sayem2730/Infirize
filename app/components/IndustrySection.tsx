"use client";

import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaShoppingCart, FaTshirt, FaHome, FaLaptopCode, FaBriefcase, FaRocket,
  FaTruck, FaBalanceScale, FaRunning, FaGamepad, FaHeartbeat, FaCar,
  FaCamera, FaVrCardboard, FaHandHoldingHeart, FaUniversity,
  FaSatelliteDish, FaBolt, FaCheckCircle, FaArrowRight,
} from "react-icons/fa";

type Industry = {
  name: string;
  Icon: IconType;
  color: string;
  desc: string;
  items: string[];
};

const industries: Industry[] = [
  { name: "E-commerce", Icon: FaShoppingCart, color: "#f0a030", desc: "Online stores built to turn visitors into customers.", items: ["Custom storefronts and checkout", "Payment and delivery integration", "Product SEO and ad campaigns"] },
  { name: "Fashion & Apparel", Icon: FaTshirt, color: "#e63946", desc: "Stylish, fast stores and brand sites for fashion labels.", items: ["Lookbooks and product galleries", "Mobile-first shopping experience", "Social media and influencer campaigns"] },
  { name: "Real Estate", Icon: FaHome, color: "#3aa76d", desc: "Property platforms that bring serious buyers and renters.", items: ["Listings with search and filters", "Inquiry and viewing booking forms", "Local SEO and lead generation"] },
  { name: "Software", Icon: FaLaptopCode, color: "#3b6fd4", desc: "Custom software and SaaS products built around your workflow.", items: ["Web apps and dashboards", "API and third-party integrations", "Ongoing maintenance and support"] },
  { name: "Business", Icon: FaBriefcase, color: "#2f5fd0", desc: "Professional websites and tools that build trust and generate leads.", items: ["Corporate websites", "CRM and internal tools", "Brand-focused digital marketing"] },
  { name: "Startup", Icon: FaRocket, color: "#f07a28", desc: "Launch fast with an MVP and a marketing plan that fits your budget.", items: ["MVP development", "Landing pages and waitlists", "Growth and SEO strategy"] },
  { name: "Logistics", Icon: FaTruck, color: "#2a9d8f", desc: "Digital tools that keep shipments and teams moving.", items: ["Tracking and booking portals", "Fleet and order dashboards", "Quote request systems"] },
  { name: "Legal Services", Icon: FaBalanceScale, color: "#3a9ad9", desc: "Credible websites for law firms and legal professionals.", items: ["Practice area pages", "Online consultation booking", "Local SEO for your firm"] },
  { name: "Sports & Fitness", Icon: FaRunning, color: "#3aa76d", desc: "Platforms for clubs, trainers and fitness brands.", items: ["Class and membership booking", "Online coaching platforms", "Community and social campaigns"] },
  { name: "Gaming", Icon: FaGamepad, color: "#7c4dff", desc: "Websites and web experiences for studios and communities.", items: ["Game and studio landing pages", "Leaderboards and community features", "Launch and promotion campaigns"] },
  { name: "Health & Fitness", Icon: FaHeartbeat, color: "#e63946", desc: "Client-friendly sites for health and wellness providers.", items: ["Appointment booking", "Clinic and service websites", "Content marketing and local SEO"] },
  { name: "Automotive", Icon: FaCar, color: "#4a4f5c", desc: "Showrooms, listings and service booking for the auto industry.", items: ["Vehicle listings with filters", "Service booking", "Lead generation campaigns"] },
  { name: "Photo & Video", Icon: FaCamera, color: "#7c4dff", desc: "Portfolios that showcase your work beautifully.", items: ["Portfolio and gallery sites", "Client proofing and booking", "Social media and SEO"] },
  { name: "AR/VR", Icon: FaVrCardboard, color: "#6a35e0", desc: "Immersive experiences delivered through the web.", items: ["Interactive 3D web experiences", "Product visualization", "Promo and launch sites"] },
  { name: "Non-profit", Icon: FaHandHoldingHeart, color: "#e8527f", desc: "Sites that tell your story and drive donations.", items: ["Donation and volunteer forms", "Campaign and event pages", "Awareness and outreach campaigns"] },
  { name: "Finance & Banking", Icon: FaUniversity, color: "#2f6cc4", desc: "Clean, trustworthy interfaces for financial services.", items: ["Calculators and dashboards", "Client portals", "Clear, trust-building design"] },
  { name: "Telecom", Icon: FaSatelliteDish, color: "#6a4be0", desc: "Customer-facing portals and plan showcases for telecom brands.", items: ["Plan comparison pages", "Customer self-service portals", "Customer acquisition campaigns"] },
  { name: "Energy & Utilities", Icon: FaBolt, color: "#f5c518", desc: "Digital tools for energy providers and utility companies.", items: ["Usage and billing dashboards", "Service request portals", "Awareness campaigns"] },
];

const hexPattern = `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/svg%3E")`;

export default function IndustrySection() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reveal cards once when the grid scrolls into view
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Spotlight: pass the mouse position to every card as CSS variables
  const onGridMove = (e: React.MouseEvent<HTMLDivElement>) => {
    cardRefs.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  };

  const onGridLeave = () => {
    cardRefs.current.forEach((el) => {
      el?.style.removeProperty("--mx");
      el?.style.removeProperty("--my");
    });
  };

  // 3D tilt toward the cursor
  const onCardMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(700px) rotateX(${(0.5 - py) * 14}deg) rotateY(${(px - 0.5) * 14}deg) scale(1.05)`;
  };

  const onCardLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "";
  };

  const select = (i: number) => {
    setActive(i);
    if (window.innerWidth < 1024) {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const current = industries[active];

  return (
    <section className="relative mx-3 my-3 overflow-hidden rounded-[2rem] bg-[color:var(--c-accent-2)] px-4 py-20 sm:mx-5">
      <style>{`@keyframes industryFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>

      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: hexPattern }}
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <h2 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl">
          Industry-Specific Software Development &amp;{" "}
          <span className="text-yellow-400">Digital Marketing Solutions</span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base text-blue-100 md:text-lg">
          We deliver custom software development and digital marketing
          solutions across 18+ industries worldwide. Select an industry to see
          what we build for it.
        </p>

        <div
          ref={gridRef}
          onMouseMove={onGridMove}
          onMouseLeave={onGridLeave}
          className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"
        >
          {industries.map(({ name, Icon, color }, i) => (
            <div
              key={name}
              className={`transition duration-700 ${
                inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <button
                type="button"
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                onClick={() => select(i)}
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
                aria-pressed={active === i}
                className={`relative w-full overflow-hidden rounded-2xl bg-white px-4 py-8 shadow-lg transition-[transform,box-shadow] duration-150 ease-out hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 ${
                  active === i ? "ring-4 ring-yellow-400" : ""
                }`}
              >
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(170px circle at var(--mx, -999px) var(--my, -999px), rgba(59,130,246,0.22), transparent 70%)",
                  }}
                />
                <span className="relative flex flex-col items-center gap-3">
                  <Icon size={34} style={{ color }} />
                  <span className="text-sm font-medium text-slate-800">{name}</span>
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div ref={panelRef} className="mx-auto mt-10 max-w-3xl">
          <div
            key={current.name}
            className="rounded-2xl border border-white/20 bg-white/10 p-6 text-left backdrop-blur md:p-8"
            style={{ animation: "industryFade 0.35s ease" }}
          >
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow">
                <current.Icon size={28} style={{ color: current.color }} />
              </span>
              <div>
                <h3 className="text-2xl font-bold text-white">{current.name}</h3>
                <p className="text-blue-100">{current.desc}</p>
              </div>
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {current.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-yellow-400" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-bold text-[#0b3d73] transition hover:bg-yellow-300"
            >
              Get a Free Quote <FaArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
