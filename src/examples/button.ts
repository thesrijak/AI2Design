import type { ComponentSetJSON } from "../schema";

// Clay accent palette
const CLAY = "#D97757";
const CLAY_HOVER = "#C36240";
const CLAY_PRESSED = "#AE5535";
const DISABLED_BG = "#E5E7EB";
const DISABLED_TEXT = "#9CA3AF";
const WHITE = "#FFFFFF";

type ButtonSize = {
  padding: { top: number; right: number; bottom: number; left: number };
  fontSize: number;
  cornerRadius: number;
};

const sizes: Record<string, ButtonSize> = {
  Sm: {
    padding: { top: 6, right: 12, bottom: 6, left: 12 },
    fontSize: 12,
    cornerRadius: 7,
  },
  Md: {
    padding: { top: 10, right: 16, bottom: 10, left: 16 },
    fontSize: 13,
    cornerRadius: 9,
  },
  Lg: {
    padding: { top: 13, right: 20, bottom: 13, left: 20 },
    fontSize: 14,
    cornerRadius: 10,
  },
};

const states: Record<string, { bg: string; text: string; opacity?: number }> = {
  Default: { bg: CLAY, text: WHITE },
  Hover: { bg: CLAY_HOVER, text: WHITE },
  Pressed: { bg: CLAY_PRESSED, text: WHITE },
  Disabled: { bg: DISABLED_BG, text: DISABLED_TEXT, opacity: 1 },
};

function makeVariant(state: string, size: string) {
  const s = sizes[size];
  const st = states[state];
  return {
    properties: { State: state, Size: size },
    node: {
      name: "Button",
      type: "FRAME" as const,
      layoutMode: "HORIZONTAL" as const,
      primaryAxisAlignItems: "CENTER" as const,
      counterAxisAlignItems: "CENTER" as const,
      layoutSizingHorizontal: "HUG" as const,
      layoutSizingVertical: "HUG" as const,
      padding: s.padding,
      itemSpacing: 6,
      cornerRadius: s.cornerRadius,
      fills: [st.bg],
      ...(st.opacity !== undefined ? { opacity: st.opacity } : {}),
      effects:
        state === "Disabled"
          ? []
          : [
              {
                type: "DROP_SHADOW" as const,
                color: { r: 0.851, g: 0.467, b: 0.341, a: 0.22 },
                offset: { x: 0, y: 2 },
                blur: 6,
                spread: 0,
              },
            ],
      children: [
        {
          name: "Label",
          type: "TEXT" as const,
          characters: "Continue",
          fontSize: s.fontSize,
          fontWeight: 600 as const,
          fills: [st.text],
        },
      ],
    },
  };
}

export const buttonExample: ComponentSetJSON = {
  name: "Button",
  type: "COMPONENT_SET",
  description: "Primary action button. State × Size variants with clay accent.",
  variantProperties: {
    State: ["Default", "Hover", "Pressed", "Disabled"],
    Size: ["Sm", "Md", "Lg"],
  },
  variants: [
    makeVariant("Default", "Sm"),
    makeVariant("Hover", "Sm"),
    makeVariant("Pressed", "Sm"),
    makeVariant("Disabled", "Sm"),
    makeVariant("Default", "Md"),
    makeVariant("Hover", "Md"),
    makeVariant("Pressed", "Md"),
    makeVariant("Disabled", "Md"),
    makeVariant("Default", "Lg"),
    makeVariant("Hover", "Lg"),
    makeVariant("Pressed", "Lg"),
    makeVariant("Disabled", "Lg"),
  ],
};
