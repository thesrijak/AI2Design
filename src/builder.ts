/// <reference types="@figma/plugin-typings" />

import {
  ComponentSetJSON,
  FrameNodeJSON,
  GradientStopJSON,
  NodeJSON,
  PaintInputJSON,
  RectangleNodeJSON,
  RGBColorJSON,
  BlurEffectJSON,
  StrokePositionJSON,
  TextNodeJSON,
  EffectJSON,
  hexToRGB,
} from "./schema";

type CommonStyleData = {
  name?: string;
  width?: number | "HUG" | "FILL";
  height?: number | "HUG" | "FILL";
  opacity?: number;
  blendMode?: BlendMode;
  fills?: PaintInputJSON[];
  strokes?: PaintInputJSON[];
  strokeWeight?: number;
  strokePosition?: StrokePositionJSON;
  strokeDashes?: number[];
  effects?: EffectJSON[];
  layoutSizingHorizontal?: "FIXED" | "HUG" | "FILL";
  layoutSizingVertical?: "FIXED" | "HUG" | "FILL";
};
type CornerData = FrameNodeJSON | RectangleNodeJSON;

function toCommonStyleData(node: NodeJSON): CommonStyleData {
  const common = { ...node } as NodeJSON & {
    type?: never;
    children?: never;
  };
  delete (common as { type?: unknown }).type;
  delete (common as { children?: unknown }).children;
  return common as CommonStyleData;
}

function clamp(value: unknown, min = 0, max = 1) {
  const number = Number(value);
  if (Number.isNaN(number)) {
    return min;
  }

  return Math.min(max, Math.max(min, number));
}

function ensurePageParent(parent: BaseNode) {
  if ("appendChild" in parent) {
    return parent as ChildrenMixin;
  }

  throw new Error("Parent node cannot accept children");
}

function appendToParent(parent: BaseNode, child: SceneNode) {
  ensurePageParent(parent).appendChild(child);
}

function rgbToFigmaColor(color: RGBColorJSON) {
  return {
    r: clamp(color.r),
    g: clamp(color.g),
    b: clamp(color.b),
  };
}

function solidPaintFromHex(hex: string): SolidPaint {
  const color = hexToRGB(hex);
  return {
    type: "SOLID",
    color: rgbToFigmaColor(color),
    opacity: color.a ?? 1,
    visible: true,
    blendMode: "NORMAL",
  };
}

function buildGradientStops(stops: GradientStopJSON[]) {
  return stops.map(function (stop) {
    return {
      position: stop.position,
      color: {
        r: clamp(stop.r),
        g: clamp(stop.g),
        b: clamp(stop.b),
        a: clamp(stop.a ?? 1),
      },
    };
  });
}

function buildLinearGradientTransform(angle: number): Transform {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return [
    [cos, sin, 0.5 - cos / 2 - sin / 2],
    [-sin, cos, 0.5 + sin / 2 - cos / 2],
  ];
}

function normalizePaint(paint: PaintInputJSON): Paint {
  if (typeof paint === "string") {
    return solidPaintFromHex(paint);
  }

  if (paint.type === "SOLID") {
    return {
      type: "SOLID",
      color: rgbToFigmaColor(paint),
      opacity: clamp(paint.a ?? 1),
      visible: true,
      blendMode: "NORMAL",
    };
  }

  if (paint.type === "LINEAR_GRADIENT") {
    return {
      type: "GRADIENT_LINEAR",
      gradientStops: buildGradientStops(paint.stops),
      gradientTransform: buildLinearGradientTransform(paint.angle),
      visible: true,
      opacity: 1,
      blendMode: "NORMAL",
    };
  }

  return {
    type: "GRADIENT_RADIAL",
    gradientStops: buildGradientStops(paint.stops),
    gradientTransform: [
      [0.5, 0, 0.25],
      [0, 0.5, 0.25],
    ],
    visible: true,
    opacity: 1,
    blendMode: "NORMAL",
  };
}

function hasFills(node: SceneNode): node is SceneNode & GeometryMixin {
  return "fills" in node;
}

function hasStrokes(node: SceneNode): node is SceneNode & GeometryMixin {
  return "strokes" in node;
}

type EffectsNode = SceneNode & { effects: ReadonlyArray<Effect> };

function hasEffects(node: SceneNode): node is EffectsNode {
  return "effects" in node;
}

export function applyFills(node: SceneNode, fills?: PaintInputJSON[]) {
  if (!hasFills(node) || fills === undefined) {
    return;
  }

  node.fills = fills.map(normalizePaint);
}

export function applyStrokes(node: SceneNode, strokes?: PaintInputJSON[]) {
  if (!hasStrokes(node) || strokes === undefined) {
    return;
  }

  node.strokes = strokes.map(normalizePaint);
}

