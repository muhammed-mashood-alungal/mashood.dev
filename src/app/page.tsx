import { Contact } from "@/components/contact";
import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { ProofOfWork } from "@/components/proof-of-work";
import { Skills } from "@/components/skills";

export default function Home() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto max-w-5xl space-y-16 px-5 pb-4 outline-none sm:space-y-20 sm:px-8"
    >
      <div id="top" tabIndex={-1} className="outline-none">
        <Hero />
      </div>
      <ProofOfWork />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Contact />
    </main>
  );
}
