import { useState } from "preact/hooks";

import { exampleTemplates } from "../../examples/templates";
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

function formatJson(value: string): string {
  return JSON.stringify(JSON.parse(value), null, 2);
}

export interface JsonEditorState {
  selectedExample: string;
  json: string;
  lineCount: number;
  handleExampleChange: (name: string) => void;
  handleJsonInput: (value: string) => void;
  handleFormat: () => void;
  /** Returns serialized JSON payload or null on parse error */
  buildPayload: () => string | null;
}

/**
 * Manages the JSON editor state: example selection, raw text,
 * validation, and formatting.
 */
export function useJsonEditor(setStatus: (s: Status) => void): JsonEditorState {
  const [selectedExample, setSelectedExample] = useState(DEFAULT_EXAMPLE);
  const [json, setJson] = useState(exampleTemplates[DEFAULT_EXAMPLE]);

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
    setStatus({ type: "info", message: `${name} example loaded` });
    validate(next);
  }

  function handleJsonInput(value: string) {
    setJson(value);
    if (selectedExample !== "Custom") {
      setSelectedExample("Custom");
    }
    validate(value);
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
    handleExampleChange,
    handleJsonInput,
    handleFormat,
    buildPayload,
  };
}
