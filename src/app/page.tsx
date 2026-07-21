import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { PageTransition } from "@/components/effects/PageTransition";

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Sits above the fixed Backdrop. */}
      <PageTransition>
        <main id="main" className="relative z-10">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Experience />
          <Contact />
        </main>

        <div className="relative z-10">
          <Footer />
        </div>
      </PageTransition>
    </>
  );
}
