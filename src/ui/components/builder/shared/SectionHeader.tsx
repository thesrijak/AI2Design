import { h } from "preact";

import type { ColorTokens } from "../../../tokens";

interface SectionHeaderProps {
  title: string;
  colors: ColorTokens;
  action?: { label: string; onClick: () => void };
}

export function SectionHeader({ title, colors, action }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "24px",
        marginBottom: "6px",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: colors.textMuted,
        }}
      >
        {title}
      </span>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            border: "none",
            background: "transparent",
            color: colors.accent,
            fontSize: "11px",
            fontWeight: 500,
            fontFamily: "inherit",
            cursor: "pointer",
            padding: "2px 4px",
            borderRadius: "3px",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
