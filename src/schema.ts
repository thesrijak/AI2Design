export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] }

export type BlendModeJSON = 'NORMAL' | 'MULTIPLY' | 'SCREEN' | 'OVERLAY'
export type LayoutModeJSON = 'HORIZONTAL' | 'VERTICAL' | 'NONE'
export type LayoutAlignJSON = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH'
export type AxisAlignJSON = 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN'
export type CounterAxisAlignJSON = 'MIN' | 'CENTER' | 'MAX'
export type LayoutSizingJSON = 'FIXED' | 'HUG' | 'FILL'
export type SizeValueJSON = number | 'HUG' | 'FILL'
export type StrokePositionJSON = 'INSIDE' | 'OUTSIDE' | 'CENTER'
export type TextAlignJSON = 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
export type TextDecorationJSON = 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH'
export type FontStyleJSON = 'Regular' | 'Medium' | 'Bold' | 'Italic'

export interface RGBColorJSON {
  r: number
  g: number
  b: number
  a?: number
}

export interface GradientStopJSON extends RGBColorJSON {
  position: number
}

export interface SolidPaintJSON {
  type: 'SOLID'
  r: number
  g: number
  b: number
  a?: number
}

export interface LinearGradientPaintJSON {
  type: 'LINEAR_GRADIENT'
  stops: GradientStopJSON[]
  angle: number
}

export interface RadialGradientPaintJSON {
  type: 'RADIAL_GRADIENT'
  stops: GradientStopJSON[]
}

export type PaintJSON = SolidPaintJSON | LinearGradientPaintJSON | RadialGradientPaintJSON
export type PaintInputJSON = PaintJSON | string

export interface ShadowEffectJSON {
  type: 'DROP_SHADOW' | 'INNER_SHADOW'
  color: RGBColorJSON
  offset: {
    x: number
    y: number
  }
  blur: number
  spread?: number
  visible?: boolean
}

export interface BlurEffectJSON {
  type: 'LAYER_BLUR' | 'BACKGROUND_BLUR'
  radius: number
  visible?: boolean
}

export type EffectJSON = ShadowEffectJSON | BlurEffectJSON

export interface PaddingJSON {
  top: number
  right: number
  bottom: number
  left: number
}

export interface CornerRadiusIndividualJSON {
  topLeft: number
  topRight: number
  bottomRight: number
  bottomLeft: number
}

export interface LineHeightPixelsJSON {
  value: number
  unit: 'PIXELS'
}

export interface LineHeightPercentJSON {
  value: number
  unit: 'PERCENT'
}

export interface LineHeightAutoJSON {
  unit: 'AUTO'
}

export type LineHeightJSON =
  | LineHeightPixelsJSON
  | LineHeightPercentJSON
  | LineHeightAutoJSON

export interface BaseNodeJSON {
  type: 'FRAME' | 'TEXT' | 'RECTANGLE' | 'ELLIPSE'
  name?: string
  width?: SizeValueJSON
  height?: SizeValueJSON
  opacity?: number
  blendMode?: BlendModeJSON
  fills?: PaintInputJSON[]
  strokes?: PaintInputJSON[]
  strokeWeight?: number
  strokePosition?: StrokePositionJSON
  strokeDashes?: number[]
  effects?: EffectJSON[]
  children?: NodeJSON[]
}

export interface FrameNodeJSON extends BaseNodeJSON {
  type: 'FRAME'
  layoutMode?: LayoutModeJSON
  layoutAlign?: LayoutAlignJSON
  primaryAxisAlignItems?: AxisAlignJSON
  counterAxisAlignItems?: CounterAxisAlignJSON
  layoutSizingHorizontal?: LayoutSizingJSON
  layoutSizingVertical?: LayoutSizingJSON
  itemSpacing?: number
  padding?: PaddingJSON
  cornerRadius?: number
  cornerRadiusIndividual?: CornerRadiusIndividualJSON
  clipsContent?: boolean
}

