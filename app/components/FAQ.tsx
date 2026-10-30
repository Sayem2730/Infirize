"use client";

import { useState } from "react";
import { FaChevronDown, FaQuestion } from "react-icons/fa";

const faqs = [
  {
    q: "What Is The Typical Timeline For Project Completion?",
    a: "Timelines depend on the scope and complexity of your project. A simple business website can take 1-2 weeks, while larger web apps and custom software take longer. After discussing your requirements, we give you a clear, tailored timeline before we start.",
  },
  {
    q: "What Services Does Infirize Offer?",
    a: "Infirize is a web development and digital marketing agency. We build websites, web applications and e-commerce stores, and we run SEO, social media and online marketing to help your business grow.",
  },
  {
    q: "Do You Provide Ongoing Support After Project Completion?",
    a: "Yes. After launch we offer maintenance, bug fixes, updates and hosting support, so your website stays fast, secure and up to date.",
  },
  {
    q: "How Do You Ensure The Quality Of Your Work?",
    a: "We test every project across devices and browsers, follow modern coding and security practices, and share progress with you at each stage so you can give feedback before launch.",
  },
  {
    q: "Will My Website Be Fast, Secure And Mobile-Friendly?",
    a: "Yes. Every website we build is responsive, optimized for speed and built with security best practices, so it works smoothly on every device and keeps your visitors data protected.",
  },
  {
    q: "What Industries Do You Serve?",
    a: "We work with businesses across 18+ industries, including e-commerce, real estate, healthcare, finance, logistics, education and startups. Each solution is tailored to the needs of your industry.",
  },
  {
    q: "What Sets Infirize Apart From Other Development Companies?",
    a: "We combine development and digital marketing under one roof, so your website is built to get found and to convert visitors. You also get direct communication, transparent pricing and custom work instead of generic templates.",
  },
  {
    q: "Can You Help With Both Small And Large-Scale Projects?",
    a: "Absolutely. We take on projects of every size, from landing pages for small businesses to complex custom platforms for growing companies.",
  },
  {
    q: "How Do I Get Started?",
    a: "Contact us through the form on this page or by email. We'll set up a free consultation to understand your goals, then send a clear proposal with scope, timeline and cost.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg bg-[color:var(--c-accent-2)] px-4 py-6 text-center">
          <h2 className="text-3xl font-extrabold text-white md:text-5xl">
            Frequently <span className="text-yellow-400">Asked Questions</span>
          </h2>
        </div>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
          <div className="mx-auto hidden aspect-square w-full max-w-md flex-col items-center justify-center gap-4 rounded-xl bg-[color:var(--c-accent-2)] lg:flex">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-[color:var(--c-accent-2)]">
              <FaQuestion size={28} />
            </span>
            <span className="text-8xl font-black text-white">FAQ</span>
          </div>

          <div>
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className="border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-slate-900"
                  >
                    {item.q}
                    <FaChevronDown
                      className={`shrink-0 text-slate-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="leading-7 text-slate-600">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
