"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const storageKey = "ledgerbyte-theme";
const themeChangeEvent = "ledgerbyte-theme-change";

function getStoredTheme(): Theme | null {
  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    return storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      meta.content = theme === "light" ? "#f5f0e5" : "#171716";
    });
}

function subscribeToTheme(onStoreChange: () => void) {
  const colorScheme = window.matchMedia("(prefers-color-scheme: light)");
  const handleThemeChange = () => onStoreChange();
  const handleSystemChange = () => {
    if (getStoredTheme()) return;
    applyTheme(getSystemTheme());
    onStoreChange();
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== storageKey) return;
    const nextTheme =
      event.newValue === "light" || event.newValue === "dark"
        ? event.newValue
        : getSystemTheme();
    applyTheme(nextTheme);
    onStoreChange();
  };

  colorScheme.addEventListener("change", handleSystemChange);
  window.addEventListener("storage", handleStorage);
  window.addEventListener(themeChangeEvent, handleThemeChange);

  return () => {
    colorScheme.removeEventListener("change", handleSystemChange);
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(themeChangeEvent, handleThemeChange);
  };
}

function getThemeSnapshot(): Theme {
  const documentTheme = document.documentElement.dataset.theme;
  return documentTheme === "light" || documentTheme === "dark"
    ? documentTheme
    : getStoredTheme() ?? getSystemTheme();
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(
    subscribeToTheme,
    getThemeSnapshot,
    () => null,
  );

  const toggleTheme = () => {
    const currentTheme =
      theme ??
      (document.documentElement.dataset.theme as Theme | undefined) ??
      getSystemTheme();
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";
    const commitTheme = () => {
      applyTheme(nextTheme);
      try {
        window.localStorage.setItem(storageKey, nextTheme);
      } catch {
        window.dispatchEvent(new Event(themeChangeEvent));
        return;
      }
      window.dispatchEvent(new Event(themeChangeEvent));
    };

    const viewTransitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };

    if (
      viewTransitionDocument.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      viewTransitionDocument.startViewTransition(commitTheme);
    } else {
      commitTheme();
    }
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={
        theme === "light"
          ? "Switch to dark mode"
          : theme === "dark"
            ? "Switch to light mode"
            : "Change color theme"
      }
      onClick={toggleTheme}
    >
      <Sun className="theme-icon theme-icon-sun" weight="bold" aria-hidden="true" />
      <Moon
        className="theme-icon theme-icon-moon"
        weight="bold"
        aria-hidden="true"
      />
    </button>
  );
}
