import { Command, Errors, Flags } from "@oclif/core";
import fs from "fs-extra";
import chalk from "chalk";
import { OpenAIService } from "../services/openai.js";
import { GeminiService } from "../services/gemini.js";
import { ValidationService, isStyleDangerous } from "../utils/validation.js";
import { buildFeatureGraphicPrompt } from "../utils/fg-prompt.js";
import { StyleTemplates } from "../utils/styleTemplates.js";
import { CTA } from "../utils/branding.js";
import { saveBase64Images } from "../utils/save-images.js";
import {
  resizeToFeatureGraphic,
  compositeLogoOnBanner,
} from "../utils/image-processing.js";

export default class FeatureGraphicCommand extends Command {
  static description =
    "Generate AI-powered Google Play feature graphics (1024x500) using OpenAI or Gemini";

  static aliases = ["fg"];

  static examples = [
    '<%= config.bin %> <%= command.id %> --prompt "fitness tracker app"',
    '<%= config.bin %> <%= command.id %> --prompt "fitness tracker" --app-name "FitTrack"',
    '<%= config.bin %> <%= command.id %> --prompt "music player" --style neon --model gpt-1.5',
    '<%= config.bin %> <%= command.id %> --prompt "weather app" --model banana --output-format jpeg',
    '<%= config.bin %> <%= command.id %> --prompt "tracker" --logo ./assets/icon.png --logo-position left',
    '<%= config.bin %> fg --prompt "calculator app" --prompt-only',
  ];

  static flags = {
    prompt: Flags.string({
      char: "p",
      description: "Description of the feature graphic to generate",
      required: true,
    }),
    output: Flags.string({
      char: "o",
      description: "Output directory",
      default: "./assets",
    }),
    "prompt-only": Flags.boolean({
      description: "Preview the final prompt without generating images",
      default: false,
    }),
    "openai-api-key": Flags.string({
      char: "k",
      description:
        "OpenAI API key override. Also supports SNAPAI_API_KEY / OPENAI_API_KEY",
    }),
    "google-api-key": Flags.string({
      char: "g",
      description:
        "Google Studio API key override. Also supports SNAPAI_GOOGLE_API_KEY / GEMINI_API_KEY",
    }),
    model: Flags.string({
      char: "m",
      description:
        'Model: OpenAI ("gpt-1.5" or "gpt-1") or Gemini ("banana" or "banana-2")',
      default: "gpt-1.5",
      options: ["gpt-1.5", "gpt-1", "banana", "banana-2", "gpt"],
    }),
    quality: Flags.string({
      char: "q",
      description: "Quality level (depends on model)",
      default: "auto",
      options: [
        "auto", "standard", "hd", "high", "medium", "low",
        "1k", "2k", "4k",
      ],
    }),
    "output-format": Flags.string({
      char: "f",
      description: "Output format: png or jpeg (no webp per Google Play spec)",
      default: "png",
      options: ["png", "jpeg"],
    }),
    n: Flags.integer({
      char: "n",
      description: "Number of images (max 10)",
      default: 1,
      min: 1,
      max: 10,
    }),
    moderation: Flags.string({
      description: "Content filtering: low, auto (GPT only)",
      default: "auto",
      options: ["low", "auto"],
    }),
    "raw-prompt": Flags.boolean({
      char: "r",
      description: "Send the prompt as-is (no enhancement)",
      default: false,
    }),
    style: Flags.string({
      char: "s",
      description: "Optional style hint",
    }),
    "app-name": Flags.string({
      description: "App name to include as text on the banner",
    }),
    logo: Flags.string({
      description: "Path to a logo file to composite onto the banner",
    }),
    "logo-position": Flags.string({
      description: "Logo position on the banner",
      default: "left",
      options: ["left", "center", "right"],
    }),
    pro: Flags.boolean({
      char: "P",
      description: "Use Gemini Pro model (banana only)",
      default: false,
    }),
    thinking: Flags.string({
      description: "Thinking level for banana-2: minimal or max",
      options: ["minimal", "max"],
    }),
  };

  private resolveOpenAIQuality(
    input: string
  ): "auto" | "high" | "medium" | "low" {
    const q = input.trim().toLowerCase();
    if (q === "hd") return "high";
    if (q === "standard") return "medium";
    if (q === "auto" || q === "high" || q === "medium" || q === "low") return q;
    throw new Error(
      `Invalid --quality "${input}" for OpenAI models. Valid: auto|high|medium|low`
    );
  }

