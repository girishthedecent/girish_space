"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { experience, projects, site } from "@/content/site";

type Line = { kind: "in" | "out"; node: ReactNode };

const help = `commands:
  whoami            who is this
  about             a bit more
  projects          list projects
  open <name>       open a project (e.g. open codebook)
  contact           how to reach me
  resume            open my resume
  clear             clear the screen
  exit              close terminal`;

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([{ kind: "out", node: "welcome. type `help` to see commands." }]);
  const [val, setVal] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const out = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input,textarea") && t !== input.current) return;
      if (e.key === "`") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);
  useEffect(() => {
    out.current?.scrollTo(0, out.current.scrollHeight);
  }, [lines]);

  function run(raw: string) {
    const cmd = raw.trim();
    const [c, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ").toLowerCase();
    const say = (node: ReactNode) => setLines((l) => [...l, { kind: "in", node: cmd }, { kind: "out", node }]);
    switch (c?.toLowerCase()) {
      case "":
        return;
      case "help":
        return say(help);
      case "whoami":
        return say(`${site.name} — ${site.title}, ${site.titleSub}.`);
      case "about":
        return say(`${experience.role} at ${experience.company} since May 2026.\nB.Tech CSE at IIIT Nuzvid (2024–2028).\nI build backend systems, AI agents with RAG, and full stack products.`);
      case "projects":
        return say(projects.map((p) => `  ${p.slug.padEnd(18)} ${p.tagline}`).join("\n") + "\n\ntry: open codebook");
      case "open": {
        const p = projects.find((x) => x.slug === arg || x.name.toLowerCase() === arg || x.slug.startsWith(arg));
        if (!arg || !p) return say(`project not found: ${arg || "(none)"}. type \`projects\`.`);
        if (p.caseStudy) router.push(p.caseStudy);
        else window.open(p.live ?? p.github, "_blank");
        return say(`opening ${p.name}…`);
      }
      case "contact":
        return say(
          <>
            email: <a href={`mailto:${site.email}`}>{site.email}</a>
            {"\n"}phone: <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
            {"\n"}github: <a href={site.links.github} target="_blank" rel="noreferrer">{site.links.github}</a>
            {"\n"}linkedin: <a href={site.links.linkedin} target="_blank" rel="noreferrer">{site.links.linkedin}</a>
          </>,
        );
      case "resume":
        window.open(site.resume, "_blank");
        return say("opening resume…");
      case "clear":
        return setLines([]);
      case "exit":
        setOpen(false);
        return;
      case "sudo":
        return say("nice try.");
      default:
        return say(`command not found: ${c}. type \`help\`.`);
    }
  }

  return (
    <>
      <button className="term-btn" onClick={() => setOpen((o) => !o)} aria-label="Open terminal" title="Terminal (press `)">
        {">_"}
      </button>
      {open && (
        <div className="term" role="dialog" aria-label="Terminal">
          <div className="tab">
            <span>girish@portfolio: ~</span>
            <button onClick={() => setOpen(false)} aria-label="Close terminal">esc ✕</button>
          </div>
          <div className="out" ref={out} onClick={() => input.current?.focus()}>
            {lines.map((l, i) => (
              <div key={i} className={l.kind === "in" ? "p" : undefined}>
                {l.kind === "in" ? `$ ${l.node}` : l.node}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(val);
              setVal("");
            }}
          >
            <span className="mu">$</span>
            <input ref={input} value={val} onChange={(e) => setVal(e.target.value)} spellCheck={false} autoComplete="off" aria-label="Command" />
          </form>
        </div>
      )}
    </>
  );
}
