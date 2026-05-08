import type { ComponentSetJSON } from "../schema";

type State = "Default" | "Focused" | "Filled" | "Error" | "Disabled";

const config: Record<
  State,
  {
    bg: string;
    border: string;
    borderWidth: number;
    labelColor: string;
    valueColor: string;
    helperColor: string;
    helper: string;
    value: string;
    opacity?: number;
  }
> = {
  Default: {
    bg: "#FFFFFF",
    border: "#D1D5DB",
    borderWidth: 1,
    labelColor: "#374151",
    valueColor: "#9CA3AF",
    helperColor: "#9CA3AF",
    helper: "Use your work email address",
    value: "Email address",
  },
  Focused: {
    bg: "#FFFFFF",
    border: "#D97757",
    borderWidth: 1.5,
    labelColor: "#D97757",
    valueColor: "#9CA3AF",
    helperColor: "#9CA3AF",
    helper: "Use your work email address",
    value: "Email address",
  },
  Filled: {
    bg: "#FFFFFF",
    border: "#D1D5DB",
    borderWidth: 1,
    labelColor: "#374151",
    valueColor: "#111827",
    helperColor: "#9CA3AF",
    helper: "Use your work email address",
    value: "alex@company.com",
  },
  Error: {
    bg: "#FFF8F8",
    border: "#DC2626",
    borderWidth: 1.5,
    labelColor: "#DC2626",
    valueColor: "#111827",
    helperColor: "#DC2626",
    helper: "That email address isn't valid",
    value: "alex@",
  },
  Disabled: {
    bg: "#F9FAFB",
    border: "#E5E7EB",
    borderWidth: 1,
    labelColor: "#9CA3AF",
    valueColor: "#9CA3AF",
    helperColor: "#D1D5DB",
    helper: "Use your work email address",
    value: "Email address",
    opacity: 0.7,
  },
};

function makeInputNode(state: State) {
  const c = config[state];

  return {
    name: "Input",
    type: "FRAME" as const,
    layoutMode: "VERTICAL" as const,
    primaryAxisAlignItems: "MIN" as const,
    counterAxisAlignItems: "MIN" as const,
    layoutSizingHorizontal: "HUG" as const,
    layoutSizingVertical: "HUG" as const,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    itemSpacing: 6,
    fills: [],
    ...(c.opacity !== undefined ? { opacity: c.opacity } : {}),
    children: [
      // Label
      {
        name: "Label",
        type: "TEXT" as const,
        characters: "Email address",
        fontSize: 12,
        fontWeight: 500 as const,
        fills: [c.labelColor],
      },
      // Field
      {
        name: "Field",
        type: "FRAME" as const,
        width: 280,
        layoutMode: "HORIZONTAL" as const,
        primaryAxisAlignItems: "MIN" as const,
        counterAxisAlignItems: "CENTER" as const,
        layoutSizingHorizontal: "HUG" as const,
        layoutSizingVertical: "HUG" as const,
        padding: { top: 10, right: 12, bottom: 10, left: 12 },
        itemSpacing: 8,
        cornerRadius: 8,
        fills: [c.bg],
        strokes: [c.border],
        strokeWeight: c.borderWidth,
        strokePosition: "INSIDE" as const,
        children: [
          {
            name:
              state === "Filled" || state === "Error" ? "Value" : "Placeholder",
            type: "TEXT" as const,
            characters: c.value,
            fontSize: 13,
            fills: [c.valueColor],
          },
        ],
      },
      // Helper / error text
      {
        name: state === "Error" ? "Error" : "Helper",
        type: "TEXT" as const,
        characters: c.helper,
        fontSize: 11,
        fills: [c.helperColor],
      },
    ],
  };
}

const states: State[] = ["Default", "Focused", "Filled", "Error", "Disabled"];

export const inputExample: ComponentSetJSON = {
  name: "Input",
  type: "COMPONENT_SET",
  description: "Text input field with label and helper text. State variants.",
  variantProperties: {
    State: states,
  },
  variants: states.map((state) => ({
    properties: { State: state },
    node: makeInputNode(state),
  })),
};
