import { h } from "preact";
import { useState } from "preact/hooks";

import type { ColorTokens } from "../tokens";

interface JsonEditorProps {
  value: string;
  lineCount: number;
  hasError: boolean;
  onInput: (value: string) => void;
  onFormat: () => void;
  onBlur: () => void;
  colors: ColorTokens;
}

/**
 * JSON editor area — toolbar row (label + line count + format button)
 * above a monospace textarea with a theme-aware focus ring.
 */
export function JsonEditor({
  value,
  lineCount,
  hasError,
  onInput,
  onFormat,
  onBlur,
  colors,
}: JsonEditorProps) {
  const [focused, setFocused] = useState(false);
  const [formatHovered, setFormatHovered] = useState(false);

  const borderColor = hasError
    ? colors.error
    : focused
      ? colors.accent
      : colors.border;

  const focusShadow = hasError
    ? `0 0 0 2.5px ${colors.errorBg}`
    : focused
      ? `0 0 0 2.5px ${colors.accentMuted}`
      : "none";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        gap: "6px",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
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
          JSON Schema
        </label>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Line counter */}
          <span
            style={{
              fontSize: "10px",
              color: colors.textMuted,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>

          {/* Format button */}
          <button
            onClick={onFormat}
            onMouseEnter={() => setFormatHovered(true)}
            onMouseLeave={() => setFormatHovered(false)}
            title="Format JSON (prettify)"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              height: "22px",
              padding: "0 8px",
              background: formatHovered ? colors.accentMuted : "transparent",
              border: `1px solid ${formatHovered ? colors.accent + "44" : colors.borderSubtle}`,
              borderRadius: "5px",
              color: formatHovered ? colors.accent : colors.textMuted,
              fontSize: "10px",
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 3h8M2 6h5M2 9h7"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
              />
            </svg>
            Format
          </button>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        spellcheck={false}
        onInput={function (e: Event) {
          onInput((e.currentTarget as HTMLTextAreaElement).value);
        }}
        onFocus={function () {
          setFocused(true);
        }}
        onBlur={function () {
          setFocused(false);
          onBlur();
        }}
        style={{
          flex: 1,
          width: "100%",
          resize: "none",
          background: colors.fieldBg,
          color: colors.fieldText,
          border: `1px solid ${borderColor}`,
          boxShadow: focusShadow,
          borderRadius: "8px",
          padding: "12px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "11.5px",
          lineHeight: 1.55,
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      />
    </div>
  );
}
