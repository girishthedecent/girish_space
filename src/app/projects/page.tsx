import type { Metadata } from "next";
import Link from "next/link";
import { Footer, TopBar } from "@/components/chrome";
import { Reveal } from "@/components/motion";
import { ProjectsList } from "@/components/ProjectsList";
import { projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "Everything Girish Pasupuleti has built: distributed backends, AI agents, full stack apps and test automation.",
};

export default function ProjectsPage() {
  const years = projects.map((p) => p.year);
  return (
    <>
      <TopBar active="projects" />
      <main className="w">
        <section className="ph">
          <Reveal>
            <Link className="back" href="/">← back home</Link>
            <h1>
              All <em>projects</em>
            </h1>
            <p>Everything I&apos;ve built, from distributed backends to AI agents. Most important first.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="sum">
              <div style={{ ["--ac2" as string]: "#38bdf8" }}><b>{projects.length}</b><span>projects</span></div>
              <div style={{ ["--ac2" as string]: "#22c55e" }}><b>{projects.filter((p) => p.live).length}</b><span>live demos</span></div>
              <div style={{ ["--ac2" as string]: "#fbbf24" }}><b>{Math.min(...years)}–{String(Math.max(...years)).slice(2)}</b><span>built</span></div>
            </div>
          </Reveal>
        </section>
        <ProjectsList />
      </main>
      <Footer />
    </>
  );
}
