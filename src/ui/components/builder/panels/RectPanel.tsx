import { h } from "preact";

import type { RectangleNodeJSON } from "../../../../schema";
import type { ColorTokens } from "../../../tokens";
import { FieldRow } from "../shared/FieldRow";
import { inputStyle } from "../shared/inputStyle";

interface RectPanelProps {
  node: RectangleNodeJSON;
  onUpdate: (patch: Partial<RectangleNodeJSON>) => void;
  colors: ColorTokens;
}

export function RectPanel({ node, onUpdate, colors }: RectPanelProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <FieldRow label="Radius" colors={colors}>
        <input
          type="number"
          min={0}
          value={node.cornerRadius ?? 0}
          onInput={(e) =>
            onUpdate({
              cornerRadius: parseFloat((e.target as HTMLInputElement).value),
            })
          }
          style={inputStyle(colors)}
        />
      </FieldRow>
    </div>
  );
}
