import { useState } from "preact/hooks";

import { exampleTemplates } from "../../examples/templates";
import type { ComponentSetJSON } from "../../schema";
import type { Status } from "../types";

const DEFAULT_EXAMPLE = "Button";

function tryParse(value: string): { ok: true } | { ok: false; error: string } {
  try {
    JSON.parse(value);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Invalid JSON",
    };
  }
}

function parseComponentSet(value: string): ComponentSetJSON | null {
  try {
    return JSON.parse(value) as ComponentSetJSON;
  } catch {
    return null;
  }
}

function formatJson(value: string): string {
  return JSON.stringify(JSON.parse(value), null, 2);
}

export interface JsonEditorState {
  selectedExample: string;
  json: string;
  lineCount: number;
  /** Parsed ComponentSetJSON; null only during initial load failure */
  componentSet: ComponentSetJSON | null;
  /** Non-null when json string cannot be parsed — builder shows stale state */
  jsonParseError: string | null;
  handleExampleChange: (name: string) => void;
  handleJsonInput: (value: string) => void;
  handleFormat: () => void;
  /** Apply a structural update from the Builder tab */
  handleBuilderChange: (
    updater: (prev: ComponentSetJSON) => ComponentSetJSON,
  ) => void;
  /** Returns serialized JSON payload or null on parse error */
  buildPayload: () => string | null;
}

/**
 * Manages the JSON editor state: example selection, raw text,
 * validation, and formatting. Also exposes the parsed ComponentSetJSON
 * object so the Builder tab can mutate it structurally without touching
 * raw JSON text.
 */
export function useJsonEditor(setStatus: (s: Status) => void): JsonEditorState {
  const defaultJson = exampleTemplates[DEFAULT_EXAMPLE];

  const [selectedExample, setSelectedExample] = useState(DEFAULT_EXAMPLE);
  const [json, setJson] = useState(defaultJson);
  const [componentSet, setComponentSet] = useState<ComponentSetJSON | null>(
    () => parseComponentSet(defaultJson),
  );
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);

  function validate(value: string) {
    const result = tryParse(value);
    if (!result.ok) {
      setStatus({ type: "error", message: result.error });
    } else {
      setStatus({ type: "", message: "" });
    }
  }

  function handleExampleChange(name: string) {
    const next = exampleTemplates[name];
    setSelectedExample(name);
    setJson(next);
    setJsonParseError(null);
    const parsed = parseComponentSet(next);
    if (parsed) setComponentSet(parsed);
    setStatus({ type: "info", message: `${name} example loaded` });
    validate(next);
  }

  function handleJsonInput(value: string) {
    setJson(value);
    if (selectedExample !== "Custom") {
      setSelectedExample("Custom");
    }

    const result = tryParse(value);
    if (result.ok) {
      const parsed = parseComponentSet(value);
      if (parsed) {
        setComponentSet(parsed);
        setJsonParseError(null);
      }
      setStatus({ type: "", message: "" });
    } else {
      // Leave componentSet unchanged (stale but usable in builder)
      setJsonParseError(result.error);
      setStatus({ type: "error", message: result.error });
    }
  }

  function handleBuilderChange(
    updater: (prev: ComponentSetJSON) => ComponentSetJSON,
  ) {
    if (!componentSet) return;
    const next = updater(componentSet);
    const serialized = JSON.stringify(next, null, 2);
    setComponentSet(next);
    setJson(serialized);
    setJsonParseError(null);
    setSelectedExample("Custom");
    setStatus({ type: "", message: "" });
  }

  function handleFormat() {
    const result = tryParse(json);
    if (!result.ok) {
      setStatus({ type: "error", message: result.error });
      return;
    }
    setJson(formatJson(json));
    setStatus({ type: "", message: "" });
  }

  function buildPayload(): string | null {
    const result = tryParse(json);
    if (!result.ok) {
      setStatus({ type: "error", message: result.error });
      return null;
    }
    const formatted = formatJson(json);
    setJson(formatted);
    return formatted;
  }

  return {
    selectedExample,
    json,
    lineCount: json.split("\n").length,
    componentSet,
    jsonParseError,
    handleExampleChange,
    handleJsonInput,
    handleBuilderChange,
    handleFormat,
    buildPayload,
  };
}
