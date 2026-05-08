/**
 * schema-validator.js
 *
 * ES module port of src/schema.ts validateSchema().
 * Pure JS, no external dependencies.
 * Exports: validateSchema(json) → { valid: boolean, errors?: string[] }
 */

const VALID_NODE_TYPES = new Set(["FRAME", "TEXT", "RECTANGLE", "ELLIPSE"]);
const VALID_BLEND_MODES = new Set(["NORMAL", "MULTIPLY", "SCREEN", "OVERLAY"]);
const VALID_LAYOUT_MODES = new Set(["HORIZONTAL", "VERTICAL", "NONE"]);
const VALID_LAYOUT_ALIGN = new Set(["MIN", "CENTER", "MAX", "STRETCH"]);
const VALID_AXIS_ALIGN = new Set(["MIN", "CENTER", "MAX", "SPACE_BETWEEN"]);
const VALID_COUNTER_ALIGN = new Set(["MIN", "CENTER", "MAX"]);
const VALID_LAYOUT_SIZING = new Set(["FIXED", "HUG", "FILL"]);
const VALID_STROKE_POS = new Set(["INSIDE", "OUTSIDE", "CENTER"]);
const VALID_TEXT_ALIGN = new Set(["LEFT", "CENTER", "RIGHT", "JUSTIFIED"]);
const VALID_TEXT_DECO = new Set(["NONE", "UNDERLINE", "STRIKETHROUGH"]);
const VALID_FONT_WEIGHTS = new Set([
  100, 200, 300, 400, 500, 600, 700, 800, 900,
]);

