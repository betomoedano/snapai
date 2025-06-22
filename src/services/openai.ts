import OpenAI from "openai";
import { ConfigService } from "./config.js";
import { IconGenerationOptions, OpenAIResponse } from "../types.js";

export class OpenAIService {
  private static async getClient(): Promise<OpenAI> {
    const apiKey = await ConfigService.get("openai_api_key");

    if (!apiKey) {
      throw new Error(
        "OpenAI API key not configured. Run: snapai config --api-key YOUR_KEY"
      );
    }

    return new OpenAI({
      apiKey: apiKey,
    });
  }

  static async generateIcon(options: IconGenerationOptions): Promise<string> {
    const client = await this.getClient();
    const { prompt, size = "1024x1024", quality = "standard", rawPrompt = false } = options;

    // Use either raw prompt or enhanced prompt for iOS app icons
    const finalPrompt = rawPrompt 
      ? prompt 
      : `Create a full-bleed ${size} px iOS app icon: ${prompt}. IMPORTANT: Fill the entire canvas edge-to-edge with the design - no white background, no padding, no margins. The background color should extend to all four corners of the image. Design elements should be centered with appropriate spacing from edges but the background must cover 100% of the canvas. Use vibrant, solid background colors that fill the entire space. Add subtle depth with inner highlights, avoid hard shadows. Clean, minimal, Apple-style design. No borders, frames, or rounded corners - the platform handles that.`;

    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: finalPrompt,
      n: 1,
      size: size as any,
      quality: quality === "standard" ? "medium" : "high",
      background: "opaque",
      output_format: "png",
      moderation: "auto",
    });

    if (!response.data?.[0]?.b64_json) {
      throw new Error("Failed to generate image");
    }

    return response.data[0].b64_json;
  }
}
