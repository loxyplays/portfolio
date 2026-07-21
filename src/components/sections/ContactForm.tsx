"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassField, GlassTextarea } from "@/components/ui/GlassField";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { EASE } from "@/lib/motion";
import { site } from "@/lib/data";
import { ArrowRight, Check } from "@/components/ui/Icons";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Where submissions go.
 *
 * This site builds to static files, so there's no server of ours to receive a
 * POST. Point this at a form service (Formspree, Web3Forms, Basin — anything
 * that accepts a JSON POST and returns 2xx) and the form submits for real.
 *
 * Left unset, the form falls back to composing a pre-filled email in the
 * visitor's mail client. That keeps the section functional out of the box
 * rather than shipping a button that silently does nothing.
 */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  /** Honeypot — bots fill hidden fields, humans never see it. */
  const [company, setCompany] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): Errors => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(email)) next.email = "That doesn't look like an email.";
    if (message.trim().length < 10)
      next.message = "A little more detail would help — 10 characters minimum.";
    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Honeypot: a bot filled the hidden field. Show success and drop it.
    if (company.trim() !== "") {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    setServerError(null);

    // No endpoint configured — hand off to the visitor's mail client with
    // everything already filled in.
    if (!FORM_ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      return;
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio enquiry from ${name}`,
        }),
      });

      if (!res.ok) {
        throw new Error(
          "That didn't go through. Try again, or email me directly.",
        );
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  };

  const disabled = status === "submitting";

  return (
    <div className="glass ring-gradient relative overflow-hidden rounded-[28px] p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          /* ---------------------------------------------------------- */
          /* Success state                                               */
          /* ---------------------------------------------------------- */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: EASE.out }}
            className="flex min-h-[22rem] flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 18,
                delay: 0.1,
              }}
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-bright text-void"
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-white/30"
                animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, repeat: 2, ease: "easeOut" }}
              />
              {/* Tick draws itself in. */}
              <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative h-7 w-7"
              >
                <motion.path
                  d="m4.5 12.5 5 5 10-11"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: EASE.out, delay: 0.28 }}
                />
              </motion.svg>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: EASE.out }}
              className="mt-6 text-xl font-semibold tracking-[-0.03em] text-bright"
            >
              {FORM_ENDPOINT ? "Message sent" : "Almost there"}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5, ease: EASE.out }}
              className="mt-2 max-w-xs text-[0.875rem] leading-relaxed text-muted"
            >
              {FORM_ENDPOINT
                ? "Thanks for reaching out — I'll get back to you within a day."
                : "Your mail app should have opened with everything filled in. Hit send and I'll reply within a day."}
            </motion.p>

            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => setStatus("idle")}
              className="mt-7 text-[0.8125rem] font-medium text-dim underline-offset-4 transition-colors hover:text-bright hover:underline"
            >
              Send another
            </motion.button>
          </motion.div>
        ) : (
          /* ---------------------------------------------------------- */
          /* Form                                                        */
          /* ---------------------------------------------------------- */
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <GlassField
                label="Name"
                name="name"
                value={name}
                onChange={setName}
                error={errors.name}
                disabled={disabled}
                required
              />
              <GlassField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={setEmail}
                error={errors.email}
                disabled={disabled}
                required
              />
            </div>

            <GlassTextarea
              label="What are you working on?"
              name="message"
              value={message}
              onChange={setMessage}
              error={errors.message}
              disabled={disabled}
              required
            />

            {/* Honeypot. Hidden from sight and from assistive tech. */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-0">
              <label htmlFor="company-field">Company</label>
              <input
                id="company-field"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton
                type="submit"
                size="lg"
                disabled={disabled}
                icon={
                  disabled ? undefined : <ArrowRight className="h-4 w-4" />
                }
              >
                {disabled ? (
                  <span className="flex items-center gap-2.5">
                    <motion.span
                      className="block h-3.5 w-3.5 rounded-full border-[1.5px] border-void/25 border-t-void"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.7,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Sending
                  </span>
                ) : (
                  "Send message"
                )}
              </MagneticButton>

              <p className="flex items-center gap-1.5 text-[0.75rem] text-faint">
                <Check className="h-3.5 w-3.5" />
                No spam, ever.
              </p>
            </div>

            <AnimatePresence>
              {serverError && (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-[0.8125rem] text-bright/80"
                >
                  {serverError}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
