"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navItems, site } from "@/lib/data";
import { useUIStore } from "@/store/useUIStore";
import { useActiveSection } from "@/hooks/useActiveSection";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Menu, Close } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "./MobileMenu";

/**
 * Floating pill navbar.
 *
 * The active-section indicator is a single element moved between links by
 * framer-motion's shared-layout system (`layoutId`), so it physically travels
 * rather than cross-fading — much closer to how Linear's nav behaves.
 */
export function Navbar() {
  useActiveSection();

  const activeSection = useUIStore((s) => s.activeSection);
  const menuOpen = useUIStore((s) => s.menuOpen);
  const toggleMenu = useUIStore((s) => s.toggleMenu);
  const setCursor = useUIStore((s) => s.setCursor);

  const [condensed, setCondensed] = useState(false);
  const { scrollY } = useScroll();

  // Tighten the bar once the hero starts leaving.
  useMotionValueEvent(scrollY, "change", (latest) => {
    setCondensed(latest > 40);
  });

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE.out, delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-[9000] flex justify-center px-4 pt-4 sm:pt-5"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex items-center gap-1 rounded-full transition-all duration-500 ease-out",
            condensed
              ? "glass-strong px-2 py-2 shadow-[0_16px_50px_-14px_rgba(0,0,0,0.9)]"
              : "glass px-2.5 py-2.5",
          )}
        >
          {/* Wordmark */}
          <a
            href="#home"
            onMouseEnter={() => setCursor("hover")}
            onMouseLeave={() => setCursor("default")}
            className="group flex shrink-0 items-center gap-2.5 rounded-full py-1.5 pl-2.5 pr-3 sm:pr-4"
          >
            <Logo className="h-[1.15rem] transition-transform duration-500 ease-out group-hover:scale-105" priority />
            <span className="hidden text-[0.8125rem] font-medium tracking-[-0.01em] text-bright sm:inline">
              {site.name}
            </span>
          </a>

          <span
            aria-hidden="true"
            className="mx-1 hidden h-5 w-px bg-white/10 md:block"
          />

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 md:flex">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    onMouseEnter={() => setCursor("hover")}
                    onMouseLeave={() => setCursor("default")}
                    className={cn(
                      "relative block rounded-full px-3.5 py-2 text-[0.8125rem] font-medium transition-colors duration-300",
                      isActive ? "text-void" : "text-muted hover:text-bright",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-full bg-bright"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                          mass: 0.8,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href="#contact"
            onMouseEnter={() => setCursor("hover")}
            onMouseLeave={() => setCursor("default")}
            className="ml-1 hidden rounded-full bg-bright px-4 py-2 text-[0.8125rem] font-medium text-void transition-transform duration-300 hover:scale-[1.03] active:scale-95 md:block"
          >
            Get in touch
          </a>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative ml-auto flex h-9 w-9 items-center justify-center rounded-full text-bright transition-colors hover:bg-white/10 md:hidden"
          >
            <motion.span
              className="absolute"
              animate={{
                opacity: menuOpen ? 0 : 1,
                rotate: menuOpen ? -90 : 0,
                scale: menuOpen ? 0.6 : 1,
              }}
              transition={{ duration: 0.25, ease: EASE.out }}
            >
              <Menu className="h-[18px] w-[18px]" />
            </motion.span>
            <motion.span
              className="absolute"
              animate={{
                opacity: menuOpen ? 1 : 0,
                rotate: menuOpen ? 0 : 90,
                scale: menuOpen ? 1 : 0.6,
              }}
              transition={{ duration: 0.25, ease: EASE.out }}
            >
              <Close className="h-[18px] w-[18px]" />
            </motion.span>
          </button>
        </nav>
      </motion.header>

      <MobileMenu />
    </>
  );
}
