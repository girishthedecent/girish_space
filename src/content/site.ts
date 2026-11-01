// All site text lives here. Edit wording in this file; layout lives in components.

export const site = {
  name: "Girish Pasupuleti",
  first: "Girish",
  last: "Pasupuleti",
  handle: "girishthedecent",
  title: "Backend & Full Stack Engineer",
  titleSub: "AI Engineering",
  subline: "Software Engineering Intern at AppWeave · B.Tech CSE at IIIT Nuzvid",
  status: "Open to internships",
  url: "https://girishthedecent.space",
  email: "girishpavan985@gmail.com",
  phone: "+91 73861 75294",
  phoneTel: "+917386175294",
  resume: "/resume.pdf",
  links: {
    github: "https://github.com/girishthedecent",
    linkedin: "https://www.linkedin.com/in/girishthedecent",
    x: "https://x.com/girishthedecent",
    leetcode: "https://leetcode.com/girishthedecent",
  },
  usernames: { github: "girishthedecent", leetcode: "girishthedecent" },
  now: [
    ["working", "SWE Intern @ AppWeave"],
    ["building", "CodeBook, agentic RAG"],
    ["studying", "B.Tech CSE, IIIT Nuzvid"],
    ["based", "India"],
  ] as [string, string][],
};

export const experience = {
  company: "AppWeave",
  initials: "AW",
  url: "https://appweave.tech",
  logo: "/logos/appweave-icon.svg",
  wordmark: "/logos/appweave.svg",
  role: "Software Engineering Intern",
  period: "May 2026 — present",
  blurb: "Shipping product features, re-architecting backends and owning test automation across AppWeave's products.",
  products: ["Collected", "Certifico", "Marketplace", "Watch scrapers"],
  impact: [
    { product: "Collected", logo: "/logos/collected.svg", accent: "#22c55e", tag: "feature · end to end", big: "4 × 7", unit: "badge tiers × categories", text: "Built the gamified achievements system with progress tracking and automated awards." },
    { product: "Certifico", accent: "#38bdf8", tag: "architecture", big: "−80%", unit: "route-layer code", text: "Re-architected the monolithic backend into a modular service layer, with 128% more tests." },
    { product: "Marketplace", accent: "#2dd4bf", tag: "testing", big: "Playwright", unit: "E2E suite migrated", text: "Moved the legacy end-to-end suite to Playwright, covering critical user workflows." },
    { product: "Watch scrapers", accent: "#a78bfa", tag: "data", big: "33%", unit: "failing sites restored", text: "Fixed scraping across four platforms, improving listing availability and status accuracy." },
  ],
  education: { school: "IIIT Nuzvid", degree: "B.Tech CSE", period: "2024 — 2028" },
};

export type Category = "Backend" | "AI" | "Full Stack" | "Testing";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: number;
  categories: Category[];
  short: string; // one line for cards / rows
  description: string; // projects page
  stack: string[];
  github: string;
  live?: string;
  caseStudy?: string;
  image?: string;
  diagram?: "codebook" | "hotel" | "algo";
  accent: string; // hover colour
};

const gh = (r: string) => `https://github.com/girishthedecent/${r}`;

