"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siGithub, siLeetcode, siX } from "simple-icons";
import { site } from "@/content/site";

const ico = {
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  linkedin: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.6 8.65 22 11.2 22 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.5-2.25 3.1V21h-4z",
};

/** Hamburger in the top bar; opens the side panel (rendered once at the root, see MobileMenu). */
export function MenuButton() {
  return (
    <button className="burger" aria-label="Open menu" aria-haspopup="dialog" onClick={() => window.dispatchEvent(new Event("menu:open"))}>
      <span />
      <span />
    </button>
  );
}

/** Slide-in side panel menu for phones, rendered at the root of <body> so nothing can clip it. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const home = path === "/" ? "" : "/";

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("menu:open", onOpen);
    return () => window.removeEventListener("menu:open", onOpen);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      root.classList.remove("menu-open");
      return;
    }
    root.classList.add("menu-open");
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: `${home}#work`, label: "Work", sub: "CodeBook & selected projects" },
    { href: `${home}#experience`, label: "Experience", sub: "AppWeave internship" },
    { href: "/projects", label: "Projects", sub: "All 12, with descriptions", on: path.startsWith("/projects") },
    { href: `${home}#contact`, label: "Contact", sub: "Email, call or message" },
  ];
  const close = () => setOpen(false);

  const sheet = (
    <div className={`msheet${open ? " open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="scrim" onClick={close} />
      <aside className="panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="phead">
          <span className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="avatar" src="/avatar.png" alt="" width={34} height={34} />
            <span className="pname">girish<i>the</i>decent</span></span>
          <button ref={closeBtn} className="pclose" onClick={close} aria-label="Close menu">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="pstatus"><span className="pulse" />{site.status.toLowerCase()}</div>
        <nav className="plinks">
          {links.map((l, i) => (
            <Link key={l.label} href={l.href} onClick={close} className={l.on ? "on" : undefined} style={{ ["--i" as string]: i }}>
              <span className="pn">0{i + 1}</span>
              <span className="pl">
                <b>{l.label}</b>
                <small>{l.sub}</small>
              </span>
              <span className="pa">→</span>
            </Link>
          ))}
        </nav>
        <div className="pfoot" style={{ ["--i" as string]: links.length }}>
          <a className="prow" href={`mailto:${site.email}`}>
            <svg viewBox="0 0 24 24" aria-hidden><path d={ico.mail} /></svg>{site.email}
          </a>
          <a className="prow" href={`tel:${site.phoneTel}`}>
            <svg viewBox="0 0 24 24" aria-hidden><path d={ico.phone} /></svg>{site.phone}
          </a>
          <div className="psoc">
            <a href={site.links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><svg viewBox="0 0 24 24" className="fill" aria-hidden><path d={siGithub.path} /></svg></a>
            <a href={site.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" className="fill" aria-hidden><path d={ico.linkedin} /></svg></a>
            <a href={site.links.x} target="_blank" rel="noreferrer" aria-label="X"><svg viewBox="0 0 24 24" className="fill" aria-hidden><path d={siX.path} /></svg></a>
            <a href={site.links.leetcode} target="_blank" rel="noreferrer" aria-label="LeetCode"><svg viewBox="0 0 24 24" className="fill" aria-hidden><path d={siLeetcode.path} /></svg></a>
          </div>
          <a className="lk pri presume" href={site.resume} target="_blank" rel="noreferrer">Download resume ↓</a>
        </div>
      </aside>
    </div>
  );

  return sheet;
}

const wa = `https://wa.me/${site.phoneTel.replace("+", "")}`;

/** Thumb-reach action bar on phones: appears after the hero, hides at the contact section. */
export function MobileDock() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const contact = document.getElementById("contact");
    let nearContact = false;
    const io = contact
      ? new IntersectionObserver(([e]) => {
          nearContact = e.isIntersecting;
          update();
        })
      : null;
    function update() {
      setShow(window.scrollY > 420 && !nearContact);
    }
    if (contact && io) io.observe(contact);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);
  return (
    <nav className={`dock${show ? " on" : ""}`} aria-label="Quick contact">
      <a href={`mailto:${site.email}`}>
        <svg viewBox="0 0 24 24" aria-hidden><path d="M3 6h18v12H3zM3 7l9 6 9-6" /></svg>
        Email
      </a>
      <a href={`tel:${site.phoneTel}`}>
        <svg viewBox="0 0 24 24" aria-hidden><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
        Call
      </a>
      <a href={wa} target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden><path d="M3 21l1.7-5A9 9 0 1 1 8 19.3zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1a5 5 0 0 1-2.4-2.4l1-1-1-2z" /></svg>
        WhatsApp
      </a>
      <a className="pri" href={site.resume} target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden><path d="M7 3h7l5 5v13H7zM14 3v5h5M12 11v6M9.5 14.5 12 17l2.5-2.5" /></svg>
        Resume
      </a>
    </nav>
  );
}

/**
 * Touch screens can't hover, so tiles light up (class .act) while they pass through the
 * middle band of the screen, giving phones the same colour moments as desktop hover.
 */
export function TouchActivator() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(hover: hover)").matches) return;
    const els = document.querySelectorAll<HTMLElement>(".card, .ti, .sg, .pit, .row, .lc, .ghp, .co, .flag, .allcta, .part, .nowbox, .decision, .contact");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("act", e.isIntersecting)),
      { rootMargin: "-38% 0px -38% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
