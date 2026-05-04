import type { ComponentSetJSON } from '../schema'

import { badgeExample } from './badge'
import { buttonExample } from './button'
import { cardExample } from './card'
import { customExample } from './custom'
import { inputExample } from './input'
import { toggleExample } from './toggle'

type ExampleMap = Record<string, string>

function stringifyExample(data: ComponentSetJSON) {
  return JSON.stringify(data, null, 2)
}

export const exampleTemplates: ExampleMap = {
  Custom: stringifyExample(customExample),
  Button: stringifyExample(buttonExample),
  Card: stringifyExample(cardExample),
  Input: stringifyExample(inputExample),
  Badge: stringifyExample(badgeExample),
  Toggle: stringifyExample(toggleExample)
}
