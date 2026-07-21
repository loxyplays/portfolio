"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Admin form primitives.
 *
 * Plainer than the site's own glass inputs on purpose — this is a tool, and
 * an editing surface should be legible and dense rather than atmospheric.
 */

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-dim">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[0.6875rem] text-faint">{hint}</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[0.875rem] text-bright " +
  "outline-none transition-colors placeholder:text-faint focus:border-white/35 focus:bg-white/[0.06]";

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputBase, className)}
    />
  );
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        const n = parseFloat(e.target.value);
        onChange(Number.isFinite(n) ? n : 0);
      }}
      className={inputBase}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputBase, "resize-y leading-relaxed")}
    />
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={cn(inputBase, "appearance-none")}
    >
      {options.map((o) => (
        // Dark background set explicitly — native option lists ignore the
        // parent's colours in most browsers and would render white-on-white.
        <option key={o} value={o} className="bg-[#16161a] text-bright">
          {o}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
          checked
            ? "border-white/30 bg-white"
            : "border-white/15 bg-white/[0.06]",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all",
            checked ? "left-[calc(100%-1.25rem)] bg-void" : "left-1 bg-white/60",
          )}
        />
      </button>
      <label htmlFor={id} className="text-[0.8125rem] text-muted">
        {label}
      </label>
    </div>
  );
}

/** Comma-separated list editor — right shape for tags and short lists. */
export function ListInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <TextInput
      value={value.join(", ")}
      placeholder={placeholder}
      onChange={(raw) =>
        onChange(
          raw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        )
      }
    />
  );
}

/** One line per item — for paragraphs and bullet lists. */
export function LinesInput({
  value,
  onChange,
  rows = 4,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  rows?: number;
}) {
  return (
    <TextArea
      rows={rows}
      value={value.join("\n")}
      onChange={(raw) => onChange(raw.split("\n").filter((l) => l.trim() !== ""))}
    />
  );
}

export function Card({
  children,
  title,
  actions,
}: {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h3 className="text-[0.875rem] font-semibold text-bright">{title}</h3>
          )}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "secondary",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const styles = {
    primary: "bg-bright text-void hover:bg-white disabled:opacity-40",
    secondary:
      "border border-white/12 bg-white/[0.04] text-bright hover:border-white/25 hover:bg-white/[0.08]",
    danger:
      "border border-white/12 bg-transparent text-dim hover:border-white/30 hover:text-bright",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full px-4 text-[0.8125rem] font-medium transition-colors disabled:pointer-events-none",
        styles,
      )}
    >
      {children}
    </button>
  );
}

/** Move/delete controls for an item in an ordered list. */
export function RowControls({
  onUp,
  onDown,
  onRemove,
  isFirst,
  isLast,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const btn =
    "flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-dim transition-colors hover:border-white/30 hover:text-bright disabled:opacity-25 disabled:pointer-events-none";
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={onUp} disabled={isFirst} className={btn} aria-label="Move up">
        ↑
      </button>
      <button type="button" onClick={onDown} disabled={isLast} className={btn} aria-label="Move down">
        ↓
      </button>
      <button type="button" onClick={onRemove} className={btn} aria-label="Remove">
        ✕
      </button>
    </div>
  );
}

/** Immutable list helpers, shared by every repeating section. */
export const listOps = {
  update: <T,>(arr: T[], i: number, next: T): T[] =>
    arr.map((item, idx) => (idx === i ? next : item)),
  remove: <T,>(arr: T[], i: number): T[] => arr.filter((_, idx) => idx !== i),
  move: <T,>(arr: T[], i: number, dir: -1 | 1): T[] => {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return arr;
    const copy = [...arr];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  },
};
