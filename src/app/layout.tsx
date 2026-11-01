import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Cursor } from "@/components/motion";
import { Terminal } from "@/components/Terminal";
import { ScrollProgress, SmoothScroll, SpotlightTracker } from "@/components/fx";
import { MobileDock, MobileMenu, TouchActivator } from "@/components/mobile";
import { site } from "@/content/site";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

const description = `${site.name} — ${site.title} working on AI engineering. ${site.subline}.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.title}`, template: `%s — ${site.name}` },
  description,
  openGraph: { title: `${site.name} — ${site.title}`, description, url: site.url, siteName: site.name, type: "website" },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.title}`, description },
};

export const viewport: Viewport = { themeColor: "#000000", viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <ScrollProgress />
        {children}
        <Cursor />
        <SmoothScroll />
        <MobileDock />
        <MobileMenu />
        <TouchActivator />
        <SpotlightTracker />
        <Terminal />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