export interface TextNodeJSON extends BaseNodeJSON {
  type: 'TEXT'
  characters: string
  fontSize?: number
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  fontFamily?: string
  fontStyle?: FontStyleJSON
  textAlign?: TextAlignJSON
  textDecoration?: TextDecorationJSON
  letterSpacing?: number
  lineHeight?: LineHeightJSON
}

export interface RectangleNodeJSON extends BaseNodeJSON {
  type: 'RECTANGLE'
  cornerRadius?: number
  cornerRadiusIndividual?: CornerRadiusIndividualJSON
}

export interface EllipseNodeJSON extends BaseNodeJSON {
  type: 'ELLIPSE'
}

export type NodeJSON =
  | FrameNodeJSON
  | TextNodeJSON
  | RectangleNodeJSON
  | EllipseNodeJSON

export interface VariantJSON {
  properties: Record<string, string>
  node: NodeJSON
}

export interface ComponentSetJSON {
  name: string
  type: 'COMPONENT_SET'
  description?: string
  variantProperties: Record<string, string[]>
  variants: VariantJSON[]
}

const VALID_NODE_TYPES = new Set(['FRAME', 'TEXT', 'RECTANGLE', 'ELLIPSE'])
const VALID_BLEND_MODES = new Set(['NORMAL', 'MULTIPLY', 'SCREEN', 'OVERLAY'])
const VALID_LAYOUT_MODES = new Set(['HORIZONTAL', 'VERTICAL', 'NONE'])
const VALID_LAYOUT_ALIGN = new Set(['MIN', 'CENTER', 'MAX', 'STRETCH'])
const VALID_AXIS_ALIGN = new Set(['MIN', 'CENTER', 'MAX', 'SPACE_BETWEEN'])
const VALID_COUNTER_AXIS_ALIGN = new Set(['MIN', 'CENTER', 'MAX'])
const VALID_LAYOUT_SIZING = new Set(['FIXED', 'HUG', 'FILL'])
const VALID_STROKE_POSITIONS = new Set(['INSIDE', 'OUTSIDE', 'CENTER'])
const VALID_TEXT_ALIGN = new Set(['LEFT', 'CENTER', 'RIGHT', 'JUSTIFIED'])
const VALID_TEXT_DECORATION = new Set(['NONE', 'UNDERLINE', 'STRIKETHROUGH'])
const VALID_FONT_WEIGHTS = new Set([100, 200, 300, 400, 500, 600, 700, 800, 900])

export function hexToRGB(hex: string) {
  const clean = String(hex).trim().replace('#', '')
  const normalized =
    clean.length === 3
      ? clean
          .split('')
          .map(function (part) {
            return part + part
          })
          .join('')
      : clean

  if (normalized.length !== 6) {
    throw new Error(`Invalid hex color "${hex}"`)
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16) / 255,
    g: parseInt(normalized.slice(2, 4), 16) / 255,
    b: parseInt(normalized.slice(4, 6), 16) / 255,
    a: 1
  }
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

function isNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
}

function isSizeKeyword(value: unknown) {
  return value === 'HUG' || value === 'FILL'
}

function validateSizeValue(value: unknown, path: string, errors: string[]) {
  if (value === undefined) {
    return
  }

  if (isNumber(value) || isSizeKeyword(value)) {
    return
  }

  errors.push(`${path} must be a number, "HUG", or "FILL"`)
}

function validateOpacity(value: unknown, path: string, errors: string[]) {
  if (value === undefined) {
    return
  }

  if (!isNumber(value)) {
    errors.push(`${path} must be a number between 0 and 1`)
    return
  }

  const opacity = value as number
  if (opacity < 0 || opacity > 1) {
    errors.push(`${path} must be a number between 0 and 1`)
  }
}

function validateColor(color: unknown, path: string, errors: string[]) {
  if (!isObject(color)) {
    errors.push(`${path} must be a color object`)
    return
  }

  for (const channel of ['r', 'g', 'b'] as const) {
    if (!isNumber(color[channel]) || color[channel] < 0 || color[channel] > 1) {
      errors.push(`${path}.${channel} must be a number between 0 and 1`)
    }
  }

  const alpha = color.a as any
  if (alpha !== undefined && (!isNumber(alpha) || alpha < 0 || alpha > 1)) {
    errors.push(`${path}.a must be a number between 0 and 1`)
  }
}

