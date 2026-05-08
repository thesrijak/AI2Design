# AI2Design

AI2Design is a Figma plugin that turns structured JSON into editable component sets. Paste a schema-driven description of frames, text, and shapes, then generate a fully editable variant set in your current page.

## What it does

- Builds a Figma component set with variant properties you define.
- Supports frames, text, rectangles, and ellipses.
- Applies fills, strokes, effects, auto layout, and typography.
- Provides 8 built-in example templates to get started immediately.

## How to use the plugin

1. Open a Figma document.
2. Run the AI2Design plugin.
3. Choose a built-in example or paste your own JSON in the editor.
4. Click **Apply Design** to create the component set.

If the JSON is invalid, the plugin shows a validation error in the status bar.

## Built-in examples

| Example  | Variants                           |
|----------|------------------------------------|
| Button   | State (4) × Size (3) — 12 total    |
| Input    | State (5)                          |
| Checkbox | State (4)                          |
| Toggle   | State (3)                          |
| Badge    | Status (5) × Style (2) — 10 total  |
| Card     | Variant (3)                        |
| Avatar   | Size (5) × Presence (4) — 20 total |
| Custom   | Starter template                   |

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

All node types share these common style fields:

- `name`, `width`, `height`, `opacity`, `blendMode`
- `fills`, `strokes`, `strokeWeight`, `strokePosition`, `strokeDashes`
- `effects`
- `layoutSizingHorizontal`, `layoutSizingVertical` — valid on any node type inside an auto-layout parent
- `children` (for nested nodes)

### Layout and sizing

- `FRAME` nodes enable auto layout via `layoutMode` (`HORIZONTAL`, `VERTICAL`, or `NONE`).
- When `layoutMode` is `HORIZONTAL` or `VERTICAL`, `itemSpacing` and `padding` are available.
- `layoutSizingHorizontal` / `layoutSizingVertical` accept `"FIXED"`, `"HUG"`, or `"FILL"`:
  - `"FILL"` — stretches the node to fill its auto-layout parent's width/height.
  - `"HUG"` — wraps content (FRAME only).
  - `"FIXED"` — keeps the explicit `width`/`height`. **Needed when a FRAME has `layoutMode` set and you want to preserve its exact dimensions** — Figma defaults auto-layout frames to HUG.
- `layoutSizingHorizontal: "FILL"` on a `TEXT` node makes it span the parent width and wrap text.

### Text fields

`TEXT` nodes support:

- `characters` (required)
- `fontSize`, `fontWeight`, `fontFamily`, `fontStyle`
- `textAlign`, `textDecoration`, `letterSpacing`, `lineHeight`

If a requested font style is missing, the plugin falls back to `Inter Regular`.

### Paints and effects

Fills and strokes accept:

- Hex strings like `"#D97757"`
- Solid paints: `{ "type": "SOLID", "r": 0.86, "g": 0.47, "b": 0.34 }`
- Linear gradients: `{ "type": "LINEAR_GRADIENT", "stops": [...], "angle": 135 }`
- Radial gradients: `{ "type": "RADIAL_GRADIENT", "stops": [...] }`

Effects support:

- `DROP_SHADOW`, `INNER_SHADOW`, `LAYER_BLUR`, `BACKGROUND_BLUR`

## Example (minimal)

```json
{
  "name": "Checkbox",
  "type": "COMPONENT_SET",
  "variantProperties": {
    "State": ["Unchecked", "Checked"]
  },
  "variants": [
    {
      "properties": { "State": "Unchecked" },
      "node": {
        "name": "Checkbox",
        "type": "FRAME",
        "layoutMode": "HORIZONTAL",
        "primaryAxisAlignItems": "MIN",
        "counterAxisAlignItems": "CENTER",
        "layoutSizingHorizontal": "HUG",
        "layoutSizingVertical": "HUG",
        "padding": { "top": 0, "right": 0, "bottom": 0, "left": 0 },
        "itemSpacing": 9,
        "fills": [],
        "children": [
          {
            "name": "Box",
            "type": "FRAME",
            "width": 18,
            "height": 18,
            "layoutSizingHorizontal": "FIXED",
            "layoutSizingVertical": "FIXED",
            "layoutMode": "HORIZONTAL",
            "primaryAxisAlignItems": "CENTER",
            "counterAxisAlignItems": "CENTER",
            "padding": { "top": 0, "right": 0, "bottom": 0, "left": 0 },
            "itemSpacing": 0,
            "cornerRadius": 5,
            "fills": ["#FFFFFF"],
            "strokes": ["#D1D5DB"],
            "strokeWeight": 1.5,
            "strokePosition": "INSIDE",
            "children": []
          },
          {
            "name": "Label",
            "type": "TEXT",
            "characters": "Accept terms and conditions",
            "fontSize": 13,
            "fontWeight": 400,
            "fills": ["#111827"]
          }
        ]
      }
    }
  ]
}
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and contribution guidelines.

Note: `manifest.json` is tracked in Git so contributors can import the plugin without running a build first.

## Roadmap

- More node types (vector, line, boolean operations).
- Style tokens for color, typography, and spacing presets.
- Image and icon asset support.
- Importing design systems from external JSON sources.
