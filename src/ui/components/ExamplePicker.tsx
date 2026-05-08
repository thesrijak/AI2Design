import { h } from "preact";

import type { ColorTokens } from "../tokens";

interface ExamplePickerProps {
  examples: string[];
  selected: string;
  onChange: (name: string) => void;
  colors: ColorTokens;
}

/** Label + full-width styled select for choosing a built-in example. */
export function ExamplePicker({
  examples,
  selected,
  onChange,
  colors,
}: ExamplePickerProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: colors.textMuted,
          userSelect: "none",
        }}
      >
        Load example
      </label>

      <div style={{ position: "relative" }}>
        <select
          value={selected}
          onChange={function (e: Event) {
            onChange((e.currentTarget as HTMLSelectElement).value);
          }}
          style={{
            width: "100%",
            height: "36px",
            padding: "0 36px 0 12px",
            background: colors.surface,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 500,
            fontFamily: "inherit",
            appearance: "none",
            WebkitAppearance: "none",
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
        >
          {examples.map(function (name) {
            return (
              <option key={name} value={name}>
                {name}
              </option>
            );
          })}
        </select>

        {/* Custom chevron */}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: colors.textMuted,
          }}
          aria-hidden="true"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