function validatePadding(value: unknown, path: string, errors: string[]) {
  if (!isObject(value)) {
    errors.push(`${path} must be an object with top, right, bottom, and left`)
    return
  }

  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    if (!isNumber(value[side])) {
      errors.push(`${path}.${side} must be a number`)
    }
  }
}

function validateCornerRadiusIndividual(value: unknown, path: string, errors: string[]) {
  if (!isObject(value)) {
    errors.push(
      `${path} must be an object with topLeft, topRight, bottomRight, and bottomLeft`
    )
    return
  }

  for (const key of ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'] as const) {
    if (!isNumber(value[key])) {
      errors.push(`${path}.${key} must be a number`)
    }
  }
}

function validatePaintStopArray(value: unknown, path: string, errors: string[]) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${path} must be a non-empty array of gradient stops`)
    return
  }

  value.forEach(function (stop, index) {
    const stopPath = `${path}[${index}]`
    if (!isObject(stop)) {
      errors.push(`${stopPath} must be a gradient stop object`)
      return
    }

    if (!isNumber(stop.position) || stop.position < 0 || stop.position > 1) {
      errors.push(`${stopPath}.position must be a number between 0 and 1`)
    }

    validateColor(stop, stopPath, errors)
  })
}

function validatePaintArray(value: unknown, path: string, errors: string[]) {
  if (value === undefined) {
    return
  }

  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`)
    return
  }

  value.forEach(function (paint, index) {
    const paintPath = `${path}[${index}]`
    if (typeof paint === 'string') {
      try {
        hexToRGB(paint)
      } catch (error: any) {
        errors.push(`${paintPath} has invalid hex fill "${paint}"`)
      }
      return
    }

    if (!isObject(paint)) {
      errors.push(`${paintPath} must be a paint object or hex string`)
      return
    }

    if (paint.type === 'SOLID') {
      validateColor(paint, paintPath, errors)
      return
    }

    if (paint.type === 'LINEAR_GRADIENT') {
      validatePaintStopArray(paint.stops, `${paintPath}.stops`, errors)
      if (!isNumber(paint.angle)) {
        errors.push(`${paintPath}.angle must be a number`)
      }
      return
    }

    if (paint.type === 'RADIAL_GRADIENT') {
      validatePaintStopArray(paint.stops, `${paintPath}.stops`, errors)
      return
    }

    errors.push(`${paintPath}.type must be SOLID, LINEAR_GRADIENT, or RADIAL_GRADIENT`)
  })
}

