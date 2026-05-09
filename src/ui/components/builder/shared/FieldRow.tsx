import { h } from "preact";

import type { ColorTokens } from "../../../tokens";

interface FieldRowProps {
  label: string;
  colors: ColorTokens;
  children: preact.ComponentChildren;
}

export function FieldRow({ label, colors, children }: FieldRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        minHeight: "26px",
        gap: "8px",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: "80px",
          fontSize: "10px",
          color: colors.textMuted,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}
