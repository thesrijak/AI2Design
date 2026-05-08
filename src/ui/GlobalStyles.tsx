import { h } from "preact";

/**
 * Injects global CSS that can't be expressed as inline styles:
 * keyframe animations, scrollbar styling, and base resets.
 */
export function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
      #plugin-root { height: 100%; display: flex; flex-direction: column; }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* Thin, unobtrusive scrollbar for the textarea */
      textarea::-webkit-scrollbar { width: 4px; }
      textarea::-webkit-scrollbar-track { background: transparent; }
      textarea::-webkit-scrollbar-thumb {
        background: rgba(128, 128, 128, 0.25);
        border-radius: 4px;
      }

      /* Remove default focus outline — components define their own */
      *:focus { outline: none; }

      /* Select option inherits theme colours from parent */
      select option { background: inherit; color: inherit; }
    `}</style>
  );
}
