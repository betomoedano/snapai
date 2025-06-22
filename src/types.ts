export interface TelemetryData {
  session_id: string;
  command: string;
  success: boolean;
  timestamp: number;
  version: string;
  execution_time?: number;
  error_type?: string;
  prompt_length?: number;
  output_format?: string;
  model_used?: string;
}

export interface ConfigData {
  openai_api_key?: string;
  telemetry_enabled: boolean;
  default_output_path?: string;
}

export interface IconGenerationOptions {
  prompt: string;
  output?: string;
  size?: string;
  quality?: 'standard' | 'hd';
  background?: 'transparent' | 'opaque' | 'auto';
  outputFormat?: 'png' | 'jpeg' | 'webp';
}

export interface OpenAIResponse {
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}