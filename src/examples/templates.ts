import type { ComponentSetJSON } from "../schema";

import { avatarExample } from "./avatar";
import { badgeExample } from "./badge";
import { buttonExample } from "./button";
import { cardExample } from "./card";
import { checkboxExample } from "./checkbox";
import { customExample } from "./custom";
import { inputExample } from "./input";
import { toggleExample } from "./toggle";

type ExampleMap = Record<string, string>;

function stringifyExample(data: ComponentSetJSON): string {
  return JSON.stringify(data, null, 2);
}

export const exampleTemplates: ExampleMap = {
  // Shown first — most commonly used component
  Button: stringifyExample(buttonExample),
  Input: stringifyExample(inputExample),
  Checkbox: stringifyExample(checkboxExample),
  Toggle: stringifyExample(toggleExample),
  Badge: stringifyExample(badgeExample),
  Card: stringifyExample(cardExample),
  Avatar: stringifyExample(avatarExample),
  // Blank starter template — always last
  Custom: stringifyExample(customExample),
};
