import OpenAI from "openai";
import { ConfigService } from "./config.js";
import { IconGenerationOptions, OpenAIResponse } from "../types.js";
import { ImageGenerateParams } from "openai/resources/images.js";

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

  static async generateIcon(options: IconGenerationOptions): Promise<string[]> {
    const client = await this.getClient();
    const {
      prompt,
      model = "gpt-image-1",
      size = "1024x1024",
      quality = "auto",
      background = "auto",
      outputFormat = "png",
      numImages = 1,
      moderation = "auto",
      rawPrompt = false,
    } = options;

    // Validate model-specific parameters
    this.validateModelParameters(
      model,
      size,
      quality,
      numImages,
      background,
      outputFormat,
      moderation
    );

    // Use either raw prompt or enhanced prompt for iOS app icons
    const finalPrompt = rawPrompt
      ? prompt
      : `Create a full-bleed ${size} px iOS app icon: ${prompt}.Use crisp, minimal design with vibrant colors. Add a subtle inner bevel for gentle depth; no hard shadows or outlines. Center the design with comfortable breathing room from the edges. Solid, light-neutral background. IMPORTANT: Fill the entire canvas edge-to-edge with the design, no padding, no margins. Design elements should be centered with appropriate spacing from edges but the background must cover 100% of the canvas. Add subtle depth with inner highlights, avoid hard shadows. Clean, minimal, Apple-style design. No borders, frames, or rounded corners.`;

    // Build request parameters based on model
    const requestParams: ImageGenerateParams = {
      model,
      prompt: finalPrompt,
      n: numImages,
      size: size as any,
    };

    // Add model-specific parameters
    if (model === "gpt-image-1") {
      requestParams.quality = this.mapQualityForGptImage1(
        quality
      ) as ImageGenerateParams["quality"];
      requestParams.background = background;
      requestParams.output_format = outputFormat;
      requestParams.moderation = moderation;
    } else if (model === "dall-e-3") {
      requestParams.quality = quality === "hd" ? "hd" : "standard";
      requestParams.n = 1; // dall-e-3 only supports n=1
      requestParams.response_format = "b64_json"; // Request base64 data for dall-e-3
    } else if (model === "dall-e-2") {
      // dall-e-2 only supports standard quality
      requestParams.quality = "standard";
    }

    const response = await client.images.generate(requestParams);

    if (!response.data || response.data.length === 0) {
      throw new Error("Failed to generate image");
    }

    // Return all generated images
    return response.data.map((img) => {
      if (!img.b64_json) {
        throw new Error("Failed to get base64 data from generated image");
      }
      return img.b64_json;
    });
  }

  private static validateModelParameters(
    model: string,
    size: string,
    quality: string,
    numImages: number,
    background: string,
    outputFormat: string,
    moderation: string
  ): void {
    // Validate size based on model
    const validSizes = {
      "dall-e-2": ["256x256", "512x512", "1024x1024"],
      "dall-e-3": ["1024x1024", "1792x1024", "1024x1792"],
      "gpt-image-1": ["1024x1024", "1536x1024", "1024x1536", "auto"],
    };

    if (!validSizes[model as keyof typeof validSizes]?.includes(size)) {
      throw new Error(
        `Invalid size "${size}" for model "${model}". Valid sizes: ${validSizes[
          model as keyof typeof validSizes
        ]?.join(", ")}`
      );
    }

    // Validate quality based on model
    const validQualities = {
      "dall-e-2": ["standard"],
      "dall-e-3": ["standard", "hd"],
      "gpt-image-1": ["auto", "high", "medium", "low"],
    };

    if (
      !validQualities[model as keyof typeof validQualities]?.includes(quality)
    ) {
      throw new Error(
        `Invalid quality "${quality}" for model "${model}". Valid qualities: ${validQualities[
          model as keyof typeof validQualities
        ]?.join(", ")}`
      );
    }

    // Validate number of images
    if (model === "dall-e-3" && numImages > 1) {
      throw new Error("dall-e-3 only supports generating 1 image at a time");
    }

    if (numImages < 1 || numImages > 10) {
      throw new Error("Number of images must be between 1 and 10");
    }

    // Validate gpt-image-1 specific parameters
    if (model !== "gpt-image-1") {
      if (background !== "auto") {
        throw new Error(
          `Background parameter is only supported for gpt-image-1 model`
        );
      }
      if (outputFormat !== "png") {
        throw new Error(
          `Output format parameter is only supported for gpt-image-1 model`
        );
      }
      if (moderation !== "auto") {
        throw new Error(
          `Moderation parameter is only supported for gpt-image-1 model`
        );
      }
    }
  }

  private static mapQualityForGptImage1(quality: string): string {
    // Map our quality options to gpt-image-1 quality options
    const qualityMap: { [key: string]: string } = {
      auto: "auto",
      high: "high",
      medium: "medium",
      low: "low",
      hd: "high", // Map hd to high for gpt-image-1
      standard: "medium", // Map standard to medium for gpt-image-1
    };
    return qualityMap[quality] || "auto";
  }
}
