import { h } from "preact";

import type { TextNodeJSON } from "../../../../schema";
import type { ColorTokens } from "../../../tokens";
import { FieldRow } from "../shared/FieldRow";
import { inputStyle } from "../shared/inputStyle";

interface TextPanelProps {
  node: TextNodeJSON;
  onUpdate: (patch: Partial<TextNodeJSON>) => void;
  colors: ColorTokens;
}

type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type TextAlign = "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";

export function TextPanel({ node, onUpdate, colors }: TextPanelProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {/* Characters */}
      <FieldRow label="Text" colors={colors}>
        <textarea
          value={node.characters}
          rows={2}
          onInput={(e) =>
            onUpdate({ characters: (e.target as HTMLTextAreaElement).value })
          }
          style={{
            ...inputStyle(colors),
            height: "auto",
            padding: "4px 6px",
            resize: "vertical",
            lineHeight: 1.4,
          }}
        />
      </FieldRow>

      {/* Font size */}
      <FieldRow label="Font size" colors={colors}>
        <input
          type="number"
          min={1}
          value={node.fontSize ?? 12}
          onInput={(e) =>
            onUpdate({
              fontSize: parseFloat((e.target as HTMLInputElement).value),
            })
          }
          style={inputStyle(colors)}
        />
      </FieldRow>

      {/* Font weight */}
      <FieldRow label="Weight" colors={colors}>
        <select
          value={node.fontWeight ?? 400}
          onChange={(e) =>
            onUpdate({
              fontWeight: parseInt(
                (e.target as HTMLSelectElement).value,
                10,
              ) as FontWeight,
            })
          }
          style={inputStyle(colors)}
        >
          <option value={100}>Thin 100</option>
          <option value={200}>ExtraLight 200</option>
          <option value={300}>Light 300</option>
          <option value={400}>Regular 400</option>
          <option value={500}>Medium 500</option>
          <option value={600}>SemiBold 600</option>
          <option value={700}>Bold 700</option>
          <option value={800}>ExtraBold 800</option>
          <option value={900}>Black 900</option>
        </select>
      </FieldRow>

      {/* Font family */}
      <FieldRow label="Family" colors={colors}>
        <input
          type="text"
          value={node.fontFamily ?? ""}
          placeholder="Inter"
          onBlur={(e) =>
            onUpdate({
              fontFamily: (e.target as HTMLInputElement).value || undefined,
            })
          }
          style={inputStyle(colors)}
        />
      </FieldRow>

      {/* Text align */}
      <FieldRow label="Align" colors={colors}>
        <select
          value={node.textAlign ?? "LEFT"}
          onChange={(e) =>
            onUpdate({
              textAlign: (e.target as HTMLSelectElement).value as TextAlign,
            })
          }
          style={inputStyle(colors)}
        >
          <option value="LEFT">Left</option>
          <option value="CENTER">Center</option>
          <option value="RIGHT">Right</option>
          <option value="JUSTIFIED">Justified</option>
        </select>
      </FieldRow>
    </div>
  );
}
