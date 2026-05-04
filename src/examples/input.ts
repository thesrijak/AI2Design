import type { ComponentSetJSON } from '../schema'

export const inputExample: ComponentSetJSON = {
  name: 'Input',
  type: 'COMPONENT_SET',
  variantProperties: {
    Variant: ['Default']
  },
  variants: [
    {
      properties: {
        Variant: 'Default'
      },
      node: {
        name: 'Input',
        type: 'FRAME',
        width: 260,
        height: 48,
        layoutMode: 'HORIZONTAL',
        itemSpacing: 8,
        padding: {
          top: 12,
          right: 12,
          bottom: 12,
          left: 12
        },
        cornerRadius: 10,
        fills: ['#FFFFFF'],
        children: [
          {
            name: 'Placeholder',
            type: 'TEXT',
            characters: 'Enter email',
            fontSize: 13,
            fills: ['#9CA3AF']
          }
        ]
      }
    }
  ]
}
