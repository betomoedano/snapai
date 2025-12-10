export type IconStyle = 'minimalism' | 'glassy' | 'woven' | 'geometric' | 'neon' | 'gradient' | 'flat' | 'material' | 'ios-classic' | 'android-material' | 'pixel' | 'game' | 'clay' | 'holographic';

export class StyleTemplates {
  static getBaseRules(size: string = '1024x1024'): string {
    const sizeNum = size === 'auto' ? 1024 : parseInt(size.split('x')[0]);
    return `Single icon symbol fills 96–98% of the ${sizeNum}x${sizeNum} canvas (no padding, no inset, no margins). No container, no rounded-square tile, no app plate, no border, no outline, no drop shadow, no outer glow, no bevel, no emboss, no inner shadow. Crisp, sharp, professional composition.`;
  }

  static getStylePrompt(userPrompt: string, style: IconStyle, size: string = '1024x1024'): string {
    const sizeNum = size === 'auto' ? 1024 : parseInt(size.split('x')[0]);
    const baseRules = this.getBaseRules(size);
    
    switch (style) {
      case 'minimalism':
        return `Create a ${sizeNum}x${sizeNum} minimalist app icon: ${userPrompt}. ${baseRules} Use clean, simple lines with maximum 2-3 colors. Focus on essential shapes only. White or very light background. Ultra-clean, Apple-inspired minimalism.`;

      case 'glassy':
        return `Create a ${sizeNum}x${sizeNum} glassy app icon: ${userPrompt}. ${baseRules} Use glass-like, semi-transparent elements with soft color blending where elements overlap. Subtle gradients and translucent effects. Modern, premium glass aesthetic.`;

      case 'woven':
        return `Create a ${sizeNum}x${sizeNum} woven/fabric app icon: ${userPrompt}. ${baseRules} Use textile-inspired patterns with woven textures, soft fabric-like gradients, and organic flowing lines. Warm, tactile materials aesthetic.`;

      case 'geometric':
        return `Create a ${sizeNum}x${sizeNum} geometric app icon: ${userPrompt}. ${baseRules} Use only geometric shapes: circles, squares, triangles, hexagons. Bold, angular compositions with high contrast colors. Mathematical precision and symmetry.`;

      case 'neon':
        return `Create a ${sizeNum}x${sizeNum} neon app icon: ${userPrompt}. ${baseRules} Use electric neon colors (cyan, magenta, yellow, green) with glowing effects. Dark background with bright neon outlines. Cyberpunk, futuristic aesthetic.`;

      case 'gradient':
        return `Create a ${sizeNum}x${sizeNum} gradient app icon: ${userPrompt}. ${baseRules} Use smooth, vibrant gradients as the primary design element. Multiple color transitions creating depth and visual interest. Modern, Instagram-inspired aesthetic.`;

      case 'flat':
        return `Create a ${sizeNum}x${sizeNum} flat design app icon: ${userPrompt}. ${baseRules} Use flat design principles: solid colors, no gradients, no shadows, no 3D effects. Clean, modern, Microsoft-inspired flat design.`;

      case 'material':
        return `Create a ${sizeNum}x${sizeNum} Material Design app icon: ${userPrompt}. ${baseRules} Use Google Material Design principles: bold colors, geometric shapes, subtle shadows, and depth. Android-optimized design language.`;

      case 'ios-classic':
        return `Create a ${sizeNum}x${sizeNum} classic iOS app icon: ${userPrompt}. ${baseRules} Use traditional iOS design: subtle gradients, soft shadows, rounded elements, and Apple's signature color palette. Timeless iOS aesthetic.`;

      case 'android-material':
        return `Create a ${sizeNum}x${sizeNum} Android Material app icon: ${userPrompt}. ${baseRules} Use Android Material Design 3: dynamic colors, adaptive icons, geometric shapes, and modern Android styling.`;

      case 'pixel':
        return `Create a ${sizeNum}x${sizeNum} pixel art app icon: ${userPrompt}. ${baseRules} Use pixel-perfect, retro 8-bit/16-bit game art style. Sharp, blocky pixels with limited color palette. Nostalgic gaming aesthetic with clear pixel boundaries.`;

      case 'game':
        return `Create a ${sizeNum}x${sizeNum} gaming app icon: ${userPrompt}. ${baseRules} Use vibrant, energetic gaming aesthetics with bold colors, dynamic compositions, and playful elements. Modern mobile game icon style with high contrast and engaging visuals.`;

      case 'clay':
        return `Create a ${sizeNum}x${sizeNum} clay/plasticine app icon: ${userPrompt}. ${baseRules} Use soft, malleable clay-like textures with organic, handcrafted appearance. Soft shadows, rounded edges, and tactile material feel. Playful, child-friendly aesthetic.`;

      case 'holographic':
        return `Create a ${sizeNum}x${sizeNum} holographic app icon: ${userPrompt}. ${baseRules} Use iridescent, rainbow-shifting colors with metallic finishes and prismatic effects. Futuristic, high-tech aesthetic with light refraction and dimensional depth.`;

      default:
        return `Create a ${sizeNum}x${sizeNum} app icon: ${userPrompt}. ${baseRules}`;
    }
  }

  static getAvailableStyles(): IconStyle[] {
    return ['minimalism', 'glassy', 'woven', 'geometric', 'neon', 'gradient', 'flat', 'material', 'ios-classic', 'android-material', 'pixel', 'game', 'clay', 'holographic'];
  }

  static getStyleDescription(style: IconStyle): string {
    const descriptions: Record<IconStyle, string> = {
      'minimalism': 'Clean, simple lines with maximum 2-3 colors. Ultra-clean, Apple-inspired minimalism.',
      'glassy': 'Glass-like, semi-transparent elements with soft color blending. Modern, premium glass aesthetic.',
      'woven': 'Textile-inspired patterns with woven textures and organic flowing lines. Warm, tactile materials.',
      'geometric': 'Only geometric shapes with bold, angular compositions. Mathematical precision and symmetry.',
      'neon': 'Electric neon colors with glowing effects. Cyberpunk, futuristic aesthetic.',
      'gradient': 'Smooth, vibrant gradients as primary design element. Modern, Instagram-inspired aesthetic.',
      'flat': 'Solid colors, no gradients, no shadows. Clean, modern, Microsoft-inspired flat design.',
      'material': 'Google Material Design principles with bold colors and geometric shapes.',
      'ios-classic': 'Traditional iOS design with subtle gradients and Apple\'s signature color palette.',
      'android-material': 'Android Material Design 3 with dynamic colors and modern Android styling.',
      'pixel': 'Pixel-perfect, retro 8-bit/16-bit game art style with sharp, blocky pixels.',
      'game': 'Vibrant, energetic gaming aesthetics with bold colors and playful elements.',
      'clay': 'Soft, malleable clay-like textures with organic, handcrafted appearance.',
      'holographic': 'Iridescent, rainbow-shifting colors with metallic finishes and prismatic effects.'
    };
    return descriptions[style];
  }
}
