import { siGithub, siLeetcode, siX } from "simple-icons";
import { site } from "@/content/site";
import { Magnetic } from "./motion";

type Preview = { title: string; lines: string[] };

const linkedin =
  "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.6 8.65 22 11.2 22 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.5-2.25 3.1V21h-4z";

function Icon({ path, stroke }: { path: string; stroke?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="hl-icon">
      {stroke ? <path d={path} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> : <path d={path} />}
    </svg>
  );
}

/** Arrow that flies out top-right and a twin that flies in from bottom-left on hover. */
function Arrow({ glyph = "↗" }: { glyph?: string }) {
  return (
    <span className="hl-arrow" aria-hidden>
      <span>{glyph}</span>
      <span>{glyph}</span>
    </span>
  );
}

function HeroLink({
  href, label, color, icon, preview, primary, external = true, glyph,
}: {
  href: string; label: string; color: string; icon: React.ReactNode; preview?: Preview; primary?: boolean; external?: boolean; glyph?: string;
}) {
  return (
    <Magnetic>
      <a
        className={`lk hl${primary ? " pri" : ""}`}
        href={href}
        style={{ ["--ac2" as string]: color }}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        <span className="hl-ico">{icon}</span>
        <span>{label}</span>
        <Arrow glyph={glyph} />
        {preview && (
          <span className="hl-pop" role="tooltip">
            <b>{preview.title}</b>
            {preview.lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </span>
        )}
      </a>
    </Magnetic>
  );
}

export function HeroLinks({ github, leetcode }: { github: Preview; leetcode: Preview }) {
  return (
    <div className="links">
      <HeroLink href="#contact" label="Email me" color="#e8432c" primary external={false} glyph="→" icon={<Icon stroke path="M3 6h18v12H3zM3 7l9 6 9-6" />} />
      <HeroLink href={site.links.github} label="GitHub" color="#c9d1d9" icon={<Icon path={siGithub.path} />} preview={github} />
      <HeroLink href={site.links.linkedin} label="LinkedIn" color="#3b9cff" icon={<Icon path={linkedin} />} />
      <HeroLink href={site.links.x} label="X" color="#e7e9ea" icon={<Icon path={siX.path} />} />
      <HeroLink href={site.links.leetcode} label="LeetCode" color="#ffa116" icon={<Icon path={siLeetcode.path} />} preview={leetcode} />
      <HeroLink href={site.resume} label="Resume" color="#fcd34d" glyph="↓" icon={<Icon stroke path="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" />} />
    </div>
  );
}
