"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { projects, type Category, type Project } from "@/content/site";
import { Diagram } from "./Diagram";

const cats: ("All" | Category)[] = ["All", "Backend", "AI", "Full Stack", "Testing"];
const catColor: Record<string, string> = { All: "#f2f2f0", Backend: "#2dd4bf", AI: "#f472b6", "Full Stack": "#f59e0b", Testing: "#a3e635" };

function Thumb({ p }: { p: Project }) {
  if (p.image)
    return (
      <div className="thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={`${p.name} screenshot`} />
      </div>
    );
  if (p.diagram)
    return (
      <div className="thumb">
        <Diagram kind={p.diagram} />
      </div>
    );
  return (
    <div className="thumb">
      <div className="repo">
        <b>{p.github.replace("https://github.com/", "")}</b>
        {p.stack.slice(0, 4).join(" · ")}
        <br />
        {p.year} · {p.categories.join(" · ").toLowerCase()}
      </div>
    </div>
  );
}

export function ProjectsList() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const list = projects.filter((p) => cat === "All" || p.categories.includes(cat));
  return (
    <>
      <div className="filters" role="tablist">
        {cats.map((c) => (
          <button key={c} role="tab" aria-selected={c === cat} className={c === cat ? "on" : undefined} onClick={() => setCat(c)} style={{ ["--ac2" as string]: catColor[c] }}>
            {c}
            <i>{c === "All" ? projects.length : projects.filter((p) => p.categories.includes(c)).length}</i>
          </button>
        ))}
      </div>
      <div className="plist">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p) => (
            <motion.article
              layout
              key={p.slug}
              className={`pit spot-host${p.caseStudy ? " flag-row" : ""}`}
              style={{ ["--ac2" as string]: p.accent }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className="spot" aria-hidden />
              <a className="card-link" href={p.caseStudy ?? p.live ?? p.github} {...(p.caseStudy ? {} : { target: "_blank", rel: "noreferrer" })} aria-label={`Open ${p.name}`} data-cursor-label={p.caseStudy ? "Case study →" : p.live ? "Live ↗" : "Code ↗"} />
              <div className="no">{String(projects.indexOf(p) + 1).padStart(2, "0")}</div>
              <Thumb p={p} />
              <div>
                <div className="hd">
                  <h3>{p.name}</h3>
                  <span className="tl">{p.tagline}</span>
                </div>
                <p>{p.description}</p>
                <div className="meta">
                  <span className="cat">{p.categories.join(" · ")}</span>
                  <span>{p.year}</span>
                  <span>{p.stack.join(" · ")}</span>
                </div>
              </div>
              <div className="ln">
                {p.live && (
                  <a className={p.caseStudy ? "red" : "pri"} href={p.live} target="_blank" rel="noreferrer">
                    Live demo <span>↗</span>
                  </a>
                )}
                <a href={p.github} target="_blank" rel="noreferrer">
                  GitHub <span>↗</span>
                </a>
                {p.caseStudy && (
                  <Link href={p.caseStudy}>
                    Case study <span>→</span>
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
