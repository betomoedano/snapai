import { StyleTemplates, type IconStyle } from "./styleTemplates.js";

// Shared "always-on" rules to prevent common generation failure modes.
const ICON_BASE_CONTEXT_LINES = [
  `Context: standalone symbol/illustration for general use, not an app launcher icon or UI mockup.`,
  `Do not design or imply an app icon, logo plate, badge, or rounded-square container, even if the user prompt mentions "app icon", "logo", "badge", or similar terms.`,
  `Do not draw an icon inside a larger canvas. No outer margins, padding, or separate card background.`,
  `Do not draw any rounded-square tile, card, or container behind the subject.`,
  `The canvas itself is a perfect square with sharp 90° corners; do not simulate rounded-corner app icon masks or device-rounded corners.`,
  `No global drop shadows, long cast shadows, outer glows, or halos around the subject or canvas.`,
  `No UI mockups. No borders, frames, stickers, app plates, or device chrome.`,
  `No text/typography (letters, numbers, monograms). No watermark.`,
  `Not a full photo/portrait/real-world scene. No realistic human faces as the main subject.`,
  `Do not copy or imitate real brand logos, trademarked shapes, or recognizable brand marks.`,
] as const;

// Simple, high-signal technical constraints (kept short to avoid repetition).
const ICON_BASE_RULES_LINES = [
  `Square 1:1 aspect ratio.`,
  `Main subject fills 92–98% of the canvas (zoom in; avoid excessive empty space).`,
  `Center/balance the silhouette. Keep critical details within ~5–8% safe area.`,
  `Android-safe: keep critical details within central ~70% (silhouette may extend).`,
  `Background extends to all four edges of the square canvas with straight (non-rounded) corners; keep it clean (low-detail, low-noise).`,
] as const;

// Resolves `--style` into either a known preset or a free-form style string.
function resolveStylePreset(style?: string): { preset?: IconStyle; text?: string } {
  if (!style) return {};
  const normalized = style.trim().toLowerCase();
  const available = StyleTemplates.getAvailableStyles() as readonly string[];
  if (available.includes(normalized)) {
    return { preset: normalized as IconStyle };
  }
  return { text: style.trim() };
}