function validateEffects(value: unknown, path: string, errors: string[]) {
  if (value === undefined) {
    return
  }

  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`)
    return
  }

  value.forEach(function (effect, index) {
    const effectPath = `${path}[${index}]`
    if (!isObject(effect)) {
      errors.push(`${effectPath} must be an effect object`)
      return
    }

    if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
      validateColor(effect.color, `${effectPath}.color`, errors)
      if (!isObject(effect.offset)) {
        errors.push(`${effectPath}.offset must be an object with x and y`)
      } else {
        if (!isNumber(effect.offset.x)) {
          errors.push(`${effectPath}.offset.x must be a number`)
        }
        if (!isNumber(effect.offset.y)) {
          errors.push(`${effectPath}.offset.y must be a number`)
        }
      }
      if (!isNumber(effect.blur)) {
        errors.push(`${effectPath}.blur must be a number`)
      }
      if (effect.spread !== undefined && !isNumber(effect.spread)) {
        errors.push(`${effectPath}.spread must be a number`)
      }
      return
    }

    if (effect.type === 'LAYER_BLUR' || effect.type === 'BACKGROUND_BLUR') {
      if (!isNumber(effect.radius)) {
        errors.push(`${effectPath}.radius must be a number`)
      }
      return
    }

    errors.push(
      `${effectPath}.type must be DROP_SHADOW, INNER_SHADOW, LAYER_BLUR, or BACKGROUND_BLUR`
    )
  })
}

function validateNode(node: unknown, path: string, errors: string[]) {
  if (!isObject(node)) {
    errors.push(`${path} must be an object`)
    return
  }

  if (!VALID_NODE_TYPES.has(node.type)) {
    errors.push(`${path}.type must be one of FRAME, TEXT, RECTANGLE, or ELLIPSE`)
    return
  }

  if (node.name !== undefined && !isNonEmptyString(node.name)) {
    errors.push(`${path}.name must be a non-empty string when provided`)
  }

  validateSizeValue(node.width, `${path}.width`, errors)
  validateSizeValue(node.height, `${path}.height`, errors)

  validateOpacity(node.opacity, `${path}.opacity`, errors)

  if (node.blendMode !== undefined && !VALID_BLEND_MODES.has(node.blendMode)) {
    errors.push(`${path}.blendMode must be NORMAL, MULTIPLY, SCREEN, or OVERLAY`)
  }

  if (node.strokeWeight !== undefined && !isNumber(node.strokeWeight)) {
    errors.push(`${path}.strokeWeight must be a number`)
  }

  if (node.strokePosition !== undefined && !VALID_STROKE_POSITIONS.has(node.strokePosition)) {
    errors.push(`${path}.strokePosition must be INSIDE, OUTSIDE, or CENTER`)
  }

  if (node.strokeDashes !== undefined) {
    if (
      !Array.isArray(node.strokeDashes) ||
      node.strokeDashes.some(function (item) {
        return !isNumber(item)
      })
    ) {
      errors.push(`${path}.strokeDashes must be an array of numbers`)
    }
  }

  validatePaintArray(node.fills, `${path}.fills`, errors)
  validatePaintArray(node.strokes, `${path}.strokes`, errors)
  validateEffects(node.effects, `${path}.effects`, errors)

  if (node.type === 'FRAME') {
    if (node.layoutMode !== undefined && !VALID_LAYOUT_MODES.has(node.layoutMode)) {
      errors.push(`${path}.layoutMode must be HORIZONTAL, VERTICAL, or NONE`)
    }

    if (node.layoutAlign !== undefined && !VALID_LAYOUT_ALIGN.has(node.layoutAlign)) {
      errors.push(`${path}.layoutAlign must be MIN, CENTER, MAX, or STRETCH`)
    }

    if (
      node.primaryAxisAlignItems !== undefined &&
      !VALID_AXIS_ALIGN.has(node.primaryAxisAlignItems)
    ) {
      errors.push(
        `${path}.primaryAxisAlignItems must be MIN, CENTER, MAX, or SPACE_BETWEEN`
      )
    }

    if (
      node.counterAxisAlignItems !== undefined &&
      !VALID_COUNTER_AXIS_ALIGN.has(node.counterAxisAlignItems)
    ) {
      errors.push(`${path}.counterAxisAlignItems must be MIN, CENTER, or MAX`)
    }

    if (
      node.layoutSizingHorizontal !== undefined &&
      !VALID_LAYOUT_SIZING.has(node.layoutSizingHorizontal)
    ) {
      errors.push(`${path}.layoutSizingHorizontal must be FIXED, HUG, or FILL`)
    }

    if (
      node.layoutSizingVertical !== undefined &&
      !VALID_LAYOUT_SIZING.has(node.layoutSizingVertical)
    ) {
      errors.push(`${path}.layoutSizingVertical must be FIXED, HUG, or FILL`)
    }

    if (
      (node.layoutSizingHorizontal !== undefined || node.layoutSizingVertical !== undefined) &&
      (!node.layoutMode || node.layoutMode === 'NONE')
    ) {
      errors.push(
        `${path}.layoutSizingHorizontal/layoutSizingVertical require layoutMode to be HORIZONTAL or VERTICAL`
      )
    }

    if (
      (isSizeKeyword(node.width) || isSizeKeyword(node.height)) &&
      (!node.layoutMode || node.layoutMode === 'NONE')
    ) {
      errors.push(`${path}.width/height "HUG" or "FILL" require layoutMode to be HORIZONTAL or VERTICAL`)
    }

    if (node.layoutMode && node.layoutMode !== 'NONE') {
      if (!isNumber(node.itemSpacing)) {
        errors.push(`${path}.itemSpacing must be a number when layoutMode is HORIZONTAL or VERTICAL`)
      }
      if (node.padding === undefined) {
        errors.push(`${path}.padding is required when layoutMode is HORIZONTAL or VERTICAL`)
      } else {
        validatePadding(node.padding, `${path}.padding`, errors)
      }
    } else {
      if (node.itemSpacing !== undefined && !isNumber(node.itemSpacing)) {
        errors.push(`${path}.itemSpacing must be a number`)
      }
      if (node.padding !== undefined) {
        validatePadding(node.padding, `${path}.padding`, errors)
      }
    }

    if (node.cornerRadius !== undefined && !isNumber(node.cornerRadius)) {
      errors.push(`${path}.cornerRadius must be a number`)
    }

    if (node.cornerRadiusIndividual !== undefined) {
      validateCornerRadiusIndividual(
        node.cornerRadiusIndividual,
        `${path}.cornerRadiusIndividual`,
        errors
      )
    }
  } else {
    if (isSizeKeyword(node.width) || isSizeKeyword(node.height)) {
      errors.push(`${path}.width/height "HUG" or "FILL" are only valid for FRAME nodes`)
    }
  }

  if (node.type === 'TEXT') {
    if (typeof node.characters !== 'string') {
      errors.push(`${path}.characters must be a string`)
    }

    if (node.fontSize !== undefined && !isNumber(node.fontSize)) {
      errors.push(`${path}.fontSize must be a number`)
    }

    if (node.fontWeight !== undefined && !VALID_FONT_WEIGHTS.has(node.fontWeight)) {
      errors.push(
        `${path}.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, 900`
      )
    }

    if (node.fontFamily !== undefined && !isNonEmptyString(node.fontFamily)) {
      errors.push(`${path}.fontFamily must be a non-empty string`)
    }

    if (node.fontStyle !== undefined && !['Regular', 'Medium', 'Bold', 'Italic'].includes(node.fontStyle)) {
      errors.push(`${path}.fontStyle must be Regular, Medium, Bold, or Italic`)
    }

    if (node.textAlign !== undefined && !VALID_TEXT_ALIGN.has(node.textAlign)) {
      errors.push(`${path}.textAlign must be LEFT, CENTER, RIGHT, or JUSTIFIED`)
    }

    if (
      node.textDecoration !== undefined &&
      !VALID_TEXT_DECORATION.has(node.textDecoration)
    ) {
      errors.push(`${path}.textDecoration must be NONE, UNDERLINE, or STRIKETHROUGH`)
    }

    if (node.letterSpacing !== undefined && !isNumber(node.letterSpacing)) {
      errors.push(`${path}.letterSpacing must be a number`)
    }

    if (node.lineHeight !== undefined) {
      if (!isObject(node.lineHeight)) {
        errors.push(`${path}.lineHeight must be an object`)
      } else if (node.lineHeight.unit === 'AUTO') {
        // Valid
      } else if (node.lineHeight.unit === 'PIXELS' || node.lineHeight.unit === 'PERCENT') {
        if (!isNumber(node.lineHeight.value)) {
          errors.push(`${path}.lineHeight.value must be a number`)
        }
      } else {
        errors.push(`${path}.lineHeight.unit must be PIXELS, PERCENT, or AUTO`)
      }
    }
  }

  if (node.type === 'RECTANGLE') {
    if (node.cornerRadius !== undefined && !isNumber(node.cornerRadius)) {
      errors.push(`${path}.cornerRadius must be a number`)
    }

    if (node.cornerRadiusIndividual !== undefined) {
      validateCornerRadiusIndividual(
        node.cornerRadiusIndividual,
        `${path}.cornerRadiusIndividual`,
        errors
      )
    }
  }

  if (node.children !== undefined) {
    if (!Array.isArray(node.children)) {
      errors.push(`${path}.children must be an array`)
    } else {
      node.children.forEach(function (child, index) {
        validateNode(child, `${path}.children[${index}]`, errors)
      })
    }
  }
}

export function validateSchema(json: unknown): ValidationResult {
  const errors: string[] = []

  if (!isObject(json)) {
    return {
      valid: false,
      errors: ['Root JSON must be an object']
    }
  }

  if (!isNonEmptyString(json.name)) {
    errors.push(`name is required and must be a non-empty string`)
  }

  if (json.type !== 'COMPONENT_SET') {
    errors.push(`type must be "COMPONENT_SET"`)
  }

  if (json.description !== undefined && typeof json.description !== 'string') {
    errors.push(`description must be a string when provided`)
  }

  if (!isObject(json.variantProperties)) {
    errors.push(`variantProperties is required and must be an object`)
  } else {
    const variantPropertyKeys = Object.keys(json.variantProperties)
    if (variantPropertyKeys.length === 0) {
      errors.push(`variantProperties must declare at least one property`)
    }

    variantPropertyKeys.forEach(function (key) {
      const values = json.variantProperties[key]
      if (!Array.isArray(values) || values.length === 0) {
        errors.push(`variantProperties.${key} must be a non-empty array of strings`)
        return
      }

      values.forEach(function (value: unknown, index: number) {
        if (!isNonEmptyString(value)) {
          errors.push(`variantProperties.${key}[${index}] must be a non-empty string`)
        }
      })
    })
  }

  if (!Array.isArray(json.variants) || json.variants.length === 0) {
    errors.push(`variants is required and must be a non-empty array`)
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors
    }
  }

  const variantPropertyKeys = Object.keys(json.variantProperties)
  const seenVariantCombinations = new Set<string>()

  json.variants.forEach(function (variant: any, variantIndex: number) {
    const variantPath = `variants[${variantIndex}]`

    if (!isObject(variant)) {
      errors.push(`${variantPath} must be an object`)
      return
    }

    if (!isObject(variant.properties)) {
      errors.push(`${variantPath}.properties is required and must be an object`)
    }

    if (!isObject(variant.node)) {
      errors.push(`${variantPath}.node is required and must be an object`)
    }

    if (isObject(variant.properties)) {
      const providedKeys = Object.keys(variant.properties)
      const extraKeys = providedKeys.filter(function (key) {
        return variantPropertyKeys.includes(key) === false
      })
      const missingKeys = variantPropertyKeys.filter(function (key) {
        return providedKeys.includes(key) === false
      })

      if (extraKeys.length > 0) {
        errors.push(
          `${variantPath}.properties has unexpected keys: ${extraKeys.join(', ')}`
        )
      }

      if (missingKeys.length > 0) {
        errors.push(`${variantPath}.properties is missing keys: ${missingKeys.join(', ')}`)
      }

      variantPropertyKeys.forEach(function (key) {
        const allowedValues = json.variantProperties[key]
        const value = variant.properties[key]

        if (!isNonEmptyString(value)) {
          errors.push(`${variantPath}.properties.${key} must be a non-empty string`)
          return
        }

        if (allowedValues.includes(value) === false) {
          errors.push(
            `${variantPath}.properties.${key} must be one of: ${allowedValues.join(', ')}`
          )
        }
      })

      const combinationKey = variantPropertyKeys
        .map(function (key) {
          return `${key}=${variant.properties[key]}`
        })
        .join('|')

      if (seenVariantCombinations.has(combinationKey)) {
        errors.push(`${variantPath}.properties duplicates another variant combination`)
      } else {
        seenVariantCombinations.add(combinationKey)
      }
    }

    if (isObject(variant.node)) {
      validateNode(variant.node, `${variantPath}.node`, errors)
    }
  })

  if (errors.length > 0) {
    return {
      valid: false,
      errors
    }
  }

  return { valid: true }
}
