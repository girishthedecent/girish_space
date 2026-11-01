import type { Metadata } from "next";
import Link from "next/link";
import { Footer, TopBar } from "@/components/chrome";
import { Diagram } from "@/components/Diagram";
import { Magnetic, Reveal } from "@/components/motion";
import { flagship as p } from "@/content/site";

// DRAFT written from the codebook repo README and code (Nov 2026). Girish to review before going live.

export const metadata: Metadata = {
  title: "CodeBook case study",
  description: "How CodeBook, an agentic RAG workspace for books, docs and code, is built: ingestion, hybrid retrieval, a tool-using agent and verified citations.",
};

const ext = { target: "_blank", rel: "noreferrer" } as const;

const parts = [
  { h: "Ingestion", c: "#fbbf24", t: "PDFs, GitHub repos and docs sites are parsed in background Inngest jobs: page-accurate text and a table of contents for books, Tree-sitter chunks and a code graph for repos, readable sections for sites." },
  { h: "Index", c: "#38bdf8", t: "Parent and child chunks with a short model-written context note each, embedded and stored in Postgres with pgvector, a full-text index and the code graph, swapped in with one transaction." },
  { h: "Retrieval", c: "#a78bfa", t: "Vector search on an HNSW index and keyword search on tsvector, fused with weighted reciprocal rank fusion. A MiniLM cross-encoder reranker can be switched on." },
  { h: "Agent", c: "#ff7a3d", t: "A streamed, multi-step loop that picks tools per question: hybrid search, exact code search, reading pages or lines, browsing a book's contents, and walking the call graph." },
  { h: "Citations", c: "#22c55e", t: "Every numbered note in an answer must point to a passage the model was actually shown; it opens the exact page, section or file:line beside the chat." },
  { h: "Reliability", c: "#f472b6", t: "Per-model and per-key circuit breakers, fallbacks across free-tier models, daily token budgets, rate limits and an admin view of failures." },
];

const decisions = [
  {
    h: "An agent with tools, not one vector index",
    body: "Different questions need different ways of looking. “Who calls this function?” needs the call graph, “what does chapter 5 say?” needs the book's structure, and an error message needs exact text search. A single similarity search over one index does badly on all three, so the model gets each as a tool and chooses per question, retrying when the first results are weak.",
    why: "Trade-off: more model steps per answer, so a turn is capped at five steps and the last one must answer.",
  },
  {
    h: "Hybrid search, with keywords weighted down",
    body: "Vector search alone misses exact identifiers; keyword search alone misses paraphrases. Fusing both catches function names without letting keyword noise dominate, so the keyword list is weighted at a quarter in the fusion.",
    why: "Measured: equal weights lowered MRR (0.82) compared with the ¼ weight (0.89) on the evaluation set.",
  },
  {
    h: "Reranking is opt-in",
    body: "A MiniLM cross-encoder improves results on book passages, but it was trained on web text rather than code and costs around two seconds of CPU per search, so it stays off by default and can be enabled where it helps.",
    why: "Trade-off: a little recall on books, in exchange for fast answers everywhere.",
  },
  {
    h: "Context notes on every chunk",
    body: "Before embedding, each chunk gets a short model-written note about where it sits in the document or repository. A function body alone often doesn't say what it is for; the note does.",
    why: "Measured: on code and cross-source questions, recall@5 rose from 0.82 to 0.92 with the notes.",
  },
  {
    h: "Citations are checked before saving",
    body: "Models sometimes cite things they never saw. Each answer's references are validated against the passages returned to the model during that turn, and tool output and source text are passed as tagged data that the prompt never treats as instructions.",
    why: "Result: every note under an answer opens real text the answer was based on.",
  },
  {
    h: "Cached, transactional ingestion",
    body: "Each ingestion step caches its output, so a retry or resync only pays for what changed, and the new index replaces the old one in a single transaction. A source stays searchable while it re-indexes.",
    why: "Trade-off: more storage for caches, in exchange for cheap retries and no downtime.",
  },
  {
    h: "One service, one origin",
    body: "The Express API also serves the built web app, so the browser talks to a single origin: the session cookie stays first-party and answers stream over server-sent events without cross-origin setup. Long work runs as Inngest functions, so requests only queue it.",
    why: "Trade-off: the API and frontend deploy together.",
  },
];

export default function CodeBookCaseStudy() {
  return (
    <>
      <TopBar active="projects" />
      <main className="w">
        <section className="cs-hero">
          <Reveal>
            <Link className="back" href="/projects">← all projects</Link>
            <h1>{p.name}</h1>
            <p className="tl">An agentic RAG workspace that answers questions across a book, its docs and its code at once, with every claim cited to the page, section or line.</p>
            <div className="btns" style={{ paddingTop: 22 }}>
              <Magnetic><a className="lk red" href={p.live} {...ext}>Live demo ↗</a></Magnetic>
              <Magnetic><a className="lk" href={p.github} {...ext}>GitHub ↗</a></Magnetic>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="cs-meta hv" style={{ ["--ac2" as string]: "#ff7a3d" }}>
              <div><span>role</span><b>Solo, end to end</b></div>
              <div><span>started</span><b>October 2026</b></div>
              <div><span>type</span><b>AI · Full Stack</b></div>
              <div><span>stack</span><b>TypeScript · Express · React · Postgres</b></div>
            </div>
          </Reveal>
        </section>

        <section className="cs-sec">
          <h2><span>01</span>The problem</h2>
          <Reveal className="cs-body">
            <p>Learning a codebase usually means reading two things side by side: the prose that explains an idea, like a book chapter or a framework guide, and the code that implements it. Switching between them is slow, and asking a chatbot about either one gives answers you can&apos;t check.</p>
            <p><b>CodeBook puts both in one workspace.</b> Add a PDF, a public GitHub repository or a docs site, then ask questions. An agent decides how to look for each answer, and every claim points to the page, section or <code>file:line</code> it came from, which opens beside the chat.</p>
            <p>Around that core I built study tools (quizzes, flashcards, mind maps), long-term memory, a public demo workspace that needs no account, and usage limits so it runs on free model tiers.</p>
          </Reveal>
        </section>

        <section className="cs-sec">
          <h2><span>02</span>Architecture</h2>
          <div>
            <Reveal>
              <div className="box" style={{ padding: 24 }}>
                <Diagram kind="codebook" />
              </div>
            </Reveal>
            <div className="cs-parts">
              {parts.map((x, i) => (
                <Reveal key={x.h} delay={(i % 2) * 0.08}>
                  <div className="part spot-host" style={{ ["--ac2" as string]: x.c }}>
                    <span className="spot" aria-hidden />
                    <h5>{x.h}</h5>
                    <p>{x.t}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="cs-sec" style={{ borderBottom: 0 }}>
          <h2><span>03</span>Key decisions</h2>
          <div className="cs-body">
            {decisions.map((d, i) => (
              <Reveal key={d.h}>
                <div className="decision" style={{ ["--ac2" as string]: ["#ff7a3d", "#38bdf8", "#a78bfa", "#fbbf24", "#22c55e", "#2dd4bf", "#f472b6"][i % 7] }}>
                  <h4>{d.h}</h4>
                  <p style={{ margin: 0 }}>{d.body}</p>
                  <div className="why">{d.why}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <Link href="/projects" className="allcta">
            <div>
              <div className="t">
                More <em>projects</em>
              </div>
              <div className="s">backend · ai · full stack · testing</div>
            </div>
            <span className="arrow">→</span>
          </Link>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
