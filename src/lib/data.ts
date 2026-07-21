/* ==========================================================================
 * SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT
 *
 * Everything you need to personalise lives in this file. Nothing else in the
 * codebase hardcodes a name, a project, or a link. Start at `site` and work
 * down; the layout adapts to whatever length of content you give it.
 * ========================================================================== */

export const site = {
  name: "Zac Delaney",
  /** Shown in the navbar and footer marks. */
  initials: "ZD",
  role: "Developer & Designer",
  /** Used verbatim in <title> and OG tags. */
  tagline: "Developer & designer building fast, futuristic interfaces",
  description:
    "I design and build websites, games, and applications — interfaces that feel fast, considered, and a little ahead of their time.",
  email: "hello@zacdelaney.dev",
  location: "Manchester, UK",
  /**
   * Canonical production origin — baked into canonical tags, og:url, the
   * sitemap and robots.txt at build time.
   *
   * Defaults to the real domain rather than localhost on purpose: a build
   * that forgets the env var should still ship correct absolute URLs, not
   * quietly tell Google the site lives on someone's laptop.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://loxy.lol",
  /** Shown as a status pill in the hero. Set `available: false` to grey it. */
  available: true,
  availabilityLabel: "Available for select work",
} as const;

export type NavItem = { label: string; href: string; id: SectionId };

export type SectionId =
  | "home"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "contact";

export const navItems: NavItem[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];

/* -------------------------------------------------------------------------- */
/* Socials                                                                     */
/* -------------------------------------------------------------------------- */

export type SocialKey = "github" | "x" | "linkedin" | "dribbble" | "mail";

export type Social = {
  key: SocialKey;
  label: string;
  handle: string;
  href: string;
};

export const socials: Social[] = [
  {
    key: "github",
    label: "GitHub",
    handle: "@zacdelaney",
    href: "https://github.com/zacdelaney",
  },
  {
    key: "x",
    label: "X",
    handle: "@zacdelaney",
    href: "https://x.com/zacdelaney",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "in/zacdelaney",
    href: "https://www.linkedin.com/in/zacdelaney",
  },
  {
    key: "dribbble",
    label: "Dribbble",
    handle: "@zacdelaney",
    href: "https://dribbble.com/zacdelaney",
  },
];

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export const about = {
  heading: "I care about the thousand small decisions nobody notices.",
  paragraphs: [
    "I'm a developer and designer working across the whole surface of a product — from the type scale and the easing curve on a dropdown, right down to the query that makes the page load in under a second.",
    "I started out scripting Roblox games as a teenager, which turned out to be an unreasonably good education: you ship to real players on day one, and they tell you immediately when something feels wrong. That instinct for feel is what I've carried into every interface I've built since.",
    "These days I spend most of my time in TypeScript and React, building products for small teams who care about craft. When I'm not doing that I'm usually pulling apart someone else's animation work frame by frame to figure out how they did it.",
  ],
  /** Rendered as a signature-ish detail line on the profile card. */
  nowPlaying: "Currently building a real-time design canvas",
} as const;

export type Stat = {
  value: number;
  /** Appended after the counter, e.g. "+" or "M+". */
  suffix: string;
  label: string;
  hint: string;
};

export const stats: Stat[] = [
  { value: 7, suffix: "+", label: "Years coding", hint: "Since 2019" },
  { value: 42, suffix: "", label: "Projects built", hint: "Shipped, not started" },
  { value: 25, suffix: "+", label: "Technologies", hint: "Used in production" },
  { value: 3.2, suffix: "M+", label: "Users reached", hint: "Across web & games" },
];

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export type ProjectStatus = "Live" | "Beta" | "Open source" | "In development";

export type Project = {
  slug: string;
  name: string;
  /** One line, shown on the card. */
  summary: string;
  /** Longer copy, shown only on the featured layout. */
  detail?: string;
  year: string;
  status: ProjectStatus;
  tech: string[];
  cover: string;
  demo?: string;
  source?: string;
  /** Exactly one project should be featured. */
  featured?: boolean;
  /** Optional headline metric shown on the featured card. */
  metrics?: { value: string; label: string }[];
};

