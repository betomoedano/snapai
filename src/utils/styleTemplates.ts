export type IconStyle = 'minimalism' | 'glassy' | 'woven' | 'geometric' | 'neon' | 'gradient' | 'flat' | 'material' | 'ios-classic' | 'android-material' | 'pixel' | 'game' | 'clay' | 'holographic';

export class StyleTemplates {
  private static readonly baseRulesV2 = [
    `Single dominant subject only.`,
    `No rounded-square tile or app plate.`,
    `No heavy realism or photo look.`,
    `No UI mockups or interface elements.`,
    `High contrast and clear focal point.`,
    `Soft edges unless the selected style requires sharp geometry.`,
  ].join(" ");

  static getStylePrompt(userPrompt: string, style: IconStyle, size: string = '1024x1024'): string {
    const sizeNum = size === 'auto' ? 1024 : parseInt(size.split('x')[0]);
    
    switch (style) {
      case 'minimalism':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Reduce the idea to its purest metaphor. Max 2–3 colors. Flat or very subtle depth.`;

      case 'glassy':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Translucent, inflated glass material with soft internal reflections and calm, premium mood.`;

      case 'woven':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Single dominant fabric/textile material with subtle weave texture, soft lighting, and tactile warmth.`;

      case 'geometric':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Sharp geometry, confident edges, precise symmetry, bold color blocks, minimal texture.`;

      case 'neon':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Electric neon lighting with soft glow, rim light, and high-contrast mood.`;

      case 'gradient':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Smooth, premium gradients that enhance form and mood, not a background wash.`;

      case 'flat':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Flat design with solid colors and minimal depth. Keep it expressive, not sterile.`;

      case 'material':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Material-like clarity with bold colors, gentle depth, and intentional lighting.`;

      case 'ios-classic':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Classic iOS mood with subtle gradients, soft highlights, and clean premium finish.`;

      case 'android-material':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Android Material 3 vibe with modern shapes, dynamic color, and clear depth cues.`;

      case 'pixel':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Pixel art with crisp blocky pixels, limited palette, and readable silhouette at small sizes.`;

      case 'game':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Exaggerated proportions, high contrast, playful energy, clear emotion or action.`;

      case 'clay':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Soft plasticine material, rounded shapes, slight deformation, toy-like warmth.`;

      case 'holographic':
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2} Rendering style: Iridescent holographic surfaces with rainbow light shifts and metallic glow.`;

      default:
        return `Create a ${sizeNum}x${sizeNum} square app icon artwork. Subject: ${userPrompt}. ${this.baseRulesV2}`;
    }
  }

  static getAvailableStyles(): IconStyle[] {
    return ['minimalism', 'glassy', 'woven', 'geometric', 'neon', 'gradient', 'flat', 'material', 'ios-classic', 'android-material', 'pixel', 'game', 'clay', 'holographic'];
  }

  static getStyleDescription(style: IconStyle): string {
    const descriptions: Record<IconStyle, string> = {
      'glassy': 'Translucent, inflated glass material with soft internal reflections and calm, premium mood.',
      'minimalism': 'Reduce the idea to its purest metaphor. Max 2–3 colors. Flat or very subtle depth.',
      'clay': 'Soft plasticine material, rounded shapes, slight deformation, toy-like warmth.',
      'holographic': 'Iridescent surfaces with rainbow light shifts and metallic glow.',
      'game': 'Exaggerated proportions, high contrast, playful energy, clear emotion or action.',
      'woven': 'Single dominant fabric/textile material with subtle weave texture and tactile warmth.',
      'geometric': 'Sharp geometry, confident edges, precise symmetry, bold color blocks.',
      'neon': 'Expressive neon lighting with soft glow, rim light, high-contrast mood.',
      'gradient': 'Premium gradients that enhance form and mood, not a background wash.',
      'flat': 'Flat design with solid colors and minimal depth, still expressive.',
      'material': 'Material-like clarity with bold colors, gentle depth, intentional lighting.',
      'ios-classic': 'Classic iOS mood with subtle gradients, soft highlights, clean premium finish.',
      'android-material': 'Android Material 3 vibe with modern shapes, dynamic color, clear depth cues.',
      'pixel': 'Pixel art with crisp blocky pixels, limited palette, readable silhouette at small sizes.'
    };
    return descriptions[style];
  }

