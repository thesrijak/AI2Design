import { h, render } from "preact";
import * as preactHooks from "preact/hooks";

import { exampleTemplates } from "./examples/templates";

type StatusMessage = {
  type: "status";
  statusType?: "success" | "error" | "info";
  message?: string;
};

type WindowWithHooks = Window & { preactHooks?: typeof preactHooks };

function isStatusMessage(value: unknown): value is StatusMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return record.type === "status";
}

void h;

const hooksWindow = window as WindowWithHooks;
hooksWindow.preactHooks = preactHooks;

const { useEffect, useMemo, useState } = preactHooks;

function getThemeMode() {
  if (document.body.classList.contains("theme-dark")) {
    return "dark";
  }

  if (document.body.classList.contains("theme-light")) {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function Plugin() {
  const [selectedExample, setSelectedExample] = useState("Custom");
  const [json, setJson] = useState(exampleTemplates.Custom);
  const [status, setStatus] = useState<{
    type: "" | "success" | "error" | "info";
    message: string;
  }>({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isPrimaryPressed, setIsPrimaryPressed] = useState(false);
  const [themeMode, setThemeMode] = useState(getThemeMode());

  useEffect(function () {
    const preconnectGoogle = document.createElement("link");
    preconnectGoogle.rel = "preconnect";
    preconnectGoogle.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnectGoogle);

    const preconnectStatic = document.createElement("link");
    preconnectStatic.rel = "preconnect";
    preconnectStatic.href = "https://fonts.gstatic.com";
    preconnectStatic.crossOrigin = "anonymous";
    document.head.appendChild(preconnectStatic);

    const fontStylesheet = document.createElement("link");
    fontStylesheet.rel = "stylesheet";
    fontStylesheet.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(fontStylesheet);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = function () {
      setThemeMode(getThemeMode());
    };

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleThemeChange);
    }

    window.onmessage = function (event: MessageEvent) {
      const payload = event.data as { pluginMessage?: unknown };
      const pluginMessage = payload && payload.pluginMessage;
      if (!isStatusMessage(pluginMessage)) {
        return;
      }

      setStatus({
        type: pluginMessage.statusType || "info",
        message: pluginMessage.message || "",
      });
      setIsSubmitting(false);
    };

    return function () {
      preconnectGoogle.remove();
      preconnectStatic.remove();
      fontStylesheet.remove();
      observer.disconnect();
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleThemeChange);
      }
    };
  }, []);

  const colors = useMemo(
    function () {
      if (themeMode === "dark") {
        return {
          appBg: "#121316",
          panelBg: "#191B20",
          topBarBg: "#16181C",
          text: "#F3F4F6",
          muted: "rgba(255,255,255,0.56)",
          softMuted: "rgba(255,255,255,0.36)",
          border: "rgba(255,255,255,0.10)",
          subtleBorder: "rgba(255,255,255,0.07)",
          fieldBg: "#101114",
          fieldText: "#C4B5FD",
          actionBg: "rgba(255,255,255,0.05)",
          actionBgHover: "rgba(255,255,255,0.09)",
          statusBg: "rgba(255,255,255,0.04)",
          statusText: "rgba(255,255,255,0.76)",
          selectBg: "#101114",
        };
      }

      return {
        appBg: "#F6F7FB",
        panelBg: "transparent",
        topBarBg: "#F8FAFC",
        text: "#111827",
        muted: "rgba(17,24,39,0.68)",
        softMuted: "rgba(17,24,39,0.48)",
        border: "rgba(15,23,42,0.12)",
        subtleBorder: "rgba(15,23,42,0.08)",
        fieldBg: "#FFFFFF",
        fieldText: "#6D28D9",
        actionBg: "rgba(15,23,42,0.04)",
        actionBgHover: "rgba(15,23,42,0.08)",
        statusBg: "rgba(15,23,42,0.03)",
        statusText: "rgba(17,24,39,0.78)",
        selectBg: "#FFFFFF",
      };
    },
    [themeMode],
  );

  function handleInsert() {
    try {
      const parsed = JSON.parse(json);
      const formatted = JSON.stringify(parsed, null, 2);
      if (formatted !== json) {
        setJson(formatted);
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Invalid JSON",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({
      type: "info",
      message: "Building editable design in Figma...",
    });

    parent.postMessage(
      {
        pluginMessage: {
          type: "insert-design",
          json: json,
        },
      },
      "*",
    );
  }

  function validateJson(value: string) {
    try {
      JSON.parse(value);
      setStatus({
        type: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Invalid JSON",
      });
    }
  }

  function handleExampleChange(event: Event) {
    const target = event.currentTarget as HTMLSelectElement;
    const exampleName = target.value;
    const nextJson = exampleTemplates[exampleName];
    setSelectedExample(exampleName);
    setJson(nextJson);
    setStatus({
      type: "info",
      message: `${exampleName} example loaded`,
    });
    validateJson(nextJson);
  }

  const statusDotColor =
    status.type === "error"
      ? "#F87171"
      : status.type === "success"
        ? "#4ADE80"
        : "#7C5AF7";

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: colors.appBg,
        color: colors.text,
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: colors.topBarBg,
          borderBottom: `1px solid ${colors.subtleBorder}`,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              color: colors.text,
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            AI2Design
          </div>
        </div>
        <div
          style={{
            color: colors.softMuted,
            fontSize: "11px",
            fontWeight: 500,
          }}
        >
          v0.0.1
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "hidden",
          padding: "14px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: colors.panelBg,
            padding: "14px 14px 0 14px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: colors.text,
            }}
          >
            Component Builder
          </div>
          <div
            style={{
              marginTop: "6px",
              fontSize: "12px",
              color: colors.muted,
              lineHeight: 1.6,
            }}
          >
            Paste JSON and turn it into editable frames, components, and layout.
          </div>

          <div
            style={{
              marginTop: "14px",
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: colors.softMuted,
            }}
          >
            Examples
          </div>

          <div
            style={{
              marginTop: "8px",
              position: "relative",
            }}
          >
            <select
              value={selectedExample}
              onChange={handleExampleChange}
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "10px",
                border: `1px solid ${colors.border}`,
                background: colors.selectBg,
                color: colors.text,
                fontSize: "12px",
                padding: "0 40px 0 12px",
                outline: "none",
                boxSizing: "border-box",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
              }}
            >
              {Object.keys(exampleTemplates).map(function (templateName) {
                return (
                  <option key={templateName} value={templateName}>
                    {templateName}
                  </option>
                );
              })}
            </select>
            <div
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: colors.muted,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>

          <textarea
            value={json}
            onInput={function (event: Event) {
              const target = event.currentTarget as HTMLTextAreaElement;
              const nextValue = target.value;
              setJson(nextValue);
              if (selectedExample !== "Custom") {
                setSelectedExample("Custom");
              }
              validateJson(nextValue);
            }}
            onFocus={function () {
              setIsFocused(true);
            }}
            onBlur={function () {
              setIsFocused(false);
              try {
                const parsed = JSON.parse(json);
                setJson(JSON.stringify(parsed, null, 2));
                setStatus({
                  type: "",
                  message: "",
                });
              } catch (error) {
                setStatus({
                  type: "error",
                  message:
                    error instanceof Error ? error.message : "Invalid JSON",
                });
              }
            }}
            placeholder={exampleTemplates.Custom}
            spellcheck={false}
            style={{
              width: "100%",
              flex: 1,
              minHeight: "320px",
              marginTop: "14px",
              resize: "none",
              background: colors.fieldBg,
              border: isFocused
                ? "1px solid rgba(124,90,247,0.5)"
                : `1px solid ${colors.border}`,
              borderRadius: "10px",
              padding: "14px",
              boxSizing: "border-box",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "11.5px",
              color: colors.fieldText,
              lineHeight: 1.5,
              outline: "none",
            }}
          />

          {status.message ? (
            <div
              style={{
                marginTop: "14px",
                background: colors.statusBg,
                border: `1px solid ${colors.subtleBorder}`,
                borderRadius: "8px",
                padding: "11px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                color: colors.statusText,
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: statusDotColor,
                  flexShrink: 0,
                }}
              />
              <span>{status.message}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          padding: "0 14px 14px 14px",
          background: colors.appBg,
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={handleInsert}
          disabled={isSubmitting}
          onMouseEnter={function () {
            setIsPrimaryHovered(true);
          }}
          onMouseLeave={function () {
            setIsPrimaryHovered(false);
            setIsPrimaryPressed(false);
          }}
          onMouseDown={function () {
            setIsPrimaryPressed(true);
          }}
          onMouseUp={function () {
            setIsPrimaryPressed(false);
          }}
          style={{
            width: "100%",
            height: "42px",
            border: "none",
            borderRadius: "10px",
            padding: "0 16px",
            background: isSubmitting
              ? "#5A4AA7"
              : isPrimaryHovered
                ? "#6B4BE6"
                : "#7C5AF7",
            color: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 600,
            cursor: isSubmitting ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: isPrimaryPressed ? "scale(0.98)" : "scale(1)",
          }}
        >
          <span>{isSubmitting ? "Applying..." : "Apply Design"}</span>
        </button>
      </div>
    </div>
  );
}

export default function (rootNode: HTMLElement) {
  render(<Plugin />, rootNode);
}
