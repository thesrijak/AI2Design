/**
 * Demo module — interactive JSON schema editor + live preview pane.
 *
 * Available examples: button, input, checkbox, toggle, badge, card, avatar, custom
 * JSON files live at: ../data/examples/<name>.json
 */

import { validateSchema } from "./schema-validator.js";
import { debounce } from "../lib/debounce.js";

const EXAMPLES = [
  "button",
  "input",
  "checkbox",
  "toggle",
  "badge",
  "card",
  "avatar",
  "custom",
];

/** @type {Record<string, string>} loaded example cache */
const cache = {};

async function loadExample(name) {
  if (cache[name]) return cache[name];
  try {
    const res = await fetch(`data/examples/${name}.json`);
    const text = await res.text();
    cache[name] = text;
    return text;
  } catch {
    return null;
  }
}

function setStatus(el, state, message) {
  el.className = `demo__status demo__status--${state}`;
  el.querySelector(".demo__status-text").textContent = message;
}

function renderPreview(container, emptyEl, json) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    return;
  }

  const result = validateSchema(parsed);

  if (!result.valid) {
    emptyEl.style.display = "none";
    container.style.display = "block";
    container.innerHTML = `
      <div class="schema-tree__section-label">Validation errors</div>
      <div class="schema-tree__error-list">
        ${result.errors
          .slice(0, 8)
          .map((e) => `<div class="schema-tree__error">${escHtml(e)}</div>`)
          .join("")}
        ${result.errors.length > 8 ? `<div class="schema-tree__error">…and ${result.errors.length - 8} more</div>` : ""}
      </div>
    `;
    return;
  }

  const propKeys = Object.keys(parsed.variantProperties || {});
  const variants = (parsed.variants || []).map((v) =>
    propKeys.map((k) => `${k}=${v.properties?.[k] ?? "?"}`).join(", "),
  );

  emptyEl.style.display = "none";
  container.style.display = "block";
  container.innerHTML = `
    <div class="schema-tree__name">${escHtml(parsed.name || "—")}</div>
    <div class="schema-tree__type">COMPONENT_SET</div>
    ${parsed.description ? `<p style="font-size:var(--text-xs);color:var(--color-text-secondary);margin-bottom:var(--space-3)">${escHtml(parsed.description)}</p>` : ""}

    <div class="schema-tree__section-label">Variant Properties</div>
    <div class="schema-tree__props">
      ${propKeys
        .map((k) => {
          const vals = (parsed.variantProperties[k] || []).join(", ");
          return `<span class="schema-tree__prop"><strong>${escHtml(k)}</strong> · ${escHtml(vals)}</span>`;
        })
        .join("")}
    </div>

    <div class="schema-tree__section-label" style="margin-top:var(--space-4)">
      ${variants.length} variant${variants.length !== 1 ? "s" : ""}
    </div>
    <div class="schema-tree__variants">
      ${variants
        .slice(0, 12)
        .map((v) => `<div class="schema-tree__variant">${escHtml(v)}</div>`)
        .join("")}
      ${variants.length > 12 ? `<div class="schema-tree__variant" style="opacity:0.5">…${variants.length - 12} more</div>` : ""}
    </div>
  `;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function initDemo() {
  const editor = document.getElementById("demo-editor");
  const selectEl = document.getElementById("demo-example-select");
  const statusEl = document.getElementById("demo-status");
  const previewEl = document.getElementById("demo-preview-content");
  const emptyEl = document.getElementById("demo-preview-empty");

  if (!editor || !selectEl || !statusEl || !previewEl || !emptyEl) return;

  function processInput(value) {
    if (!value.trim()) {
      setStatus(statusEl, "idle", "Enter or paste a JSON schema");
      emptyEl.style.display = "flex";
      previewEl.style.display = "none";
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(value);
    } catch (e) {
      setStatus(statusEl, "error", e.message);
      emptyEl.style.display = "none";
      previewEl.style.display = "block";
      previewEl.innerHTML = `<div class="schema-tree__error-list"><div class="schema-tree__error">${escHtml(e.message)}</div></div>`;
      return;
    }

    const result = validateSchema(parsed);
    if (result.valid) {
      setStatus(
        statusEl,
        "valid",
        "Valid schema — ready to paste into the plugin",
      );
    } else {
      setStatus(
        statusEl,
        "error",
        `${result.errors.length} error${result.errors.length !== 1 ? "s" : ""} found`,
      );
    }
    renderPreview(previewEl, emptyEl, value);
  }

  const debouncedProcess = debounce(processInput, 300);

  editor.addEventListener("input", () => {
    // Reset example select if user edits manually
    if (selectEl.value !== "custom") {
      selectEl.value = "custom";
    }
    debouncedProcess(editor.value);
  });

  selectEl.addEventListener("change", async () => {
    const name = selectEl.value;
    const json = await loadExample(name);
    if (json) {
      editor.value = json;
      processInput(json);
    }
  });

  // Load default example (button)
  const defaultJson = await loadExample("button");
  if (defaultJson) {
    editor.value = defaultJson;
    processInput(defaultJson);
  } else {
    setStatus(statusEl, "idle", "Enter or paste a JSON schema");
  }
}
