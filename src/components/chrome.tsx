import Link from "next/link";
import * as icons from "simple-icons";
import { site, stack } from "@/content/site";
import type { GitHubActivity } from "@/lib/live";
import { MenuButton } from "./mobile";

export function TopBar({ active }: { active?: "home" | "projects" }) {
  const home = active === "projects" ? "/" : "";
  return (
    <header className="top">
      <div className="w">
        <Link href="/" className="brand" aria-label="Home">
          <span className="gp">GP</span>
          <span>
            girish<i>the</i>decent
          </span>
        </Link>
        <nav className="nav">
          {[
            { href: `${home}#work`, label: "Work" },
            { href: `${home}#experience`, label: "Experience" },
            { href: "/projects", label: "Projects", on: active === "projects" },
            { href: `${home}#contact`, label: "Contact" },
          ].map((l) => (
            <Link key={l.label} href={l.href} className={`roll${l.on ? " on" : ""}`} data-text={l.label}>
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
        <div className="status">
          <span className="pulse" />
          {site.status.toLowerCase()}
        </div>
        <MenuButton />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="w bar">
        <span>⑂ main</span>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <span className="dim">
          press <kbd>`</kbd> for terminal
        </span>
        <div className="r">
          <a href={site.links.github} target="_blank" rel="noreferrer" style={{ ["--ac2" as string]: "#c9d1d9" }}>GitHub</a>
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" style={{ ["--ac2" as string]: "#3b9cff" }}>LinkedIn</a>
          <a href={site.links.x} target="_blank" rel="noreferrer" style={{ ["--ac2" as string]: "#e7e9ea" }}>X</a>
          <a href={site.links.leetcode} target="_blank" rel="noreferrer" style={{ ["--ac2" as string]: "#ffa116" }}>LeetCode</a>
          <span>© 2026 {site.handle}</span>
        </div>
      </div>
    </footer>
  );
}

type Icon = { path: string; title: string; hex: string };

function brand(hex?: string) {
  if (!hex) return "#f2f2f0";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.18 ? "#f2f2f0" : `#${hex}`;
}
const iconSet = icons as unknown as Record<string, Icon>;

const groupColor: Record<string, string> = {
  Languages: "#3b82f6",
  Backend: "#22c55e",
  AI: "#a78bfa",
  Frontend: "#38bdf8",
  Data: "#f97316",
  "Ops & Testing": "#2dd4bf",
};

export function StackGrid() {
  return (
    <div className="stack">
      {stack.map((g) => (
        <div className="sg spot-host" key={g.group} style={{ ["--ac2" as string]: groupColor[g.group] ?? "#f2f2f0" }}>
          <span className="spot" aria-hidden />
          <h4>{g.group}</h4>
          <div className="logos">
            {g.items.map((it) => {
              const ic = it.icon ? iconSet[it.icon] : undefined;
              return (
                <span className="logo-t" key={it.name} style={{ ["--brand" as string]: brand(ic?.hex) }}>
                  {ic ? (
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d={ic.path} />
                    </svg>
                  ) : (
                    <span className="mono-i" aria-hidden>
                      {it.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  {it.name}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContribGraph({ data, label = "GitHub contributions", unit = "contributions" }: { data: Pick<GitHubActivity, "weeks" | "total">; label?: string; unit?: string }) {
  if (!data.weeks.length) return <p className="mu mono" style={{ fontSize: 12.5 }}>Activity is loading. See it on my profile.</p>;
  return (
    <div className="contrib" role="img" aria-label={`${data.total} ${label} in the last year`}>
      {data.weeks.flatMap((w, wi) =>
        w.map((d) => (
          <i key={d.date} data-l={d.level} title={d.count !== undefined ? `${d.count} ${unit} on ${d.date}` : d.date} style={{ ["--col" as string]: wi + 1, ["--colm" as string]: wi - data.weeks.length + 27, gridRow: d.row + 1, ["--c" as string]: wi }} data-old={wi < data.weeks.length - 26 || undefined} />
        )),
      )}
    </div>
  );
}

/** Endless strip of monochrome tech logos (brand colour on hover). */
export function LogoMarquee() {
  const items = stack.flatMap((g) => g.items).filter((it, i, a) => a.findIndex((x) => x.name === it.name) === i);
  const row = (hidden: boolean) => (
    <div className="mq-row" aria-hidden={hidden || undefined}>
      {items.map((it) => {
        const ic = it.icon ? iconSet[it.icon] : undefined;
        return (
          <span className="mq-item" key={it.name} style={{ ["--brand" as string]: brand(ic?.hex) }}>
            {ic ? (
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d={ic.path} />
              </svg>
            ) : (
              <span className="mono-i" aria-hidden>{it.name.slice(0, 2).toUpperCase()}</span>
            )}
            {it.name}
          </span>
        );
      })}
    </div>
  );
  return (
    <div className="marquee" aria-label="Technologies I use">
      <div className="mq-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
