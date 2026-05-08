import type { ComponentSetJSON } from "../schema";

type State = "On" | "Off" | "Disabled";

const config: Record<
  State,
  { bg: string; knobSide: "MAX" | "MIN"; opacity?: number }
> = {
  On: { bg: "#D97757", knobSide: "MAX" },
  Off: { bg: "#D1D5DB", knobSide: "MIN" },
  Disabled: { bg: "#E5E7EB", knobSide: "MIN", opacity: 0.5 },
};

function makeToggleNode(state: State) {
  const c = config[state];

  return {
    name: "Toggle",
    type: "FRAME" as const,
    width: 44,
    height: 26,
    layoutMode: "HORIZONTAL" as const,
    primaryAxisAlignItems: c.knobSide,
    counterAxisAlignItems: "CENTER" as const,
    layoutSizingHorizontal: "HUG" as const,
    layoutSizingVertical: "HUG" as const,
    padding: { top: 3, right: 3, bottom: 3, left: 3 },
    itemSpacing: 0,
    cornerRadius: 999,
    fills: [c.bg],
    ...(c.opacity !== undefined ? { opacity: c.opacity } : {}),
    children: [
      {
        name: "Knob",
        type: "FRAME" as const,
        width: 20,
        height: 20,
        layoutMode: "HORIZONTAL" as const,
        primaryAxisAlignItems: "CENTER" as const,
        counterAxisAlignItems: "CENTER" as const,
        layoutSizingHorizontal: "HUG" as const,
        layoutSizingVertical: "HUG" as const,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        itemSpacing: 0,
        cornerRadius: 999,
        fills: ["#FFFFFF"],
        effects: [
          {
            type: "DROP_SHADOW" as const,
            color: { r: 0, g: 0, b: 0, a: 0.14 },
            offset: { x: 0, y: 1 },
            blur: 3,
            spread: 0,
          },
        ],
        children: [],
      },
    ],
  };
}

const states: State[] = ["On", "Off", "Disabled"];

export const toggleExample: ComponentSetJSON = {
  name: "Toggle",
  type: "COMPONENT_SET",
  description: "Toggle switch. On, Off, and Disabled states with knob shadow.",
  variantProperties: {
    State: states,
  },
  variants: states.map((state) => ({
    properties: { State: state },
    node: makeToggleNode(state),
  })),
};
