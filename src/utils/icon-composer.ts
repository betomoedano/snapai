export const ICON_COMPOSER_SIZE = 512 as const;

export const ICON_COMPOSER_MIN_LAYERS = 1 as const;
export const ICON_COMPOSER_MAX_LAYERS = 12 as const;

export const ICON_COMPOSER_COLORS = [
  "#111827",
  "#FFFFFF",
  "#3B82F6",
] as const;

export type IconComposerColor = (typeof ICON_COMPOSER_COLORS)[number];

export const ICON_COMPOSER_SHAPES = [
  "rounded-rect",
  "rect",
  "lines",
  "badge",
] as const;

export type IconComposerShape = (typeof ICON_COMPOSER_SHAPES)[number];

export type IconComposerLayer =
  | {
      id: string;
      type: string;
      shape: "rounded-rect";
      fill: IconComposerColor;
      x: number;
      y: number;
      w: number;
      h: number;
      radius: number;
    }
  | {
      id: string;
      type: string;
      shape: "rect";
      fill: IconComposerColor;
      x: number;
      y: number;
      w: number;
      h: number;
    }
  | {
      id: string;
      type: string;
      shape: "lines";
      fill: IconComposerColor;
      x: number;
      y: number;
      w: number;
      h: number;
      count: number;
      gap: number;
      direction: "horizontal" | "vertical";
    }
  | {
      id: string;
      type: string;
      shape: "badge";
      fill: IconComposerColor;
      x: number;
      y: number;
      w: number;
      h: number;
      radius: number;
    };

export interface IconComposerPlan {
  icon: {
    size: typeof ICON_COMPOSER_SIZE;
    layers: IconComposerLayer[];
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isAllowedColor(value: unknown): value is IconComposerColor {
  return (
    isString(value) &&
    (ICON_COMPOSER_COLORS as readonly string[]).includes(value)
  );
}

function isShape(value: unknown): value is IconComposerShape {
  return (
    isString(value) &&
    (ICON_COMPOSER_SHAPES as readonly string[]).includes(value)
  );
}

function assertIntInRange(
  value: unknown,
  label: string,
  min: number,
  max: number
): asserts value is number {
  assert(isNumber(value), `${label} must be a number`);
  assert(Number.isInteger(value), `${label} must be an integer`);
  assert(value >= min && value <= max, `${label} must be between ${min}-${max}`);
}

function parseBox(
  layerId: string,
  x: unknown,
  y: unknown,
  w: unknown,
  h: unknown
): { x: number; y: number; w: number; h: number } {
  assertIntInRange(x, `${layerId}.x`, 0, ICON_COMPOSER_SIZE);
  assertIntInRange(y, `${layerId}.y`, 0, ICON_COMPOSER_SIZE);
  assertIntInRange(w, `${layerId}.w`, 1, ICON_COMPOSER_SIZE);
  assertIntInRange(h, `${layerId}.h`, 1, ICON_COMPOSER_SIZE);
  assert(
    x + w <= ICON_COMPOSER_SIZE,
    `${layerId}: x + w must be <= ${ICON_COMPOSER_SIZE}`
  );
  assert(
    y + h <= ICON_COMPOSER_SIZE,
    `${layerId}: y + h must be <= ${ICON_COMPOSER_SIZE}`
  );

  return { x, y, w, h };
}

function parseRadius(
  layerId: string,
  radius: unknown,
  w: number,
  h: number
): number {
  assertIntInRange(
    radius,
    `${layerId}.radius`,
    0,
    Math.floor(Math.min(w, h) / 2)
  );
  return radius;
}

function assertLayer(raw: unknown, index: number): IconComposerLayer {
  assert(isObject(raw), `Layer[${index}] must be an object`);
  const id = (raw as any).id;
  const type = (raw as any).type;
  const shape = (raw as any).shape;
  const fill = (raw as any).fill;

  assert(isString(id) && id.trim().length > 0, `Layer[${index}].id must be a non-empty string`);
  assert(isString(type) && type.trim().length > 0, `Layer[${index}].type must be a non-empty string`);
  assert(isShape(shape), `Layer[${index}].shape must be one of: ${ICON_COMPOSER_SHAPES.join(", ")}`);
  assert(isAllowedColor(fill), `Layer[${index}].fill must be one of: ${ICON_COMPOSER_COLORS.join(", ")}`);

  // Disallow AI-provided path data (determinism requirement)
  assert(
    !("d" in raw) && !("path" in raw) && !("paths" in raw),
    `Layer[${index}] must not include path data (d/path/paths)`
  );

  if (shape === "rounded-rect") {
    const { x, y, w, h, radius } = raw as any;
    const box = parseBox(String(id), x, y, w, h);
    const r = parseRadius(String(id), radius, box.w, box.h);
    return {
      id,
      type,
      shape,
      fill,
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      radius: r,
    };
  }

  if (shape === "rect") {
    const { x, y, w, h } = raw as any;
    const box = parseBox(String(id), x, y, w, h);
    return { id, type, shape, fill, ...box };
  }

  if (shape === "lines") {
    const { x, y, w, h, count, gap, direction } = raw as any;
    const box = parseBox(String(id), x, y, w, h);
    assertIntInRange(count, `${id}.count`, 1, 32);
    assertIntInRange(gap, `${id}.gap`, 0, ICON_COMPOSER_SIZE);
    assert(
      direction === "horizontal" || direction === "vertical",
      `${id}.direction must be "horizontal" or "vertical"`
    );
    return {
      id,
      type,
      shape,
      fill,
      ...box,
      count,
      gap,
      direction,
    };
  }

  // badge
  const { x, y, w, h, radius } = raw as any;
  const box = parseBox(String(id), x, y, w, h);
  const r = parseRadius(String(id), radius, box.w, box.h);
  return { id, type, shape, fill, ...box, radius: r };
}

export function parseAndValidateIconComposerPlan(raw: unknown): IconComposerPlan {
  assert(isObject(raw), "Planner response must be an object");
  assert("icon" in raw, 'Planner response must include "icon"');
  const icon = (raw as any).icon;

  assert(isObject(icon), '"icon" must be an object');
  assert(
    (icon as any).size === ICON_COMPOSER_SIZE,
    `icon.size must be ${ICON_COMPOSER_SIZE}`
  );

  const layers = (icon as any).layers;
  assert(Array.isArray(layers), "icon.layers must be an array");
  assert(
    layers.length >= ICON_COMPOSER_MIN_LAYERS &&
      layers.length <= ICON_COMPOSER_MAX_LAYERS,
    `icon.layers must have between ${ICON_COMPOSER_MIN_LAYERS}-${ICON_COMPOSER_MAX_LAYERS} layers`
  );

  const validatedLayers = layers.map((layer: unknown, i: number) =>
    assertLayer(layer, i)
  );

  // Strong-but-flexible convention: background first
  const first = validatedLayers[0];
  assert(
    first.id === "background" || first.type === "background",
    `First layer should be background (id/type "background")`
  );

  return {
    icon: {
      size: ICON_COMPOSER_SIZE,
      layers: validatedLayers,
    },
  };
}

export function svgWrapSinglePath(pathD: string, fill: IconComposerColor): string {
  // Icon Composer rules: keep it flat, no groups/defs/filters/images/etc.
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_COMPOSER_SIZE}" height="${ICON_COMPOSER_SIZE}" viewBox="0 0 ${ICON_COMPOSER_SIZE} ${ICON_COMPOSER_SIZE}">`,
    `<path d="${pathD}" fill="${fill}" />`,
    `</svg>`,
    ``,
  ].join("\n");
}

