"use client";

import Lenis from "lenis";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Buttery smooth scrolling (desktop wheel only; touch keeps native scrolling). */
export function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      anchors: { offset: -80 },
      prevent: (node) => !!node.closest(".term, textarea"),
    });
    return () => lenis.destroy();
  }, []);
  return null;
}

/** Thin multi-colour bar at the top that fills as you scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden />;
}

/**
 * One global listener: whichever `.spot-host` is under the pointer gets --mx/--my,
 * which drives the cursor-following glow and border (see .spot in globals.css).
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const move = (e: PointerEvent) => {
      const host = (e.target as HTMLElement).closest<HTMLElement>(".spot-host");
      if (!host) return;
      const r = host.getBoundingClientRect();
      host.style.setProperty("--mx", `${e.clientX - r.left}px`);
      host.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
    };
  }, []);
  return null;
}

/** Interactive dot grid: dots near the cursor brighten and swell, with a slow idle shimmer. */
export function DotGrid() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const still = reducedMotion();
    const GAP = 28;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      ctx.clearRect(0, 0, w, h);
      for (let x = GAP / 2; x < w; x += GAP) {
        for (let y = GAP / 2; y < h; y += GAP) {
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          const near = Math.max(0, 1 - d / 180);
          const wave = still ? 0 : (Math.sin(x * 0.012 + y * 0.018 + t * 0.0009) + 1) / 2;
          const a = 0.09 + wave * 0.09 + near * 0.8;
          const r = 0.8 + near * 1.8;
          ctx.fillStyle = `rgba(242,242,240,${a})`;
          ctx.beginPath();
          ctx.arc(x + (still ? 0 : (x - mouse.x) * near * 0.08), y + (still ? 0 : (y - mouse.y) * near * 0.08), r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!still && visible) raf = requestAnimationFrame(draw);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      if (still) draw(0);
    };
    const onLeave = () => {
      mouse.tx = mouse.ty = -9999;
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    resize();
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return <canvas ref={ref} className="dotgrid" aria-hidden />;
}

/** Tilts its child up in 3D as it scrolls into view (Apple-style product reveal). */
export function ScrollTilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.93, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], reduce ? [1, 1] : [0.5, 1]);
  return (
    <div ref={ref} style={{ perspective: 1400 }}>
      <motion.div style={{ rotateX, scale, opacity, transformOrigin: "50% 100%" }}>{children}</motion.div>
    </div>
  );
}

/** Giant outlined name that fills in as you scroll to the end of the page. */
export function SignOff({ first, last }: { first: string; last: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const fill = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);
  return (
    <div ref={ref} className="signoff" aria-label={`${first} ${last}`}>
      <motion.div className="signoff-text" style={{ ["--fill" as string]: fill }} aria-hidden>
        {first} <em>{last}</em>
      </motion.div>
    </div>
  );
}
