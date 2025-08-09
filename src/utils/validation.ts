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

  static validateBaseUrl(baseUrl: string): string | null {
    if (!baseUrl || !baseUrl.startsWith('https://')) {
      return 'Invalid OpenAI URL format';
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