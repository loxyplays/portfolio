/* ==========================================================================
 * SITE CONTENT
 *
 * The actual content lives in `content/content.json` at the repo root, not
 * here. This file only types it and re-exports it, so components keep
 * importing exactly what they always did.
 *
 * Why JSON rather than TypeScript: the admin panel at /admin writes content
 * back to the repo through the GitHub API. Generating valid TypeScript from
 * a form is fragile; JSON round-trips safely. `resolveJsonModule` in
 * tsconfig lets us import it directly, and because the site is statically
 * exported, this is all baked in at build time.
 *
 * Edit content at /admin, or by hand in content/content.json.
 * ========================================================================== */

import content from "../../content/content.json";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type SectionId =
  | "home"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "contact";

export type NavItem = { label: string; href: string; id: SectionId };

export type SocialKey = "github" | "x" | "linkedin" | "dribbble" | "mail";

export type Social = {
  key: SocialKey;
  label: string;
  handle: string;
  href: string;
};

export type Stat = {
  value: number;
  suffix: string;
  label: string;
  hint: string;
};

export type ProjectStatus = "Live" | "Beta" | "Open source" | "In development";

export type ProjectMetric = { value: string; label: string };

export type Project = {
  slug: string;
  name: string;
  summary: string;
  detail?: string;
  year: string;
  status: ProjectStatus;
  tech: string[];
  cover: string;
  demo?: string;
  source?: string;
  featured?: boolean;
  metrics?: ProjectMetric[];
};

export type Skill = { name: string; level: number; note?: string };

export type SkillCategory = {
  id: string;
  title: string;
  blurb: string;
  skills: Skill[];
};

export type ExperienceEntry = {
  period: string;
  role: string;
  org: string;
  location: string;
  description: string;
  highlights: string[];
  current?: boolean;
};

export type SiteMeta = {
  name: string;
  siteName: string;
  initials: string;
  role: string;
  tagline: string;
  description: string;
  heroHeadline: string;
  heroDimWords: string[];
  heroIntro: string;
  email: string;
  location: string;
  available: boolean;
  availabilityLabel: string;
};

export type AboutContent = {
  heading: string;
  paragraphs: string[];
  nowPlaying: string;
};

export type ContactContent = {
  heading: string;
  blurb: string;
  responseTime: string;
  closingLine: string;
};

/** The full shape of content/content.json — also what /admin edits. */
export type SiteContent = {
  site: SiteMeta;
  socials: Social[];
  about: AboutContent;
  stats: Stat[];
  projects: Project[];
  skillCategories: SkillCategory[];
  marqueeItems: string[];
  experience: ExperienceEntry[];
  contact: ContactContent;
};

/* -------------------------------------------------------------------------- */
/* Exports                                                                     */
/* -------------------------------------------------------------------------- */

const data = content as SiteContent;

/**
 * `url` is derived rather than stored: it's environment config, not content,
 * and putting it in the editable JSON would let a typo in the admin panel
 * silently break every canonical tag and OG URL on the site.
 */
export const site = {
  ...data.site,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://loxy.lol",
};

export const socials: Social[] = data.socials;
export const about: AboutContent = data.about;
export const stats: Stat[] = data.stats;
export const projects: Project[] = data.projects;
export const skillCategories: SkillCategory[] = data.skillCategories;
export const marqueeItems: string[] = data.marqueeItems;
export const experience: ExperienceEntry[] = data.experience;
export const contact: ContactContent = data.contact;

/** Structural, not content — the sections exist in code, so they stay here. */
export const navItems: NavItem[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const PROJECT_STATUSES: ProjectStatus[] = [
  "Live",
  "Beta",
  "Open source",
  "In development",
];

export const SOCIAL_KEYS: SocialKey[] = [
  "github",
  "x",
  "linkedin",
  "dribbble",
  "mail",
];
