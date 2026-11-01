import Link from "next/link";
import { Suspense } from "react";
import { ContribGraph, Footer, LogoMarquee, StackGrid, TopBar } from "@/components/chrome";
import { ContactForm, CopyEmail } from "@/components/Contact";
import { Diagram } from "@/components/Diagram";
import { HeroLinks } from "@/components/HeroLinks";
import { DotGrid, ScrollTilt, SignOff } from "@/components/fx";
import { CountUp, Magnetic, Parallax, Reveal, Tilt } from "@/components/motion";
import { codebookFacts, experience, flagship, more, projects, selected, site } from "@/content/site";
import { getGitHub, getLeetCode } from "@/lib/live";

const ext = { target: "_blank", rel: "noreferrer" } as const;

function Sec({ id, num, title, italic, path, more }: { id?: string; num: string; title: string; italic?: string; path?: string; more?: { href: string; label: string } }) {
  return (
    <Reveal>
      <div className="sec" id={id}>
        <span className="num">{num}</span>
        <h2>
          {title} {italic && <em>{italic}</em>}
        </h2>
        {path && <span className="path">{path}</span>}
        {more && (
          <Link className="more" href={more.href}>
            {more.label}
          </Link>
        )}
      </div>
    </Reveal>
  );
}

async function Hero() {
  const [lc, gh] = await Promise.all([getLeetCode(), getGitHub()]);
  return (
    <section className="hero">
      <div>
        <Reveal y={12}>
          <div className="kick">hi, I&apos;m</div>
        </Reveal>
        <h1 className="name" aria-label={site.name}>
          <span className="word" aria-hidden>
            {[...site.first].map((ch, i) => (
              <span className="ch" key={i} style={{ ["--i" as string]: i }}>{ch}</span>
            ))}
          </span>{" "}
          <em className="word" aria-hidden>
            {[...site.last].map((ch, i) => (
              <span className="ch" key={i} style={{ ["--i" as string]: i + site.first.length + 1 }}>{ch}</span>
            ))}
          </em>
        </h1>
        <Reveal delay={0.16}>
          <div className="tagline">
            {site.title}
            <span>/</span>
            {site.titleSub}
          </div>
          <p className="subline">{site.subline}</p>
        </Reveal>
        <Reveal delay={0.24}>
          <HeroLinks
            github={{ title: `@${site.usernames.github}`, lines: [gh.total ? `${gh.total} contributions this year` : "open-source work", `${projects.length} projects`] }}
            leetcode={{ title: `${lc.badge} · ${lc.rating.toLocaleString("en-US")}`, lines: [`top ${Math.round(lc.topPercentage * 10) / 10}% globally`, `${lc.solved}+ solved · ${lc.attended} contests`] }}
          />
        </Reveal>
      </div>
      <Reveal delay={0.3}>
        <div className="box hv nowbox spot-host" style={{ ["--ac2" as string]: "#38bdf8" }}>
          <span className="spot" aria-hidden />
          <div className="tab">
            <span>now.json</span>
            <span className="d">nov 2026</span>
          </div>
          <div className="json">
            {"{\n"}
            {site.now.map(([k, v], i) => (
              <span key={k}>
                {"  "}
                <span className="k">&quot;{k}&quot;</span>: {" ".repeat(9 - k.length)}
                <span className="s">&quot;{v}&quot;</span>
                {i < site.now.length - 1 ? ",\n" : "\n"}
              </span>
            ))}
            {"}"}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Flagship() {
  const p = flagship;
  return (
    <Reveal>
      <article className="flag spot-host" style={{ ["--ac2" as string]: p.accent }}>
        <span className="spot" aria-hidden />
        <div className="shot">
          <ScrollTilt>
          <div className="frame">
            <div className="fbar">
              <i /><i /><i />
              <span>codebook.girishthedecent.space</span>
            </div>
            <div className="img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="CodeBook live site" />
            </div>
          </div>
          </ScrollTilt>
          <Diagram kind="codebook" />
        </div>
        <div className="info">
          <span className="lab"><i />live</span>
          <h3>{p.name}</h3>
          <div className="tl">Agentic RAG workspace. {p.short}</div>
          <ul>
            <li>Ingests PDFs, websites and GitHub repos with Inngest, Tree-sitter and cached embeddings.</li>
            <li>Hybrid retrieval: pgvector and full-text search fused with weighted RRF, with optional MiniLM reranking.</li>
            <li>A multi-step agent that searches sources, navigates code and cites every answer, streamed over SSE.</li>
          </ul>
          <div className="facts">
            {codebookFacts.map((f) => (
              <span key={f.label}><b>{f.n}</b>{f.label}</span>
            ))}
          </div>
          <div className="stackline">{p.stack.join(" · ")}</div>
          <div className="btns">
            <Magnetic><a className="lk red" href={p.live} {...ext} style={{ ["--ac2" as string]: "#ff7a3d" }}>Live demo ↗</a></Magnetic>
            <Magnetic><a className="lk" href={p.github} {...ext} style={{ ["--ac2" as string]: "#c9d1d9" }}>GitHub ↗</a></Magnetic>
            <Magnetic><Link className="lk" href="/projects/codebook" style={{ ["--ac2" as string]: "#ff7a3d" }}>Case study →</Link></Magnetic>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function Experience() {
  const e = experience;
  return (
    <Reveal>
      <div className="exp">
        <div className="co spot-host" style={{ ["--ac2" as string]: "#e5432c" }}>
          <span className="spot" aria-hidden />
          <a className="coh" href={e.url} {...ext} aria-label="AppWeave website">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo" src={e.logo} alt="AppWeave logo" width={50} height={50} />
            <div>
              <b>
                {e.company} <span className="ext">↗</span>
              </b>
              <span>{e.role}</span>
            </div>
          </a>
          <div className="when"><span className="pulse" />{e.period}</div>
          <p>{e.blurb}</p>
          <div className="chips">{e.products.map((x) => <span key={x}>{x}</span>)}</div>
          <a className="cosite" href={e.url} {...ext}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={e.wordmark} alt="AppWeave" height={22} />
            <span>appweave.tech ↗</span>
          </a>
          <div className="edu" style={{ marginTop: 28 }}>
            <span><b>{e.education.school}</b> · {e.education.degree}</span>
            <span>{e.education.period}</span>
          </div>
        </div>
        <div className="imp">
          {e.impact.map((t, i) => {
            const pct = t.big.match(/^([−-])?(\d+)%$/);
            return (
              <Reveal key={t.product} delay={i * 0.08} className="ti spot-host" style={{ ["--ac2" as string]: t.accent }}>
                <span className="spot" aria-hidden />
                <div className="th">
                  <span className="tp">
                    {t.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.logo} alt="" width={22} height={12} />
                    )}
                    {t.product}
                  </span>
                  <em>{t.tag}</em>
                </div>
                <span className="big">{pct ? <CountUp to={+pct[2]} prefix={pct[1] ?? ""} suffix="%" /> : t.big}</span>
                <small>{t.unit}</small>
                <p>{t.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

function Work() {
  return (
    <div className="cards">
      {selected.map((p, i) => (
        <Reveal key={p.slug} delay={(i % 2) * 0.1}>
          <Tilt className="card spot-host" style={{ ["--ac2" as string]: p.accent }}>
            <span className="spot" aria-hidden />
            <a className="card-link" href={p.live ?? p.github} {...ext} aria-label={`Open ${p.name}`} data-cursor-label={p.live ? "Live ↗" : "Code ↗"} />
            <div className="viz">
              {p.image ? (
                <Parallax amount={24}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={`${p.name} screenshot`} loading="lazy" />
                </Parallax>
              ) : (
                p.diagram && <Diagram kind={p.diagram} />
              )}
            </div>
            <div className="cb">
              <div className="t">
                <h3>{p.name}</h3>
                <span className="tag">{p.live ? "live" : p.categories[0].toLowerCase()}</span>
              </div>
              <p>{p.short}</p>
              <div className="l">
                {p.live && <a href={p.live} {...ext}>live ↗</a>}
                <a href={p.github} {...ext}>code ↗</a>
                <span className="dim">{p.stack.slice(0, 4).join(" · ")}</span>
              </div>
            </div>
          </Tilt>
        </Reveal>
      ))}
    </div>
  );
}

async function Activity() {
  const [lc, gh] = await Promise.all([getLeetCode(), getGitHub()]);
  const top = Math.round(lc.topPercentage * 10) / 10;
  return (
    <div className="act">
      <Reveal>
        <a className="box lc spot-host" href={site.links.leetcode} {...ext} data-cursor-label="LeetCode ↗" style={{ ["--ac2" as string]: "#2cbb5d" }}>
          <span className="spot" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="badge-img" src="/knight.png" alt="LeetCode Knight badge" width={120} height={120} />
          <div>
            <div className="mono mu" style={{ fontSize: 12 }}>leetcode · {lc.badge.toLowerCase()}</div>
            <div className="rating"><CountUp to={lc.rating} /></div>
            <div className="rl">contest rating · top {top}% globally</div>
            <div className="grid">
              <div><b><CountUp to={lc.solved} />+</b><span>solved on LeetCode</span></div>
              <div><b>600+</b><span>across platforms</span></div>
              <div><b><CountUp to={lc.attended} /></b><span>contests</span></div>
            </div>
          </div>
        </a>
      </Reveal>
      <div className="act-r">
        <Reveal delay={0.08}>
          <a className="box ghp lcmap spot-host" href={site.links.leetcode} {...ext} data-cursor-label="LeetCode ↗" style={{ ["--ac2" as string]: "#2cbb5d" }}>
            <span className="spot" aria-hidden />
            <div className="ghh">
              <b>{lc.heatmap.total ? <CountUp to={lc.heatmap.total} /> : "—"}</b>
              <span>submissions in the last year · leetcode</span>
            </div>
            <ContribGraph data={lc.heatmap} label="LeetCode submissions" unit="submissions" />
            <div className="legend">
              <span>{lc.heatmap.activeDays} active days · max streak {lc.heatmap.streak}</span>
              <span className="sw">
                less <i style={{ background: "#141414" }} /><i style={{ background: "#3a3a38" }} /><i style={{ background: "#6b6b67" }} /><i style={{ background: "#a8a8a3" }} /><i style={{ background: "#f2f2f0" }} /> more
              </span>
            </div>
          </a>
        </Reveal>
        <Reveal delay={0.14}>
        <a className="box ghp spot-host" href={site.links.github} {...ext} data-cursor-label="GitHub ↗" style={{ ["--ac2" as string]: "#39d353" }}>
          <span className="spot" aria-hidden />
          <div className="ghh">
            <b>{gh.total ? <CountUp to={gh.total} /> : "—"}</b>
            <span>contributions in the last year · github</span>
          </div>
          <ContribGraph data={gh} />
          <div className="legend">
            <span>@{site.usernames.github}</span>
            <span className="sw">
              less <i style={{ background: "#141414" }} /><i style={{ background: "#3a3a38" }} /><i style={{ background: "#6b6b67" }} /><i style={{ background: "#a8a8a3" }} /><i style={{ background: "#f2f2f0" }} /> more
            </span>
          </div>
        </a>
      </Reveal>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <TopBar active="home" />
      <div className="hero-bg" aria-hidden>
        <DotGrid />
      </div>
      <main className="w">
        <Hero />
        <LogoMarquee />

        <div id="work" className="anchor-gap" />
        <Flagship />

        <Sec id="experience" num="01" title="Experience" path="experience.json" more={{ href: site.resume, label: "resume ↓" }} />
        <Experience />

        <div className="anchor-gap" />
        <Work />

        <Sec num="02" title="Activity" path="leetcode · github" />
        <Suspense fallback={<div className="box" style={{ height: 220 }} />}>
          <Activity />
        </Suspense>

        <Sec num="03" title="Stack" path="skills.yml" />
        <Reveal>
          <StackGrid />
        </Reveal>

        <Sec num="04" title="More" italic="projects" path="projects/*" />
        <Reveal>
          <div className="rows">
            {more.map((p) => (
              <a className="row spot-host" key={p.slug} href={p.github} {...ext} style={{ ["--ac2" as string]: p.accent }} data-cursor-label="Code ↗">
                <span className="spot" aria-hidden />
                <b>{p.name}</b>
                <span className="d">{p.short}</span>
                <span className="s">{p.stack.slice(0, 3).join(" · ")}</span>
                <span className="l">code ↗</span>
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <Link href="/projects" className="allcta spot-host" data-cursor-label="Explore →" style={{ ["--ac2" as string]: "#a78bfa" }}>
            <span className="spot" aria-hidden />
            <div>
              <div className="t">
                See all {projects.length} <em>projects</em>
              </div>
              <div className="s">backend · ai · full stack · testing, with descriptions</div>
            </div>
            <span className="arrow">→</span>
          </Link>
        </Reveal>

        <Reveal>
          <section className="contact hv spot-host" id="contact" style={{ ["--ac2" as string]: "#fb7185" }}>
            <span className="spot" aria-hidden />
            <div>
              <h2>
                Let&apos;s <em>talk.</em>
              </h2>
              <p className="lead">Hiring interns, or want to build something together? Write to me.</p>
              <div className="mailrow">
                <a className="addr" href={`mailto:${site.email}`}>{site.email}</a>
                <CopyEmail />
              </div>
              <div className="mailrow" style={{ marginTop: 10 }}>
                <a className="addr" href={`tel:${site.phoneTel}`}>{site.phone}</a>
                <CopyEmail value={site.phone} />
              </div>
              <div className="socials">
                <a href={site.links.github} {...ext} style={{ ["--ac2" as string]: "#c9d1d9" }}>GitHub ↗</a>
                <a href={site.links.linkedin} {...ext} style={{ ["--ac2" as string]: "#3b9cff" }}>LinkedIn ↗</a>
                <a href={site.links.x} {...ext} style={{ ["--ac2" as string]: "#e7e9ea" }}>X ↗</a>
                <a href={site.links.leetcode} {...ext} style={{ ["--ac2" as string]: "#ffa116" }}>LeetCode ↗</a>
              </div>
            </div>
            <ContactForm />
          </section>
        </Reveal>
      </main>
      <SignOff first={site.first} last={site.last} />
      <Footer />
    </>
  );
}
