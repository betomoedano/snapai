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

  const sizeText = "1024x1024";
  const artworkNoun = useIconWords
    ? "square app icon artwork"
    : "square app artwork";

  const glossyKeywords =
    /\b(glassy|glass|chrome|holographic|iridescent|neon|glow|bloom|sparkle|sparkles|lens\s*flare|shiny|shine|metallic)\b/i;
  const isDefaultLook = !style && !glossyKeywords.test(prompt);

  const contextBlock = [
    `Context: This is a mobile app icon for an app launcher / home screen.`,
    `The output image IS the icon (full-bleed). Do not place a smaller icon centered on a blank/white canvas.`,
    `Do NOT draw a rounded-square tile/container, app plate, sticker, or UI mockup. The platform applies rounded corners; you must output a full square image.`,
    `It must read as an icon, not a standalone photo.`,
    `Do NOT generate a photographic portrait, a concert photo, a landscape photo, or a full real-world scene.`,
    `No realistic human faces as the main subject. No celebrity-like portraits.`,
    `If a "photo" is part of the concept, it must be a small framed element inside the icon (e.g. a museum frame), not the full image.`,
    `Do not copy or imitate real brand logos, trademarked shapes, or recognizable brand marks.`,
  ].join("\n");

  const styleResolved = resolveStylePreset(style);
  const presetDirective = styleResolved.preset
    ? StyleTemplates.getStyleDirective(styleResolved.preset)
    : null;

  const layer1 = [
    `Create a full-bleed ${sizeText} ${artworkNoun}.`,
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
    `Modern, premium, app-icon-first. Creative without being childish. Readable at small sizes.`,
    isDefaultLook
      ? `Rendering default: clean illustration / 2D or 2.5D, matte finish, subtle shading only.`
      : null,
  ].join("\n");

  const squareRule = `Square 1:1 aspect ratio.`;

  const layer2 = [
    `Technical constraints:`,
    squareRule,
    `Main subject fills 92–98% of the canvas. Scale up / zoom in — avoid excessive empty space.`,
    `Keep the silhouette centered and balanced. Keep critical details within ~5–8% safe area, but the background must still be full-bleed to the edges.`,
    `Android-safe guidance: keep critical details within the central ~70% of the canvas (silhouette can extend beyond).`,
    `No text. No watermark. No borders. No frames. No container tiles. No app plates.`,
    `No letters, numbers, monograms, or typography.`,
    `No floating sticker or badge appearance.`,
    `Background MUST be full-bleed and touch all four edges (no white/blank outer margin).`,
    `Do NOT draw rounded corners, rounded-square tiles, or an app-icon "plate". Do NOT draw an icon inside a larger square canvas.`,
    `No outer padding, matte, vignette, frame, or border. Use the entire 1024x1024 canvas.`,
    `Keep background clean: low-detail, low-noise, no busy patterns.`,
    `Not a photo: no camera realism, no full-scene photography, no portrait framing as the whole image.`,
    `Do not imitate real brand logos or trademarked marks.`,
    isDefaultLook
      ? `Avoid over-stylized glossy/glassy icon aesthetics: no inflated glass, no chrome, no rainbow refraction, no neon glow, no sparkles, no lens flare, no exaggerated shine.`
      : null,
    `If generating multiple images: keep the same archetype + dominant material, and vary only small details.`,
    ``,
    `Base rules:`,
    `Single dominant subject only.`,
    `No rounded-square tile or app plate.`,
    `No heavy realism or photo look.`,
    `No UI mockups or interface elements.`,
    `High contrast and clear focal point (must work on both light and dark wallpapers).`,
    `Use one consistent primary light direction; avoid heavy drop shadows and muddy shading.`,
    `Soft edges unless the selected style requires sharp geometry.`,
    ``,
    `Quality filters:`,
    `Reject if: a face appears without choosing character_icon; it looks toy-like for finance/productivity; too many elements reduce clarity; it becomes a mascot by default; it looks like a photo/portrait/full scene instead of an icon.`,
    `Accept if: it communicates function or mood instantly; material is intentional; silhouette is strong; creativity enhances clarity, not noise.`,
    ``,
    `Icon QA checklist (internal):`,
    `- Blur test: still recognizable when blurred and viewed at ~64px.`,
    `- Small-size test: readable at small launcher sizes (avoid thin details).`,
    `- Wallpaper test: strong contrast on both light and dark backgrounds.`,
    `- Simplicity test: one focal point, no secondary scene.`,
  ]
    .filter(Boolean)
    .join("\n");

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

  if (rawPrompt) {
    const rawLayer1 = [
      `Create a full-bleed ${sizeText} ${artworkNoun}.`,
      ``,
      `Subject: ${prompt}`,
      ``,
      contextBlock,
    ].join("\n");
    return `${rawLayer1}\n\n${layer2}${layer3}`;
  }

  return `${layer1WithStyle}\n\n${layer2}${layer3}`;
}

