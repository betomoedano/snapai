export interface ConfigData {
  openai_api_key?: string;
  replicate_api_token?: string;
  google_api_key?: string;
  default_output_path?: string;
}

export interface IconGenerationOptions {
  prompt: string;
  output?: string;
  size?: string;
  quality?: 'auto' | 'standard' | 'hd' | 'high' | 'medium' | 'low';
  background?: 'transparent' | 'opaque' | 'auto';
  outputFormat?: 'png' | 'jpeg' | 'webp' | 'svg';
  model?: 'dall-e-2' | 'dall-e-3' | 'gpt-image-1' | 'recraft-v3-svg';
  numImages?: number;
  moderation?: 'low' | 'auto';
  rawPrompt?: boolean;
  style?: 'minimalism' | 'glassy' | 'woven' | 'geometric' | 'neon' | 'gradient' | 'flat' | 'material' | 'ios-classic' | 'android-material' | 'pixel' | 'game' | 'clay' | 'holographic';
  
}

export interface OpenAIResponse {
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}