import { h } from "preact";
import { useState } from "preact/hooks";

import type { ColorTokens } from "../../../tokens";
import { inputStyle } from "./inputStyle";

interface HexColorInputProps {
  value: string; // "#RRGGBB"
  onChange: (hex: string) => void;
  colors: ColorTokens;
}

function isValidHex(v: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(v);
}

export function HexColorInput({ value, onChange, colors }: HexColorInputProps) {
  const [draft, setDraft] = useState(value);

  // Keep draft in sync when value changes from outside (e.g. example load)
  if (draft !== value && isValidHex(value)) {
    setDraft(value);
  }

  function commit(text: string) {
    const normalized = text.startsWith("#") ? text : `#${text}`;
    if (isValidHex(normalized)) {
      onChange(normalized);
      setDraft(normalized);
    }
  }

  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {/* Colour swatch */}
      <div
        style={{
          flexShrink: 0,
          width: "18px",
          height: "18px",
          borderRadius: "3px",
          background: isValidHex(draft) ? draft : "#cccccc",
          border: `1px solid ${colors.border}`,
        }}
      />
      <input
        type="text"
        value={draft}
        maxLength={7}
        onInput={(e) => setDraft((e.target as HTMLInputElement).value)}
        onChange={(e) => commit((e.target as HTMLInputElement).value)}
        onBlur={(e) => commit((e.target as HTMLInputElement).value)}
        style={{ ...inputStyle(colors), flex: 1 }}
      />
    </div>
  );
}