export function applyEffects(node: SceneNode, effects?: EffectJSON[]) {
  if (!hasEffects(node) || effects === undefined) {
    return;
  }

  node.effects = effects.map(function (effect): Effect {
    if (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW") {
      return {
        type: effect.type,
        color: {
          r: clamp(effect.color.r),
          g: clamp(effect.color.g),
          b: clamp(effect.color.b),
          a: clamp(effect.color.a ?? 1),
        },
        offset: {
          x: effect.offset.x,
          y: effect.offset.y,
        },
        radius: effect.blur,
        spread: effect.spread ?? 0,
        visible: effect.visible !== false,
        blendMode: "NORMAL",
      };
    }

    if (effect.type === "LAYER_BLUR" || effect.type === "BACKGROUND_BLUR") {
      const blurEffect = effect as BlurEffectJSON;
      return {
        type: effect.type,
        radius: blurEffect.radius,
        visible: effect.visible !== false,
      };
    }

    return effect as unknown as Effect;
  });
}

function applyCommonStyles(node: SceneNode, data: CommonStyleData) {
  if (data.name) {
    node.name = data.name;
  }

  if ("resize" in node) {
    const widthValue = typeof data.width === "number" ? data.width : undefined;
    const heightValue =
      typeof data.height === "number" ? data.height : undefined;
    const layoutSizingHorizontal = data.layoutSizingHorizontal;
    const layoutSizingVertical = data.layoutSizingVertical;
    const canResizeWidth =
      widthValue !== undefined &&
      layoutSizingHorizontal !== "HUG" &&
      layoutSizingHorizontal !== "FILL";
    const canResizeHeight =
      heightValue !== undefined &&
      layoutSizingVertical !== "HUG" &&
      layoutSizingVertical !== "FILL";

    if (canResizeWidth && canResizeHeight) {
      node.resize(widthValue, heightValue);
    } else if (canResizeWidth) {
      node.resize(widthValue, node.height);
    } else if (canResizeHeight) {
      node.resize(node.width, heightValue);
    }
  }

  if (data.opacity !== undefined && "opacity" in node) {
    node.opacity = data.opacity;
  }

  if (data.blendMode !== undefined && "blendMode" in node) {
    node.blendMode = data.blendMode;
  }

  if (data.strokeWeight !== undefined && "strokeWeight" in node) {
    node.strokeWeight = data.strokeWeight;
  }

  if (data.strokePosition !== undefined && "strokeAlign" in node) {
    node.strokeAlign = data.strokePosition;
  }

  if (data.strokeDashes !== undefined && "dashPattern" in node) {
    node.dashPattern = data.strokeDashes;
  }

  applyFills(node, data.fills);
  applyStrokes(node, data.strokes);
  applyEffects(node, data.effects);
}

function applyCornerRadius(node: SceneNode, data: CornerData) {
  const mutableNode = node as unknown as {
    cornerRadius?: number;
    topLeftRadius?: number;
    topRightRadius?: number;
    bottomRightRadius?: number;
    bottomLeftRadius?: number;
  };

  if (data.cornerRadius !== undefined && "cornerRadius" in node) {
    mutableNode.cornerRadius = data.cornerRadius;
  }

  if (data.cornerRadiusIndividual && "topLeftRadius" in node) {
    mutableNode.topLeftRadius = data.cornerRadiusIndividual.topLeft;
    mutableNode.topRightRadius = data.cornerRadiusIndividual.topRight;
    mutableNode.bottomRightRadius = data.cornerRadiusIndividual.bottomRight;
    mutableNode.bottomLeftRadius = data.cornerRadiusIndividual.bottomLeft;
  }
}

function applyFrameSettings(
  node: FrameNode | ComponentNode,
  data: FrameNodeJSON,
) {
  applyCommonStyles(node, toCommonStyleData(data));
  applyCornerRadius(node, data);

  node.layoutMode =
    data.layoutMode && data.layoutMode !== "NONE" ? data.layoutMode : "NONE";

  if (data.layoutAlign !== undefined) {
    node.layoutAlign = data.layoutAlign;
  }

  if (data.primaryAxisAlignItems !== undefined) {
    node.primaryAxisAlignItems = data.primaryAxisAlignItems;
  }

  if (data.counterAxisAlignItems !== undefined) {
    node.counterAxisAlignItems = data.counterAxisAlignItems;
  }

  // NOTE: layoutSizing is intentionally NOT applied here.
  // FILL requires the node to already be a child of an auto-layout frame,
  // so it must be applied AFTER appendToParent. Call applyLayoutSizing()
  // separately once the node has been inserted into its parent.

  if (data.itemSpacing !== undefined) {
    node.itemSpacing = data.itemSpacing;
  }

  if (data.padding) {
    node.paddingTop = data.padding.top;
    node.paddingRight = data.padding.right;
    node.paddingBottom = data.padding.bottom;
    node.paddingLeft = data.padding.left;
  }

  if (data.clipsContent !== undefined) {
    node.clipsContent = data.clipsContent;
  }
}

