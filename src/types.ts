export interface ConfigData {
  openai_api_key?: string;
  default_output_path?: string;
}

export interface IconGenerationOptions {
  prompt: string;
  output?: string;
  size?: string;
  quality?: 'auto' | 'standard' | 'hd' | 'high' | 'medium' | 'low';
  background?: 'transparent' | 'opaque' | 'auto';
  outputFormat?: 'png' | 'jpeg' | 'webp';
  model?: 'dall-e-2' | 'dall-e-3' | 'gpt-image-1';
  numImages?: number;
  moderation?: 'low' | 'auto';
  rawPrompt?: boolean;
}

export interface OpenAIResponse {
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}