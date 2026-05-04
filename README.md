# AI2Design

AI2Design is a Figma plugin that turns structured JSON into editable component sets. Paste a schema-driven description of frames, text, and shapes, then generate a fully editable variant set in your current page.

## What it does

- Builds a Figma component set with variant properties you define.
- Supports frames, text, rectangles, and ellipses.
- Applies fills, strokes, effects, auto layout, and typography.
- Provides built-in example templates to get started quickly.

## How to use the plugin

1. Open a Figma document.
2. Run the AI2Design plugin.
3. Choose an example or paste your JSON in the editor.
4. Click Apply Design to create the component set.

If the JSON is invalid, the plugin will show a validation error in the status area.

## JSON schema overview

Top-level shape:

```json
{
  "name": "Button",
  "type": "COMPONENT_SET",
  "description": "Optional description",
  "variantProperties": {
    "State": ["Default", "Hover"],
    "Size": ["Sm", "Md"]
  },
  "variants": [
    {
      "properties": { "State": "Default", "Size": "Sm" },
      "node": { "type": "FRAME", "children": [] }
    }
  ]
}
```

### Variant rules

- Every variant must provide the exact set of keys defined in `variantProperties`.
- Each variant combination must be unique.
- `type` must be `COMPONENT_SET`.

### Node types

Supported `node.type` values:

- `FRAME`
- `TEXT`
- `RECTANGLE`
- `ELLIPSE`

Nodes can include common style fields:

- `name`, `width`, `height`, `opacity`, `blendMode`
- `fills`, `strokes`, `strokeWeight`, `strokePosition`, `strokeDashes`
- `effects`
- `children` (for nested nodes)

### Layout and sizing

- `FRAME` nodes can use `layoutMode` (`HORIZONTAL`, `VERTICAL`, or `NONE`).
- When `layoutMode` is `HORIZONTAL` or `VERTICAL`, `itemSpacing` and `padding` are required.
- `width` and `height` can be numbers or the keywords `HUG` and `FILL` on frames.
- `layoutSizingHorizontal` and `layoutSizingVertical` are only valid when `layoutMode` is not `NONE`.

### Text fields

`TEXT` nodes support:

- `characters` (required)
- `fontSize`, `fontWeight`, `fontFamily`, `fontStyle`
- `textAlign`, `textDecoration`, `letterSpacing`, `lineHeight`

If a requested font style is missing, the plugin falls back to `Inter Regular`.

### Paints and effects

Fills and strokes accept:

- Hex strings like `"#7C5AF7"`
- Solid paints: `{ "type": "SOLID", "r": 0.49, "g": 0.35, "b": 0.97 }`
- Linear gradients: `{ "type": "LINEAR_GRADIENT", "stops": [...], "angle": 90 }`
- Radial gradients: `{ "type": "RADIAL_GRADIENT", "stops": [...] }`

Effects support:

- `DROP_SHADOW`, `INNER_SHADOW`, `LAYER_BLUR`, `BACKGROUND_BLUR`

## Example (minimal)

```json
{
  "name": "Custom",
  "type": "COMPONENT_SET",
  "variantProperties": {
    "Variant": ["Default"]
  },
  "variants": [
    {
      "properties": { "Variant": "Default" },
      "node": {
        "name": "Custom",
        "type": "FRAME",
        "layoutMode": "HORIZONTAL",
        "itemSpacing": 8,
        "padding": { "top": 0, "right": 0, "bottom": 0, "left": 0 },
        "children": []
      }
    }
  ]
}
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and contribution guidelines.

Note: `manifest.json` is tracked in Git so contributors can import the plugin without running a build first.

## Features coming soon

- More schema-driven node types (vector, line, and boolean operations).
- Style tokens for color, typography, and spacing presets.
- Asset support for images and icons.
- Importing design systems from external JSON sources.
