export class PromptTemplates {
  static enhanceForIOSIcon(userPrompt: string): string {
    return `Create a 1024 × 1024 px square illustration of ${userPrompt}. Do NOT design or imply an app launcher icon, rounded-square tile, badge, or card. Do not add any outer drop shadow, halo, or border around the canvas. Focus only on the main subject and its complements on a simple, clean background. No text, typography, or UI elements. Final look: crisp, minimal, and illustration-first. Use subtle internal shading only; avoid glossy glass looks, harsh specular highlights, or lens flare.`;
  }

  static enhanceForAndroidIcon(userPrompt: string): string {
    return `Create a 1024 × 1024 px square illustration of ${userPrompt}. Do NOT design or imply an Android app icon, adaptive icon, rounded-square tile, badge, or card. Do not add any outer drop shadow, halo, or glow around the canvas. Focus only on the main subject and its complements on a simple, clean background. No text, typography, or UI mockups. Final look should be modern, bold, and illustration-first with clean geometry and controlled, matte shading (no neon glow, sparkles, or lens flare).`;
  }

  static getSuccessfulPromptElements(): string[] {
    return [
      "crisp, minimal design focused on the main subject only",
      "vibrant colors with subtle internal shading (no outer drop shadows)",
      "comfortable breathing room around the subject",
      "simple, clean background without a separate card or tile",
      "no text, borders, badges, or UI chrome",
      "do not design an app launcher icon or rounded-square plate",
      "avoid implying platform-specific icon shapes or corners"
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