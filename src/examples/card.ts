import type { ComponentSetJSON } from '../schema'

export const cardExample: ComponentSetJSON = {
  name: 'Card',
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
        name: 'Card',
        type: 'FRAME',
        width: 280,
        height: 180,
        layoutMode: 'VERTICAL',
        padding: {
          top: 16,
          right: 16,
          bottom: 16,
          left: 16
        },
        itemSpacing: 10,
        cornerRadius: 14,
        fills: ['#F8FAFC'],
        children: [
          {
            name: 'Title',
            type: 'TEXT',
            characters: 'Premium Card',
            fontSize: 18,
            fills: ['#111827']
          },
          {
            name: 'Meta',
            type: 'TEXT',
            characters: 'Built from JSON in seconds.',
            fontSize: 12,
            fills: ['#6B7280']
          }
        ]
      }
    }
  ]
}
