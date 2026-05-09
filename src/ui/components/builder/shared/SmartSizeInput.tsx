import { h } from "preact";

import type { ColorTokens } from "../../../tokens";
import { inputStyle } from "./inputStyle";

type SizeKeyword = "FIXED" | "HUG" | "FILL";

interface SmartSizeInputProps {
  keyword: SizeKeyword;
  px: number | undefined;
  onKeywordChange: (k: SizeKeyword) => void;
  onPxChange: (v: number) => void;
  colors: ColorTokens;
}

export function SmartSizeInput({
  keyword,
  px,
  onKeywordChange,
  onPxChange,
  colors,
}: SmartSizeInputProps) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      <select
        value={keyword}
        onChange={(e) =>
          onKeywordChange((e.target as HTMLSelectElement).value as SizeKeyword)
        }
        style={{ ...inputStyle(colors), flex: "0 0 60px", fontSize: "10px" }}
      >
        <option value="FIXED">Fixed</option>
        <option value="HUG">Hug</option>
        <option value="FILL">Fill</option>
      </select>
      {keyword === "FIXED" && (
        <input
          type="number"
          value={px ?? ""}
          min={0}
          onInput={(e) =>
            onPxChange(Number((e.target as HTMLInputElement).value))
          }
          style={{ ...inputStyle(colors), flex: 1, minWidth: 0 }}
        />
      )}
    </div>
  );
}
