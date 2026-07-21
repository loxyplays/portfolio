"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navItems, socials, site } from "@/lib/data";
import { useUIStore } from "@/store/useUIStore";
import { EASE } from "@/lib/motion";
import { socialIcons } from "@/components/ui/Icons";

/**
 * Fullscreen mobile navigation.
 *
 * Handles the accessibility work a fullscreen overlay owes the user: body
 * scroll lock, Escape to close, focus moved in on open and returned to the
 * trigger on close, and a focus trap so Tab can't wander behind the panel.
 */
export function MobileMenu() {
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);

  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // `overflow: hidden` preserves scrollTop, so no manual restore is needed.
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    // Move focus into the panel.
    const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus();
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE.out }}
          className="fixed inset-0 z-[8999] md:hidden"
        >
          {/* Backdrop: a real blurred surface, not a flat scrim. */}
          <motion.div
            className="absolute inset-0 bg-void/85 backdrop-blur-2xl"
            initial={{ clipPath: "circle(0% at 90% 6%)" }}
            animate={{ clipPath: "circle(150% at 90% 6%)" }}
            exit={{ clipPath: "circle(0% at 90% 6%)" }}
            transition={{ duration: 0.75, ease: EASE.inOut }}
          />

          <div className="dot-bg absolute inset-0 opacity-40" />

          <div className="relative flex h-full flex-col justify-between px-7 pb-10 pt-28">
            <ul className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "110%", opacity: 0 }}
                    transition={{
                      duration: 0.65,
                      ease: EASE.out,
                      delay: 0.16 + i * 0.055,
                    }}
                    className="group flex items-baseline gap-4 py-2.5"
                  >
                    <span className="font-mono text-[0.6875rem] text-faint">
                      0{i + 1}
                    </span>
                    <span className="text-[2.25rem] font-semibold leading-tight tracking-[-0.04em] text-bright transition-transform duration-500 ease-out group-active:translate-x-2">
                      {item.label}
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: EASE.out, delay: 0.42 }}
              className="space-y-6"
            >
              <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />

              <a
                href={`mailto:${site.email}`}
                className="block text-sm text-muted transition-colors hover:text-bright"
              >
                {site.email}
              </a>

              <div className="flex items-center gap-2.5">
                {socials.map((social) => {
                  const Icon = socialIcons[social.key];
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="glass flex h-11 w-11 items-center justify-center rounded-2xl text-muted transition-colors hover:text-bright"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
