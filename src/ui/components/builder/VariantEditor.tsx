import { h, Fragment } from "preact";

import type {
  ComponentSetJSON,
  FrameNodeJSON,
  NodeJSON,
  TextNodeJSON,
} from "../../../schema";
import type { ColorTokens } from "../../tokens";
import { FieldRow } from "./shared/FieldRow";
import { HexColorInput } from "./shared/HexColorInput";
import { inputStyle } from "./shared/inputStyle";

interface VariantEditorProps {
  componentSet: ComponentSetJSON;
  variantIndex: number;
  onBuilderChange: (
    updater: (prev: ComponentSetJSON) => ComponentSetJSON,
  ) => void;
  colors: ColorTokens;
}

type NodeType = "FRAME" | "TEXT" | "RECTANGLE" | "ELLIPSE";
type LayoutMode = "NONE" | "HORIZONTAL" | "VERTICAL";
type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

function firstFillHex(fills: unknown[] | undefined): string {
  if (!fills || fills.length === 0) return "";
  const first = fills[0];
  if (typeof first === "string") return first;
  if (
    typeof first === "object" &&
    first !== null &&
    "type" in first &&
    (first as { type: string }).type === "SOLID"
  ) {
    const s = first as unknown as { r: number; g: number; b: number };
    const r = Math.round(s.r * 255);
    const g = Math.round(s.g * 255);
    const b = Math.round(s.b * 255);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
  return "";
}

function hasFills(node: NodeJSON): boolean {
  return (node.fills?.length ?? 0) > 0;
}

function hasMultiFill(node: NodeJSON): boolean {
  return (node.fills?.length ?? 0) > 1;
}

function patchVariantNode(
  prev: ComponentSetJSON,
  variantIndex: number,
  patch: Partial<NodeJSON>,
): ComponentSetJSON {
  const variants = [...prev.variants];
  const v = variants[variantIndex];
  variants[variantIndex] = { ...v, node: { ...v.node, ...patch } as NodeJSON };
  return { ...prev, variants };
}

function defaultNodeForType(type: NodeType): NodeJSON {
  switch (type) {
    case "FRAME":
      return {
        type: "FRAME",
        name: "Frame",
        layoutMode: "NONE",
        fills: [],
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        itemSpacing: 0,
      };
    case "TEXT":
      return {
        type: "TEXT",
        name: "Text",
        characters: "Text",
        fills: ["#000000"],
      };
    case "RECTANGLE":
      return {
        type: "RECTANGLE",
        name: "Rect",
        width: 100,
        height: 40,
        fills: [],
      };
    case "ELLIPSE":
      return {
        type: "ELLIPSE",
        name: "Ellipse",
        width: 40,
        height: 40,
        fills: [],
      };
  }
}

export function VariantEditor({
  componentSet,
  variantIndex,
  onBuilderChange,
  colors,
}: VariantEditorProps) {
  const variant = componentSet.variants[variantIndex];
  if (!variant) return null;

  const node = variant.node;
  const isFrame = node.type === "FRAME";
  const isText = node.type === "TEXT";
  const frameNode = isFrame ? (node as FrameNodeJSON) : null;
  const textNode = isText ? (node as TextNodeJSON) : null;
  const hasAL =
    frameNode?.layoutMode === "HORIZONTAL" ||
    frameNode?.layoutMode === "VERTICAL";

  function patch(p: Partial<NodeJSON>) {
    onBuilderChange((prev) => patchVariantNode(prev, variantIndex, p));
  }

  function changeType(type: NodeType) {
    if (type === node.type) return;
    onBuilderChange((prev) => {
      const variants = [...prev.variants];
      variants[variantIndex] = {
        ...variants[variantIndex],
        node: defaultNodeForType(type),
      };
      return { ...prev, variants };
    });
  }

  const fillHex = firstFillHex(node.fills);

  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: "8px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      {/* Variant label */}
      <div
        style={{
          fontSize: "10px",
          fontWeight: 600,
          color: colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "2px",
        }}
      >
        {Object.values(variant.properties).join(" / ") || "Default"}
      </div>

      {/* Node type */}
      <FieldRow label="Type" colors={colors}>
        <select
          value={node.type}
          onChange={(e) =>
            changeType((e.target as HTMLSelectElement).value as NodeType)
          }
          style={inputStyle(colors)}
        >
          <option value="FRAME">Frame</option>
          <option value="TEXT">Text</option>
          <option value="RECTANGLE">Rectangle</option>
          <option value="ELLIPSE">Ellipse</option>
        </select>
      </FieldRow>

      {/* Fill */}
      <FieldRow label="Fill" colors={colors}>
        {hasMultiFill(node) && (
          <div
            style={{
              fontSize: "10px",
              color: colors.textMuted,
              marginBottom: "3px",
            }}
          >
            Multi-fill — first shown
          </div>
        )}
        {hasFills(node) ? (
          <HexColorInput
            value={fillHex || "#000000"}
            onChange={(hex) =>
              patch({ fills: [hex, ...(node.fills?.slice(1) ?? [])] })
            }
            colors={colors}
          />
        ) : (
          <button
            onClick={() => patch({ fills: ["#000000"] })}
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

      {/* Width / Height (simple number for FIXED) */}
      <FieldRow label="Width" colors={colors}>
        <input
          type="number"
          min={0}
          placeholder="auto"
          value={typeof node.width === "number" ? node.width : ""}
          onInput={(e) => {
            const v = (e.target as HTMLInputElement).value;
            patch({ width: v === "" ? undefined : parseFloat(v) });
          }}
          style={inputStyle(colors)}
        />
      </FieldRow>

      <FieldRow label="Height" colors={colors}>
        <input
          type="number"
          min={0}
          placeholder="auto"
          value={typeof node.height === "number" ? node.height : ""}
          onInput={(e) => {
            const v = (e.target as HTMLInputElement).value;
            patch({ height: v === "" ? undefined : parseFloat(v) });
          }}
          style={inputStyle(colors)}
        />
      </FieldRow>

      {/* Frame-specific */}
      {isFrame && frameNode && (
        <>
          <FieldRow label="Layout" colors={colors}>
            <select
              value={frameNode.layoutMode ?? "NONE"}
              onChange={(e) =>
                patch({
                  layoutMode: (e.target as HTMLSelectElement)
                    .value as LayoutMode,
                })
              }
              style={inputStyle(colors)}
            >
              <option value="NONE">None</option>
              <option value="HORIZONTAL">Horizontal</option>
              <option value="VERTICAL">Vertical</option>
            </select>
          </FieldRow>

          {hasAL && (
            <FieldRow label="Gap" colors={colors}>
              <input
                type="number"
                min={0}
                value={frameNode.itemSpacing ?? 0}
                onInput={(e) =>
                  patch({
                    itemSpacing: parseFloat(
                      (e.target as HTMLInputElement).value,
                    ),
                  })
                }
                style={inputStyle(colors)}
              />
            </FieldRow>
          )}

          <FieldRow label="Radius" colors={colors}>
            <input
              type="number"
              min={0}
              value={frameNode.cornerRadius ?? 0}
              onInput={(e) =>
                patch({
                  cornerRadius: parseFloat(
                    (e.target as HTMLInputElement).value,
                  ),
                })
              }
              style={inputStyle(colors)}
            />
          </FieldRow>
        </>
      )}

      {/* Text-specific */}
      {isText && textNode && (
        <>
          <FieldRow label="Text" colors={colors}>
            <input
              type="text"
              value={textNode.characters}
              onInput={(e) =>
                patch({ characters: (e.target as HTMLInputElement).value })
              }
              style={inputStyle(colors)}
            />
          </FieldRow>

          <FieldRow label="Size" colors={colors}>
            <input
              type="number"
              min={1}
              value={textNode.fontSize ?? 12}
              onInput={(e) =>
                patch({
                  fontSize: parseFloat((e.target as HTMLInputElement).value),
                })
              }
              style={inputStyle(colors)}
            />
          </FieldRow>

          <FieldRow label="Weight" colors={colors}>
            <select
              value={textNode.fontWeight ?? 400}
              onChange={(e) =>
                patch({
                  fontWeight: parseInt(
                    (e.target as HTMLSelectElement).value,
                    10,
                  ) as FontWeight,
                })
              }
              style={inputStyle(colors)}
            >
              <option value={300}>Light</option>
              <option value={400}>Regular</option>
              <option value={500}>Medium</option>
              <option value={600}>SemiBold</option>
              <option value={700}>Bold</option>
            </select>
          </FieldRow>
        </>
      )}

      {/* Opacity */}
      {node.opacity !== undefined && node.opacity !== 1 && (
        <FieldRow label="Opacity" colors={colors}>
          <input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={node.opacity}
            onInput={(e) =>
              patch({
                opacity: parseFloat((e.target as HTMLInputElement).value),
              })
            }
            style={inputStyle(colors)}
          />
        </FieldRow>
      )}
    </div>
  );
}
