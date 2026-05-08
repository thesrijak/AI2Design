import { h } from "preact";

import type { ColorTokens } from "../tokens";

interface HeaderProps {
  colors: ColorTokens;
  version?: string;
}

/** Top bar — clay logo mark, plugin name, version pill. */
export function Header({ colors, version = "v0.0.1" }: HeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "44px",
        padding: "0 16px",
        background: colors.topBar,
        borderBottom: `1px solid ${colors.borderSubtle}`,
        flexShrink: 0,
      }}
    >
      {/* Logo + name */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden="true"
        >
          <rect
            width="22"
            height="22"
            rx="6"
            fill={colors.accent}
            fill-opacity="0.14"
          />
          <path
            d="M7 17L11 6L15 17M8.8 13H13.2"
            stroke={colors.accent}
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: colors.text,
          }}
        >
          AI2Design
        </span>
      </div>

      {/* Version pill */}
      <span
        style={{
          fontSize: "10px",
          fontWeight: 500,
          color: colors.textMuted,
          background: colors.accentMuted,
          border: `1px solid ${colors.accent}22`,
          borderRadius: "999px",
          padding: "2px 8px",
          letterSpacing: "0.02em",
        }}
      >
        {version}
      </span>
    </header>
  );
}
