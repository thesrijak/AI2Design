import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

import { exampleTemplates } from "../examples/templates";
import { tokens } from "./tokens";
import type { Status } from "./types";
import { GlobalStyles } from "./GlobalStyles";
import { useTheme } from "./hooks/useTheme";
import { usePluginMessages } from "./hooks/usePluginMessages";
import { useJsonEditor } from "./hooks/useJsonEditor";
import { Header } from "./components/Header";
import { ExamplePicker } from "./components/ExamplePicker";
import { JsonEditor } from "./components/JsonEditor";
import { StatusBar } from "./components/StatusBar";
import { ApplyButton } from "./components/ApplyButton";
import { TabBar } from "./components/builder/TabBar";
import { BuilderTab } from "./components/builder/BuilderTab";

const EXAMPLES = Object.keys(exampleTemplates);

type Tab = "builder" | "json";

/**
 * Root plugin component.
 * Owns global state (theme, status, submitting, currentTab) and wires all sub-components.
 */
export function App() {
  const theme = useTheme();
  const c = tokens[theme];

  const [status, setStatus] = useState<Status>({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab>("builder");

  const editor = useJsonEditor(setStatus);

  usePluginMessages(setStatus, function () {
    setIsSubmitting(false);
  });

  // Inject Inter font imperatively — Figma plugins can't use <link> in HTML head
  useEffect(function () {
    const preconnect1 = Object.assign(document.createElement("link"), {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    });
    const preconnect2 = Object.assign(document.createElement("link"), {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    });
    const font = Object.assign(document.createElement("link"), {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
    });

    document.head.append(preconnect1, preconnect2, font);

    return function () {
      preconnect1.remove();
      preconnect2.remove();
      font.remove();
    };
  }, []);

  function handleApply() {
    const payload = editor.buildPayload();
    if (!payload) return; // validation error already set by buildPayload

    setIsSubmitting(true);
    setStatus({ type: "info", message: "Building component set in Figma…" });

    parent.postMessage(
      { pluginMessage: { type: "insert-design", json: payload } },
      "*",
    );
  }

  function handleEditorBlur() {
    // Auto-format on blur when JSON is valid
    if (status.type !== "error") {
      editor.handleFormat();
    }
  }

  return (
    <div
      id="plugin-root"
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        background: c.bg,
        color: c.text,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <GlobalStyles />

      <Header colors={c} />

      <TabBar currentTab={currentTab} onTabChange={setCurrentTab} colors={c} />

      {/* Builder tab — always mounted, hidden when inactive */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: currentTab === "builder" ? "flex" : "none",
          flexDirection: "column",
        }}
      >
        <BuilderTab
          componentSet={editor.componentSet}
          jsonParseError={editor.jsonParseError}
          onBuilderChange={editor.handleBuilderChange}
          colors={c}
        />
      </div>

      {/* JSON tab — always mounted, hidden when inactive */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: currentTab === "json" ? "flex" : "none",
          flexDirection: "column",
          padding: "16px",
          gap: "14px",
          overflow: "hidden",
        }}
      >
        <ExamplePicker
          examples={EXAMPLES}
          selected={editor.selectedExample}
          onChange={editor.handleExampleChange}
          colors={c}
        />

        <JsonEditor
          value={editor.json}
          lineCount={editor.lineCount}
          hasError={status.type === "error"}
          onInput={editor.handleJsonInput}
          onFormat={editor.handleFormat}
          onBlur={handleEditorBlur}
          colors={c}
        />

        <StatusBar status={status} colors={c} />
      </div>

      {/* Footer / CTA */}
      <div
        style={{
          padding: "0 16px 16px",
          flexShrink: 0,
        }}
      >
        <ApplyButton
          onClick={handleApply}
          isSubmitting={isSubmitting}
          colors={c}
        />
      </div>
    </div>
  );
}
