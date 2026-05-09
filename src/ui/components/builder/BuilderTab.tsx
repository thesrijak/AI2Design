import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

import type { ComponentSetJSON } from "../../../schema";
import type { ColorTokens } from "../../tokens";
import { MetaSection } from "./MetaSection";
import { VariantPropertiesEditor } from "./VariantPropertiesEditor";
import { VariantsList } from "./VariantsList";
import { VariantEditor } from "./VariantEditor";
import { WizardNav } from "./WizardNav";

interface BuilderTabProps {
  componentSet: ComponentSetJSON | null;
  jsonParseError: string | null;
  onBuilderChange: (
    updater: (prev: ComponentSetJSON) => ComponentSetJSON,
  ) => void;
  colors: ColorTokens;
}

const TOTAL_STEPS = 3;

const STEP_TITLES = [
  "Component Info",
  "Variant Properties",
  "Configure Variants",
];

const STEP_HINTS = [
  "Name your component and add a description.",
  "Define the axes and values that make up your variants.",
  "Select a variant to preview and edit its root node.",
];

export function BuilderTab({
  componentSet,
  jsonParseError,
  onBuilderChange,
  colors,
}: BuilderTabProps) {
  const [step, setStep] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);

  if (jsonParseError) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          padding: "16px",
        }}
      >
        <div
          style={{
            background: colors.errorBg,
            border: `1px solid ${colors.error}`,
            borderRadius: "6px",
            padding: "12px 14px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: colors.error,
              marginBottom: "4px",
            }}
          >
            JSON parse error
          </div>
          <div style={{ fontSize: "11px", color: colors.error, opacity: 0.85 }}>
            {jsonParseError}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: colors.textMuted,
              marginTop: "6px",
            }}
          >
            Fix the JSON tab to resume editing here.
          </div>
        </div>
      </div>
    );
  }

  if (!componentSet) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.textMuted,
          fontSize: "12px",
        }}
      >
        No component set loaded.
      </div>
    );
  }

  const variantCount = componentSet.variants.length;

  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "12px 16px 12px",
        gap: "0",
      }}
    >
      {/* Step header */}
      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: colors.text,
            marginBottom: "2px",
          }}
        >
          {STEP_TITLES[step - 1]}
        </div>
        <div style={{ fontSize: "11px", color: colors.textMuted }}>
          {STEP_HINTS[step - 1]}
        </div>
      </div>

      {/* Step content — scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          paddingBottom: "4px",
        }}
      >
        {/* Step 1: Component Info */}
        {step === 1 && (
          <MetaSection
            componentSet={componentSet}
            onBuilderChange={onBuilderChange}
            colors={colors}
          />
        )}

        {/* Step 2: Variant Properties */}
        {step === 2 && (
          <>
            <VariantPropertiesEditor
              componentSet={componentSet}
              onBuilderChange={onBuilderChange}
              colors={colors}
            />
            {variantCount > 0 && (
              <div
                style={{
                  fontSize: "11px",
                  color: colors.textSub,
                  background: colors.accentMuted,
                  borderRadius: "5px",
                  padding: "6px 10px",
                }}
              >
                {variantCount} variant{variantCount !== 1 ? "s" : ""} will be
                generated → edit each one in step 3.
              </div>
            )}
          </>
        )}

        {/* Step 3: Configure Variants */}
        {step === 3 && (
          <>
            <VariantsList
              componentSet={componentSet}
              selectedVariantIndex={selectedVariantIndex}
              onSelectVariant={setSelectedVariantIndex}
              colors={colors}
            />

            {variantCount > 0 && (
              <VariantEditor
                componentSet={componentSet}
                variantIndex={selectedVariantIndex}
                onBuilderChange={onBuilderChange}
                colors={colors}
              />
            )}

            {variantCount === 0 && (
              <div
                style={{
                  fontSize: "11px",
                  color: colors.textMuted,
                  padding: "8px 0",
                }}
              >
                No variants yet. Go back and add variant properties.
              </div>
            )}
          </>
        )}
      </div>

      {/* Wizard navigation */}
      <WizardNav
        step={step}
        totalSteps={TOTAL_STEPS}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
        onNext={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
        colors={colors}
      />
    </div>
  );
}
