import { h } from "preact";

import type { ColorTokens } from "../tokens";
import type { Status } from "../types";

interface StatusBarProps {
  status: Status;
  colors: ColorTokens;
}

function SuccessIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="6.5"
        cy="6.5"
        r="5.5"
        stroke="currentColor"
        stroke-width="1.3"
      />
      <path
        d="M4 6.5L6 8.5L9 5"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="6.5"
        cy="6.5"
        r="5.5"
        stroke="currentColor"
        stroke-width="1.3"
      />
      <path
        d="M4.5 4.5L8.5 8.5M8.5 4.5L4.5 8.5"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="6.5"
        cy="6.5"
        r="5.5"
        stroke="currentColor"
        stroke-width="1.3"
      />
      <path
        d="M6.5 5.5V9"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
      />
      <circle cx="6.5" cy="4" r="0.7" fill="currentColor" />
    </svg>
  );
}

/**
 * Inline status bar — icon + coloured message text.
 * Animates in when a message appears.
 */
export function StatusBar({ status, colors }: StatusBarProps) {
  if (!status.message) return null;

  const isSuccess = status.type === "success";
  const isError = status.type === "error";

  const color = isSuccess
    ? colors.success
    : isError
      ? colors.error
      : colors.info;
  const bg = isSuccess
    ? colors.successBg
    : isError
      ? colors.errorBg
      : colors.infoBg;

  const Icon = isSuccess ? SuccessIcon : isError ? ErrorIcon : InfoIcon;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "7px",
        padding: "9px 11px",
        background: bg,
        border: `1px solid ${color}22`,
        borderRadius: "7px",
        animation: "fadeIn 0.15s ease",
        flexShrink: 0,
      }}
    >
      <span style={{ color, flexShrink: 0, marginTop: "1px" }}>
        <Icon />
      </span>
      <span
        style={{
          fontSize: "11.5px",
          color,
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {status.message}
      </span>
    </div>
  );
}
