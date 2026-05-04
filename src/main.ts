/// <reference types="@figma/plugin-typings" />

import { showUI } from "@create-figma-plugin/utilities";

import { buildComponentSet } from "./builder";
import { ComponentSetJSON, validateSchema } from "./schema";

type InsertDesignMessage = {
  type: "insert-design";
  json?: string;
};

function isInsertDesignMessage(value: unknown): value is InsertDesignMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return record.type === "insert-design";
}

function postStatus(type: "success" | "error" | "info", message: string) {
  figma.ui.postMessage({
    type: "status",
    statusType: type,
    message,
  });
}

export default function () {
  showUI({
    width: 540,
    height: 640,
    themeColors: true,
  });

  figma.ui.onmessage = async function (message: unknown) {
    if (!isInsertDesignMessage(message)) {
      return;
    }

    try {
      const raw = String(message.json || "").trim();
      if (!raw) {
        throw new Error("Paste some JSON before applying the design");
      }

      let data: unknown;
      try {
        data = JSON.parse(raw);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Invalid JSON";
        throw new Error(`Invalid JSON: ${errorMessage}`);
      }

      const validation = validateSchema(data);
      if (validation.valid === false) {
        throw new Error(validation.errors.join(" | "));
      }

      const componentSet = await buildComponentSet(data as ComponentSetJSON);
      figma.currentPage.selection = [componentSet];
      figma.viewport.scrollAndZoomIntoView([componentSet]);
      postStatus(
        "success",
        `Component Set "${componentSet.name}" created successfully`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while building the component set";
      postStatus("error", errorMessage);
    }
  };
}
