import { useEffect, useRef } from "preact/hooks";

import type { PluginStatusMessage, Status } from "../types";

function isPluginStatus(value: unknown): value is PluginStatusMessage {
  if (typeof value !== "object" || value === null) return false;
  return (value as Record<string, unknown>).type === "status";
}

/**
 * Listens for messages posted back from the Figma plugin sandbox.
 * Uses refs internally so callbacks never go stale without re-subscribing.
 */
export function usePluginMessages(
  onStatus: (s: Status) => void,
  onDone: () => void,
) {
  // Keep latest callbacks in refs — avoids removing/re-adding the listener
  const onStatusRef = useRef(onStatus);
  const onDoneRef = useRef(onDone);

  useEffect(function () {
    onStatusRef.current = onStatus;
  });
  useEffect(function () {
    onDoneRef.current = onDone;
  });

  useEffect(function () {
    function handle(event: MessageEvent) {
      const payload = (event.data as { pluginMessage?: unknown })
        ?.pluginMessage;
      if (!isPluginStatus(payload)) return;

      onStatusRef.current({
        type: payload.statusType ?? "info",
        message: payload.message ?? "",
      });
      onDoneRef.current();
    }

    window.addEventListener("message", handle);
    return function () {
      window.removeEventListener("message", handle);
    };
  }, []); // intentionally empty — subscription is stable via refs
}
