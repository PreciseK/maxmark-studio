"use client";

import { useEffect, useSyncExternalStore } from "react";

type Preference = "system" | "light" | "dark";
const order: Preference[] = ["system", "light", "dark"];

function applyTheme(preference: Preference) {
  const resolved = preference === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
}

function getPreference(): Preference {
  const stored = localStorage.getItem("maxmark-theme") as Preference | null;
  return order.includes(stored as Preference) ? stored as Preference : "system";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("maxmark-theme-change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("maxmark-theme-change", onStoreChange);
  };
}

const getServerPreference = (): Preference => "system";

export default function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
  const preference = useSyncExternalStore(subscribe, getPreference, getServerPreference);

  useEffect(() => {
    applyTheme(preference);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => { if (getPreference() === "system") applyTheme("system"); };
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [preference]);

  const next = () => {
    const value = order[(order.indexOf(preference) + 1) % order.length];
    localStorage.setItem("maxmark-theme", value);
    applyTheme(value);
    window.dispatchEvent(new Event("maxmark-theme-change"));
  };

  const icon = preference === "light" ? "☼" : preference === "dark" ? "◐" : "A";
  return (
    <button
      type="button"
      onClick={next}
      className="theme-toggle"
      aria-label={`Theme: ${preference}. Change theme`}
      title={`Theme: ${preference}`}
      style={mobile ? { width: "100%", justifyContent: "space-between", paddingInline: "18px" } : undefined}
    >
      {mobile && <span>{preference} theme</span>}
      <span className="theme-toggle-icon" aria-hidden="true">{icon}</span>
    </button>
  );
}
