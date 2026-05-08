import type { ComponentSetJSON } from "../schema";

/**
 * Starter template shown when the user selects "Custom".
 * Minimal but valid schema — easy to extend.
 */
export const customExample: ComponentSetJSON = {
  name: "MyComponent",
  type: "COMPONENT_SET",
  description: "Replace this with your own component schema.",
  variantProperties: {
    Variant: ["Default", "Hover"],
  },
  variants: [
    {
      properties: { Variant: "Default" },
      node: {
        name: "MyComponent",
        type: "FRAME",
        layoutMode: "HORIZONTAL",
        primaryAxisAlignItems: "CENTER",
        counterAxisAlignItems: "CENTER",
        layoutSizingHorizontal: "HUG",
        layoutSizingVertical: "HUG",
        padding: { top: 12, right: 20, bottom: 12, left: 20 },
        itemSpacing: 8,
        cornerRadius: 10,
        fills: ["#F3F4F6"],
        strokes: ["#E5E7EB"],
        strokeWeight: 1,
        strokePosition: "INSIDE",
        children: [
          {
            name: "Label",
            type: "TEXT",
            characters: "Default",
            fontSize: 13,
            fontWeight: 500,
            fills: ["#374151"],
          },
        ],
      },
    },
    {
      properties: { Variant: "Hover" },
      node: {
        name: "MyComponent",
        type: "FRAME",
        layoutMode: "HORIZONTAL",
        primaryAxisAlignItems: "CENTER",
        counterAxisAlignItems: "CENTER",
        layoutSizingHorizontal: "HUG",
        layoutSizingVertical: "HUG",
        padding: { top: 12, right: 20, bottom: 12, left: 20 },
        itemSpacing: 8,
        cornerRadius: 10,
        fills: ["#E5E7EB"],
        strokes: ["#D1D5DB"],
        strokeWeight: 1,
        strokePosition: "INSIDE",
        children: [
          {
            name: "Label",
            type: "TEXT",
            characters: "Hover",
            fontSize: 13,
            fontWeight: 500,
            fills: ["#111827"],
          },
        ],
      },
    },
  ],
};