function isObj(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isStr(v) {
  return typeof v === "string" && v.trim().length > 0;
}
function isNum(v) {
  return typeof v === "number" && Number.isFinite(v);
}
function isSizeKw(v) {
  return v === "HUG" || v === "FILL";
}

function validateHex(hex) {
  const clean = String(hex).trim().replace("#", "");
  const norm =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return norm.length === 6 && /^[0-9a-fA-F]{6}$/.test(norm);
}

function valSize(v, path, errors) {
  if (v === undefined) return;
  if (!isNum(v) && !isSizeKw(v))
    errors.push(`${path} must be a number, "HUG", or "FILL"`);
}

function valOpacity(v, path, errors) {
  if (v === undefined) return;
  if (!isNum(v) || v < 0 || v > 1)
    errors.push(`${path} must be a number between 0 and 1`);
}

function valColor(c, path, errors) {
  if (!isObj(c)) {
    errors.push(`${path} must be a color object`);
    return;
  }
  for (const ch of ["r", "g", "b"]) {
    if (typeof c[ch] !== "number" || !isNum(c[ch]) || c[ch] < 0 || c[ch] > 1)
      errors.push(`${path}.${ch} must be a number between 0 and 1`);
  }
  if (c.a !== undefined && (typeof c.a !== "number" || c.a < 0 || c.a > 1))
    errors.push(`${path}.a must be a number between 0 and 1`);
}

function valStops(stops, path, errors) {
  if (!Array.isArray(stops) || stops.length === 0) {
    errors.push(`${path} must be a non-empty array of gradient stops`);
    return;
  }
  stops.forEach((stop, i) => {
    const p = `${path}[${i}]`;
    if (!isObj(stop)) {
      errors.push(`${p} must be a gradient stop object`);
      return;
    }
    const pos = stop.position;
    if (typeof pos !== "number" || !isNum(pos) || pos < 0 || pos > 1)
      errors.push(`${p}.position must be a number between 0 and 1`);
    valColor(stop, p, errors);
  });
}

function valPaints(arr, path, errors) {
  if (arr === undefined) return;
  if (!Array.isArray(arr)) {
    errors.push(`${path} must be an array`);
    return;
  }
  arr.forEach((p, i) => {
    const pp = `${path}[${i}]`;
    if (typeof p === "string") {
      if (!validateHex(p)) errors.push(`${pp} has invalid hex fill "${p}"`);
      return;
    }
    if (!isObj(p)) {
      errors.push(`${pp} must be a paint object or hex string`);
      return;
    }
    if (p.type === "SOLID") {
      valColor(p, pp, errors);
      return;
    }
    if (p.type === "LINEAR_GRADIENT") {
      valStops(p.stops, `${pp}.stops`, errors);
      if (!isNum(p.angle)) errors.push(`${pp}.angle must be a number`);
      return;
    }
    if (p.type === "RADIAL_GRADIENT") {
      valStops(p.stops, `${pp}.stops`, errors);
      return;
    }
    errors.push(
      `${pp}.type must be SOLID, LINEAR_GRADIENT, or RADIAL_GRADIENT`,
    );
  });
}

function valEffects(arr, path, errors) {
  if (arr === undefined) return;
  if (!Array.isArray(arr)) {
    errors.push(`${path} must be an array`);
    return;
  }
  arr.forEach((eff, i) => {
    const ep = `${path}[${i}]`;
    if (!isObj(eff)) {
      errors.push(`${ep} must be an effect object`);
      return;
    }
    if (eff.type === "DROP_SHADOW" || eff.type === "INNER_SHADOW") {
      valColor(eff.color, `${ep}.color`, errors);
      if (!isObj(eff.offset))
        errors.push(`${ep}.offset must be an object with x and y`);
      else {
        if (!isNum(eff.offset.x))
          errors.push(`${ep}.offset.x must be a number`);
        if (!isNum(eff.offset.y))
          errors.push(`${ep}.offset.y must be a number`);
      }
      if (!isNum(eff.blur)) errors.push(`${ep}.blur must be a number`);
      if (eff.spread !== undefined && !isNum(eff.spread))
        errors.push(`${ep}.spread must be a number`);
      return;
    }
    if (eff.type === "LAYER_BLUR" || eff.type === "BACKGROUND_BLUR") {
      if (!isNum(eff.radius)) errors.push(`${ep}.radius must be a number`);
      return;
    }
    errors.push(
      `${ep}.type must be DROP_SHADOW, INNER_SHADOW, LAYER_BLUR, or BACKGROUND_BLUR`,
    );
  });
}

function valPadding(v, path, errors) {
  if (!isObj(v)) {
    errors.push(`${path} must be an object with top, right, bottom, and left`);
    return;
  }
  for (const s of ["top", "right", "bottom", "left"])
    if (!isNum(v[s])) errors.push(`${path}.${s} must be a number`);
}

function valCornerIndividual(v, path, errors) {
  if (!isObj(v)) {
    errors.push(
      `${path} must be an object with topLeft, topRight, bottomRight, and bottomLeft`,
    );
    return;
  }
  for (const k of ["topLeft", "topRight", "bottomRight", "bottomLeft"])
    if (!isNum(v[k])) errors.push(`${path}.${k} must be a number`);
}

function valNode(node, path, errors) {
  if (!isObj(node)) {
    errors.push(`${path} must be an object`);
    return;
  }
  const type = node.type;
  if (typeof type !== "string" || !VALID_NODE_TYPES.has(type)) {
    errors.push(
      `${path}.type must be one of FRAME, TEXT, RECTANGLE, or ELLIPSE`,
    );
    return;
  }
  if (node.name !== undefined && !isStr(node.name))
    errors.push(`${path}.name must be a non-empty string when provided`);
  valSize(node.width, `${path}.width`, errors);
  valSize(node.height, `${path}.height`, errors);
  valOpacity(node.opacity, `${path}.opacity`, errors);
  if (node.blendMode !== undefined && !VALID_BLEND_MODES.has(node.blendMode))
    errors.push(
      `${path}.blendMode must be NORMAL, MULTIPLY, SCREEN, or OVERLAY`,
    );
  if (node.strokeWeight !== undefined && !isNum(node.strokeWeight))
    errors.push(`${path}.strokeWeight must be a number`);
  if (
    node.strokePosition !== undefined &&
    !VALID_STROKE_POS.has(node.strokePosition)
  )
    errors.push(`${path}.strokePosition must be INSIDE, OUTSIDE, or CENTER`);
  if (
    node.strokeDashes !== undefined &&
    (!Array.isArray(node.strokeDashes) ||
      node.strokeDashes.some((x) => !isNum(x)))
  )
    errors.push(`${path}.strokeDashes must be an array of numbers`);
  valPaints(node.fills, `${path}.fills`, errors);
  valPaints(node.strokes, `${path}.strokes`, errors);
  valEffects(node.effects, `${path}.effects`, errors);

  if (type === "FRAME") {
    if (
      node.layoutMode !== undefined &&
      !VALID_LAYOUT_MODES.has(node.layoutMode)
    )
      errors.push(`${path}.layoutMode must be HORIZONTAL, VERTICAL, or NONE`);
    if (
      node.layoutAlign !== undefined &&
      !VALID_LAYOUT_ALIGN.has(node.layoutAlign)
    )
      errors.push(`${path}.layoutAlign must be MIN, CENTER, MAX, or STRETCH`);
    if (
      node.primaryAxisAlignItems !== undefined &&
      !VALID_AXIS_ALIGN.has(node.primaryAxisAlignItems)
    )
      errors.push(
        `${path}.primaryAxisAlignItems must be MIN, CENTER, MAX, or SPACE_BETWEEN`,
      );
    if (
      node.counterAxisAlignItems !== undefined &&
      !VALID_COUNTER_ALIGN.has(node.counterAxisAlignItems)
    )
      errors.push(`${path}.counterAxisAlignItems must be MIN, CENTER, or MAX`);
    if (
      node.layoutSizingHorizontal !== undefined &&
      !VALID_LAYOUT_SIZING.has(node.layoutSizingHorizontal)
    )
      errors.push(`${path}.layoutSizingHorizontal must be FIXED, HUG, or FILL`);
    if (
      node.layoutSizingVertical !== undefined &&
      !VALID_LAYOUT_SIZING.has(node.layoutSizingVertical)
    )
      errors.push(`${path}.layoutSizingVertical must be FIXED, HUG, or FILL`);

    const hasAutoLayout = node.layoutMode && node.layoutMode !== "NONE";
    if (
      (node.layoutSizingHorizontal !== undefined ||
        node.layoutSizingVertical !== undefined) &&
      !hasAutoLayout
    )
      errors.push(
        `${path}.layoutSizingHorizontal/layoutSizingVertical require layoutMode to be HORIZONTAL or VERTICAL`,
      );
    if ((isSizeKw(node.width) || isSizeKw(node.height)) && !hasAutoLayout)
      errors.push(
        `${path}.width/height "HUG" or "FILL" require layoutMode to be HORIZONTAL or VERTICAL`,
      );

    if (hasAutoLayout) {
      if (!isNum(node.itemSpacing))
        errors.push(
          `${path}.itemSpacing must be a number when layoutMode is HORIZONTAL or VERTICAL`,
        );
      if (node.padding === undefined)
        errors.push(
          `${path}.padding is required when layoutMode is HORIZONTAL or VERTICAL`,
        );
      else valPadding(node.padding, `${path}.padding`, errors);
    } else {
      if (node.itemSpacing !== undefined && !isNum(node.itemSpacing))
        errors.push(`${path}.itemSpacing must be a number`);
      if (node.padding !== undefined)
        valPadding(node.padding, `${path}.padding`, errors);
    }
    if (node.cornerRadius !== undefined && !isNum(node.cornerRadius))
      errors.push(`${path}.cornerRadius must be a number`);
    if (node.cornerRadiusIndividual !== undefined)
      valCornerIndividual(
        node.cornerRadiusIndividual,
        `${path}.cornerRadiusIndividual`,
        errors,
      );
  } else {
    if (isSizeKw(node.width) || isSizeKw(node.height))
      errors.push(
        `${path}.width/height "HUG" or "FILL" are only valid for FRAME nodes`,
      );
  }

  if (type === "TEXT") {
    if (typeof node.characters !== "string")
      errors.push(`${path}.characters must be a string`);
    if (node.fontSize !== undefined && !isNum(node.fontSize))
      errors.push(`${path}.fontSize must be a number`);
    if (
      node.fontWeight !== undefined &&
      !VALID_FONT_WEIGHTS.has(node.fontWeight)
    )
      errors.push(
        `${path}.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, 900`,
      );
    if (node.fontFamily !== undefined && !isStr(node.fontFamily))
      errors.push(`${path}.fontFamily must be a non-empty string`);
    if (
      node.fontStyle !== undefined &&
      !["Regular", "Medium", "Bold", "Italic"].includes(node.fontStyle)
    )
      errors.push(`${path}.fontStyle must be Regular, Medium, Bold, or Italic`);
    if (node.textAlign !== undefined && !VALID_TEXT_ALIGN.has(node.textAlign))
      errors.push(
        `${path}.textAlign must be LEFT, CENTER, RIGHT, or JUSTIFIED`,
      );
    if (
      node.textDecoration !== undefined &&
      !VALID_TEXT_DECO.has(node.textDecoration)
    )
      errors.push(
        `${path}.textDecoration must be NONE, UNDERLINE, or STRIKETHROUGH`,
      );
    if (node.letterSpacing !== undefined && !isNum(node.letterSpacing))
      errors.push(`${path}.letterSpacing must be a number`);
    if (node.lineHeight !== undefined) {
      if (!isObj(node.lineHeight)) {
        errors.push(`${path}.lineHeight must be an object`);
      } else {
        const unit = node.lineHeight.unit;
        if (unit === "AUTO") {
          /* valid */
        } else if (unit === "PIXELS" || unit === "PERCENT") {
          if (!isNum(node.lineHeight.value))
            errors.push(`${path}.lineHeight.value must be a number`);
        } else {
          errors.push(
            `${path}.lineHeight.unit must be PIXELS, PERCENT, or AUTO`,
          );
        }
      }
    }
  }

  if (type === "RECTANGLE") {
    if (node.cornerRadius !== undefined && !isNum(node.cornerRadius))
      errors.push(`${path}.cornerRadius must be a number`);
    if (node.cornerRadiusIndividual !== undefined)
      valCornerIndividual(
        node.cornerRadiusIndividual,
        `${path}.cornerRadiusIndividual`,
        errors,
      );
  }

  if (node.children !== undefined) {
    if (!Array.isArray(node.children)) {
      errors.push(`${path}.children must be an array`);
    } else
      node.children.forEach((child, i) =>
        valNode(child, `${path}.children[${i}]`, errors),
      );
  }
}

/**
 * Validate a parsed JSON value against the AI2Design ComponentSet schema.
 * @param {unknown} json
 * @returns {{ valid: true } | { valid: false, errors: string[] }}
 */
export function validateSchema(json) {
  const errors = [];

  if (!isObj(json))
    return { valid: false, errors: ["Root JSON must be an object"] };

  if (!isStr(json.name))
    errors.push("name is required and must be a non-empty string");
  if (json.type !== "COMPONENT_SET")
    errors.push('type must be "COMPONENT_SET"');
  if (json.description !== undefined && typeof json.description !== "string")
    errors.push("description must be a string when provided");
  if (!isObj(json.variantProperties)) {
    errors.push("variantProperties is required and must be an object");
  } else {
    const keys = Object.keys(json.variantProperties);
    if (keys.length === 0)
      errors.push("variantProperties must declare at least one property");
    keys.forEach((key) => {
      const vals = json.variantProperties[key];
      if (!Array.isArray(vals) || vals.length === 0)
        errors.push(
          `variantProperties.${key} must be a non-empty array of strings`,
        );
      else
        vals.forEach((v, i) => {
          if (!isStr(v))
            errors.push(
              `variantProperties.${key}[${i}] must be a non-empty string`,
            );
        });
    });
  }
  if (!Array.isArray(json.variants) || json.variants.length === 0)
    errors.push("variants is required and must be a non-empty array");

  if (errors.length > 0) return { valid: false, errors };

  const propKeys = Object.keys(json.variantProperties);
  const seen = new Set();

  json.variants.forEach((variant, vi) => {
    const vp = `variants[${vi}]`;
    if (!isObj(variant)) {
      errors.push(`${vp} must be an object`);
      return;
    }
    if (!isObj(variant.properties))
      errors.push(`${vp}.properties is required and must be an object`);
    if (!isObj(variant.node))
      errors.push(`${vp}.node is required and must be an object`);

    if (isObj(variant.properties)) {
      const provided = Object.keys(variant.properties);
      const extra = provided.filter((k) => !propKeys.includes(k));
      const missing = propKeys.filter((k) => !provided.includes(k));
      if (extra.length)
        errors.push(
          `${vp}.properties has unexpected keys: ${extra.join(", ")}`,
        );
      if (missing.length)
        errors.push(`${vp}.properties is missing keys: ${missing.join(", ")}`);
      propKeys.forEach((key) => {
        const allowed = json.variantProperties[key];
        const val = variant.properties[key];
        if (!isStr(val)) {
          errors.push(`${vp}.properties.${key} must be a non-empty string`);
          return;
        }
        if (!allowed.includes(val))
          errors.push(
            `${vp}.properties.${key} must be one of: ${allowed.join(", ")}`,
          );
      });
      const combo = propKeys
        .map((k) => `${k}=${variant.properties[k]}`)
        .join("|");
      if (seen.has(combo))
        errors.push(`${vp}.properties duplicates another variant combination`);
      else seen.add(combo);
    }
    if (isObj(variant.node)) valNode(variant.node, `${vp}.node`, errors);
  });

  return errors.length > 0 ? { valid: false, errors } : { valid: true };
}
