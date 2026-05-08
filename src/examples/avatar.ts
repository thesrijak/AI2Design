import type { ComponentSetJSON } from "../schema";

type Size = "Xs" | "Sm" | "Md" | "Lg" | "Xl";
type Presence = "Online" | "Away" | "Busy" | "Offline";

// circlePad: symmetric padding inside the circle — HUG sizing uses this to
// produce the correct diameter so the initials have comfortable breathing room.
const sizes: Record<
  Size,
  { circlePad: number; font: number; dotSize: number; chipFont: number }
> = {
  Xs: { circlePad: 7, font: 9, dotSize: 5, chipFont: 9 },
  Sm: { circlePad: 10, font: 12, dotSize: 6, chipFont: 10 },
  Md: { circlePad: 13, font: 14, dotSize: 6, chipFont: 10 },
  Lg: { circlePad: 15, font: 17, dotSize: 7, chipFont: 11 },
  Xl: { circlePad: 18, font: 20, dotSize: 8, chipFont: 11 },
};

const presence: Record<
  Presence,
  { dot: string; chipBg: string; chipText: string; label: string }
> = {
  Online: {
    dot: "#16A34A",
    chipBg: "#DCFCE7",
    chipText: "#15803D",
    label: "Online",
  },
  Away: {
    dot: "#D97757",
    chipBg: "#FDE8DC",
    chipText: "#AE5535",
    label: "Away",
  },
  Busy: {
    dot: "#DC2626",
    chipBg: "#FEE2E2",
    chipText: "#B91C1C",
    label: "Busy",
  },
  Offline: {
    dot: "#9CA3AF",
    chipBg: "#F3F4F6",
    chipText: "#6B7280",
    label: "Offline",
  },
};

// Warm avatar gradient — clay-adjacent
const AVATAR_GRADIENT = {
  type: "LINEAR_GRADIENT" as const,
  angle: 145,
  stops: [
    { r: 0.988, g: 0.906, b: 0.863, a: 1, position: 0 }, // #FDE8DC
    { r: 0.973, g: 0.843, b: 0.8, a: 1, position: 1 }, // #F8D7CC
  ],
};

function makeAvatarNode(size: Size, p: Presence) {
  const s = sizes[size];
  const pr = presence[p];
  void s; // all fields accessed below

  return {
    name: "Avatar",
    type: "FRAME" as const,
    layoutMode: "VERTICAL" as const,
    primaryAxisAlignItems: "CENTER" as const,
    counterAxisAlignItems: "CENTER" as const,
    layoutSizingHorizontal: "HUG" as const,
    layoutSizingVertical: "HUG" as const,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    itemSpacing: 6,
    fills: [],
    children: [
      // ── Circle ────────────────────────────────────────────────
      {
        name: "Circle",
        type: "FRAME" as const,
        layoutMode: "HORIZONTAL" as const,
        primaryAxisAlignItems: "CENTER" as const,
        counterAxisAlignItems: "CENTER" as const,
        layoutSizingHorizontal: "HUG" as const,
        layoutSizingVertical: "HUG" as const,
        // Symmetric padding gives the circle its size — HUG wraps initials + padding
        padding: {
          top: s.circlePad,
          right: s.circlePad,
          bottom: s.circlePad,
          left: s.circlePad,
        },
        itemSpacing: 0,
        cornerRadius: 999,
        fills: [AVATAR_GRADIENT],
        effects: [
          {
            type: "DROP_SHADOW" as const,
            color: { r: 0.851, g: 0.467, b: 0.341, a: 0.16 },
            offset: { x: 0, y: 2 },
            blur: 6,
            spread: 0,
          },
        ],
        children: [
          {
            name: "Initials",
            type: "TEXT" as const,
            characters: "JD",
            fontSize: s.font,
            fontWeight: 600 as const,
            fills: ["#AE5535"],
          },
        ],
      },

      // ── Presence chip ─────────────────────────────────────────
      {
        name: "PresenceChip",
        type: "FRAME" as const,
        layoutMode: "HORIZONTAL" as const,
        primaryAxisAlignItems: "CENTER" as const,
        counterAxisAlignItems: "CENTER" as const,
        layoutSizingHorizontal: "HUG" as const,
        layoutSizingVertical: "HUG" as const,
        padding: { top: 3, right: 7, bottom: 3, left: 5 },
        itemSpacing: 4,
        cornerRadius: 999,
        fills: [pr.chipBg],
        children: [
          {
            name: "Dot",
            type: "ELLIPSE" as const,
            width: s.dotSize,
            height: s.dotSize,
            fills: [pr.dot],
          },
          {
            name: "Label",
            type: "TEXT" as const,
            characters: pr.label,
            fontSize: s.chipFont,
            fontWeight: 500 as const,
            fills: [pr.chipText],
          },
        ],
      },
    ],
  };
}

const sizeList: Size[] = ["Xs", "Sm", "Md", "Lg", "Xl"];
const presenceList: Presence[] = ["Online", "Away", "Busy", "Offline"];

export const avatarExample: ComponentSetJSON = {
  name: "Avatar",
  type: "COMPONENT_SET",
  description:
    "User avatar — circular initials with presence chip below. Size × Presence variants.",
  variantProperties: {
    Size: sizeList,
    Presence: presenceList,
  },
  variants: sizeList.flatMap((size) =>
    presenceList.map((p) => ({
      properties: { Size: size, Presence: p },
      node: makeAvatarNode(size, p),
    })),
  ),
};
