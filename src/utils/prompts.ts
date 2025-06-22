export class PromptTemplates {
  static enhanceForIOSIcon(userPrompt: string, size: number = 1024): string {
    return `Create a ${size} × ${size} px square iOS app-icon illustration: ${userPrompt}. Use crisp, minimal design with vibrant colors. Add subtle depth with inner bevel effects but no hard shadows or outlines. Center the design with comfortable breathing room from edges. Solid, light-neutral background. No text, borders, or extraneous details. Final look should be clean, vibrant, and Apple-polished. Use the full image size for the icon, don't draw it inside the image, don't add borders - rounded corners will be applied by the platform.`;
  }

  static enhanceForAndroidIcon(userPrompt: string, size: number = 1024): string {
    return `Create a ${size} × ${size} px square Android app-icon illustration: ${userPrompt}. Use material design principles with bold, vibrant colors and clean geometry. Subtle depth with appropriate shadowing. Center the design with comfortable margins. Solid background or subtle gradient. No text, borders, or extraneous details. Final look should be modern, bold, and Android-appropriate. Use the full image size for the icon.`;
  }

  static getPopularExamples(): string[] {
    return [
      "minimalist calculator app with clean numbers",
      "fitness tracker app with running figure",
      "weather app with stylized sun and cloud",
      "music player app with abstract sound waves",
      "photo gallery app with camera lens design",
      "messaging app with speech bubble",
      "calendar app with clean date grid",
      "note-taking app with pen and paper",
      "timer app with elegant stopwatch design",
      "banking app with secure lock symbol"
    ];
  }
}