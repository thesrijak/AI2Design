import { h } from "preact";
import { useState } from "preact/hooks";

import type { ComponentSetJSON, NodeJSON } from "../../../schema";
import type { ColorTokens } from "../../tokens";
import { SectionHeader } from "./shared/SectionHeader";
import { inputStyle } from "./shared/inputStyle";

interface VariantPropertiesEditorProps {
  componentSet: ComponentSetJSON;
  onBuilderChange: (
    updater: (prev: ComponentSetJSON) => ComponentSetJSON,
  ) => void;
  colors: ColorTokens;
}

/** Compute cartesian product of all axis values */
function cartesian(props: Record<string, string[]>): Record<string, string>[] {
  const axes = Object.keys(props);
  if (axes.length === 0) return [];
  return axes.reduce<Record<string, string>[]>(
    (acc, axis) =>
      acc.flatMap((combo) =>
        props[axis].map((val) => ({ ...combo, [axis]: val })),
      ),
    [{}],
  );
}

function comboKey(props: Record<string, string>): string {
  return Object.keys(props)
    .sort()
    .map((k) => `${k}=${props[k]}`)
    .join(";");
}

/** Reconcile variants to match new variantProperties */
function reconcileVariants(
  variants: ComponentSetJSON["variants"],
  newProps: Record<string, string[]>,
): ComponentSetJSON["variants"] {
  const product = cartesian(newProps);
  const existingByKey = new Map(
    variants.map((v) => [comboKey(v.properties), v]),
  );

  const defaultNode: NodeJSON = {
    type: "FRAME",
    name: "Variant",
    layoutMode: "NONE",
    fills: [],
  };

  return product.map((combo) => {
    const existing = existingByKey.get(comboKey(combo));
    if (existing) return { ...existing, properties: combo };
    return { properties: combo, node: defaultNode };
  });
}

export function VariantPropertiesEditor({
  componentSet,
  onBuilderChange,
  colors,
}: VariantPropertiesEditorProps) {
  const [newAxisName, setNewAxisName] = useState("");

  const axes = Object.keys(componentSet.variantProperties);

  function addAxis() {
    const name = newAxisName.trim();
    if (!name || name in componentSet.variantProperties) return;
    onBuilderChange((prev) => {
      const newProps = { ...prev.variantProperties, [name]: ["Default"] };
      return {
        ...prev,
        variantProperties: newProps,
        variants: reconcileVariants(prev.variants, newProps),
      };
    });
    setNewAxisName("");
  }

  function removeAxis(axis: string) {
    onBuilderChange((prev) => {
      const newProps = { ...prev.variantProperties };
      delete newProps[axis];
      return {
        ...prev,
        variantProperties: newProps,
        variants: reconcileVariants(prev.variants, newProps),
      };
    });
  }

  function addValue(axis: string) {
    onBuilderChange((prev) => {
      const existing = prev.variantProperties[axis] ?? [];
      const next = `Value ${existing.length + 1}`;
      const newProps = {
        ...prev.variantProperties,
        [axis]: [...existing, next],
      };
      return {
        ...prev,
        variantProperties: newProps,
        variants: reconcileVariants(prev.variants, newProps),
      };
    });
  }

  function renameValue(axis: string, idx: number, newVal: string) {
    onBuilderChange((prev) => {
      const updated = [...(prev.variantProperties[axis] ?? [])];
      updated[idx] = newVal;
      const newProps = { ...prev.variantProperties, [axis]: updated };
      return {
        ...prev,
        variantProperties: newProps,
        variants: reconcileVariants(prev.variants, newProps),
      };
    });
  }

  function removeValue(axis: string, idx: number) {
    onBuilderChange((prev) => {
      const updated = [...(prev.variantProperties[axis] ?? [])];
      if (updated.length <= 1) return prev; // must keep at least one value
      updated.splice(idx, 1);
      const newProps = { ...prev.variantProperties, [axis]: updated };
      return {
        ...prev,
        variantProperties: newProps,
        variants: reconcileVariants(prev.variants, newProps),
      };
    });
  }

  return (
    <div>
      <SectionHeader title="Variant Properties" colors={colors} />

      {axes.length === 0 && (
        <div
          style={{
            fontSize: "11px",
            color: colors.textMuted,
            padding: "6px 0",
          }}
        >
          No axes yet. Add one below.
        </div>
      )}

      {axes.map((axis) => (
        <div
          key={axis}
          style={{
            marginBottom: "8px",
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: "6px",
            padding: "8px",
          }}
        >
          {/* Axis header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "6px",
              gap: "6px",
            }}
          >
            <span
              style={{
                flex: 1,
                fontSize: "11px",
                fontWeight: 600,
                color: colors.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {axis}
            </span>
            <button
              onClick={() => addValue(axis)}
              title="Add value"
              style={{
                border: "none",
                background: "transparent",
                color: colors.accent,
                fontSize: "14px",
                lineHeight: 1,
                cursor: "pointer",
                padding: "0 2px",
                fontFamily: "inherit",
              }}
            >
              +
            </button>
            <button
              onClick={() => removeAxis(axis)}
              title="Remove axis"
              style={{
                border: "none",
                background: "transparent",
                color: colors.textMuted,
                fontSize: "13px",
                lineHeight: 1,
                cursor: "pointer",
                padding: "0 2px",
                fontFamily: "inherit",
              }}
            >
              ×
            </button>
          </div>

          {/* Values */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {componentSet.variantProperties[axis].map((val, idx) => (
              <div
                key={idx}
                style={{ display: "flex", gap: "4px", alignItems: "center" }}
              >
                <input
                  type="text"
                  value={val}
                  onBlur={(e) =>
                    renameValue(axis, idx, (e.target as HTMLInputElement).value)
                  }
                  onChange={(e) =>
                    renameValue(axis, idx, (e.target as HTMLInputElement).value)
                  }
                  style={{ ...inputStyle(colors), flex: 1 }}
                />
                <button
                  onClick={() => removeValue(axis, idx)}
                  title="Remove value"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: colors.textMuted,
                    fontSize: "13px",
                    lineHeight: 1,
                    cursor: "pointer",
                    padding: "0 2px",
                    flexShrink: 0,
                    fontFamily: "inherit",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add axis row */}
      <div style={{ display: "flex", gap: "4px" }}>
        <input
          type="text"
          placeholder="New axis name…"
          value={newAxisName}
          onInput={(e) => setNewAxisName((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => e.key === "Enter" && addAxis()}
          style={{ ...inputStyle(colors), flex: 1 }}
        />
        <button
          onClick={addAxis}
          style={{
            flexShrink: 0,
            border: `1px solid ${colors.accent}`,
            background: "transparent",
            color: colors.accent,
            fontSize: "11px",
            fontWeight: 500,
            fontFamily: "inherit",
            borderRadius: "4px",
            padding: "0 8px",
            height: "24px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
