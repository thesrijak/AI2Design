import { h, render } from "preact";
import * as preactHooks from "preact/hooks";

import { App } from "./ui/App";

// Expose preact hooks globally — required for Figma plugin iframe context
// to ensure all modules share the same hooks instance.
type WindowWithHooks = Window & { preactHooks?: typeof preactHooks };
(window as WindowWithHooks).preactHooks = preactHooks;

void h; // referenced by JSX transform

export default function (rootNode: HTMLElement) {
  render(<App />, rootNode);
}
