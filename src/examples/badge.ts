import type { ComponentSetJSON } from "../schema";

// Status colour palette
const palette = {
  Neutral: { bg: "#F3F4F6", dot: "#9CA3AF", text: "#374151" },
  Success: { bg: "#DCFCE7", dot: "#16A34A", text: "#15803D" },
  Warning: { bg: "#FEF9C3", dot: "#CA8A04", text: "#A16207" },
  Error: { bg: "#FEE2E2", dot: "#DC2626", text: "#B91C1C" },
  Info: { bg: "#DBEAFE", dot: "#2563EB", text: "#1D4ED8" },
} as const;

type Status = keyof typeof palette;
type Style = "Solid" | "Outline";

function makeBadgeNode(status: Status, style: Style) {
  const p = palette[status];
  const isOutline = style === "Outline";

  return {
    name: "Badge",
    type: "FRAME" as const,
    layoutMode: "HORIZONTAL" as const,
    primaryAxisAlignItems: "CENTER" as const,
    counterAxisAlignItems: "CENTER" as const,
    layoutSizingHorizontal: "HUG" as const,
    layoutSizingVertical: "HUG" as const,
    padding: { top: 3, right: 9, bottom: 3, left: 7 },
    itemSpacing: 5,
    cornerRadius: 999,
    fills: isOutline ? [] : [p.bg],
    strokes: isOutline ? [p.dot] : [],
    strokeWeight: isOutline ? 1 : 0,
    strokePosition: "INSIDE" as const,
    children: [
      // Status dot
      {
        name: "Dot",
        type: "ELLIPSE" as const,
        width: 6,
        height: 6,
        fills: [p.dot],
      },
      // Label
      {
        name: "Label",
        type: "TEXT" as const,
        characters: status,
        fontSize: 11,
        fontWeight: 500 as const,
        fills: [p.text],
      },
    ],
  };
}

const statuses: Status[] = ["Neutral", "Success", "Warning", "Error", "Info"];
const styles: Style[] = ["Solid", "Outline"];

export const badgeExample: ComponentSetJSON = {
  name: "Badge",
  type: "COMPONENT_SET",
  description: "Status badge. Status × Style variants with semantic colours.",
  variantProperties: {
    Status: statuses,
    Style: styles,
  },
  variants: statuses.flatMap((status) =>
    styles.map((style) => ({
      properties: { Status: status, Style: style },
      node: makeBadgeNode(status, style),
    })),
  ),
};
