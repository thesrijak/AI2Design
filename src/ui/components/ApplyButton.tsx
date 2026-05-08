import { Fragment, h } from "preact";
import { useState } from "preact/hooks";

import type { ColorTokens } from "../tokens";

interface ApplyButtonProps {
  onClick: () => void;
  isSubmitting: boolean;
  colors: ColorTokens;
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ animation: "spin 0.75s linear infinite", flexShrink: 0 }}
    >
      <circle
        cx="7"
        cy="7"
        r="5.5"
        stroke="rgba(255,255,255,0.30)"
        stroke-width="1.5"
      />
      <path
        d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

/**
 * Full-width primary CTA — clay accent, loading spinner, hover/press states.
 */
export function ApplyButton({
  onClick,
  isSubmitting,
  colors,
}: ApplyButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const bg = isSubmitting
    ? colors.accentPressed
    : pressed
      ? colors.accentPressed
      : hovered
        ? colors.accentHover
        : colors.accent;

  return (
    <button
      onClick={onClick}
      disabled={isSubmitting}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      aria-label={isSubmitting ? "Applying design…" : "Apply design to Figma"}
      style={{
        width: "100%",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "0 16px",
        background: bg,
        color: colors.accentFg,
        border: "none",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 600,
        fontFamily: "inherit",
        letterSpacing: "-0.01em",
        cursor: isSubmitting ? "default" : "pointer",
        transform: pressed ? "scale(0.985)" : "scale(1)",
        transition: "background 0.15s, transform 0.1s",
        opacity: isSubmitting ? 0.88 : 1,
      }}
    >
      {isSubmitting ? (
        <>
          <Spinner />
          <span>Applying…</span>
        </>
      ) : (
        <>
          <span>Apply Design</span>
          <ArrowIcon />
        </>
      )}
    </button>
  );
}
