import { useEffect, useState } from "preact/hooks";

import type { Theme } from "../types";

function detectTheme(): Theme {
  if (document.body.classList.contains("theme-dark")) return "dark";
  if (document.body.classList.contains("theme-light")) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Tracks the active Figma theme (light / dark).
 * Responds to Figma's body class changes and OS preference changes.
 */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(detectTheme);

  useEffect(function () {
    const update = () => setTheme(detectTheme());

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    mq.addEventListener?.("change", update);

    return function () {
      observer.disconnect();
      mq.removeEventListener?.("change", update);
    };
  }, []);

  return theme;
}
