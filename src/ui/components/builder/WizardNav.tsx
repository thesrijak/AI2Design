import { h } from "preact";

import type { ColorTokens } from "../../tokens";

interface WizardNavProps {
  step: number; // 1-based
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  colors: ColorTokens;
}

export function WizardNav({
  step,
  totalSteps,
  onBack,
  onNext,
  colors,
}: WizardNavProps) {
  const isFirst = step === 1;
  const isLast = step === totalSteps;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "8px",
        borderTop: `1px solid ${colors.border}`,
        marginTop: "auto",
        flexShrink: 0,
      }}
    >
      {/* Step dots */}
      <div style={{ display: "flex", gap: "5px" }}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            style={{
              width: i + 1 === step ? "16px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i + 1 === step ? colors.accent : colors.border,
              transition: "width 0.15s, background 0.15s",
            }}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: "flex", gap: "6px" }}>
        {!isFirst && (
          <button
            onClick={onBack}
            style={{
              border: `1px solid ${colors.border}`,
              background: "transparent",
              color: colors.textSub,
              fontSize: "11px",
              fontFamily: "inherit",
              borderRadius: "5px",
              padding: "0 10px",
              height: "28px",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        )}
        {!isLast && (
          <button
            onClick={onNext}
            style={{
              border: "none",
              background: colors.accent,
              color: colors.accentFg,
              fontSize: "11px",
              fontWeight: 500,
              fontFamily: "inherit",
              borderRadius: "5px",
              padding: "0 12px",
              height: "28px",
              cursor: "pointer",
            }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