export function buildFinalIconPrompt(params: {
  prompt: string;
  rawPrompt?: boolean;
  style?: string;
  useIconWords?: boolean;
}): string {
  const {
    prompt,
    rawPrompt = false,
    style,
    useIconWords = false,
  } = params;

  const styleResolved = resolveStylePreset(style);
  const presetDirective = styleResolved.preset
    ? StyleTemplates.getStyleDirective(styleResolved.preset)
    : null;

  // Raw mode: send the user's prompt literally.
  // - If no style: DO NOT add any SnapAI instructions/context/constraints.
  // - If style is present: apply style as a dominant constraint, but still avoid all other SnapAI rules.
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

  const sizeText = "1024x1024";
  const artworkNoun = useIconWords
    ? "square symbol illustration (icon-style, but not an app launcher tile)"
    : "square symbol illustration";

  // If the user explicitly asks for glossy-ish vibes, we don't apply the default matte guardrails.
  const glossyKeywords =
    /\b(glassy|glass|chrome|holographic|iridescent|neon|glow|bloom|sparkle|sparkles|lens\s*flare|shiny|shine|metallic)\b/i;
  const isDefaultLook = !style && !glossyKeywords.test(prompt);

  // Base "context" block: avoids canvas/plate/text/logo/photo failures.
  const contextBlock = ICON_BASE_CONTEXT_LINES.join("\n");

  // Layer 1: concept + art-direction guidance (human readable).
  const layer1 = [
    `Create a ${sizeText} ${artworkNoun}.`,
    ``,
    `Subject: ${prompt}`,
    ``,
    contextBlock,
    ``,
    `Archetype (internal decision, do not mention in the output):`,
    `Choose exactly ONE archetype: object_icon, abstract_form_icon, hybrid_icon, or character_icon.`,
    `Characters are optional and must only be used when clearly appropriate.`,
    ``,
    `Archetype guidance:`,
    `- object_icon: a single physical or symbolic object without a face/personality (finance, productivity, utilities, dev tools, dashboards, system apps).`,
    `- abstract_form_icon: pure form/metaphor without literal objects or faces (AI tools, design tools, analytics, experimental products).`,
    `- hybrid_icon: an object with subtle life cues (no face), friendly but restrained (finance+friendly, health, lifestyle).`,
    `- character_icon: a friendly expressive character with a face (kids, games, beginner education, wellness, fun social). Never the default.`,
    ``,
    `Concept:`,
    `Design a single, intentional visual element that represents the app. This can be an object, a form, or a character depending on the archetype.`,
    `Avoid generic logos and generic symbols. Avoid the most literal/obvious metaphor; choose a clear but slightly unexpected metaphor.`,
    ``,
    `Creativity means: unusual material choices, unexpected but clear metaphors, expressive lighting, playful proportions, premium texture decisions.`,
    `Creativity does NOT mean: always adding eyes/faces, always making it cute, always anthropomorphizing objects.`,
    ``,
    `Material:`,
    isDefaultLook
      ? `Default to an illustration-friendly matte finish (painted polymer, ceramic, paper, or flat vector). Avoid glass/chrome/neon unless explicitly requested.`
      : `Select one dominant material (glass, metal, gel, ceramic, plastic, light, fabric, liquid).`,
    `Material choice should communicate mood and product category.`,
    ``,
    `Composition:`,
    `Main subject fills 92–98% of the canvas. Strong silhouette. No unnecessary elements.`,
    ``,
    `Lighting:`,
    isDefaultLook
      ? `Soft, controlled lighting. Minimal specular highlights. No bloom/glow/lens flares. No “3D glass icon” look.`
      : `Use lighting to define mood and hierarchy. Do not add facial expressions unless using the character_icon archetype.`,
    ``,
    `Overall feel:`,
    `Modern, bold, subject-first illustration (not an app icon layout). Creative without being childish. Readable at small sizes.`,
    isDefaultLook
      ? `Rendering default: clean illustration / 2D or 2.5D, matte finish, subtle shading only.`
      : null,
  ].join("\n");

  // Layer 2: hard constraints + compact quality checklist (model-internal).
  const layer2 = [
    `Technical constraints:`,
    ...ICON_BASE_RULES_LINES,
    isDefaultLook
      ? `Default-look guardrail: avoid inflated glass/chrome/neon/glow/sparkles/lens flare/exaggerated shine unless explicitly requested.`
      : null,
    `If generating multiple images: keep the same archetype + dominant material; vary only small details.`,
    ``,
    `Quality filters (internal):`,
    `Reject if: it reads like a photo/portrait/full scene; it becomes a mascot by default; too many elements hurt clarity; a face appears without choosing character_icon; any rounded-square/card/tile background or app-icon-style container appears behind the subject.`,
    `Accept if: instant read at small size; strong silhouette; intentional material; clean contrast on both light and dark backgrounds.`,
    ``,
    `Icon QA (internal): blur test (~64px), small-size readability, wallpaper contrast, one focal point.`,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

  // Optional style block: either a strict preset (dominates conflicts) or a free-form style hint.
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

  // Layer 3: style enforcement. If a preset is selected, it "wins" any conflicts and must drive all decisions.
  // If style is free-form text, it's applied after the concept (material/rendering guidance, not archetype selection).
  const layer3 = styleLine
    ? [
        ``,
        `Style system:`,
        styleResolved.preset
          ? `This preset is the base art direction and is a HARD constraint. If any other instruction conflicts, the style rules win. Concept, material, lighting, composition, and rendering must all comply with it.`
          : `Apply the style after the concept is defined. Styles affect material and rendering (texture/color/lighting), not the chosen archetype.`,
        styleLine,
      ].join("\n")
    : "";

  // If a preset exists, reinforce it early so it drives concept/material choices.
  const layer1WithStyle =
    styleResolved.preset && presetDirective
      ? layer1.replace(
          `Material:`,
          `Primary style preset (dominant): ${styleResolved.preset}\nStyle directive: ${presetDirective}\n\nMaterial:`
        )
      : layer1;

  return `${layer1WithStyle}\n\n${layer2}${layer3}`;
}

