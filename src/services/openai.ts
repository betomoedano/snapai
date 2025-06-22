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
    const { prompt, size = "1024x1024", quality = "standard" } = options;

    // Enhanced prompt for iOS app icons with key elements for optimal generation
    const enhancedPrompt = `Create a ${size} px iOS app-icon illustration: ${prompt}. Use crisp, minimal design with vibrant colors. Add a subtle inner bevel for gentle depth; no hard shadows or outlines. Center the design with comfortable breathing room from the edges. Solid, light-neutral background. No text, borders, or extraneous details. Final look: clean, vibrant, and Apple-polished. Use the full image size for the icon, don't draw it inside the image, don't add borders, the rounded corners would be applied by the platform, so don't add them.`;

    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: enhancedPrompt,
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
