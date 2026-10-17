import { Suspense } from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import WhyUs from "./components/WhyUs";
import ServicesLoader from "./components/ServicesLoader";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <WhyUs />
      <Suspense fallback={<section id="services" aria-hidden="true" className="min-h-[100dvh] bg-paper" />}>
        <ServicesLoader />
      </Suspense>
      <Suspense
        fallback={<section id="projects" aria-hidden="true" className="min-h-[60dvh] bg-paper" />}
      >
        <Projects />
      </Suspense>
      <Contact />
    </>
  );
}
