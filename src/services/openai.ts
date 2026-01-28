import OpenAI from "openai";
import { ConfigService } from "./config.js";
import { IconGenerationOptions, OpenAIResponse } from "../types.js";
import { ImageGenerateParams } from "openai/resources/images.js";
import {
  IconComposerPlan,
  ICON_COMPOSER_COLORS,
  ICON_COMPOSER_SIZE,
  ICON_COMPOSER_SHAPES,
  parseAndValidateIconComposerPlan,
} from "../utils/icon-composer.js";

export class OpenAIService {
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
      model = "gpt-image-1.5",
      size = "1024x1024",
      quality,
      background = "auto",
      outputFormat = "png",
      numImages = 1,
      moderation = "auto",
      rawPrompt = false,
      style,
    } = options;

    // Set default quality based on model
    const defaultQuality = model === "dall-e-2" ? undefined : quality || "auto";

    // Validate model-specific parameters
    this.validateModelParameters(
      model,
      size,
      defaultQuality,
      numImages,
      background,
      outputFormat,
      moderation
    );

    
    // Use either raw prompt, style-enhanced prompt, or default iOS prompt
    let finalPrompt: string;
    
    if (rawPrompt) {
      finalPrompt = prompt;
    } else if (style) {
      finalPrompt = StyleTemplates.getStylePrompt(prompt, style, size);
    } else {
      // Default iOS prompt (backward compatibility)
      finalPrompt = `Create a full-bleed ${size} px iOS app icon: ${prompt}.Use crisp, minimal design with vibrant colors. Add a subtle inner bevel for gentle depth; no hard shadows or outlines. Center the design with comfortable breathing room from the edges. Solid, light-neutral background. IMPORTANT: Fill the entire canvas edge-to-edge with the design, no padding, no margins. Design elements should be centered with appropriate spacing from edges but the background must cover 100% of the canvas. Add subtle depth with inner highlights, avoid hard shadows. Clean, minimal, Apple-style design. No borders, frames, or rounded corners.`;
    }

    // Build request parameters based on model
    const requestParams: ImageGenerateParams = {
      model,
      prompt: finalPrompt,
      n: numImages,
      size: size as any,
    };

    // gpt-image-1.5 parameters
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

  static async planIconComposerLayers(params: {
    prompt: string;
    model?: string;
    apiKey?: string;
  }): Promise<IconComposerPlan> {
    const client = await this.getClient(params.apiKey);
    const { prompt, model = "gpt-4o-mini" } = params;

    const systemPrompt = [
      `You are an icon layer architect for Apple Icon Composer.`,
      `Return ONLY valid JSON. No explanations. No comments. No Markdown.`,
      ``,
      `Hard rules:`,
      `- Output must be a single JSON object.`,
      `- You MUST NOT output SVG.`,
      `- You MUST NOT output any path data (no "d", no "path", no coordinates lists).`,
      `- One layer = one SVG file. Layers must be independent.`,
      `- icon.size must be exactly ${ICON_COMPOSER_SIZE}.`,
      `- Use ONLY these colors: ${ICON_COMPOSER_COLORS.join(", ")}.`,
      `- Allowed shapes only: ${ICON_COMPOSER_SHAPES.join(", ")}.`,
      `- All numbers MUST be integers and multiples of 8 (8px grid).`,
      ``,
      `Layer planning goal: be creative and dynamic, but deterministic and icon-like.`,
      `- Produce between 3 and 10 layers.`,
      `- Layers must be ordered back-to-front in the array (first drawn = furthest back).`,
      `- The first layer MUST be a background layer (id or type must be exactly "background").`,
      `- Background must be a full-canvas rounded-rect: x=0 y=0 w=512 h=512 radius 96..128.`,
      ``,
      `For all other layers: DO NOT assume any fixed layer names or roles.`,
      `- Choose your own layer count and structure based on the prompt.`,
      `- Use id/type strings that describe the layer's meaning for THIS icon (e.g. "paper", "shadow-1", "sparkle", "bubble", "sun-core", "ray-set-1").`,
      `- Every non-background layer should add a specific, meaningful silhouette/detail.`,
      `- Favor bold simple forms, clear negative space, and clean stacking.`,
      ``,
      `Composition guidelines (not prescriptive):`,
      `- Keep the main subject roughly centered and readable at small sizes.`,
      `- Prefer 1–2 dominant shapes, then 1–3 smaller accents/details.`,
      `- Avoid thin details: keep minimum thickness ~16px unless it's intentional lines texture.`,
      `- Use high contrast between adjacent layers when possible (within the 3-color palette).`,
      `- If you use "lines": treat it as a texture block inside a bounded area; choose count 3–9 and gap 8–16.`,
      ``,
      `Output schema:`,
      `{ "icon": { "size": 512, "layers": [ ...layer objects... ] } }`,
      ``,
      `Each layer object MUST include: id, type, shape, fill, x, y, w, h. If shape is rounded-rect or badge also include radius.`,
      `If shape is lines include: count, gap, direction.`,
    ].join("\n");

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Planner returned empty response");
    }

    let json: unknown;
    try {
      json = JSON.parse(content);
    } catch {
      throw new Error("Planner returned invalid JSON");
    }

    return parseAndValidateIconComposerPlan(json);
  }

  private static validateModelParameters(
    model: string,
    size: string,
    quality: string | undefined,
    numImages: number,
    background: string,
    outputFormat: string,
    moderation: string
  ): void {
    if (model !== "gpt-image-1.5") {
      throw new Error(`Only "gpt-image-1.5" is supported for OpenAI`);
    }

    const validSizes = ["1024x1024", "1536x1024", "1024x1536", "auto"];
    if (!validSizes.includes(size)) {
      throw new Error(
        `Invalid size "${size}" for model "${model}". Valid sizes: ${validSizes.join(
          ", "
        )}`
      );
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
    // Map our quality options to gpt-image-1.5 quality options
    const qualityMap: { [key: string]: string } = {
      auto: "auto",
      high: "high",
      medium: "medium",
      low: "low",
      hd: "high", // Map hd to high for gpt-image-1.5
      standard: "medium", // Map standard to medium for gpt-image-1.5
    };
    return qualityMap[quality] || "auto";
  }
}
