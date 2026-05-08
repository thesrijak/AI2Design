import type { ComponentSetJSON } from "../schema";

type Variant = "Default" | "Elevated" | "Featured";

const config: Record<
  Variant,
  {
    bg: string;
    border: string;
    borderWidth: number;
    badgeBg: string;
    badgeText: string;
    accentColor: string;
  }
> = {
  Default: {
    bg: "#FFFFFF",
    border: "#E5E7EB",
    borderWidth: 1,
    badgeBg: "#F3F4F6",
    badgeText: "#6B7280",
    accentColor: "#D97757",
  },
  Elevated: {
    bg: "#FFFFFF",
    border: "#F3F4F6",
    borderWidth: 1,
    badgeBg: "#FDF3EE",
    badgeText: "#D97757",
    accentColor: "#D97757",
  },
  Featured: {
    bg: "#FDF3EE",
    border: "#F5C8B4",
    borderWidth: 1,
    badgeBg: "#D97757",
    badgeText: "#FFFFFF",
    accentColor: "#AE5535",
  },
};

function makeCardNode(variant: Variant) {
  const c = config[variant];

  const shadow =
    variant === "Elevated"
      ? [
          {
            type: "DROP_SHADOW" as const,
            color: { r: 0, g: 0, b: 0, a: 0.08 },
            offset: { x: 0, y: 4 },
            blur: 16,
            spread: 0,
          },
        ]
      : [
          {
            type: "DROP_SHADOW" as const,
            color: { r: 0, g: 0, b: 0, a: 0.04 },
            offset: { x: 0, y: 1 },
            blur: 4,
            spread: 0,
          },
        ];

  return {
    name: "Card",
    type: "FRAME" as const,
    width: 300,
    layoutMode: "VERTICAL" as const,
    primaryAxisAlignItems: "MIN" as const,
    counterAxisAlignItems: "MIN" as const,
    layoutSizingHorizontal: "FIXED" as const,
    layoutSizingVertical: "HUG" as const,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    itemSpacing: 0,
    cornerRadius: 14,
    fills: [c.bg],
    strokes: [c.border],
    strokeWeight: c.borderWidth,
    strokePosition: "INSIDE" as const,
    effects: shadow,
    clipsContent: true,
    children: [
      // Cover image placeholder
      {
        name: "Cover",
        type: "RECTANGLE" as const,
        width: 300,
        height: 148,
        fills: [
          {
            type: "LINEAR_GRADIENT" as const,
            angle: 160,
            stops: [
              { r: 0.949, g: 0.918, b: 0.906, a: 1, position: 0 },
              { r: 0.918, g: 0.878, b: 0.859, a: 1, position: 1 },
            ],
          },
        ],
      },
      // Body
      {
        name: "Body",
        type: "FRAME" as const,
        layoutMode: "VERTICAL" as const,
        primaryAxisAlignItems: "MIN" as const,
        counterAxisAlignItems: "MIN" as const,
        layoutSizingHorizontal: "FILL" as const,
        layoutSizingVertical: "HUG" as const,
        padding: { top: 16, right: 18, bottom: 18, left: 18 },
        itemSpacing: 10,
        fills: [],
        children: [
          // Category badge
          {
            name: "Category",
            type: "FRAME" as const,
            layoutMode: "HORIZONTAL" as const,
            primaryAxisAlignItems: "CENTER" as const,
            counterAxisAlignItems: "CENTER" as const,
            layoutSizingHorizontal: "HUG" as const,
            layoutSizingVertical: "HUG" as const,
            padding: { top: 3, right: 9, bottom: 3, left: 9 },
            itemSpacing: 0,
            cornerRadius: 999,
            fills: [c.badgeBg],
            children: [
              {
                name: "CategoryLabel",
                type: "TEXT" as const,
                characters: "Design System",
                fontSize: 10,
                fontWeight: 600 as const,
                fills: [c.badgeText],
              },
            ],
          },
          // Title — FILL so it wraps within the Body width
          {
            name: "Title",
            type: "TEXT" as const,
            characters: "Build better UI components faster",
            fontSize: 15,
            fontWeight: 600 as const,
            fills: ["#111827"],
            lineHeight: { unit: "PIXELS" as const, value: 22 },
            layoutSizingHorizontal: "FILL" as const,
          },
          // Description — FILL so it wraps within the Body width
          {
            name: "Description",
            type: "TEXT" as const,
            characters:
              "Define your components in JSON and generate production-ready Figma variants in seconds.",
            fontSize: 12,
            fontWeight: 400 as const,
            fills: ["#6B7280"],
            lineHeight: { unit: "PIXELS" as const, value: 18 },
            layoutSizingHorizontal: "FILL" as const,
          },
          // Footer row — FILL so it stretches to Body's width and
          // SPACE_BETWEEN pushes "Read more" to the far right.
          {
            name: "Footer",
            type: "FRAME" as const,
            layoutMode: "HORIZONTAL" as const,
            primaryAxisAlignItems: "SPACE_BETWEEN" as const,
            counterAxisAlignItems: "CENTER" as const,
            layoutSizingHorizontal: "FILL" as const,
            layoutSizingVertical: "HUG" as const,
            padding: { top: 4, right: 0, bottom: 0, left: 0 },
            itemSpacing: 0,
            fills: [],
            children: [
              // Author row
              {
                name: "Author",
                type: "FRAME" as const,
                layoutMode: "HORIZONTAL" as const,
                primaryAxisAlignItems: "MIN" as const,
                counterAxisAlignItems: "CENTER" as const,
                layoutSizingHorizontal: "HUG" as const,
                layoutSizingVertical: "HUG" as const,
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                itemSpacing: 8,
                fills: [],
                children: [
                  // Avatar — FIXED 28×28. layoutMode causes Figma to default to HUG,
                  // so we must explicitly set FIXED to keep the circle dimensions.
                  {
                    name: "Avatar",
                    type: "FRAME" as const,
                    width: 28,
                    height: 28,
                    layoutSizingHorizontal: "FIXED" as const,
                    layoutSizingVertical: "FIXED" as const,
                    layoutMode: "HORIZONTAL" as const,
                    primaryAxisAlignItems: "CENTER" as const,
                    counterAxisAlignItems: "CENTER" as const,
                    padding: { top: 0, right: 0, bottom: 0, left: 0 },
                    itemSpacing: 0,
                    cornerRadius: 999,
                    fills: [c.badgeBg],
                    children: [
                      {
                        name: "Initials",
                        type: "TEXT" as const,
                        characters: "S",
                        fontSize: 10,
                        fontWeight: 600 as const,
                        fills: [c.badgeText],
                      },
                    ],
                  },
                  {
                    name: "AuthorName",
                    type: "TEXT" as const,
                    characters: "Srijak",
                    fontSize: 12,
                    fontWeight: 500 as const,
                    fills: ["#374151"],
                  },
                ],
              },
              // Read more link
              {
                name: "ReadMore",
                type: "TEXT" as const,
                characters: "Read more →",
                fontSize: 12,
                fontWeight: 500 as const,
                fills: [c.accentColor],
              },
            ],
          },
        ],
      },
    ],
  };
}

const variants: Variant[] = ["Default", "Elevated", "Featured"];

export const cardExample: ComponentSetJSON = {
  name: "Card",
  type: "COMPONENT_SET",
  description:
    "Content card with cover, category badge, title, description, and footer.",
  variantProperties: {
    Variant: variants,
  },
  variants: variants.map((variant) => ({
    properties: { Variant: variant },
    node: makeCardNode(variant),
  })),
};
