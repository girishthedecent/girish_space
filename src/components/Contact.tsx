"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { Magnetic } from "./motion";

export function CopyEmail({ value = site.email }: { value?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="lk"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }}
    >
      {done ? "copied ✓" : "copy"}
    </button>
  );
}

/** No backend: builds a mailto link so the message opens in the visitor's own email app. */
export function ContactForm() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Hello from ${name || "your portfolio"}`);
        const body = encodeURIComponent(`${msg}\n\n— ${name}`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      }}
    >
      <label>
        your name
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" required />
      </label>
      <label>
        message
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} placeholder="Hi Girish, we're hiring interns for…" required />
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <Magnetic>
          <button type="submit" className="lk pri" style={{ cursor: "pointer" }}>
            Open in my email app →
          </button>
        </Magnetic>
        <span className="note">sends from your own email app</span>
      </div>
    </form>
  );
}
