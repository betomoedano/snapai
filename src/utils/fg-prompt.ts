import { StyleTemplates, type IconStyle } from "./styleTemplates.js";

function resolveStylePreset(style?: string): { preset?: IconStyle; text?: string } {
  if (!style) return {};
  const normalized = style.trim().toLowerCase();
  const available = StyleTemplates.getAvailableStyles() as readonly string[];
  if (available.includes(normalized)) {
    return { preset: normalized as IconStyle };
  }
  return { text: style.trim() };
}

export function buildFeatureGraphicPrompt(params: {
  prompt: string;
  rawPrompt?: boolean;
  style?: string;
  appName?: string;
}): string {
  const { prompt, rawPrompt = false, style, appName } = params;

  const styleResolved = resolveStylePreset(style);
  const presetDirective = styleResolved.preset
    ? StyleTemplates.getStyleDirective(styleResolved.preset)
    : null;

  // Raw mode
  if (rawPrompt) {
    if (!styleResolved.preset && !styleResolved.text) {
      return prompt;
    }

    if (styleResolved.preset && presetDirective) {
      return [
        `STYLE PRESET (dominant): ${styleResolved.preset}`,
        `Style directive (must dominate all decisions): ${presetDirective}`,
        ``,
        `User prompt: ${prompt}`,
      ].join("\n");
    }

    return [
      `STYLE (dominant): ${styleResolved.text}`,
      ``,
      `User prompt: ${prompt}`,
    ].join("\n");
  }

  const appNameLine = appName
    ? `Include "${appName}" as large, bold, clearly readable text prominently placed on the banner.`
    : null;

  // Layer 1 - Context & concept
  const layer1 = [
    `Create a Google Play Store feature graphic — a landscape marketing banner (1024x500px).`,
    `This is NOT an app icon. It is a billboard/hero-image composition for a store listing.`,
    ``,
    `Subject/theme: ${prompt}`,
    ``,
    appNameLine,
    `Design direction:`,
    `- Horizontal flow, bold high-contrast visuals`,
    `- Main visual fills the frame with no large empty margins`,
    `- Eye-catching at thumbnail size, professional at full size`,
    `- Modern, polished promotional banner aesthetic`,
    `- No device mockups, phone frames, or screenshots`,
    `- No small text or fine details that won't read at thumbnail`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  // Layer 2 - Constraints
  const layer2 = [
    `Technical constraints:`,
    `Landscape aspect ratio approximately 2:1 (1024x500).`,
    `Main visual fills the frame — no large margins or padding.`,
    `Safe zone: keep critical content (text, logo) within central 80%.`,
    `Opaque background required (no transparency).`,
    `Must be readable and impactful at thumbnail size.`,
    `No text/typography unless explicitly requested via app name.`,
    `No watermarks or logos unless explicitly requested.`,
  ].join("\n");

  // Layer 3 - Style
  const styleLine = styleResolved.preset
    ? [
        `Primary style preset (dominant): ${styleResolved.preset}`,
        `Style intent: ${StyleTemplates.getStyleDescription(styleResolved.preset)}`,
        `Style directive (must dominate all decisions): ${presetDirective}`,
        `Do not mix in other conflicting materials/styles.`,
      ].join("\n")
    : styleResolved.text
      ? `Style: ${styleResolved.text}`
      : null;

  const layer3 = styleLine
    ? [
        ``,
        `Style system:`,
        styleResolved.preset
          ? `This preset is the base art direction and is a HARD constraint. If any other instruction conflicts, the style rules win.`
          : `Apply the style after the concept is defined.`,
        styleLine,
      ].join("\n")
    : "";

  return `${layer1}\n\n${layer2}${layer3}`;
}
