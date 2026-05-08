import type { Theme } from "./types";

export interface ColorTokens {
  // Backgrounds
  bg: string;
  surface: string;
  topBar: string;
  // Text
  text: string;
  textSub: string;
  textMuted: string;
  // Borders
  border: string;
  borderSubtle: string;
  // Editor field
  fieldBg: string;
  fieldText: string;
  // Accent (clay)
  accent: string;
  accentHover: string;
  accentPressed: string;
  accentFg: string;
  accentMuted: string;
  // Status colours
  success: string;
  successBg: string;
  error: string;
  errorBg: string;
  info: string;
  infoBg: string;
}

export const tokens: Record<Theme, ColorTokens> = {
  light: {
    bg: "#F8F7F4",
    surface: "#FFFFFF",
    topBar: "#FAFAF8",
    text: "#1A1917",
    textSub: "rgba(26,25,23,0.62)",
    textMuted: "rgba(26,25,23,0.38)",
    border: "rgba(26,25,23,0.10)",
    borderSubtle: "rgba(26,25,23,0.06)",
    fieldBg: "#FFFFFF",
    fieldText: "#2A6041", // forest green — JSON values look like code
    accent: "#D97757",
    accentHover: "#C36240",
    accentPressed: "#AE5535",
    accentFg: "#FFFFFF",
    accentMuted: "rgba(217,119,87,0.12)",
    success: "#1E7A4A",
    successBg: "rgba(30,122,74,0.08)",
    error: "#C0392B",
    errorBg: "rgba(192,57,43,0.08)",
    info: "#9A5530",
    infoBg: "rgba(217,119,87,0.10)",
  },
  dark: {
    bg: "#131211",
    surface: "#1C1B19",
    topBar: "#161513",
    text: "#F0EDE8",
    textSub: "rgba(240,237,232,0.60)",
    textMuted: "rgba(240,237,232,0.36)",
    border: "rgba(240,237,232,0.10)",
    borderSubtle: "rgba(240,237,232,0.06)",
    fieldBg: "#0F0E0D",
    fieldText: "#7EC899", // lighter green — readable on dark bg
    accent: "#D97757",
    accentHover: "#E58560",
    accentPressed: "#F09070",
    accentFg: "#FFFFFF",
    accentMuted: "rgba(217,119,87,0.14)",
    success: "#4ADE80",
    successBg: "rgba(74,222,128,0.08)",
    error: "#F87171",
    errorBg: "rgba(248,113,113,0.08)",
    info: "#FDBA74",
    infoBg: "rgba(253,186,116,0.10)",
  },
};
