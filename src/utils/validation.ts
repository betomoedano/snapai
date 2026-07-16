const DANGEROUS_STYLE_KEYWORDS = [
  "photo", "photograph", "photoreal", "photorealistic", "portrait",
  "headshot", "selfie", "concert", "wedding", "dslr", "35mm",
  "cinematic still", "real person", "celebrity",
];

export function isStyleDangerous(style?: string): boolean {
  if (!style) return false;
  const s = style.toLowerCase();
  return DANGEROUS_STYLE_KEYWORDS.some((k) => s.includes(k));
}

export class ValidationService {
  static validatePrompt(prompt: string): string | null {
    if (!prompt || prompt.trim().length === 0) {
      return 'Prompt cannot be empty';
    }
    
    if (prompt.length > 1000) {
      return 'Prompt too long (max 1000 characters)';
    }
    
    return null;
  }

  static validateApiKey(apiKey: string): string | null {
    if (!apiKey || !apiKey.startsWith('sk-')) {
      return 'Invalid OpenAI API key format';
    }
    
    return null;
  }

  static validateGoogleApiKey(apiKey: string): string | null {
    if (!apiKey || apiKey.trim().length === 0) {
      return 'Invalid Google API key format';
    }
    return null;
  }

  static validateOutputPath(outputPath: string): string | null {
    if (!outputPath || outputPath.trim().length === 0) {
      return 'Output path cannot be empty';
    }
    
    return null;
  }
}