import { h, Fragment } from "preact";

import type { FrameNodeJSON } from "../../../../schema";
import type { ColorTokens } from "../../../tokens";
import { FieldRow } from "../shared/FieldRow";
import { inputStyle } from "../shared/inputStyle";

interface FramePanelProps {
  node: FrameNodeJSON;
  onUpdate: (patch: Partial<FrameNodeJSON>) => void;
  colors: ColorTokens;
}

type LayoutMode = "NONE" | "HORIZONTAL" | "VERTICAL";
type AxisAlign = "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
type CounterAxisAlign = "MIN" | "CENTER" | "MAX";

export function FramePanel({ node, onUpdate, colors }: FramePanelProps) {
  const padding = node.padding ?? { top: 0, right: 0, bottom: 0, left: 0 };
  const hasAutoLayout =
    node.layoutMode === "HORIZONTAL" || node.layoutMode === "VERTICAL";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {/* Layout mode */}
      <FieldRow label="Layout" colors={colors}>
        <select
          value={node.layoutMode ?? "NONE"}
          onChange={(e) =>
            onUpdate({
              layoutMode: (e.target as HTMLSelectElement).value as LayoutMode,
            })
          }
          style={inputStyle(colors)}
        >
          <option value="NONE">None</option>
          <option value="HORIZONTAL">Horizontal</option>
          <option value="VERTICAL">Vertical</option>
        </select>
      </FieldRow>

      {/* Corner radius */}
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

      {/* Auto-layout specific fields */}
      {hasAutoLayout && (
        <>
          <FieldRow label="Gap" colors={colors}>
            <input
              type="number"
              min={0}
              value={node.itemSpacing ?? 0}
              onInput={(e) =>
                onUpdate({
                  itemSpacing: parseFloat((e.target as HTMLInputElement).value),
                })
              }
              style={inputStyle(colors)}
            />
          </FieldRow>

          <FieldRow label="Padding T" colors={colors}>
            <input
              type="number"
              min={0}
              value={padding.top}
              onInput={(e) =>
                onUpdate({
                  padding: {
                    ...padding,
                    top: parseFloat((e.target as HTMLInputElement).value),
                  },
                })
              }
              style={inputStyle(colors)}
            />
          </FieldRow>

          <FieldRow label="Padding R" colors={colors}>
            <input
              type="number"
              min={0}
              value={padding.right}
              onInput={(e) =>
                onUpdate({
                  padding: {
                    ...padding,
                    right: parseFloat((e.target as HTMLInputElement).value),
                  },
                })
              }
              style={inputStyle(colors)}
            />
          </FieldRow>

          <FieldRow label="Padding B" colors={colors}>
            <input
              type="number"
              min={0}
              value={padding.bottom}
              onInput={(e) =>
                onUpdate({
                  padding: {
                    ...padding,
                    bottom: parseFloat((e.target as HTMLInputElement).value),
                  },
                })
              }
              style={inputStyle(colors)}
            />
          </FieldRow>

          <FieldRow label="Padding L" colors={colors}>
            <input
              type="number"
              min={0}
              value={padding.left}
              onInput={(e) =>
                onUpdate({
                  padding: {
                    ...padding,
                    left: parseFloat((e.target as HTMLInputElement).value),
                  },
                })
              }
              style={inputStyle(colors)}
            />
          </FieldRow>

          <FieldRow label="Primary" colors={colors}>
            <select
              value={node.primaryAxisAlignItems ?? "MIN"}
              onChange={(e) =>
                onUpdate({
                  primaryAxisAlignItems: (e.target as HTMLSelectElement)
                    .value as AxisAlign,
                })
              }
              style={inputStyle(colors)}
            >
              <option value="MIN">Start</option>
              <option value="CENTER">Center</option>
              <option value="MAX">End</option>
              <option value="SPACE_BETWEEN">Space Between</option>
            </select>
          </FieldRow>

          <FieldRow label="Counter" colors={colors}>
            <select
              value={node.counterAxisAlignItems ?? "MIN"}
              onChange={(e) =>
                onUpdate({
                  counterAxisAlignItems: (e.target as HTMLSelectElement)
                    .value as CounterAxisAlign,
                })
              }
              style={inputStyle(colors)}
            >
              <option value="MIN">Start</option>
              <option value="CENTER">Center</option>
              <option value="MAX">End</option>
            </select>
          </FieldRow>
        </>
      )}

      {/* Clips content */}
      <FieldRow label="Clip" colors={colors}>
        <input
          type="checkbox"
          checked={node.clipsContent ?? false}
          onChange={(e) =>
            onUpdate({
              clipsContent: (e.target as HTMLInputElement).checked,
            })
          }
        />
      </FieldRow>
    </div>
  );
}
