"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type React from "react";

/**
 * Fades and lifts children in once when they scroll into view.
 * Content is visible by default (no JS, reduced motion); it is only hidden while
 * the page's JS is running and the element hasn't been seen yet (see .rv in globals.css).
 */
export function Reveal({ children, delay = 0, y = 24, className, style }: { children: ReactNode; delay?: number; y?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv${className ? " " + className : ""}`} style={{ ...style, ["--rv-d" as string]: `${delay}s`, ["--rv-y" as string]: `${y}px` }}>
      {children}
    </div>
  );
}

/** Counts a number up from 0 the first time it becomes visible. Server HTML shows the final value. */
export function CountUp({ to, decimals = 0, suffix = "", prefix = "" }: { to: number; decimals?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const armed = useRef(false);
  const fmt = (v: number) => prefix + v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    // Below the fold: reset to 0 while unseen, then count up when it scrolls in.
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.textContent = fmt(0);
      armed.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);
  useEffect(() => {
    const el = ref.current;
    if (!inView || !el || !armed.current) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => (el.textContent = fmt(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to]);
  return <span ref={ref}>{fmt(to)}</span>;
}

/** Element gently follows the cursor while hovered. */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });
  return (
    <motion.span
      ref={ref}
      style={{ x, y, display: "inline-flex" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Card that tilts toward the mouse. */
export function Tilt({ children, className, max = 5, style }: { children: ReactNode; className?: string; max?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...(style as object), rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Moves its child vertically as the page scrolls past it. */
export function Parallax({ children, amount = 40, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const reduce = useReducedMotion();
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-amount, amount]);
  return (
    <div ref={ref} className={className} style={{ position: "absolute", inset: 0 }}>
      <motion.div style={{ y, position: "absolute", inset: 0 }}>{children}</motion.div>
    </div>
  );
}

/** Small dot cursor that grows over links, and becomes a "View ↗" bubble over [data-cursor-label] (mouse only). */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40 });
  const sy = useSpring(y, { stiffness: 600, damping: 40 });
  const [mode, setMode] = useState<{ kind: "dot" | "big" | "label"; text?: string }>({ kind: "dot" });
  useEffect(() => {
    document.documentElement.classList.add("hydrated");
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor-label]");
      const inner = t.closest("a,button,input,textarea");
      // inner links/buttons inside a labelled card keep the small hover dot
      if (labelled && (!inner || inner === labelled)) setMode((m) => (m.text === labelled.dataset.cursorLabel ? m : { kind: "label", text: labelled.dataset.cursorLabel }));
      else if (inner || t.closest("[data-cursor]")) setMode((m) => (m.kind === "big" ? m : { kind: "big" }));
      else setMode((m) => (m.kind === "dot" ? m : { kind: "dot" }));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  return (
    <motion.div className={`cursor ${mode.kind}`} style={{ x: sx, y: sy }} aria-hidden>
      {mode.kind === "label" && <span>{mode.text}</span>}
    </motion.div>
  );
}