type SizableNode = SceneNode & {
  layoutSizingHorizontal: "FIXED" | "HUG" | "FILL";
  layoutSizingVertical: "FIXED" | "HUG" | "FILL";
};

function isSizable(node: SceneNode): node is SizableNode {
  return "layoutSizingHorizontal" in node && "layoutSizingVertical" in node;
}

// Apply layoutSizing AFTER the node has been appended to its parent.
// For frames: defaults to HUG when unspecified (matches Figma's auto-layout behaviour).
// For non-frames (text, etc.): only applies what is explicitly set in data.
function applyLayoutSizing(node: SceneNode, data: CommonStyleData) {
  if (!isSizable(node)) return;

  const isFrame = node.type === "FRAME" || node.type === "COMPONENT";
  const canAutoLayout = isFrame && (node as FrameNode).layoutMode !== "NONE";

  const widthKeyword =
    data.width === "HUG" || data.width === "FILL" ? data.width : undefined;
  const heightKeyword =
    data.height === "HUG" || data.height === "FILL" ? data.height : undefined;

  const nextH =
    data.layoutSizingHorizontal ??
    (canAutoLayout
      ? (widthKeyword ?? (data.width === undefined ? "HUG" : undefined))
      : undefined);
  const nextV =
    data.layoutSizingVertical ??
    (canAutoLayout
      ? (heightKeyword ?? (data.height === undefined ? "HUG" : undefined))
      : undefined);

  if (nextH !== undefined) node.layoutSizingHorizontal = nextH;
  if (nextV !== undefined) node.layoutSizingVertical = nextV;
}

const FONT_STYLE_BY_WEIGHT: Record<number, string[]> = {
  100: ["Thin", "Regular"],
  200: ["Extra Light", "Regular"],
  300: ["Light", "Regular"],
  400: ["Regular"],
  500: ["Medium", "Regular"],
  600: ["Semi Bold", "Medium", "Regular"],
  700: ["Bold", "Regular"],
  800: ["Extra Bold", "Bold", "Regular"],
  900: ["Black", "Bold", "Regular"],
};

async function loadFontWithFallback(data: TextNodeJSON) {
  const family = data.fontFamily || "Inter";
  const candidateStyles = [];

  if (data.fontStyle) {
    candidateStyles.push(data.fontStyle);
  }

  if (data.fontWeight && FONT_STYLE_BY_WEIGHT[data.fontWeight]) {
    candidateStyles.push(...FONT_STYLE_BY_WEIGHT[data.fontWeight]);
  }

  candidateStyles.push("Regular");

  for (const style of candidateStyles) {
    try {
      await figma.loadFontAsync({
        family,
        style,
      });

      return {
        family,
        style,
      };
    } catch {
      // Try next style
    }
  }

  await figma.loadFontAsync({
    family: "Inter",
    style: "Regular",
  });

  return {
    family: "Inter",
    style: "Regular",
  };
}

function applyTextSettings(node: TextNode, data: TextNodeJSON) {
  if (data.fontSize !== undefined) {
    node.fontSize = data.fontSize;
  }

  if (data.textAlign !== undefined) {
    node.textAlignHorizontal = data.textAlign;
  }

  if (data.textDecoration !== undefined) {
    node.textDecoration = data.textDecoration;
  }

  if (data.letterSpacing !== undefined) {
    node.letterSpacing = {
      value: data.letterSpacing,
      unit: "PIXELS",
    };
  }

  if (data.lineHeight) {
    if (data.lineHeight.unit === "AUTO") {
      node.lineHeight = {
        unit: "AUTO",
      };
    } else {
      node.lineHeight = {
        value: data.lineHeight.value,
        unit: data.lineHeight.unit,
      };
    }
  }
}

function createWrapperFrame(data: NodeJSON) {
  const wrapper = figma.createFrame();
  wrapper.name = data.name ? `${data.name} Wrapper` : `${data.type} Wrapper`;
  wrapper.layoutMode = "NONE";
  wrapper.fills = [];
  wrapper.strokes = [];
  wrapper.clipsContent = false;

  if (typeof data.width === "number" && typeof data.height === "number") {
    wrapper.resize(data.width, data.height);
  }

  return wrapper;
}

async function buildChildren(
  children: NodeJSON[] | undefined,
  parent: BaseNode,
) {
  if (!children || children.length === 0) {
    return;
  }

  for (const child of children) {
    await buildNode(child, parent);
  }
}

