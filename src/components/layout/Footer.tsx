"use client";

import { motion } from "framer-motion";
import { navItems, site, socials } from "@/lib/data";
import { socialIcons } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { useUIStore } from "@/store/useUIStore";

export function Footer() {
  const year = new Date().getFullYear();
  const setCursor = useUIStore((s) => s.setCursor);

  return (
    <footer className="relative px-5 pb-10 pt-16 sm:px-8">
      {/* Animated gradient hairline — a light travelling across the divider. */}
      <div className="relative mx-auto mb-12 h-px w-full max-w-6xl overflow-hidden bg-white/[0.07]">
        <motion.span
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent"
          animate={{ x: ["-120%", "420%"] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1.5,
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Mark */}
          <div className="max-w-xs">
            <a
              href="#home"
              onMouseEnter={() => setCursor("hover")}
              onMouseLeave={() => setCursor("default")}
              className="inline-flex items-center gap-2.5"
            >
              <Logo className="h-5" />
              <span className="text-[0.9375rem] font-medium tracking-[-0.02em] text-bright">
                {site.name}
              </span>
            </a>

            <p className="mt-4 text-[0.8125rem] leading-relaxed text-faint">
              {site.role} based in {site.location}. Building things that load
              fast and feel considered.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer">
            <p className="eyebrow mb-4">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onMouseEnter={() => setCursor("hover")}
                    onMouseLeave={() => setCursor("default")}
                    className="text-[0.8125rem] text-muted transition-colors duration-300 hover:text-bright"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <div>
            <p className="eyebrow mb-4">Elsewhere</p>
            <div className="flex items-center gap-2">
              {socials.map((social) => {
                const Icon = socialIcons[social.key];
                return (
                  <motion.a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    onMouseEnter={() => setCursor("hover")}
                    onMouseLeave={() => setCursor("default")}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 320, damping: 20 }}
                    className="glass flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors duration-300 hover:text-bright"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>

            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-block text-[0.8125rem] text-muted transition-colors hover:text-bright"
            >
              {site.email}
            </a>
          </div>
        </div>

        {/* Baseline */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-7 sm:flex-row">
          <p className="text-[0.75rem] text-faint">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-[0.75rem] text-faint">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white/80" />
            </span>
            Built with Next.js &amp; Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
