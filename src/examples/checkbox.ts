import type { ComponentSetJSON } from "../schema";

type State = "Unchecked" | "Checked" | "Indeterminate" | "Disabled";

const BOX_SIZE = 18;

const config: Record<
  State,
  {
    bg: string;
    border: string;
    borderWidth: number;
    showCheck: boolean;
    showDash: boolean;
    labelColor: string;
    opacity?: number;
  }
> = {
  Unchecked: {
    bg: "#FFFFFF",
    border: "#D1D5DB",
    borderWidth: 1.5,
    showCheck: false,
    showDash: false,
    labelColor: "#111827",
  },
  Checked: {
    bg: "#D97757",
    border: "#D97757",
    borderWidth: 0,
    showCheck: true,
    showDash: false,
    labelColor: "#111827",
  },
  Indeterminate: {
    bg: "#D97757",
    border: "#D97757",
    borderWidth: 0,
    showCheck: false,
    showDash: true,
    labelColor: "#111827",
  },
  Disabled: {
    bg: "#F3F4F6",
    border: "#E5E7EB",
    borderWidth: 1.5,
    showCheck: false,
    showDash: false,
    labelColor: "#9CA3AF",
    opacity: 0.55,
  },
};

function makeCheckboxNode(state: State) {
  const c = config[state];

  const innerChildren: ComponentSetJSON["variants"][number]["node"]["children"] =
    [];

  if (c.showCheck) {
    innerChildren.push({
      name: "Check",
      type: "TEXT" as const,
      characters: "✓",
      fontSize: 11,
      fontWeight: 700 as const,
      fills: ["#FFFFFF"],
    });
  } else if (c.showDash) {
    innerChildren.push({
      name: "Dash",
      type: "RECTANGLE" as const,
      width: 8,
      height: 2,
      cornerRadius: 1,
      fills: ["#FFFFFF"],
    });
  }

  const boxNode = {
    name: "Box",
    type: "FRAME" as const,
    width: BOX_SIZE,
    height: BOX_SIZE,
    // FIXED keeps the 18×18 square — without this, Figma defaults to HUG
    // when layoutMode is set, collapsing or expanding unpredictably.
    layoutSizingHorizontal: "FIXED" as const,
    layoutSizingVertical: "FIXED" as const,
    layoutMode: "HORIZONTAL" as const,
    primaryAxisAlignItems: "CENTER" as const,
    counterAxisAlignItems: "CENTER" as const,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    itemSpacing: 0,
    cornerRadius: 5,
    fills: [c.bg],
    strokes: c.borderWidth > 0 ? [c.border] : [],
    strokeWeight: c.borderWidth,
    strokePosition: "INSIDE" as const,
    children: innerChildren,
  };

  return {
    name: "Checkbox",
    type: "FRAME" as const,
    layoutMode: "HORIZONTAL" as const,
    primaryAxisAlignItems: "MIN" as const,
    counterAxisAlignItems: "CENTER" as const,
    layoutSizingHorizontal: "HUG" as const,
    layoutSizingVertical: "HUG" as const,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    itemSpacing: 9,
    fills: [],
    ...(c.opacity !== undefined ? { opacity: c.opacity } : {}),
    children: [
      boxNode,
      {
        name: "Label",
        type: "TEXT" as const,
        characters: "Accept terms and conditions",
        fontSize: 13,
        fontWeight: 400 as const,
        fills: [c.labelColor],
      },
    ],
  };
}

const states: State[] = ["Unchecked", "Checked", "Indeterminate", "Disabled"];

export const checkboxExample: ComponentSetJSON = {
  name: "Checkbox",
  type: "COMPONENT_SET",
  description:
    "Checkbox with label. Unchecked, Checked, Indeterminate, and Disabled states.",
  variantProperties: {
    State: states,
  },
  variants: states.map((state) => ({
    properties: { State: state },
    node: makeCheckboxNode(state),
  })),
};