export const projects: Project[] = [
  {
    slug: "nebula",
    name: "Nebula",
    summary:
      "A real-time collaborative design canvas with multiplayer cursors and conflict-free editing.",
    detail:
      "Nebula is an infinite canvas where a whole team can sketch at once. The hard part wasn't the rendering — it was making 40 simultaneous editors feel like one shared room. Built on CRDTs over WebRTC with a Postgres snapshot layer, it holds sub-60ms cursor latency across continents and survives going fully offline mid-session.",
    year: "2026",
    status: "Live",
    tech: ["Next.js", "TypeScript", "WebRTC", "Yjs", "Postgres", "Canvas API"],
    cover: "/projects/nebula.svg",
    demo: "https://example.com/nebula",
    source: "https://github.com/zacdelaney/nebula",
    featured: true,
    metrics: [
      { value: "58ms", label: "Median cursor latency" },
      { value: "40", label: "Concurrent editors" },
      { value: "99.98%", label: "Uptime, 12 months" },
    ],
  },
  {
    slug: "voidrunner",
    name: "Voidrunner",
    summary:
      "A first-person parkour game with hand-tuned momentum physics and 2.4M plays.",
    year: "2025",
    status: "Live",
    tech: ["Roblox Studio", "Luau", "Rojo"],
    cover: "/projects/voidrunner.svg",
    demo: "https://www.roblox.com/games/",
    source: "https://github.com/zacdelaney/voidrunner",
  },
  {
    slug: "prism-ui",
    name: "Prism UI",
    summary:
      "A headless React component library — 48 accessible primitives, fully unstyled.",
    year: "2025",
    status: "Open source",
    tech: ["React", "TypeScript", "Radix", "Tailwind"],
    cover: "/projects/prism.svg",
    demo: "https://example.com/prism",
    source: "https://github.com/zacdelaney/prism-ui",
  },
  {
    slug: "sentinel",
    name: "Sentinel",
    summary:
      "Self-hosted uptime and log monitoring that ingests 12k events a second on one box.",
    year: "2024",
    status: "Live",
    tech: ["Node.js", "Fastify", "ClickHouse", "Docker"],
    cover: "/projects/sentinel.svg",
    demo: "https://example.com/sentinel",
    source: "https://github.com/zacdelaney/sentinel",
  },
  {
    slug: "halcyon",
    name: "Halcyon",
    summary:
      "An offline-first focus timer PWA that syncs the moment you're back on a network.",
    year: "2024",
    status: "Beta",
    tech: ["Next.js", "IndexedDB", "Workbox", "Zustand"],
    cover: "/projects/halcyon.svg",
    demo: "https://example.com/halcyon",
    source: "https://github.com/zacdelaney/halcyon",
  },
  {
    slug: "atlas-engine",
    name: "Atlas Engine",
    summary:
      "A 2D lighting and soft-shadow engine for rapid Unity prototyping.",
    year: "2023",
    status: "In development",
    tech: ["C#", "Unity", "HLSL"],
    cover: "/projects/atlas.svg",
    source: "https://github.com/zacdelaney/atlas-engine",
  },
];

/* -------------------------------------------------------------------------- */
/* Skills                                                                      */
/* -------------------------------------------------------------------------- */

export type Skill = { name: string; level: number; note?: string };

export type SkillCategory = {
  id: string;
  title: string;
  blurb: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Where I spend most of my hours.",
    skills: [
      { name: "React", level: 95, note: "8 yrs" },
      { name: "Next.js", level: 93, note: "App Router" },
      { name: "TypeScript", level: 90, note: "Strict mode" },
      { name: "Tailwind CSS", level: 94, note: "v4" },
      { name: "Framer Motion", level: 88 },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    blurb: "Enough to ship the whole thing myself.",
    skills: [
      { name: "Node.js", level: 86, note: "Fastify / Hono" },
      { name: "Databases", level: 82, note: "Postgres, Redis" },
      { name: "APIs", level: 88, note: "REST, tRPC, WS" },
      { name: "Infrastructure", level: 74, note: "Docker, CI" },
    ],
  },
  {
    id: "games",
    title: "Game development",
    blurb: "Where I learned what 'feel' means.",
    skills: [
      { name: "Roblox Studio", level: 92, note: "6 yrs" },
      { name: "Luau", level: 90 },
      { name: "Unity", level: 71, note: "2D / shaders" },
      { name: "Gameplay systems", level: 84 },
    ],
  },
  {
    id: "design",
    title: "Design",
    blurb: "I draw the thing before I build the thing.",
    skills: [
      { name: "UI / UX", level: 89, note: "Product-led" },
      { name: "Figma", level: 91, note: "Design systems" },
      { name: "Motion design", level: 85 },
      { name: "Typography", level: 80 },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Experience                                                                  */
/* -------------------------------------------------------------------------- */

export type ExperienceEntry = {
  period: string;
  role: string;
  org: string;
  location: string;
  description: string;
  highlights: string[];
  current?: boolean;
};

export const experience: ExperienceEntry[] = [
  {
    period: "2024 — Present",
    role: "Senior Frontend Engineer",
    org: "Lumen Labs",
    location: "Remote",
    description:
      "Lead the interface work on a real-time analytics product used by ~90 engineering teams. I own the design system and the performance budget.",
    highlights: [
      "Cut median dashboard load from 3.1s to 780ms by moving to streaming SSR",
      "Built the component library now used across all four product surfaces",
      "Mentor two engineers through the design-to-code handoff",
    ],
    current: true,
  },
  {
    period: "2023 — 2024",
    role: "Frontend Engineer",
    org: "Northwind Studio",
    location: "Manchester, UK",
    description:
      "Built marketing sites and product interfaces for early-stage clients — the kind of work where the animation is the pitch.",
    highlights: [
      "Shipped 14 client sites, averaging 98 on Lighthouse performance",
      "Introduced the motion guidelines the studio still uses",
    ],
  },
  {
    period: "2021 — 2023",
    role: "Freelance Developer & Designer",
    org: "Independent",
    location: "Remote",
    description:
      "Ran my own practice designing and building products end to end for founders who needed one person to do both.",
    highlights: [
      "23 projects delivered across SaaS, e-commerce and editorial",
      "Repeat work from 70% of clients",
    ],
  },
  {
    period: "2019 — 2021",
    role: "Game Developer",
    org: "Roblox platform",
    location: "Independent",
    description:
      "Designed, scripted and shipped multiplayer experiences to an audience that gives feedback in real time and without mercy.",
    highlights: [
      "2.4M cumulative plays across three titles",
      "Learned systems design, netcode and live ops the hard way",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Contact                                                                     */
/* -------------------------------------------------------------------------- */

export const contact = {
  heading: "Let's build something worth looking at.",
  blurb:
    "I take on a small number of projects at a time. If you've got something in mind — a product, a site, a game, or just a problem you can't quite phrase yet — I'd like to hear about it.",
  responseTime: "Usually replies within a day",
} as const;
