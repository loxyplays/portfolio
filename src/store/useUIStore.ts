import { create } from "zustand";
import type { SectionId } from "@/lib/data";

/** What the custom cursor should look like right now. */
export type CursorVariant = "default" | "hover" | "text" | "drag" | "hidden";

type UIState = {
  /** Flips true when the preloader finishes; gates every intro animation. */
  introComplete: boolean;
  setIntroComplete: (v: boolean) => void;

  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  toggleMenu: () => void;

  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;

  cursorVariant: CursorVariant;
  /** Optional label rendered inside the cursor, e.g. "View". */
  cursorLabel: string | null;
  setCursor: (variant: CursorVariant, label?: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  introComplete: false,
  setIntroComplete: (v) => set({ introComplete: v }),

  menuOpen: false,
  setMenuOpen: (v) => set({ menuOpen: v }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),

  activeSection: "home",
  setActiveSection: (id) =>
    // Guard against redundant writes — this fires on every scroll frame.
    set((s) => (s.activeSection === id ? s : { activeSection: id })),

  cursorVariant: "default",
  cursorLabel: null,
  setCursor: (variant, label = null) =>
    set((s) =>
      s.cursorVariant === variant && s.cursorLabel === label
        ? s
        : { cursorVariant: variant, cursorLabel: label },
    ),
}));
