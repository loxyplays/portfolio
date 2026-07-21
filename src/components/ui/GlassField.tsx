"use client";

import { useId, useState, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

/**
 * Glass input with a floating label.
 *
 * The label lifts when the field is focused *or* has content — checking only
 * focus is the classic bug that leaves the label sitting on top of typed text
 * after blur. Errors are wired with aria-describedby + aria-invalid so screen
 * readers announce them.
 */
export function GlassField({
  label,
  name,
  value,
  onChange,
  error,
  required,
  disabled,
  type = "text",
}: BaseProps & { type?: "text" | "email" }) {
  const id = useId();
  const errorId = `${id}-error`;
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <div
        className={cn(
          "relative rounded-[18px] border bg-white/[0.03] backdrop-blur-xl transition-all duration-300",
          focused
            ? "border-white/30 bg-white/[0.06] shadow-[0_0_0_4px_rgba(255,255,255,0.05)]"
            : "border-white/[0.09] hover:border-white/[0.16]",
          error && "border-white/40",
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 origin-left transition-all duration-300 ease-out",
            lifted
              ? "top-2 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-dim"
              : "top-1/2 -translate-y-1/2 text-[0.875rem] text-dim",
          )}
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          className="h-[3.75rem] w-full bg-transparent px-4 pb-2 pt-6 text-[0.9375rem] text-bright outline-none placeholder:text-transparent disabled:opacity-50"
        />
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-2 pl-1 text-[0.75rem] text-bright/70">
          {error}
        </p>
      )}
    </div>
  );
}

/** Multi-line variant. Same floating-label behaviour. */
export function GlassTextarea({
  label,
  name,
  value,
  onChange,
  error,
  required,
  disabled,
  rows = 5,
}: BaseProps & { rows?: number }) {
  const id = useId();
  const errorId = `${id}-error`;
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <div
        className={cn(
          "relative rounded-[18px] border bg-white/[0.03] backdrop-blur-xl transition-all duration-300",
          focused
            ? "border-white/30 bg-white/[0.06] shadow-[0_0_0_4px_rgba(255,255,255,0.05)]"
            : "border-white/[0.09] hover:border-white/[0.16]",
          error && "border-white/40",
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 origin-left transition-all duration-300 ease-out",
            lifted
              ? "top-2.5 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-dim"
              : "top-6 text-[0.875rem] text-dim",
          )}
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>

        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none bg-transparent px-4 pb-4 pt-8 text-[0.9375rem] leading-relaxed text-bright outline-none placeholder:text-transparent disabled:opacity-50"
        />
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-2 pl-1 text-[0.75rem] text-bright/70">
          {error}
        </p>
      )}
    </div>
  );
}
