import OpenAI from "openai";
import { ConfigService } from "./config.js";
import type { IconGenerationOptions, OpenAIImageModel } from "../types.js";
import type { ImageGenerateParams } from "openai/resources/images.js";

export class OpenAIService {
  /**
   * SnapAI model aliases (CLI-facing) → OpenAI model IDs.
   *
   * - gpt-2: current default and friendly alias for OpenAI GPT Image 2
   * - gpt-1.5: previous default
   * - gpt-1: previous generation
   * - gpt-image-2: official GPT Image 2 model ID
   */
  private static readonly OPENAI_IMAGE_MODEL_ID_BY_ALIAS: Record<
    OpenAIImageModel,
    string
  > = {
    gpt: "gpt-image-2",
    "gpt-1": "gpt-image-1",
    "gpt-1.5": "gpt-image-1.5",
    "gpt-2": "gpt-image-2",
    "gpt-image-2": "gpt-image-2",
    "gpt-image-2-2026-04-21": "gpt-image-2-2026-04-21",
  };
  private static readonly FIXED_SIZE = "1024x1024";
  private static readonly GPT_IMAGE_2_MODEL_IDS = new Set([
    "gpt-image-2",
    "gpt-image-2-2026-04-21",
  ]);

  private static async getClient(apiKeyOverride?: string): Promise<OpenAI> {
    const apiKey =
      apiKeyOverride ||
      process.env.SNAPAI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      (await ConfigService.get("openai_api_key"));

    if (!apiKey) {
      throw new Error(
        "OpenAI API key not configured. Use SNAPAI_API_KEY / OPENAI_API_KEY, or run: snapai config --openai-api-key YOUR_KEY"
      );
    }
    // Same precedence as the API key: env var first, then local config.
    const baseURL =
      process.env.OPENAI_BASE_URL ||
      (await ConfigService.get("openai_base_url"));

    return new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL || undefined,
    });
  }

  static async generateIcon(options: IconGenerationOptions): Promise<string[]> {
    const {
      prompt,
      model = "gpt-2",
      quality = "auto",
      background = "auto",
      outputFormat = "png",
      outputCompression,
      numImages = 1,
      moderation = "auto",
    } = options;
    const size = options.size ?? this.FIXED_SIZE;

    // Validate model-specific parameters
    this.validateModelParameters(
      model,
      quality,
      numImages,
      background,
      outputFormat,
      moderation,
      size,
      outputCompression
    );

    const client = await this.getClient(options.apiKey);
    const resolvedModelId = this.resolveOpenAIImageModelId(model);

    // Build request parameters based on model
    const requestParams: ImageGenerateParams = {
      model: resolvedModelId,
      prompt,
      n: numImages,
      // The installed SDK predates GPT Image 2's arbitrary-size type, while
      // the API accepts any validated WIDTHxHEIGHT string for this model.
      size: size as ImageGenerateParams["size"],
    };

    // OpenAI image parameters
    requestParams.quality = this.mapOpenAIImageQuality(
      quality
    ) as ImageGenerateParams["quality"];
    requestParams.background = background;
    requestParams.output_format = outputFormat;
    requestParams.moderation = moderation;
    if (outputCompression !== undefined) {
      requestParams.output_compression = outputCompression;
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

  /**
   * Validate an image request without creating an API client or spending credits.
   * Used by prompt-only mode so its behavior matches a real generation.
   */
  static validateGenerationOptions(options: IconGenerationOptions): void {
    this.validateModelParameters(
      options.model ?? "gpt-2",
      options.quality ?? "auto",
      options.numImages ?? 1,
      options.background ?? "auto",
      options.outputFormat ?? "png",
      options.moderation ?? "auto",
      options.size ?? this.FIXED_SIZE,
      options.outputCompression
    );
  }

  static isGptImage2Model(model: OpenAIImageModel): boolean {
    return this.GPT_IMAGE_2_MODEL_IDS.has(
      this.resolveOpenAIImageModelId(model)
    );
  }

  private static validateModelParameters(
    model: OpenAIImageModel,
    quality: string,
    numImages: number,
    background: string,
    outputFormat: string,
    moderation: string,
    size: string,
    outputCompression?: number
  ): void {
    const resolvedId = this.resolveOpenAIImageModelId(model);

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

    if (
      this.GPT_IMAGE_2_MODEL_IDS.has(resolvedId) &&
      background === "transparent"
    ) {
      throw new Error(
        'Model "gpt-image-2" does not support transparent backgrounds. Use "opaque" or "auto".'
      );
    }
    if (!["png", "jpeg", "webp"].includes(outputFormat)) {
      throw new Error(`Invalid output format "${outputFormat}"`);
    }
    if (background === "transparent" && outputFormat === "jpeg") {
      throw new Error(
        'Transparent backgrounds require output format "png" or "webp".'
      );
    }
    if (!["low", "auto"].includes(moderation)) {
      throw new Error(`Invalid moderation "${moderation}"`);
    }
    if (
      outputCompression !== undefined &&
      (!Number.isInteger(outputCompression) ||
        outputCompression < 0 ||
        outputCompression > 100)
    ) {
      throw new Error("Output compression must be an integer between 0 and 100");
    }
    if (
      outputCompression !== undefined &&
      outputFormat !== "jpeg" &&
      outputFormat !== "webp"
    ) {
      throw new Error(
        'Output compression is only supported with "jpeg" or "webp".'
      );
    }

    this.validateSize(resolvedId, size);
  }

  private static validateSize(resolvedModelId: string, size: string): void {
    const normalizedSize = String(size || "").trim().toLowerCase();
    const standardSizes = [
      "auto",
      "1024x1024",
      "1536x1024",
      "1024x1536",
    ];

    if (!this.GPT_IMAGE_2_MODEL_IDS.has(resolvedModelId)) {
      if (!standardSizes.includes(normalizedSize)) {
        throw new Error(
          `Invalid size "${size}" for model "${resolvedModelId}". Valid sizes: ${standardSizes.join(
            ", "
          )}`
        );
      }
      return;
    }

    if (normalizedSize === "auto") return;

    const match = /^(\d+)x(\d+)$/.exec(normalizedSize);
    if (!match) {
      throw new Error(
        `Invalid size "${size}" for GPT Image 2. Use "auto" or WIDTHxHEIGHT.`
      );
    }

    const width = Number(match[1]);
    const height = Number(match[2]);
    if (width % 16 !== 0 || height % 16 !== 0) {
      throw new Error(
        "GPT Image 2 width and height must both be multiples of 16"
      );
    }
    if (Math.max(width, height) > 3840) {
      throw new Error("GPT Image 2 maximum edge length is 3840 pixels");
    }
    if (Math.max(width, height) / Math.min(width, height) > 3) {
      throw new Error("GPT Image 2 aspect ratio must be between 1:3 and 3:1");
    }

    const totalPixels = width * height;
    if (totalPixels < 655_360 || totalPixels > 8_294_400) {
      throw new Error(
        "GPT Image 2 size must contain between 655,360 and 8,294,400 pixels"
      );
    }
  }

  private static mapOpenAIImageQuality(quality: string): string {
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

  private static resolveOpenAIImageModelId(model: OpenAIImageModel): string {
    const key = String(model || "").trim().toLowerCase();
    const resolved =
      this.OPENAI_IMAGE_MODEL_ID_BY_ALIAS[key as OpenAIImageModel];
    if (!resolved) {
      const valid = Object.keys(this.OPENAI_IMAGE_MODEL_ID_BY_ALIAS)
        .sort()
        .join(", ");
      throw new Error(
        `Invalid OpenAI model "${model}". Valid: ${valid}`
      );
    }
    return resolved;
  }
}
