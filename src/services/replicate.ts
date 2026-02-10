import Replicate from "replicate";
import { ConfigService } from "./config.js";

const RECRAFT_V3_SVG_MODEL = "recraft-ai/recraft-v3-svg";

/** Resolve SVG URL from Replicate run result (output string, prediction object, or FileOutput). */
function resolveSvgOutput(
  result: unknown
): string | null {
  if (typeof result === "string") {
    return result;
  }
  if (result && typeof result === "object") {
    const obj = result as Record<string, unknown>;
    if (typeof obj.output === "string") {
      return obj.output;
    }
    if (typeof (obj as { url?: () => string }).url === "function") {
      return (result as { url: () => string }).url();
    }
  }
  return null;
}

export interface RecraftIconOptions {
  prompt: string;
  size?: string;
  style?: string;
}

export class ReplicateService {
  private static async getClient(): Promise<Replicate> {
    const token = await ConfigService.get("replicate_api_token");

    if (!token) {
      throw new Error(
        "Replicate API token not configured. Run: snapai config --replicate-api-token YOUR_TOKEN"
      );
    }

    return new Replicate({ auth: token });
  }

  /**
   * Generate an SVG via Recraft V3 SVG (Replicate), then download the SVG file(s).
   * Returns raw SVG markup string(s) ready to be written to .svg files.
   */
  static async downloadSvg(options: RecraftIconOptions): Promise<string[]> {
    const client = await this.getClient();
    const { prompt, size = "1024x1024", style = "any" } = options;

    const result = await client.run(RECRAFT_V3_SVG_MODEL, {
      input: {
        prompt,
        size,
        style,
      },
    });

    const svgUrl = resolveSvgOutput(result);
    if (!svgUrl) {
      throw new Error("Unexpected Recraft V3 SVG output format");
    }

    const response = await fetch(svgUrl);
    if (!response.ok) {
      throw new Error(`Failed to download SVG from Replicate: ${response.statusText}`);
    }
    const svgMarkup = await response.text();
    return [svgMarkup];
  }
}
