import { h } from "preact";

import type { ComponentSetJSON } from "../../../schema";
import type { ColorTokens } from "../../tokens";
import { SectionHeader } from "./shared/SectionHeader";

interface VariantsListProps {
  componentSet: ComponentSetJSON;
  selectedVariantIndex: number | null;
  onSelectVariant: (i: number) => void;
  colors: ColorTokens;
}

function variantLabel(properties: Record<string, string>): string {
  return Object.values(properties).join(" / ") || "Default";
}

export function VariantsList({
  componentSet,
  selectedVariantIndex,
  onSelectVariant,
  colors,
}: VariantsListProps) {
  return (
    <div>
      <SectionHeader
        title={`Variants (${componentSet.variants.length})`}
        colors={colors}
      />

      {componentSet.variants.length === 0 && (
        <div
          style={{
            fontSize: "11px",
            color: colors.textMuted,
            padding: "6px 0",
          }}
        >
          No variants. Add property axes above to generate variants.
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          maxHeight: "120px",
          overflowY: "auto",
        }}
      >
        {componentSet.variants.map((variant, i) => {
          const selected = selectedVariantIndex === i;
          return (
            <button
              key={i}
              onClick={() => onSelectVariant(i)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                textAlign: "left",
                border: "none",
                borderRadius: "4px",
                padding: "5px 8px",
                background: selected ? colors.accentMuted : "transparent",
                color: selected ? colors.accent : colors.text,
                fontSize: "11px",
                fontFamily: "inherit",
                cursor: "pointer",
                fontWeight: selected ? 500 : 400,
              }}
            >
              <span
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {variantLabel(variant.properties)}
              </span>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: "9px",
                  color: colors.textMuted,
                  marginLeft: "6px",
                }}
              >
                {variant.node.type}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