  private resolveBananaQuality(input: string): "1k" | "2k" | "4k" {
    const q = input.trim().toLowerCase();
    if (q === "auto") return "1k";
    if (q === "1k" || q === "2k" || q === "4k") return q;
    throw new Error(
      `Invalid --quality "${input}" for banana. Valid: 1k|2k|4k (or auto)`
    );
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(FeatureGraphicCommand);

    try {
      const promptError = ValidationService.validatePrompt(flags.prompt);
      if (promptError) this.error(promptError);

      const outputError = ValidationService.validateOutputPath(flags.output);
      if (outputError) this.error(outputError);

      if (isStyleDangerous(flags.style)) {
        this.error(
          chalk.red(
            "Blocked: --style contains photo/portrait keywords. Use a rendering style instead."
          )
        );
      }

      if (flags.logo) {
        const logoExists = await fs.pathExists(flags.logo);
        if (!logoExists) {
          this.error(chalk.red(`Logo file not found: ${flags.logo}`));
        }
      }

      const modelFlag = flags.model as string;
      const normalizedModelFlag =
        String(modelFlag || "").trim().toLowerCase() === "gpt"
          ? "gpt-1.5"
          : modelFlag;
      const provider: "banana" | "openai" =
        normalizedModelFlag === "banana" || normalizedModelFlag === "banana-2"
          ? "banana"
          : "openai";
      const bananaVariant: "banana" | "banana-2" | undefined =
        normalizedModelFlag === "banana-2"
          ? "banana-2"
          : normalizedModelFlag === "banana"
            ? "banana"
            : undefined;
      const openaiModel =
        provider === "openai"
          ? (normalizedModelFlag as "gpt-1" | "gpt-1.5" | "gpt")
          : undefined;

      const qualityInput = (
        Array.isArray(flags.quality)
          ? String(flags.quality[0] ?? "auto")
          : typeof flags.quality === "string"
            ? flags.quality
            : "auto"
      );

      if (flags.thinking && bananaVariant !== "banana-2") {
        this.error(
          chalk.red("--thinking is only supported with --model banana-2")
        );
      }

      if (flags["openai-api-key"]) {
        const keyError = ValidationService.validateApiKey(
          flags["openai-api-key"]
        );
        if (keyError) this.error(chalk.red(keyError));
      }
      if (flags["google-api-key"]) {
        const keyError = ValidationService.validateGoogleApiKey(
          flags["google-api-key"]
        );
        if (keyError) this.error(chalk.red(keyError));
      }

      const requestedN = flags.n;
      const outputFormat = flags["output-format"] as "png" | "jpeg";

      const finalPrompt = buildFeatureGraphicPrompt({
        prompt: flags.prompt,
        rawPrompt: flags["raw-prompt"],
        style: flags.style,
        appName: flags["app-name"],
      });

      // Prompt-only mode
      if (flags["prompt-only"]) {
        // Provider-specific validation (so the preview matches generation mode).
        if (provider === "banana") {
          if (bananaVariant === "banana-2" && requestedN !== 1) {
            this.error(chalk.red("banana-2 only supports -n 1"));
          }
          if (bananaVariant === "banana" && !flags.pro && requestedN !== 1) {
            this.error(chalk.red("Banana normal only supports -n 1"));
          }
          this.resolveBananaQuality(qualityInput);
        } else {
          this.resolveOpenAIQuality(qualityInput);
        }

        const styleInput = flags.style?.trim();
        const styleNormalized = styleInput?.toLowerCase();
        const availableStyles = StyleTemplates.getAvailableStyles().map((s) =>
          String(s).toLowerCase()
        );
        const isPresetStyle = Boolean(
          styleNormalized && availableStyles.includes(styleNormalized)
        );

        this.log(chalk.blue("🔎 Prompt preview (no generation)"));
        this.log("");
        this.log(chalk.gray(`Raw prompt: ${flags.prompt}`));
        this.log(chalk.gray(`Enhanced: ${flags["raw-prompt"] ? "no" : "yes"}`));
        if (flags["app-name"]) {
          this.log(chalk.gray(`App name: ${flags["app-name"]}`));
        }
        this.log(
          chalk.gray(
            `Style: ${
              styleInput
                ? `${styleInput}${isPresetStyle ? " (preset)" : " (custom)"}`
                : "none"
            }`
          )
        );
        if (styleInput && isPresetStyle) {
          this.log(
            chalk.dim(
              `Style summary: ${StyleTemplates.getStyleDescription(
                styleNormalized as any
              )}`
            )
          );
        }
        this.log("");
        this.log(chalk.gray("Configuration:"));
        this.log(chalk.gray(`  provider: ${provider}`));
        this.log(chalk.gray(`  model: ${normalizedModelFlag}`));
        this.log(chalk.gray(`  output size: 1024x500 (feature graphic)`));
        this.log(chalk.gray(`  output format: ${outputFormat}`));
        this.log(chalk.gray(`  n: ${requestedN}`));
        if (flags.logo) {
          this.log(chalk.gray(`  logo: ${flags.logo}`));
          this.log(
            chalk.gray(`  logo-position: ${flags["logo-position"]}`)
          );
        }
        this.log("");
        this.log(chalk.gray("Final prompt (sent to the model):"));
        this.log("");
        this.log(finalPrompt);
        return;
      }

      this.log(chalk.blue("🖼️  Generating your feature graphic..."));
      this.log("");
      this.log(CTA);
      this.log("");
      this.log(chalk.gray(`Prompt: ${flags.prompt}`));
      if (flags["app-name"]) {
        this.log(chalk.gray(`App name: ${flags["app-name"]}`));
      }
      if (flags.style) {
        this.log(chalk.blue(`🎨 Style: ${flags.style}`));
      }
      if (flags["raw-prompt"]) {
        this.log(chalk.yellow("⚠️  Using raw prompt (no enhancement)"));
      }

      let imageBuffers: Buffer[] = [];

      if (provider === "banana") {
        if (bananaVariant === "banana-2") {
          if (requestedN !== 1) {
            this.error(chalk.red("banana-2 only supports -n 1"));
          }
        } else if (!flags.pro) {
          if (requestedN !== 1) {
            this.error(chalk.red("Banana normal only supports -n 1"));
          }
        }

        const bananaQuality = this.resolveBananaQuality(qualityInput);
        const thinkingLevel =
          bananaVariant === "banana-2" && flags.thinking
            ? (flags.thinking as "minimal" | "max")
            : undefined;

        const images = await GeminiService.generateBananaImages({
          prompt: finalPrompt,
          pro: flags.pro,
          n: bananaVariant === "banana-2" ? 1 : flags.pro ? requestedN : 1,
          quality: bananaQuality,
          apiKey: flags["google-api-key"],
          modelVariant: bananaVariant,
          thinkingLevel,
          aspectRatio: "16:9",
        });

        imageBuffers = images.map((img) => Buffer.from(img.base64, "base64"));
      } else {
        // OpenAI
        const openaiQuality = this.resolveOpenAIQuality(qualityInput);
        const base64Array = await OpenAIService.generateIcon({
          prompt: finalPrompt,
          output: flags.output,
          model: openaiModel,
          quality: openaiQuality,
          background: "opaque",
          outputFormat: outputFormat,
          numImages: requestedN,
          moderation: flags.moderation as "low" | "auto",
          rawPrompt: true,
          apiKey: flags["openai-api-key"],
          size: "1536x1024",
        });

        imageBuffers = base64Array.map((b64) => Buffer.from(b64, "base64"));
      }

      // Post-process: resize to 1024x500
      this.log(chalk.gray("📐 Resizing to 1024x500..."));
      const processedBuffers: Buffer[] = [];
      for (const buf of imageBuffers) {
        let processed = await resizeToFeatureGraphic(buf, outputFormat);
        if (flags.logo) {
          processed = await compositeLogoOnBanner(
            processed,
            flags.logo,
            flags["logo-position"] as "left" | "center" | "right"
          );
        }
        processedBuffers.push(processed);
      }

      // Save
      this.log(chalk.gray(`💾 Saving ${processedBuffers.length} image(s)...`));
      const base64Results = processedBuffers.map((buf) =>
        buf.toString("base64")
      );
      const outputPaths = await saveBase64Images(
        base64Results,
        flags.output,
        outputFormat,
        "feature-graphic"
      );

      this.log(chalk.green("✅ Feature graphic(s) generated successfully!"));
      if (outputPaths.length === 1) {
        this.log(chalk.gray(`Saved to: ${outputPaths[0]}`));
      } else {
        this.log(chalk.gray(`Saved ${outputPaths.length} images to:`));
        outputPaths.forEach((p, index) => {
          this.log(chalk.gray(`  ${index + 1}. ${p}`));
        });
      }
    } catch (error) {
      // Errors raised via this.error() above are already user-facing CLI
      // errors; re-throw them as-is instead of double-wrapping the message.
      if (error instanceof Errors.CLIError) {
        throw error;
      }
      this.error(
        chalk.red(
          `Failed to generate feature graphic: ${(error as Error).message}`
        )
      );
    }
  }
}
