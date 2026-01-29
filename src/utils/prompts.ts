export class PromptTemplates {
  static enhanceForIOSIcon(userPrompt: string): string {
    return `Create a 1024 × 1024 px square iOS app-icon illustration: ${userPrompt}. Use crisp, minimal design with vibrant colors. Use subtle shading for gentle depth (matte finish); no glossy glass look, no harsh specular highlights, no lens flare. The output image IS the icon: full-bleed edge-to-edge background (no white outer margin), do not draw a smaller icon centered on a blank canvas. Center the design with comfortable breathing room from the edges (but avoid excessive empty space). Solid, light-neutral background. No text, borders, or extraneous details. Final look: clean, modern, and illustration-first. Use the full image size for the icon, don't draw it inside the image, don't add borders, the rounded corners would be applied by the platform, so don't add them.`;
  }

  static enhanceForAndroidIcon(userPrompt: string): string {
    return `Create a 1024 × 1024 px square Android app-icon illustration: ${userPrompt}. Use material design principles with bold, vibrant colors and clean geometry. Subtle depth with soft, controlled shadowing (matte finish); avoid glossy glass icons, exaggerated shine, neon glow, sparkles, or lens flare. The output image IS the icon: full-bleed edge-to-edge background (no white outer margin), do not draw a smaller icon centered on a blank canvas. Center the design with comfortable margins (but avoid excessive empty space). Solid background or subtle gradient. No text, borders, or extraneous details. Final look should be modern, bold, and illustration-first. Use the full image size for the icon.`;
  }

  static getSuccessfulPromptElements(): string[] {
    return [
      "crisp, minimal design",
      "vibrant colors with subtle inner bevel",
      "comfortable breathing room from edges", 
      "solid, light-neutral background",
      "clean, vibrant, and Apple-polished",
      "no text, borders, or extraneous details",
      "use full image size for the icon",
      "don't draw it inside the image",
      "rounded corners applied by platform"
    ];
  }

  static getPopularExamples(): string[] {
    return [
      "crisp, minimal color-wheel flower made of eight evenly spaced petals forming a perfect circle (matte illustration)",
      "minimalist calculator app with clean geometric numbers and soft gradients",
      "fitness tracker app with stylized running figure using vibrant gradient colors",
      "weather app with simple sun and cloud shapes, clean and friendly (matte illustration)",
      "music player app with abstract sound waves, simple shapes, soft pastel hues",
      "photo gallery app with camera lens design using inner bevel effects",
      "messaging app with speech bubble in vibrant, clean illustration style",
      "calendar app with clean date grid and subtle depth",
      "note-taking app with pen and paper using soft, blended colors",
      "banking app with secure lock symbol and professional gradients"
    ];
  }

  static addGlassEffects(prompt: string): string {
    return `${prompt} with glass-like, semi-transparent elements and soft color blending where elements overlap`;
  }

  static addPastelColors(prompt: string): string {
    return `${prompt} using soft pastel hues (pink, orange, yellow, green, teal, blue, indigo, violet)`;
  }
}