export const projects: Project[] = [
  {
    slug: "codebook", accent: "#ff7a3d", name: "CodeBook", tagline: "Agentic RAG workspace", year: 2026, categories: ["AI", "Full Stack"],
    short: "Ask a book and a codebase in one question.",
    description: "Ask a book and a codebase in one question. Ingests PDFs, websites and GitHub repos with Inngest and Tree-sitter, retrieves with pgvector and full-text search fused by weighted RRF (with optional MiniLM reranking), and answers through a multi-step agent with SSE streaming and citation validation.",
    stack: ["TypeScript", "Node.js", "Express", "React", "PostgreSQL", "pgvector", "Gemini", "Inngest"],
    github: gh("codebook"), live: "https://codebook.girishthedecent.space/", caseStudy: "/projects/codebook", image: "/shots/codebook.webp", diagram: "codebook",
  },
  {
    slug: "hotelbooking", accent: "#ef4444", name: "HotelBooking", tagline: "Distributed reservation system", year: 2026, categories: ["Backend"],
    short: "Microservices for auth, hotels, reservations and notifications, with distributed locking.",
    description: "Four independently deployable microservices for authentication, hotel management, reservations and notifications. Uses Redis distributed locks and idempotency keys around bookings, and BullMQ for asynchronous notifications.",
    stack: ["TypeScript", "Node.js", "MySQL", "Redis", "BullMQ"], github: gh("HotelBooking"), diagram: "hotel",
  },
  {
    slug: "algo-backend", accent: "#a78bfa", name: "Algo Backend", tagline: "Distributed online judge", year: 2026, categories: ["Backend"],
    short: "Online judge that runs untrusted code in isolated Docker sandboxes.",
    description: "Three services for problems, submissions and evaluation, connected through Redis and BullMQ. Runs untrusted C++ and Python in isolated Docker containers with resource limits, timeouts and network isolation.",
    stack: ["TypeScript", "Node.js", "MongoDB", "Redis", "Docker", "BullMQ"], github: gh("algo-backend"), diagram: "algo",
  },
  {
    slug: "meetly", accent: "#f59e0b", name: "Meetly", tagline: "Real-time video meetings", year: 2025, categories: ["Full Stack"],
    short: "Video meetings in the browser with WebRTC, live chat and screen sharing.",
    description: "Multi-user video calls in the browser with React and WebRTC, using Socket.IO signaling, live chat and screen sharing. A Node.js and MongoDB backend handles secure sign-up, token login and per-user meeting history.",
    stack: ["JavaScript", "React", "WebRTC", "Socket.IO", "Node.js", "MongoDB"], github: gh("Meetly"), live: "https://meetly.girishthedecent.space/", image: "/shots/meetly.webp",
  },
  {
    slug: "play-for-impact", accent: "#22c55e", name: "Play for Impact", tagline: "Subscription & prize-draw platform", year: 2026, categories: ["Full Stack", "Testing"],
    short: "Golf subscriptions and monthly charity prize draws.",
    description: "Golf members log Stableford scores, with a rolling score window enforced in a PostgreSQL transaction. A monthly draw engine publishes results atomically, rolls over unclaimed jackpots and stores winner proofs in Supabase Storage. Backed by a Jest and Vitest test suite.",
    stack: ["TypeScript", "React", "Express", "PostgreSQL", "Stripe", "Supabase"], github: gh("play-for-impact"), live: "https://play-for-impact.vercel.app", image: "/shots/pfi.webp",
  },
  {
    slug: "ai-voice-sales", accent: "#f472b6", name: "AI Voice Sales Agent", tagline: "Voice AI lead qualification", year: 2026, categories: ["AI", "Backend"],
    short: "Voice agent that qualifies leads and sends WhatsApp follow-ups.",
    description: "A voice sales agent on Tabbly with an Express and TypeScript backend exposing validated mid-call tools for WhatsApp messages and callbacks. Classifies leads as hot, warm or cold from call transcripts and sends tiered follow-ups through Evolution API.",
    stack: ["TypeScript", "Node.js", "Express", "Zod", "Docker"], github: gh("ai-voice-sales"),
  },
  {
    slug: "task-api", accent: "#a3e635", name: "Task API", tagline: "API test automation & bug discovery", year: 2026, categories: ["Testing"],
    short: "Test suite and bug report for a previously untested Express API.",
    description: "Wrote unit and integration tests with Jest and Supertest for a previously untested Express API, documented the bugs found in a prioritised report, pinned open defects with failing tests, fixed pagination and built a new endpoint test-first.",
    stack: ["JavaScript", "Node.js", "Express", "Jest"], github: gh("Take-Home-Assignment-The-Untested-API"),
  },
  {
    slug: "url-shortener", accent: "#38bdf8", name: "URL Shortener", tagline: "Link shortening service", year: 2026, categories: ["Backend"],
    short: "Type-safe short-link service with tRPC, MongoDB and Redis.",
    description: "A short-link service built with Express and tRPC for type-safe APIs, storing links in MongoDB with Redis alongside.",
    stack: ["TypeScript", "Express", "tRPC", "MongoDB", "Redis"], github: gh("url_shortener"),
  },
  {
    slug: "contact-app", accent: "#fbbf24", name: "Contact App", tagline: "MERN contact manager", year: 2026, categories: ["Full Stack"],
    short: "MERN contact manager with validation.",
    description: "React (Vite) frontend with an Express and MongoDB backend. Validated contact creation and environment-specific CORS for a separately deployed frontend and backend.",
    stack: ["React", "Vite", "Express", "MongoDB"], github: gh("contact-app"),
  },
  {
    slug: "backend-starters", accent: "#94a3b8", name: "Backend Starters", tagline: "TypeScript service templates", year: 2026, categories: ["Backend"],
    short: "Reusable TypeScript + Express starter templates.",
    description: "Reusable TypeScript and Express starter templates, including an Express and MongoDB variant, for spinning up new backend services quickly with a consistent structure.",
    stack: ["TypeScript", "Node.js", "Express", "MongoDB"], github: gh("ts-backend-starter"),
  },
  {
    slug: "github-platform", accent: "#818cf8", name: "GitHub-Inspired Platform", tagline: "Repository hosting concepts", year: 2025, categories: ["Full Stack"],
    short: "Repos, profiles, ownership and access control, built system-first.",
    description: "Authentication, user profiles, repository management, ownership and access control, built system-first with a focus on backend logic, API security and data modelling.",
    stack: ["JavaScript", "Node.js", "Express"], github: gh("github"),
  },
  {
    slug: "airbnb", accent: "#fb7185", name: "Airbnb-style App", tagline: "Property listings", year: 2025, categories: ["Full Stack"],
    short: "Listings, reviews and auth with an MVC architecture.",
    description: "Listings with sign-up and login, create, edit and delete, reviews and an MVC architecture, built to practise backend-driven web development and secure user workflows.",
    stack: ["JavaScript", "Node.js", "Express"], github: gh("airbnb"),
  },
];

