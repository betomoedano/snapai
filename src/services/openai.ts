import OpenAI from "openai";
import { ConfigService } from "./config.js";
import { IconGenerationOptions } from "../types.js";
import { ImageGenerateParams } from "openai/resources/images.js";

export class OpenAIService {
  private static readonly OPENAI_IMAGE_MODEL_ID = "gpt-image-1.5";
  private static readonly FIXED_SIZE = "1024x1024";

  private static async getClient(apiKeyOverride?: string): Promise<OpenAI> {
    const apiKey =
      apiKeyOverride ||
      process.env.SNAPAI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      (await ConfigService.get("openai_api_key"));

    if (!apiKey) {
      throw new Error(
        "OpenAI API key not configured. Use SNAPAI_API_KEY / OPENAI_API_KEY, or run: snapai config --api-key YOUR_KEY"
      );
    }

    return new OpenAI({
      apiKey: apiKey,
    });
  }

  static async generateIcon(options: IconGenerationOptions): Promise<string[]> {
    const client = await this.getClient(options.apiKey);
    const {
      prompt,
      model = "gpt",
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
      quality,
      numImages,
      background,
      outputFormat,
      moderation
    );

    const finalPrompt = rawPrompt ? prompt : prompt;

    // Build request parameters based on model
    const requestParams: ImageGenerateParams = {
      model: this.OPENAI_IMAGE_MODEL_ID,
      prompt: finalPrompt,
      n: numImages,
      size: this.FIXED_SIZE as any,
    };

    // OpenAI image parameters
    requestParams.quality = this.mapQualityForGptImage1(
      quality
    ) as ImageGenerateParams["quality"];
    requestParams.background = background;
    requestParams.output_format = outputFormat;
    requestParams.moderation = moderation;

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
    quality: string,
    numImages: number,
    background: string,
    outputFormat: string,
    moderation: string
  ): void {
    if (model !== "gpt") {
      throw new Error(`Only "gpt" is supported for OpenAI`);
    }

    const validQualities = ["auto", "high", "medium", "low"];
    if (!validQualities.includes(quality)) {
      throw new Error(
        `Invalid quality "${quality}" for model "${model}". Valid qualities: ${validQualities.join(
          ", "
        )}`
      );
    }

    if (numImages < 1 || numImages > 10) {
      throw new Error("Number of images must be between 1 and 10");
    }

    if (!["transparent", "opaque", "auto"].includes(background)) {
      throw new Error(`Invalid background "${background}"`);
    }
    if (!["png", "jpeg", "webp"].includes(outputFormat)) {
      throw new Error(`Invalid output format "${outputFormat}"`);
    }
    if (!["low", "auto"].includes(moderation)) {
      throw new Error(`Invalid moderation "${moderation}"`);
    }
  }

  private static mapQualityForGptImage1(quality: string): string {
    // Map our CLI-friendly quality options to OpenAI image API.
    const qualityMap: { [key: string]: string } = {
      auto: "auto",
      high: "high",
      medium: "medium",
      low: "low",
      hd: "high",
      standard: "medium",
    };
    return qualityMap[quality] || "auto";
  }
}
