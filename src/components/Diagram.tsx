"use client";

import { motion, useReducedMotion } from "motion/react";

type Node = { id: string; x: number; y: number; w: number; label: string; sub?: string; hl?: boolean };
type Def = { w: number; h: number; nodes: Node[]; edges: [string, string][] };

const H = 40; // node height

const defs: Record<"codebook" | "hotel" | "algo", Def> = {
  codebook: {
    w: 620, h: 170,
    nodes: [
      { id: "src", x: 4, y: 20, w: 120, label: "sources", sub: "pdf · web · github" },
      { id: "ing", x: 154, y: 20, w: 136, label: "ingest", sub: "inngest · tree-sitter" },
      { id: "idx", x: 320, y: 20, w: 130, label: "index", sub: "pgvector + fts" },
      { id: "rr", x: 480, y: 20, w: 134, label: "retrieve", sub: "rrf · rerank" },
      { id: "ag", x: 480, y: 120, w: 134, label: "agent", sub: "tools · streaming", hl: true },
      { id: "ans", x: 320, y: 120, w: 130, label: "answer", sub: "with citations" },
    ],
    edges: [["src", "ing"], ["ing", "idx"], ["idx", "rr"], ["rr", "ag"], ["ag", "ans"]],
  },
  hotel: {
    w: 600, h: 210,
    nodes: [
      { id: "c", x: 240, y: 6, w: 120, label: "client" },
      { id: "auth", x: 10, y: 86, w: 110, label: "auth svc" },
      { id: "ho", x: 150, y: 86, w: 110, label: "hotel svc" },
      { id: "bk", x: 300, y: 86, w: 130, label: "booking svc", hl: true },
      { id: "nt", x: 470, y: 86, w: 120, label: "notify svc" },
      { id: "rl", x: 230, y: 166, w: 120, label: "redis lock" },
      { id: "db", x: 370, y: 166, w: 90, label: "mysql" },
      { id: "q", x: 480, y: 166, w: 100, label: "bullmq" },
    ],
    edges: [["c", "auth"], ["c", "ho"], ["c", "bk"], ["bk", "rl"], ["bk", "db"], ["bk", "q"], ["q", "nt"]],
  },
  algo: {
    w: 600, h: 190,
    nodes: [
      { id: "c", x: 6, y: 20, w: 100, label: "client" },
      { id: "sub", x: 146, y: 20, w: 130, label: "submission svc" },
      { id: "q", x: 316, y: 20, w: 100, label: "bullmq" },
      { id: "ev", x: 456, y: 20, w: 136, label: "evaluator", hl: true },
      { id: "pr", x: 146, y: 130, w: 130, label: "problem svc" },
      { id: "db", x: 316, y: 130, w: 100, label: "mongodb" },
      { id: "dk", x: 456, y: 130, w: 136, label: "docker sandbox", sub: "c++ · python" },
    ],
    edges: [["c", "sub"], ["sub", "q"], ["q", "ev"], ["ev", "dk"], ["c", "pr"], ["pr", "db"], ["sub", "db"]],
  },
};

function route(a: Node, b: Node): [number, number][] {
  const ac = { x: a.x + a.w / 2, y: a.y + H / 2 };
  const bc = { x: b.x + b.w / 2, y: b.y + H / 2 };
  if (Math.abs(ac.y - bc.y) < 1) {
    const r = bc.x > ac.x;
    return [[r ? a.x + a.w : a.x, ac.y], [r ? b.x : b.x + b.w, bc.y]];
  }
  const down = bc.y > ac.y;
  const sy = down ? a.y + H : a.y;
  if (Math.abs(ac.x - bc.x) < 1) return [[ac.x, sy], [bc.x, down ? b.y : b.y + H]];
  // vertical out of a, then horizontal into b's top/bottom via a mid line
  const midY = down ? (a.y + H + b.y) / 2 : (a.y + b.y + H) / 2;
  return [[ac.x, sy], [ac.x, midY], [bc.x, midY], [bc.x, down ? b.y : b.y + H]];
}

export function Diagram({ kind, className = "diagram" }: { kind: keyof typeof defs; className?: string }) {
  const reduce = useReducedMotion();
  const d = defs[kind];
  const byId = Object.fromEntries(d.nodes.map((n) => [n.id, n]));
  const paths = d.edges.map(([a, b]) => route(byId[a], byId[b]));
  return (
    <svg className={className} viewBox={`0 0 ${d.w} ${d.h}`} role="img" aria-label={`${kind} architecture`}>
      {paths.map((pts, i) => (
        <g key={i}>
          <path
            className="dp"
            pathLength={1}
            d={"M" + pts.map((p) => p.join(",")).join(" L")}
            fill="none"
            stroke="#3a3a37"
            strokeWidth={1.2}
            style={{ ["--i" as string]: i }}
          />
          {!reduce && (
            <motion.circle
              className="dot"
              r={2.6}
              fill="#f2f2f0"
              initial={{ opacity: 0 }}
              animate={{ cx: pts.map((p) => p[0]), cy: pts.map((p) => p[1]), opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8 + pts.length * 0.2, repeat: Infinity, delay: 1.2 + i * 0.35, ease: "linear", repeatDelay: 0.6 }}
            />
          )}
        </g>
      ))}
      {d.nodes.map((n, i) => (
        <g key={n.id} className={`dn${n.hl ? " hl" : ""}`} style={{ ["--i" as string]: i }}>
          <rect x={n.x} y={n.y} width={n.w} height={H} rx={8} fill={n.hl ? "#161616" : "#0b0b0b"} stroke={n.hl ? "#f2f2f0" : "#2b2b2b"} strokeWidth={n.hl ? 1.2 : 1} />
          <text x={n.x + n.w / 2} y={n.y + (n.sub ? 17 : 24)} textAnchor="middle">{n.label}</text>
          {n.sub && (
            <text x={n.x + n.w / 2} y={n.y + 31} textAnchor="middle" style={{ fontSize: 9, fill: "#66665f" }}>
              {n.sub}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
