/**
 * main.js — entry point for index.html
 *
 * Imports and initialises all component modules.
 * Add new modules here as the site grows.
 */

import { initNav } from "./components/nav.js";
import { initDemo } from "./components/demo.js";
import { initCopyButtons } from "./components/copy-button.js";

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initCopyButtons();
  initDemo();
});
