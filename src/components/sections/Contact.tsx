"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact, site, socials } from "@/lib/data";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";
import { scaleIn, EASE } from "@/lib/motion";
import { socialIcons, Copy, Check, ArrowUpRight, Clock } from "@/components/ui/Icons";

/* -------------------------------------------------------------------------- */
/* Email card                                                                  */
/* -------------------------------------------------------------------------- */

function EmailCard() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions — the mailto link still works.
      setCopied(false);
    }
  };

  return (
    <div className="group glass ring-gradient relative overflow-hidden rounded-[24px] p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_0%_0%,rgba(255,255,255,0.08),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <p className="eyebrow">Email</p>

        <a
          href={`mailto:${site.email}`}
          className="mt-3 block break-all text-[1.0625rem] font-medium tracking-[-0.02em] text-bright transition-colors hover:text-white sm:text-[1.25rem]"
        >
          {site.email}
        </a>

        <div className="mt-5 flex items-center gap-2">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-bright px-4 text-[0.75rem] font-medium text-void transition-transform duration-300 hover:scale-[1.04] active:scale-95"
          >
            Send an email
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Email copied" : "Copy email address"}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 text-[0.75rem] font-medium text-muted transition-colors hover:border-white/25 hover:text-bright"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <p className="mt-5 flex items-center gap-2 text-[0.75rem] text-faint">
          <Clock className="h-3.5 w-3.5" />
          {contact.responseTime}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Socials                                                                     */
/* -------------------------------------------------------------------------- */

function SocialGrid() {
  return (
    <StaggerGroup gap={0.07} className="grid grid-cols-2 gap-3">
      {socials.map((social) => {
        const Icon = socialIcons[social.key];
        return (
          <StaggerItem key={social.key} variants={scaleIn}>
            <motion.a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group glass flex h-full items-center gap-3 rounded-[18px] px-4 py-3.5 transition-colors duration-300 hover:border-white/[0.2]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-muted transition-colors duration-300 group-hover:text-bright">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.8125rem] font-medium text-bright">
                  {social.label}
                </span>
                <span className="block truncate text-[0.6875rem] text-faint">
                  {social.handle}
                </span>
              </span>
            </motion.a>
          </StaggerItem>
        );
      })}
    </StaggerGroup>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

export function Contact() {
  return (
    <SectionShell
      id="contact"
      eyebrow="Contact"
      title={contact.heading}
      description={contact.blurb}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
        <div className="flex flex-col gap-5">
          <Reveal variants={scaleIn}>
            <EmailCard />
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow mb-3">Elsewhere</p>
            </Reveal>
            <SocialGrid />
          </div>
        </div>

        <Reveal variants={scaleIn} delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>

      {/* Closing statement */}
      <Reveal delay={0.15}>
        <div className="relative mt-20 overflow-hidden rounded-[28px] border border-white/[0.08] px-6 py-14 text-center sm:py-20">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.09),transparent_65%)] blur-2xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative">
            <p className="mx-auto max-w-lg text-balance text-[1.5rem] font-semibold leading-tight tracking-[-0.035em] text-gradient sm:text-[2rem]">
              Got something in mind? Let&apos;s make it real.
            </p>
            <motion.a
              href={`mailto:${site.email}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE.out }}
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-bright px-7 text-[0.9375rem] font-medium text-void shadow-[0_12px_45px_-12px_rgba(255,255,255,0.5)]"
            >
              Start a conversation
              <ArrowUpRight className="h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
