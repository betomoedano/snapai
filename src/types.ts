export interface ConfigData {
  openai_api_key?: string;
  openai_base_url?: string;
  default_output_path?: string;
}

export interface IconGenerationOptions {
  prompt: string;
  output?: string;
  size?: string;
  quality?: 'standard' | 'hd';
  background?: 'transparent' | 'opaque' | 'auto';
  outputFormat?: 'png' | 'jpeg' | 'webp';
  rawPrompt?: boolean;
}

export interface OpenAIResponse {
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}