import { h } from "preact";

import type { NodeJSON, PaintInputJSON } from "../../../../schema";
import type { ColorTokens } from "../../../tokens";
import { FieldRow } from "../shared/FieldRow";
import { HexColorInput } from "../shared/HexColorInput";
import { SmartSizeInput } from "../shared/SmartSizeInput";
import { inputStyle } from "../shared/inputStyle";

interface CommonFieldsProps {
  node: NodeJSON;
  onUpdate: (patch: Partial<NodeJSON>) => void;
  colors: ColorTokens;
}

function firstFillHex(fills: PaintInputJSON[] | undefined): string {
  if (!fills || fills.length === 0) return "#000000";
  const first = fills[0];
  if (typeof first === "string") return first;
  if (first.type === "SOLID") {
    const r = Math.round(first.r * 255);
    const g = Math.round(first.g * 255);
    const b = Math.round(first.b * 255);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
  return "#000000";
}

function patchFill(
  fills: PaintInputJSON[] | undefined,
  hex: string,
): PaintInputJSON[] {
  if (!fills || fills.length === 0) return [hex];
  return [hex, ...fills.slice(1)];
}

type SizeKeyword = "FIXED" | "HUG" | "FILL";

function widthKeyword(node: NodeJSON): SizeKeyword {
  if (node.layoutSizingHorizontal) return node.layoutSizingHorizontal;
  if (node.width === "HUG") return "HUG";
  if (node.width === "FILL") return "FILL";
  if (typeof node.width === "number") return "FIXED";
  return "HUG";
}

function heightKeyword(node: NodeJSON): SizeKeyword {
  if (node.layoutSizingVertical) return node.layoutSizingVertical;
  if (node.height === "HUG") return "HUG";
  if (node.height === "FILL") return "FILL";
  if (typeof node.height === "number") return "FIXED";
  return "HUG";
}

function pxFromNode(
  sizeField: "width" | "height",
  node: NodeJSON,
): number | undefined {
  const v = node[sizeField];
  return typeof v === "number" ? v : undefined;
}

export function CommonFields({ node, onUpdate, colors }: CommonFieldsProps) {
  const hasMultiFill = (node.fills?.length ?? 0) > 1;
  const fillHex = firstFillHex(node.fills);
  const hasFill = (node.fills?.length ?? 0) > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {/* Name */}
      <FieldRow label="Name" colors={colors}>
        <input
          type="text"
          value={node.name ?? ""}
          onInput={(e) =>
            onUpdate({ name: (e.target as HTMLInputElement).value })
          }
          style={inputStyle(colors)}
        />
      </FieldRow>

      {/* Width */}
      <FieldRow label="Width" colors={colors}>
        <SmartSizeInput
          keyword={widthKeyword(node)}
          px={pxFromNode("width", node)}
          onKeywordChange={(k) => {
            if (k === "FIXED") {
              onUpdate({
                layoutSizingHorizontal: "FIXED",
                width: pxFromNode("width", node) ?? 100,
              });
            } else {
              onUpdate({ layoutSizingHorizontal: k, width: undefined });
            }
          }}
          onPxChange={(v) =>
            onUpdate({ width: v, layoutSizingHorizontal: "FIXED" })
          }
          colors={colors}
        />
      </FieldRow>

      {/* Height */}
      <FieldRow label="Height" colors={colors}>
        <SmartSizeInput
          keyword={heightKeyword(node)}
          px={pxFromNode("height", node)}
          onKeywordChange={(k) => {
            if (k === "FIXED") {
              onUpdate({
                layoutSizingVertical: "FIXED",
                height: pxFromNode("height", node) ?? 40,
              });
            } else {
              onUpdate({ layoutSizingVertical: k, height: undefined });
            }
          }}
          onPxChange={(v) =>
            onUpdate({ height: v, layoutSizingVertical: "FIXED" })
          }
          colors={colors}
        />
      </FieldRow>

      {/* Opacity */}
      <FieldRow label="Opacity" colors={colors}>
        <input
          type="number"
          min={0}
          max={1}
          step={0.05}
          value={node.opacity ?? 1}
          onInput={(e) =>
            onUpdate({
              opacity: parseFloat((e.target as HTMLInputElement).value),
            })
          }
          style={inputStyle(colors)}
        />
      </FieldRow>

      {/* Fill */}
      <FieldRow label="Fill" colors={colors}>
        {hasMultiFill ? (
          <div
            style={{
              fontSize: "10px",
              color: colors.textMuted,
              padding: "3px 0",
            }}
          >
            Multi-fill — only first shown
          </div>
        ) : null}
        {hasFill ? (
          <HexColorInput
            value={fillHex}
            onChange={(hex) => onUpdate({ fills: patchFill(node.fills, hex) })}
            colors={colors}
          />
        ) : (
          <button
            onClick={() => onUpdate({ fills: ["#000000"] })}
            style={{
              border: `1px dashed ${colors.border}`,
              background: "transparent",
              color: colors.textMuted,
              fontSize: "10px",
              fontFamily: "inherit",
              borderRadius: "4px",
              padding: "2px 6px",
              cursor: "pointer",
            }}
          >
            + Add fill
          </button>
        )}
      </FieldRow>
    </div>
  );
}
