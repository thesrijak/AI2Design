import type { ComponentSetJSON } from "../schema";

export const customExample: ComponentSetJSON = {
  name: "Custom",
  type: "COMPONENT_SET",
  variantProperties: {
    Variant: ["Default"],
  },
  variants: [
    {
      properties: {
        Variant: "Default",
      },
      node: {
        name: "Custom",
        type: "FRAME",
        layoutMode: "HORIZONTAL",
        itemSpacing: 8,
        children: [],
      },
    },
  ],
};