export async function buildNode(node: NodeJSON, parent: BaseNode) {
  if (node.type === "FRAME") {
    const frame = figma.createFrame();
    applyFrameSettings(frame, node);
    appendToParent(parent, frame);
    applyLayoutSizing(frame, toCommonStyleData(node));
    await buildChildren(node.children, frame);
    return frame;
  }

  if (node.type === "TEXT") {
    const text = figma.createText();
    const fontName = await loadFontWithFallback(node);
    text.fontName = fontName;
    text.characters = node.characters;
    applyCommonStyles(text, toCommonStyleData(node));
    applyTextSettings(text, node);

    if (typeof node.width === "number" && typeof node.height === "number") {
      text.resize(node.width, node.height);
    }

    if (node.children && node.children.length > 0) {
      const wrapper = createWrapperFrame(node);
      appendToParent(parent, wrapper);
      wrapper.appendChild(text);
      await buildChildren(node.children, wrapper);
      return wrapper;
    }

    appendToParent(parent, text);
    applyLayoutSizing(text, toCommonStyleData(node));
    return text;
  }

  if (node.type === "RECTANGLE") {
    const rectangle = figma.createRectangle();
    applyCommonStyles(rectangle, toCommonStyleData(node));
    applyCornerRadius(rectangle, node);

    if (node.children && node.children.length > 0) {
      const wrapper = createWrapperFrame(node);
      appendToParent(parent, wrapper);
      wrapper.appendChild(rectangle);
      await buildChildren(node.children, wrapper);
      return wrapper;
    }

    appendToParent(parent, rectangle);
    return rectangle;
  }

  const ellipse = figma.createEllipse();
  applyCommonStyles(ellipse, toCommonStyleData(node));

  if (node.children && node.children.length > 0) {
    const wrapper = createWrapperFrame(node);
    appendToParent(parent, wrapper);
    wrapper.appendChild(ellipse);
    await buildChildren(node.children, wrapper);
    return wrapper;
  }

  appendToParent(parent, ellipse);
  return ellipse;
}

function formatVariantName(
  properties: Record<string, string>,
  propertyOrder: string[],
) {
  return propertyOrder
    .map(function (key) {
      return `${key}=${properties[key]}`;
    })
    .join(", ");
}

function positionVariantsAsGrid(variants: ComponentNode[], gap = 40) {
  if (variants.length === 0) {
    return;
  }

  const columns = Math.max(1, Math.ceil(Math.sqrt(variants.length)));
  const rowHeights: number[] = [];
  const columnWidths: number[] = [];

  variants.forEach(function (variant, index) {
    const row = Math.floor(index / columns);
    const column = index % columns;
    rowHeights[row] = Math.max(rowHeights[row] || 0, variant.height);
    columnWidths[column] = Math.max(columnWidths[column] || 0, variant.width);
  });

  variants.forEach(function (variant, index) {
    const row = Math.floor(index / columns);
    const column = index % columns;

    let x = 0;
    let y = 0;

    for (let columnIndex = 0; columnIndex < column; columnIndex += 1) {
      x += (columnWidths[columnIndex] || 0) + gap;
    }

    for (let rowIndex = 0; rowIndex < row; rowIndex += 1) {
      y += (rowHeights[rowIndex] || 0) + gap;
    }

    variant.x = x;
    variant.y = y;
  });
}

export async function buildComponentSet(json: ComponentSetJSON) {
  const propertyOrder = Object.keys(json.variantProperties);
  const components: ComponentNode[] = [];

  const variantNodeDatas: (FrameNodeJSON | null)[] = [];

  for (const variant of json.variants) {
    const component = figma.createComponent();
    component.name = formatVariantName(variant.properties, propertyOrder);

    if (variant.node.type === "FRAME") {
      const nodeData: FrameNodeJSON = { ...variant.node };
      delete nodeData.name;
      applyFrameSettings(component, nodeData);
      await buildChildren(nodeData.children, component);
      variantNodeDatas.push(nodeData);
    } else {
      await buildNode(variant.node, component);
      variantNodeDatas.push(null);
    }

    components.push(component);
  }

  positionVariantsAsGrid(components, 40);

  const componentSet = figma.combineAsVariants(components, figma.currentPage);

  // Apply layoutSizing AFTER combineAsVariants — root ComponentNodes are now
  // children of the ComponentSet (an auto-layout frame), so FILL is valid.
  components.forEach(function (component, i) {
    const nodeData = variantNodeDatas[i];
    if (nodeData !== null) {
      applyLayoutSizing(component, toCommonStyleData(nodeData));
    }
  });
  componentSet.name = json.name;

  if (json.description && "description" in componentSet) {
    componentSet.description = json.description;
  }

  const variantNodes = componentSet.children.filter(function (node) {
    return node.type === "COMPONENT";
  }) as ComponentNode[];

  positionVariantsAsGrid(variantNodes, 40);

  componentSet.x = figma.viewport.center.x - componentSet.width / 2;
  componentSet.y = figma.viewport.center.y - componentSet.height / 2;

  return componentSet;
}
