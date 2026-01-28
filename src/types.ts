export interface ConfigData {
  openai_api_key?: string;
  google_api_key?: string;
  default_output_path?: string;
}

export interface IconGenerationOptions {
  prompt: string;
  output?: string;
  size?: string;
  quality?: 'auto' | 'standard' | 'hd' | 'high' | 'medium' | 'low';
  background?: 'transparent' | 'opaque' | 'auto';
  outputFormat?: 'png' | 'jpeg' | 'webp';
  model?: 'gpt-image-1.5';
  numImages?: number;
  moderation?: 'low' | 'auto';
  rawPrompt?: boolean;
  apiKey?: string;
}

export interface OpenAIResponse {
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}