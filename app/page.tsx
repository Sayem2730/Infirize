import { Suspense } from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Suspense
        fallback={<section id="projects" aria-hidden="true" className="min-h-[60dvh] bg-paper" />}
      >
        <Projects />
      </Suspense>
      <Contact />
    </>
  );
}