export const flagship = projects[0];
export const selected = ["hotelbooking", "algo-backend", "meetly", "play-for-impact"].map((s) => projects.find((p) => p.slug === s)!);
export const more = ["ai-voice-sales", "task-api", "url-shortener"].map((s) => projects.find((p) => p.slug === s)!);

export const codebookFacts = [
  { n: 9, label: "agent tools" },
  { n: 65, label: "retrieval eval cases" },
  { n: 3, label: "source types" },
];

export const stack: { group: string; items: { name: string; icon?: string }[] }[] = [
  { group: "Languages", items: [{ name: "TypeScript", icon: "siTypescript" }, { name: "JavaScript", icon: "siJavascript" }, { name: "C++", icon: "siCplusplus" }, { name: "Java", icon: "siOpenjdk" }, { name: "Python", icon: "siPython" }] },
  { group: "Backend", items: [{ name: "Node.js", icon: "siNodedotjs" }, { name: "Express", icon: "siExpress" }, { name: "FastAPI", icon: "siFastapi" }, { name: "Socket.IO", icon: "siSocketdotio" }, { name: "BullMQ" }, { name: "Inngest" }] },
  { group: "AI", items: [{ name: "RAG" }, { name: "Agents" }, { name: "pgvector", icon: "siPostgresql" }] },
  { group: "Frontend", items: [{ name: "React", icon: "siReact" }, { name: "Next.js", icon: "siNextdotjs" }, { name: "Vite", icon: "siVite" }, { name: "Tailwind", icon: "siTailwindcss" }] },
  { group: "Data", items: [{ name: "PostgreSQL", icon: "siPostgresql" }, { name: "MySQL", icon: "siMysql" }, { name: "MongoDB", icon: "siMongodb" }, { name: "Redis", icon: "siRedis" }, { name: "Prisma", icon: "siPrisma" }] },
  { group: "Ops & Testing", items: [{ name: "Docker", icon: "siDocker" }, { name: "AWS" }, { name: "Linux", icon: "siLinux" }, { name: "GitHub Actions", icon: "siGithubactions" }, { name: "Playwright" }, { name: "Vitest", icon: "siVitest" }] },
];

// Used if the live LeetCode fetch fails.
export const leetcodeFallback = { rating: 1905, topPercentage: 4.54, attended: 23, globalRanking: 39278, badge: "Knight", solved: 505 };
