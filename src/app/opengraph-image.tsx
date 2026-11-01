import { ImageResponse } from "next/og";
import { cacheLife } from "next/cache";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function serif(italic: boolean) {
  "use cache";
  cacheLife("max");
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@${italic ? 1 : 0}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/533+ (KHTML, like Gecko)" },
    })
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error("font not found");
  return (await fetch(url)).arrayBuffer();
}

export default async function OG() {
  const [regular, italic, img] = await Promise.all([serif(false), serif(true), readFile(join(process.cwd(), "public/avatar.png"))]);
  const avatar = `data:image/png;base64,${img.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#000", color: "#f2f2f0", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26, color: "#a3a3a0" }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img src={avatar} width={56} height={56} style={{ borderRadius: 14, border: "1px solid #3a3a37" }} />
          {site.handle}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Serif", fontSize: 140, lineHeight: 0.95, letterSpacing: "-0.02em" }}>
            {site.first}&nbsp;<span style={{ fontFamily: "SerifItalic" }}>{site.last}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 36, marginTop: 28 }}>
            {site.title} <span style={{ color: "#66665f", margin: "0 14px" }}>/</span> {site.titleSub}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#a3a3a0" }}>
          <span>girishthedecent.space</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: "#e8432c" }} />
            {site.status}
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Serif", data: regular, style: "normal" }, { name: "SerifItalic", data: italic, style: "normal" }] },
  );
}
