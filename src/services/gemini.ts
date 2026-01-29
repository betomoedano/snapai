import { GoogleGenAI } from "@google/genai";
import mime from "mime";
import { ConfigService } from "./config.js";

export type BananaModel = "banana";
export type BananaQuality = "1k" | "2k" | "4k";

export interface BananaGenerateOptions {
  prompt: string;
  pro: boolean;
  n: number;
  quality: BananaQuality;
  apiKey?: string;
}

export interface GeneratedBinaryImage {
  base64: string;
  extension: string;
  mimeType?: string;
}

const BANANA_NORMAL_MODEL = "gemini-2.5-flash-image";
const BANANA_PRO_MODEL = "gemini-3-pro-image-preview";

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
    const { prompt, pro, n, quality } = options;

    if (!pro) {
      return await this.generateStream(ai, BANANA_NORMAL_MODEL, prompt, 1);
    }

    if (n <= 1) {
      return await this.generateStream(ai, BANANA_PRO_MODEL, prompt, 1, quality);
    }

    const results = await Promise.all(
      Array.from({ length: n }, async () => {
        const imgs = await this.generateStream(
          ai,
          BANANA_PRO_MODEL,
          prompt,
          1,
          quality
        );
        return imgs[0];
      })
    );
    return results;
  }

  private static async generateStream(
    ai: GoogleGenAI,
    model: string,
    prompt: string,
    desired: number,
    quality?: BananaQuality
  ): Promise<GeneratedBinaryImage[]> {
    const config: any = {
      responseModalities: ["IMAGE", "TEXT"],
    };

    if (model === BANANA_PRO_MODEL && quality) {
      config.imageConfig = {
        imageSize: mapQualityToImageSize(quality),
      };
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

