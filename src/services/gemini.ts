import { GoogleGenAI } from "@google/genai";
import mime from "mime";
import { ConfigService } from "./config.js";

export type BananaModel = "banana" | "banana-2";
export type BananaQuality = "1k" | "2k" | "4k";

/** CLI values for banana 2 thinking level; maps to ThinkingLevel in the API. */
export type Banana2ThinkingLevel = "minimal" | "max";

export interface BananaGenerateOptions {
  prompt: string;
  pro: boolean;
  n: number;
  quality: BananaQuality;
  apiKey?: string;
  /** When set to "banana-2", uses nano banana 2 (gemini-3.1-flash-image-preview) with thinking config. */
  modelVariant?: BananaModel;
  /** Only used when modelVariant is "banana-2". Sent as thinkingConfig.thinkingLevel (MINIMAL | HIGH). */
  thinkingLevel?: Banana2ThinkingLevel;
  /** Optional aspect ratio override (e.g. "16:9"). Passed to imageConfig.aspectRatio. */
  aspectRatio?: string;
}

export interface GeneratedBinaryImage {
  base64: string;
  extension: string;
  mimeType?: string;
}

const BANANA_NORMAL_MODEL = "gemini-2.5-flash-image";
const BANANA_PRO_MODEL = "gemini-3-pro-image-preview";
const BANANA_2_MODEL = "gemini-3.1-flash-image-preview";

function mapQualityToImageSize(q: BananaQuality): "1K" | "2K" | "4K" {
  if (q === "2k") return "2K";
  if (q === "4k") return "4K";
  return "1K";
}

function extensionFromMime(mimeType?: string): string {
  const ext = mimeType ? mime.getExtension(mimeType) : null;
  return ext || "png";
}

function extractInlineDataFromChunk(chunk: any): { data: string; mimeType?: string } | null {
  const parts = chunk?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;

  for (const part of parts) {
    const inlineData = part?.inlineData;
    if (inlineData?.data) {
      return { data: inlineData.data, mimeType: inlineData.mimeType };
    }
  }
  return null;
}

export class GeminiService {
  private static async getClient(apiKeyOverride?: string): Promise<GoogleGenAI> {
    const apiKey =
      apiKeyOverride ||
      process.env.SNAPAI_GOOGLE_API_KEY ||
      process.env.GEMINI_API_KEY ||
      (await ConfigService.get("google_api_key"));
    if (!apiKey) {
      throw new Error(
        "Google API key not configured. Use SNAPAI_GOOGLE_API_KEY / GEMINI_API_KEY, or run: snapai config --google-api-key YOUR_KEY"
      );
    }
    return new GoogleGenAI({ apiKey });
  }

  static async generateBananaImages(
    options: BananaGenerateOptions
  ): Promise<GeneratedBinaryImage[]> {
    const ai = await this.getClient(options.apiKey);
    const { prompt, pro, n, quality, modelVariant } = options;

    if (modelVariant === "banana-2") {
      return await this.generateStream(
        ai,
        BANANA_2_MODEL,
        prompt,
        1,
        undefined,
        "banana-2",
        options.thinkingLevel,
        options.aspectRatio
      );
    }

    if (!pro) {
      return await this.generateStream(ai, BANANA_NORMAL_MODEL, prompt, 1, undefined, undefined, undefined, options.aspectRatio);
    }

    if (n <= 1) {
      return await this.generateStream(ai, BANANA_PRO_MODEL, prompt, 1, quality, undefined, undefined, options.aspectRatio);
    }

    const results = await Promise.all(
      Array.from({ length: n }, async () => {
        const imgs = await this.generateStream(
          ai,
          BANANA_PRO_MODEL,
          prompt,
          1,
          quality,
          undefined,
          undefined,
          options.aspectRatio
        );
        return imgs[0];
      })
    );
    return results;
  }

  /** Map CLI thinking level to API ThinkingLevel (see @google/genai ThinkingLevel enum). */
  private static mapThinkingLevel(
    level: Banana2ThinkingLevel | undefined
  ): "MINIMAL" | "HIGH" | undefined {
    if (!level) return undefined;
    return level === "max" ? "HIGH" : "MINIMAL";
  }

  private static async generateStream(
    ai: GoogleGenAI,
    model: string,
    prompt: string,
    desired: number,
    quality?: BananaQuality,
    variant?: "banana-2",
    thinkingLevel?: Banana2ThinkingLevel,
    aspectRatio?: string
  ): Promise<GeneratedBinaryImage[]> {
    const config: any = {
      responseModalities: ["IMAGE", "TEXT"],
    };

    if (variant === "banana-2") {
      config.imageConfig = { imageSize: "1K" };
      const level = this.mapThinkingLevel(thinkingLevel);
      if (level !== undefined) {
        config.thinkingConfig = { thinkingLevel: level };
      } else {
        config.thinkingConfig = { thinkingLevel: "MINIMAL" };
      }
    } else if (model === BANANA_PRO_MODEL && quality) {
      config.imageConfig = {
        imageSize: mapQualityToImageSize(quality),
      };
    }

    if (aspectRatio) {
      config.imageConfig = { ...config.imageConfig, aspectRatio };
    }

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const stream = await (ai as any).models.generateContentStream({
      model,
      config,
      contents,
    });

    const images: GeneratedBinaryImage[] = [];
    for await (const chunk of stream) {
      const inline = extractInlineDataFromChunk(chunk);
      if (!inline) continue;

      images.push({
        base64: inline.data,
        extension: extensionFromMime(inline.mimeType),
        mimeType: inline.mimeType,
      });

      if (images.length >= desired) break;
    }

    if (images.length === 0) {
      throw new Error("Gemini did not return an image");
    }

    return images;
  }
}

