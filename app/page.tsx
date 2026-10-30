import { Suspense } from "react";
import Hero from "./components/Hero";
import WhyUs from "./components/WhyUs";
import ServicesLoader from "./components/ServicesLoader";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import AboutStats from "./components/AboutStats";
import FAQ from "./components/FAQ";
import IndustrySection from "./components/IndustrySection";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<section aria-hidden="true" className="min-h-[24rem]" />}>
        <AboutStats />
      </Suspense>
      <WhyUs />
      <Suspense fallback={<section id="services" aria-hidden="true" className="min-h-[100dvh] bg-paper" />}>
        <ServicesLoader />
      </Suspense>
      <IndustrySection />
      <Suspense
        fallback={<section id="projects" aria-hidden="true" className="min-h-[60dvh] bg-paper" />}
      >
        <Projects />
      </Suspense>
      <FAQ />
      <Contact />
    </>
  );
}
