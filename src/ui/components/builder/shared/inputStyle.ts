import type { ColorTokens } from "../../../tokens";

export function inputStyle(
  colors: ColorTokens,
): Record<string, string | number> {
  return {
    width: "100%",
    boxSizing: "border-box",
    height: "24px",
    padding: "0 6px",
    border: `1px solid ${colors.border}`,
    borderRadius: "4px",
    background: colors.surface,
    color: colors.text,
    fontSize: "11px",
    fontFamily: "inherit",
    outline: "none",
  };
}