  static getStyleDirective(style: IconStyle): string {
    const directives: Record<IconStyle, string> = {
      minimalism:
        "Primary material: matte paper / flat vector ink. Primary lighting: neutral, minimal shading. Hard constraints: Max 2–3 colors. Flat or very subtle depth only. No gradients. No glossy reflections. No 3D/extrusions. No currency symbols ($, €, ¥) and no coin illustrations. Prefer a simple geometric metaphor with thick shapes and plenty of clarity.",
      glassy:
        "Primary material: inflated translucent glass. Primary lighting: calm premium glow with soft internal reflections. Hard constraints: One dominant inflated glass material. Soft internal reflections and gentle highlights. No harsh specular noise. Keep silhouette bold and readable; avoid thin glass shards or busy refractions.",
      woven:
        "Primary material: fabric/textile. Primary lighting: soft diffuse light. Hard constraints: One dominant fabric material. Subtle weave texture only (not busy). Keep shapes simple and high-contrast; avoid illustrative scenes.",
      geometric:
        "Primary material: hard plastic or anodized metal (clean). Primary lighting: crisp controlled highlights. Hard constraints: Sharp geometry only. Crisp edges. Minimal texture. No organic gradients. Prefer symmetry and confident negative space.",
      neon:
        "Primary material: light / emissive tubes. Primary lighting: controlled neon glow + rim light. Hard constraints: Dark background with controlled neon glow. One light direction. No rainbow noise. Keep shapes bold; avoid tiny neon wiring details.",
      gradient:
        "Primary material: smooth gel or satin plastic. Primary lighting: soft gradient-driven form. Hard constraints: Premium, controlled gradients that define form. No rainbow gradients. No muddy multi-light shading. Keep silhouette dominant.",
      flat:
        "Primary material: flat vector shapes. Primary lighting: none (or extremely subtle). Hard constraints: Solid colors. No gradients. No 3D. No glossy reflections. Use strong icon metaphor and clear negative space.",
      material:
        "Primary material: functional polymer/painted surfaces. Primary lighting: practical soft top light. Hard constraints: Functional and grounded. Subtle depth only. No toy-like proportions. Avoid over-stylized fantasy; keep it app-icon-first.",
      "ios-classic":
        "Primary material: classic iOS gloss/gel. Primary lighting: soft Apple-like highlight. Hard constraints: Classic iOS polish. Subtle gradients/highlights only. No heavy realism. Avoid badge/sticker look.",
      "android-material":
        "Primary material: Material surfaces. Primary lighting: subtle depth cues. Hard constraints: Material 3 vibe. Bold color, clear geometry, gentle depth cues. Avoid photoreal textures.",
      pixel:
        "Primary material: pixel grid. Primary lighting: none (stylized). Hard constraints: Pixel grid look. Crisp blocky pixels. Limited palette. No anti-aliased glossy shading. Keep it readable at small sizes.",
      game:
        "Primary material: bold stylized game prop. Primary lighting: expressive and readable. Hard constraints: High contrast, playful energy, but still one focal point. Avoid cluttered scenes; keep it icon-first.",
      clay:
        "Primary material: clay/plasticine. Primary lighting: warm soft studio light. Hard constraints: Soft plasticine material, rounded forms, slight deformation. No glossy glass reflections. Warm, tactile, not toy clutter.",
      holographic:
        "Primary material: holographic film / iridescent metal. Primary lighting: prismatic but controlled. Hard constraints: Iridescent light play with restraint. Avoid visual noise. Keep silhouette bold and readable.",
    };

    return directives[style];
  }
}
