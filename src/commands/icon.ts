import { Command, Errors, Flags } from "@oclif/core";
import chalk from "chalk";
import { OpenAIService } from "../services/openai.js";
import { GeminiService } from "../services/gemini.js";
import { ValidationService, isStyleDangerous } from "../utils/validation.js";
import { buildFinalIconPrompt } from "../utils/icon-prompt.js";
import { StyleTemplates } from "../utils/styleTemplates.js";
import { CTA } from "../utils/branding.js";
import { saveBase64Images, saveBinaryImages } from "../utils/save-images.js";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export default class IconCommand extends Command {
  static description =
    "Generate AI-powered app icons using OpenAI (gpt-1.5/gpt-1/gpt-image-2) or Gemini (banana / banana-2)";

  static examples = [
    // Basic usage
    '<%= config.bin %> <%= command.id %> --prompt "minimalist calculator app icon"',
    '<%= config.bin %> <%= command.id %> --prompt "fitness tracker" --output ./assets/icons',
    "",
    // OpenAI
    '<%= config.bin %> <%= command.id %> --prompt "best quality" --model gpt-1.5 -n 3 -q high',
    "",
    // Gemini
    '<%= config.bin %> <%= command.id %> --prompt "modern app icon" --model banana',
    '<%= config.bin %> <%= command.id %> --prompt "app icon" --model banana-2',
    '<%= config.bin %> <%= command.id %> --prompt "app icon" --model banana-2 --thinking max',
    "",
    // Advanced options
    '<%= config.bin %> <%= command.id %> --prompt "logo" --model gpt-1.5 --background transparent --output-format png',
    '<%= config.bin %> <%= command.id %> --prompt "high-res banana" --model banana --pro -n 3 -q 4k',
    '<%= config.bin %> <%= command.id %> --prompt "custom design" --raw-prompt',
    "",
    // Style options
    '<%= config.bin %> <%= command.id %> --prompt "calculator app" --style minimalism',
    '<%= config.bin %> <%= command.id %> --prompt "music player" --style glassy',
    '<%= config.bin %> <%= command.id %> --prompt "weather app" --style neon',
    "",
    // Prompt preview (no generation)
    '<%= config.bin %> <%= command.id %> --prompt "calculator app" --raw-prompt --prompt-only',
    '<%= config.bin %> <%= command.id %> --prompt "calculator app" --prompt-only',
    '<%= config.bin %> <%= command.id %> --prompt "calculator app" --style minimalism --prompt-only',
  ];

  static flags = {
    // === Basic Options ===
    prompt: Flags.string({
      char: "p",
      description: "Description of the icon to generate",
      required: true,
    }),
    output: Flags.string({
      char: "o",
      description: "Output directory",
      default: "./assets",
    }),
    "prompt-only": Flags.boolean({
      description:
        "Preview the final generated prompt/config without generating images",
      default: false,
    }),
    /**
     * Deprecated: use --openai-api-key.
     * Kept for backwards compatibility.
     */
    "api-key": Flags.string({
      description:
        "OpenAI API key override (does not persist to disk). Also supports SNAPAI_API_KEY / OPENAI_API_KEY",
      hidden: true,
    }),
    "openai-api-key": Flags.string({
      char: "k",
      description:
        "OpenAI API key override (does not persist to disk). Also supports SNAPAI_API_KEY / OPENAI_API_KEY",
    }),
    "google-api-key": Flags.string({
      char: "g",
      description:
        "Google Studio API key override (does not persist to disk). Also supports SNAPAI_GOOGLE_API_KEY / GEMINI_API_KEY",
    }),

    // === Provider / Model ===
    model: Flags.string({
      char: "m",
      description:
        'Model: OpenAI ("gpt-1.5", "gpt-1", or "gpt-image-2") or Gemini ("banana" or "banana-2"). (Legacy alias: "gpt")',
      default: "gpt-1.5",
      options: ["gpt-1.5", "gpt-1", "gpt-image-2", "banana", "banana-2", "gpt"],
    }),
    quality: Flags.string({
      char: "q",
      description:
        "Quality level (depends on model). GPT: auto|high|medium|low (aliases: hd, standard). Banana Pro: 1k|2k|4k",
      default: "auto",
      options: [
        // OpenAI (gpt)
        "auto",
        "standard",
        "hd",
        "high",
        "medium",
        "low",
        // Banana pro tiers
        "1k",
        "2k",
        "4k",
      ],
    }),

    // === Advanced Options ===
    background: Flags.string({
      char: "b",
      description:
        "Background: transparent, opaque, auto (OpenAI only; transparent not supported by gpt-image-2)",
      default: "auto",
      options: ["transparent", "opaque", "auto"],
    }),
    "output-format": Flags.string({
      char: "f",
      description: "Output format: png, jpeg, webp (OpenAI only)",
      default: "png",
      options: ["png", "jpeg", "webp"],
    }),
    /**
     * Deprecated: use -n/--n.
     * Kept for backwards compatibility.
     */
    "num-images": Flags.integer({
      description: "Number of images 1-10 (OpenAI only)",
      default: 1,
      min: 1,
      max: 10,
      hidden: true,
    }),
    moderation: Flags.string({
      description: "Content filtering: low, auto (OpenAI only)",
      default: "auto",
      options: ["low", "auto"],
    }),
    "raw-prompt": Flags.boolean({
      char: "r",
      description:
        "Send the prompt as-is (no SnapAI enhancement/constraints). If --style is provided, style is applied as a dominant constraint.",
      default: false,
    }),

    style: Flags.string({
      char: "s",
      description: "Optional style hint appended after enhancement",
    }),
    "use-icon-words": Flags.boolean({
      char: "i",
      description:
        'Include the words "icon" / "logo" in the enhancer (may add unwanted borders/padding)',
      default: false,
    }),

    // === Gemini Options (banana) ===
    pro: Flags.boolean({
      char: "P",
      description: "Use Gemini Pro model (banana only)",
      default: false,
    }),
    n: Flags.integer({
      char: "n",
      description: "Number of images (max 10)",
      default: 1,
      min: 1,
      max: 10,
    }),
    thinking: Flags.string({
      description:
        'Thinking level for banana-2: minimal (faster, less reasoning) or max (deeper reasoning). Ignored for other models.',
      options: ["minimal", "max"],
    }),
  };

  private normalizeFlagString(input: unknown, fallback: string): string {
    if (Array.isArray(input)) return String(input[0] ?? fallback);
    if (typeof input === "string") return input;
    return fallback;
  }

  private resolveOpenAIQuality(input: string): "auto" | "high" | "medium" | "low" {
    const q = input.trim().toLowerCase();
    if (q === "hd") return "high";
    if (q === "standard") return "medium";
    if (q === "auto" || q === "high" || q === "medium" || q === "low") return q;
    throw new Error(
      `Invalid --quality "${input}" for OpenAI models. Valid: auto|high|medium|low (aliases: hd, standard)`
    );
  }

  private resolveBananaQuality(input: string): "1k" | "2k" | "4k" {
    const q = input.trim().toLowerCase();
    if (q === "auto") return "1k";
    if (q === "1k" || q === "2k" || q === "4k") return q;
    throw new Error(
      `Invalid --quality "${input}" for model "banana". Valid: 1k|2k|4k (or auto)`
    );
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(IconCommand);

    try {
      // Validate inputs
      const promptError = ValidationService.validatePrompt(flags.prompt);
      if (promptError) {
        this.error(promptError);
      }

      const outputError = ValidationService.validateOutputPath(flags.output);
      if (outputError) {
        this.error(outputError);
      }

      if (isStyleDangerous(flags.style)) {
        this.error(
          chalk.red(
            'Blocked: --style contains photo/portrait keywords. Use a rendering style (materials/lighting) instead of camera/portrait terms.'
          )
        );
      }

      const modelFlag = flags.model as string;
      const normalizedModelFlag =
        String(modelFlag || "")
          .trim()
          .toLowerCase() === "gpt"
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
          ? (normalizedModelFlag as
              | "gpt-1"
              | "gpt-1.5"
              | "gpt-image-2"
              | "gpt")
          : undefined;

      const qualityInput = this.normalizeFlagString(flags.quality, "auto");

      if (flags.thinking && bananaVariant !== "banana-2") {
        this.error(
          chalk.red('--thinking is only supported with --model banana-2')
        );
      }

      const openaiApiKey = flags["openai-api-key"] || flags["api-key"];
      if (flags["openai-api-key"] && flags["api-key"]) {
        this.error(
          chalk.red('Use only one: --openai-api-key or the deprecated --api-key')
        );
      }
      if (openaiApiKey) {
        const keyError = ValidationService.validateApiKey(openaiApiKey);
        if (keyError) this.error(chalk.red(keyError));
      }
      if (flags["google-api-key"]) {
        const keyError = ValidationService.validateGoogleApiKey(
          flags["google-api-key"]
        );
        if (keyError) this.error(chalk.red(keyError));
      }

      // unify image count flags
      if (flags.n !== 1 && flags["num-images"] !== 1) {
        this.error(
          chalk.red('Use only one: -n/--n or the deprecated --num-images')
        );
      }
      const requestedN = flags.n !== 1 ? flags.n : flags["num-images"];

      // Build the final prompt once (used by all providers).
      const finalPrompt = buildFinalIconPrompt({
        prompt: flags.prompt,
        rawPrompt: flags["raw-prompt"],
        style: flags.style,
        useIconWords: flags["use-icon-words"],
      });

      // Prompt-only mode: preview everything, generate nothing.
      if (flags["prompt-only"]) {
        const styleInput = flags.style?.trim();
        const styleNormalized = styleInput?.toLowerCase();
        const availableStyles = StyleTemplates.getAvailableStyles().map((s) =>
          String(s).toLowerCase()
        );
        const isPresetStyle = Boolean(
          styleNormalized && availableStyles.includes(styleNormalized)
        );

        // Provider-specific validation (so preview matches reality), but do not prompt for confirmation.
        if (provider === "banana") {
          if (bananaVariant === "banana-2") {
            if (requestedN !== 1) {
              this.error(chalk.red("banana-2 only supports -n 1"));
            }
            // Generation mode resolves banana quality for banana-2 too; run the
            // same validation here so the preview matches real behavior.
            this.resolveBananaQuality(qualityInput);
          } else if (!flags.pro) {
            if (requestedN !== 1) {
              this.error(chalk.red("Banana normal only supports -n 1"));
            }
            const bananaQ = this.resolveBananaQuality(qualityInput);
            if (bananaQ !== "1k") {
              this.error(chalk.red("Banana normal only supports --quality 1k"));
            }
          } else {
            // In generation mode we prompt for confirmation when n is large; in preview we just warn.
            // (We still allow preview so users can inspect the prompt/config without paying.)
          }
        }

        this.log(chalk.blue("🔎 Prompt preview (no generation)"));
        this.log("");
        this.log(chalk.gray(`Raw prompt: ${flags.prompt}`));
        this.log(chalk.gray(`Enhanced: ${flags["raw-prompt"] ? "no" : "yes"}`));
        this.log(
          chalk.gray(`useIconWords: ${flags["use-icon-words"] ? "yes" : "no"}`)
        );
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
        this.log(
          chalk.gray(
            `  model: ${
              normalizedModelFlag === modelFlag
                ? modelFlag
                : `${modelFlag} (alias → ${normalizedModelFlag})`
            }`
          )
        );
        this.log(chalk.gray(`  size: 1024x1024 (fixed)`));
        this.log(chalk.gray(`  n: ${requestedN}`));
        if (provider === "banana") {
          if (bananaVariant === "banana-2") {
            this.log(chalk.gray(`  variant: banana-2 (nano banana 2)`));
            if (flags.thinking) {
              this.log(chalk.gray(`  thinking: ${flags.thinking}`));
            }
          } else {
            const bananaQualityResolved = this.resolveBananaQuality(qualityInput);
            this.log(
              chalk.gray(
                `  quality: ${qualityInput} (resolved: ${bananaQualityResolved})`
              )
            );
            this.log(chalk.gray(`  pro: ${flags.pro ? "yes" : "no"}`));
          }
          if (flags.pro && requestedN >= 5) {
            this.log(
              chalk.yellow(
                `⚠️  Cost warning: generating ${requestedN} images may incur unplanned costs (generation mode will ask to confirm).`
              )
            );
          }
        } else {
          const openaiQualityResolved = this.resolveOpenAIQuality(qualityInput);
          this.log(
            chalk.gray(
              `  quality: ${qualityInput} (resolved: ${openaiQualityResolved})`
            )
          );
          this.log(chalk.gray(`  background: ${flags.background}`));
          this.log(chalk.gray(`  outputFormat: ${flags["output-format"]}`));
          this.log(chalk.gray(`  moderation: ${flags.moderation}`));
          if (requestedN >= 5) {
            this.log(
              chalk.yellow(
                `⚠️  Cost warning: generating ${requestedN} images may incur unplanned costs.`
              )
            );
          }
        }

        this.log("");
        this.log(chalk.gray("Final prompt (sent to the model):"));
        this.log("");
        this.log(finalPrompt);
        return;
      }

      if (provider === "banana") {
        if (bananaVariant === "banana-2") {
          if (requestedN !== 1) {
            this.error(chalk.red("banana-2 only supports -n 1"));
          }
        } else if (!flags.pro) {
          if (requestedN !== 1) {
            this.error(chalk.red("Banana normal only supports -n 1"));
          }
          const bananaQ = this.resolveBananaQuality(qualityInput);
          if (bananaQ !== "1k") {
            this.error(chalk.red("Banana normal only supports --quality 1k"));
          }
        } else {
          if (requestedN >= 5) {
            const ok = await this.confirmLargeGeneration(requestedN);
            if (!ok) {
              this.log(chalk.yellow("Aborted."));
              return;
            }
          }
        }
      }

      this.log(chalk.blue("🎨 Generating your app icon..."));
      this.log("");
      this.log(CTA);
      this.log("");
      this.log(chalk.gray(`Prompt: ${flags.prompt}`));
      if (flags.style) {
        this.log(chalk.blue(`🎨 Style: ${flags.style}`));
      }
      if (flags["raw-prompt"]) {
        this.log(chalk.yellow("⚠️  Using raw prompt (no style enhancement)"));
      }

      if (provider === "banana") {
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
        });

        this.log(chalk.gray(`💾 Saving ${images.length} image(s)...`));
        const outputPaths = await saveBinaryImages(images, flags.output);
        this.log(chalk.green("✅ Icon(s) generated successfully!"));
        if (outputPaths.length === 1) {
          this.log(chalk.gray(`Saved to: ${outputPaths[0]}`));
        } else {
          this.log(chalk.gray(`Saved ${outputPaths.length} images to:`));
          outputPaths.forEach((p, index) => {
            this.log(chalk.gray(`  ${index + 1}. ${p}`));
          });
        }
        return;
      }

      // OpenAI (gpt-1.5 / gpt-1)
      const openaiQuality = this.resolveOpenAIQuality(qualityInput);
      const outputFormat = flags["output-format"] as "png" | "jpeg" | "webp";
      const imageBase64Array = await OpenAIService.generateIcon({
        prompt: finalPrompt,
        output: flags.output,
        model: openaiModel,
        quality: openaiQuality,
        background: flags.background as "transparent" | "opaque" | "auto",
        outputFormat,
        numImages: requestedN,
        moderation: flags.moderation as "low" | "auto",
        rawPrompt: true,
        apiKey: openaiApiKey,
      });

      this.log(chalk.gray(`💾 Saving ${imageBase64Array.length} image(s)...`));
      const outputPaths = await saveBase64Images(
        imageBase64Array,
        flags.output,
        outputFormat
      );

      this.log(chalk.green("✅ Icon(s) generated successfully!"));
      if (outputPaths.length === 1) {
        this.log(chalk.gray(`Saved to: ${outputPaths[0]}`));
      } else {
        this.log(chalk.gray(`Saved ${outputPaths.length} images to:`));
        outputPaths.forEach((path, index) => {
          this.log(chalk.gray(`  ${index + 1}. ${path}`));
        });
      }
    } catch (error) {
      // Errors raised via this.error() above are already user-facing CLI
      // errors; re-throw them as-is instead of double-wrapping the message.
      if (error instanceof Errors.CLIError) {
        throw error;
      }
      this.error(
        chalk.red(`Failed to generate icon: ${(error as Error).message}`)
      );
    }
  }

  private async confirmLargeGeneration(n: number): Promise<boolean> {
    const rl = createInterface({ input, output });
    try {
      const answer = await rl.question(
        `You're about to generate many images (${n}). This may incur unplanned costs. Are you sure you want to continue? (y/n) `
      );
      return answer.trim().toLowerCase().startsWith("y");
    } finally {
      rl.close();
    }
  }

}
