import { h } from "preact";

import type { ComponentSetJSON } from "../../../schema";
import type { ColorTokens } from "../../tokens";
import { SectionHeader } from "./shared/SectionHeader";
import { FieldRow } from "./shared/FieldRow";
import { inputStyle } from "./shared/inputStyle";

interface MetaSectionProps {
  componentSet: ComponentSetJSON;
  onBuilderChange: (
    updater: (prev: ComponentSetJSON) => ComponentSetJSON,
  ) => void;
  colors: ColorTokens;
}

export function MetaSection({
  componentSet,
  onBuilderChange,
  colors,
}: MetaSectionProps) {
  function setName(name: string) {
    onBuilderChange((prev) => ({ ...prev, name }));
  }

  function setDescription(description: string) {
    onBuilderChange((prev) => ({ ...prev, description }));
  }

  return (
    <div>
      <SectionHeader title="Component" colors={colors} />
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <FieldRow label="Name" colors={colors}>
          <input
            type="text"
            value={componentSet.name}
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
            style={inputStyle(colors)}
          />
        </FieldRow>
        <FieldRow label="Description" colors={colors}>
          <textarea
            value={componentSet.description ?? ""}
            onInput={(e) =>
              setDescription((e.target as HTMLTextAreaElement).value)
            }
            rows={2}
            style={{
              ...inputStyle(colors),
              height: "auto",
              padding: "4px 6px",
              resize: "vertical",
              lineHeight: 1.4,
            }}
          />
        </FieldRow>
      </div>
    </div>
  );
}