export function rectPath(x: number, y: number, w: number, h: number): string {
  // Move -> draw rectangle -> close
  return `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;
}

export function roundedRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): string {
  const rx = Math.min(r, Math.floor(w / 2));
  const ry = Math.min(r, Math.floor(h / 2));

  // Clockwise rounded rect using arc commands
  const x0 = x;
  const y0 = y;
  const x1 = x + w;
  const y1 = y + h;

  return [
    `M ${x0 + rx} ${y0}`,
    `H ${x1 - rx}`,
    `A ${rx} ${ry} 0 0 1 ${x1} ${y0 + ry}`,
    `V ${y1 - ry}`,
    `A ${rx} ${ry} 0 0 1 ${x1 - rx} ${y1}`,
    `H ${x0 + rx}`,
    `A ${rx} ${ry} 0 0 1 ${x0} ${y1 - ry}`,
    `V ${y0 + ry}`,
    `A ${rx} ${ry} 0 0 1 ${x0 + rx} ${y0}`,
    `Z`,
  ].join(" ");
}

export function linesPath(params: {
  x: number;
  y: number;
  w: number;
  h: number;
  count: number;
  gap: number;
  direction: "horizontal" | "vertical";
}): string {
  const { x, y, w, h, count, gap, direction } = params;

  // Render as filled thin rectangles merged into one path d.
  // Thickness is derived deterministically from available space.
  const thickness =
    direction === "horizontal"
      ? Math.max(1, Math.floor((h - gap * (count - 1)) / count))
      : Math.max(1, Math.floor((w - gap * (count - 1)) / count));

  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    if (direction === "horizontal") {
      const yy = y + i * (thickness + gap);
      if (yy + thickness > y + h) break;
      parts.push(rectPath(x, yy, w, thickness));
    } else {
      const xx = x + i * (thickness + gap);
      if (xx + thickness > x + w) break;
      parts.push(rectPath(xx, y, thickness, h));
    }
  }

  // Join as one compound path.
  return parts.join(" ");
}

export function renderIconComposerLayer(layer: IconComposerLayer): string {
  let d: string;
  if (layer.shape === "rect") {
    d = rectPath(layer.x, layer.y, layer.w, layer.h);
  } else if (layer.shape === "rounded-rect") {
    d = roundedRectPath(layer.x, layer.y, layer.w, layer.h, layer.radius);
  } else if (layer.shape === "lines") {
    d = linesPath(layer);
  } else {
    // badge treated as rounded rect for deterministic output
    d = roundedRectPath(layer.x, layer.y, layer.w, layer.h, layer.radius);
  }

  return svgWrapSinglePath(d, layer.fill);
}

