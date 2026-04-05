"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { playThemeToggleSound } from "@/lib/ui-sound";

type Theme = "dark" | "light";

const DARK_THEME_COLOR = "#161616";
const LIGHT_THEME_COLOR = "#f3efe4";

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem("theme");
  return storedTheme === "light" ? "light" : "dark";
}

function setDocumentTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  metaThemeColor?.setAttribute("content", theme === "dark" ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const initialTheme = getStoredTheme();
    setTheme(initialTheme);
    setDocumentTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = useMemo(
    () => () => {
      const nextTheme: Theme = theme === "dark" ? "light" : "dark";
      const applyTheme = () => {
        setTheme(nextTheme);
        window.localStorage.setItem("theme", nextTheme);
        setDocumentTheme(nextTheme);
      };

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(16);
      }

      playThemeToggleSound(audioRef);

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReducedMotion && typeof document.startViewTransition === "function") {
        void document.startViewTransition(() => {
          applyTheme();
        });
        return;
      }

      applyTheme();
    },
    [theme]
  );

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (isEditable || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key.toLowerCase() === "d") {
        event.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, toggleTheme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      data-ready={mounted ? "true" : "false"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title="Toggle theme (D)"
    >
      <span className="theme-toggle__icon-stack" aria-hidden="true">
        <span className={`theme-toggle__icon theme-toggle__icon--moon${isDark ? " is-active" : ""}`}>
          <MoonIcon />
        </span>
        <span className={`theme-toggle__icon theme-toggle__icon--sun${!isDark ? " is-active" : ""}`}>
          <SunIcon />
        </span>
      </span>
      <span className="theme-toggle__hint">D</span>
    </button>
  );
}
