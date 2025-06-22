import OpenAI from "openai";
import { ConfigService } from "./config.js";
import { IconGenerationOptions, OpenAIResponse } from "../types.js";

export class OpenAIService {
  private static async getClient(): Promise<OpenAI> {
    const apiKey = await ConfigService.get("openai_api_key");

    if (!apiKey) {
      throw new Error(
        "OpenAI API key not configured. Run: iconiq config --api-key YOUR_KEY"
      );
    }

    return new OpenAI({
      apiKey: apiKey,
    });
  }

  static async generateIcon(options: IconGenerationOptions): Promise<string> {
    const client = await this.getClient();
    const { prompt, size = 1024, quality = "standard" } = options;

    // Enhanced prompt for iOS app icons
    const enhancedPrompt = `Create a ${size} × ${size} px square iOS app-icon illustration: ${prompt}. Use crisp, minimal design with vibrant colors. Add subtle depth with inner bevel effects but no hard shadows or outlines. Center the design with comfortable breathing room from edges. Solid, light-neutral background. No text, borders, or extraneous details. Final look should be clean, vibrant, and Apple-polished. Use the full image size for the icon, don't draw it inside the image, don't add borders - rounded corners will be applied by the platform.`;

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: `${size}x${size}` as any,
      quality: quality,
      response_format: "url",
    });

    if (!response.data?.[0]?.url) {
      throw new Error("Failed to generate image");
    }

    return response.data[0].url;
  }
}
