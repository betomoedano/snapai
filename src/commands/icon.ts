import { Command, Flags } from "@oclif/core";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { OpenAIService } from "../services/openai.js";
import { GeminiService } from "../services/gemini.js";
import { ValidationService } from "../utils/validation.js";
import { buildFinalIconPrompt } from "../utils/icon-prompt.js";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export default class IconCommand extends Command {
  static description =
    "Generate AI-powered app icons using OpenAI (gpt-image-1.5) or Gemini (banana)";

  static examples = [
    // Basic usage
    '<%= config.bin %> <%= command.id %> --prompt "minimalist calculator app icon"',
    '<%= config.bin %> <%= command.id %> --prompt "fitness tracker" --output ./assets/icons',
    "",
    // OpenAI
    '<%= config.bin %> <%= command.id %> --prompt "best quality" --model gpt-image-1.5 --num-images 3',
    "",
    // Gemini
    '<%= config.bin %> <%= command.id %> --prompt "modern app icon" --model banana',
    "",
    // Advanced options
    '<%= config.bin %> <%= command.id %> --prompt "logo" --model gpt-image-1.5 --background transparent --output-format png',
    '<%= config.bin %> <%= command.id %> --prompt "high-res banana" --model banana --pro --q 4k --n 3',
    '<%= config.bin %> <%= command.id %> --prompt "custom design" --raw-prompt',
    "",
    // Style options
    '<%= config.bin %> <%= command.id %> --prompt "calculator app" --style minimalism',
    '<%= config.bin %> <%= command.id %> --prompt "music player" --style glassy',
    '<%= config.bin %> <%= command.id %> --prompt "weather app" --style neon',
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
    "api-key": Flags.string({
      description:
        "OpenAI API key override (does not persist to disk). Also supports SNAPAI_API_KEY / OPENAI_API_KEY",
    }),
    "google-api-key": Flags.string({
      description:
        "Google Studio API key override (does not persist to disk). Also supports SNAPAI_GOOGLE_API_KEY / GEMINI_API_KEY",
    }),

    // === Provider / Model ===
    model: Flags.string({
      char: "m",
      description:
        'Model: OpenAI ("gpt-image-1.5") or Gemini ("banana")',
      default: "gpt-image-1.5",
      options: ["banana", "gpt-image-1.5"],
    }),
    size: Flags.string({
      char: "s",
      description: "Image size (depends on model)",
      default: "1024x1024",
      options: [
        "256x256",
        "512x512",
        "1024x1024",
        "1536x1024",
        "1024x1536",
        "1792x1024",
        "1024x1792",
        "auto",
      ],
    }),
    quality: Flags.string({
      description: "Quality level (depends on model)",
      default: "auto",
      options: ["auto", "standard", "hd", "high", "medium", "low"],
    }),

    // === Advanced Options ===
    background: Flags.string({
      char: "b",
      description: "Background: transparent, opaque, auto (GPT-Image-1 only)",
      default: "auto",
      options: ["transparent", "opaque", "auto"],
    }),
    "output-format": Flags.string({
      char: "f",
      description: "Output format: png, jpeg, webp (GPT-Image-1 only)",
      default: "png",
      options: ["png", "jpeg", "webp"],
    }),
    "num-images": Flags.integer({
      description: "Number of images 1-10 (OpenAI only)",
      default: 1,
      min: 1,
      max: 10,
    }),
    moderation: Flags.string({
      description: "Content filtering: low, auto (GPT-Image-1 only)",
      default: "auto",
      options: ["low", "auto"],
    }),
    "raw-prompt": Flags.boolean({
      description: "Skip iOS-specific prompt enhancement",
      default: false,
    }),

    style: Flags.string({
      description: "Optional style hint appended after enhancement",
    }),
    "use-icon-words": Flags.boolean({
      description:
        'Include the words "icon" / "logo" in the enhancer (may add unwanted borders/padding)',
      default: false,
    }),

    // === Gemini Options (banana) ===
    pro: Flags.boolean({
      description: "Use Gemini Pro model (banana only)",
      default: false,
    }),
    n: Flags.integer({
      char: "n",
      description: "Number of images (banana pro only, max 10)",
      default: 1,
      min: 1,
      max: 10,
    }),
    q: Flags.string({
      description: "Quality: 1k, 2k, 4k (banana pro only)",
      default: "1k",
      options: ["1k", "2k", "4k"],
    }),
  };

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

      this.log(chalk.blue("🎨 Generating your app icon..."));
      this.log("");
      this.log(
        chalk.dim(
          "Built with ❤️  by \u001b]8;;https://codewithbeto.dev\u001b\\codewithbeto.dev\u001b]8;;\u001b\\ - Ship faster, contribute more, lead with confidence"
        )
      );
      this.log("");
      this.log(chalk.gray(`Prompt: ${flags.prompt}`));
      if (flags.style) {
        this.log(chalk.blue(`🎨 Style: ${flags.style} - ${StyleTemplates.getStyleDescription(flags.style as any)}`));
      }
      if (flags["raw-prompt"]) {
        this.log(chalk.yellow("⚠️  Using raw prompt (no style enhancement)"));
      }

      const modelFlag = flags.model as "banana" | "gpt-image-1.5";
      const provider: "banana" | "gpt" = modelFlag === "banana" ? "banana" : "gpt";
      const openaiModel: "gpt-image-1.5" = "gpt-image-1.5";

      if (flags["api-key"]) {
        const keyError = ValidationService.validateApiKey(flags["api-key"]);
        if (keyError) this.error(chalk.red(keyError));
      }
      if (flags["google-api-key"]) {
        const keyError = ValidationService.validateGoogleApiKey(
          flags["google-api-key"]
        );
        if (keyError) this.error(chalk.red(keyError));
      }

      if (provider === "banana") {
        if (!flags.pro) {
          if (flags.n !== 1) {
            this.error(chalk.red("Banana normal only supports --n 1"));
          }
          if (flags.q !== "1k") {
            this.error(chalk.red("Banana normal does not support --q"));
          }
        } else {
          if (flags.n >= 5) {
            const ok = await this.confirmLargeGeneration(flags.n);
            if (!ok) {
              this.log(chalk.yellow("Aborted."));
              return;
            }
          }
        }

        const finalPrompt = buildFinalIconPrompt({
          prompt: flags.prompt,
          rawPrompt: flags["raw-prompt"],
          style: flags.style,
          squareOnly: true,
          sizeHint: flags.pro ? `${flags.q.toUpperCase()}` : "1K",
          useIconWords: flags["use-icon-words"],
        });

        const images = await GeminiService.generateBananaImages({
          prompt: finalPrompt,
          pro: flags.pro,
          n: flags.pro ? flags.n : 1,
          quality: flags.q as "1k" | "2k" | "4k",
          apiKey: flags["google-api-key"],
        });

        const outputPaths = await this.saveBinaryImages(images, flags.output);
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

      // OpenAI (gpt)
      const finalPrompt = buildFinalIconPrompt({
        prompt: flags.prompt,
        rawPrompt: flags["raw-prompt"],
        style: flags.style,
        squareOnly: false,
        sizeHint: flags.size,
        useIconWords: flags["use-icon-words"],
      });

      const imageBase64Array = await OpenAIService.generateIcon({
        prompt: finalPrompt,
        output: flags.output,
        model: openaiModel,
        size: flags.size,
        quality: flags.quality as
          | "auto"
          | "standard"
          | "hd"
          | "high"
          | "medium"
          | "low",
        background: flags.background as "transparent" | "opaque" | "auto",
        outputFormat: flags["output-format"] as "png" | "jpeg" | "webp",
        numImages: flags["num-images"],
        moderation: flags.moderation as "low" | "auto",
        rawPrompt: true,
        apiKey: flags["api-key"],
      });

      const outputPaths = await this.saveBase64Images(
        imageBase64Array,
        flags.output,
        flags["output-format"]
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

  private async saveBase64Images(
    base64DataArray: string[],
    outputDir: string,
    outputFormat: string
  ): Promise<string[]> {
    await fs.ensureDir(outputDir);

    const outputPaths: string[] = [];
    const timestamp = Date.now();

    try {
      this.log(chalk.gray(`💾 Saving ${base64DataArray.length} image(s)...`));

      for (let i = 0; i < base64DataArray.length; i++) {
        const base64Data = base64DataArray[i];
        const extension = outputFormat || "png";
        const filename =
          base64DataArray.length === 1
            ? `icon-${timestamp}.${extension}`
            : `icon-${timestamp}-${i + 1}.${extension}`;
        const outputPath = path.join(outputDir, filename);

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, "base64");
        await fs.writeFile(outputPath, buffer);

        outputPaths.push(outputPath);
      }

      return outputPaths;
    } catch (error: any) {
      throw new Error(`Failed to save image(s): ${error.message}`);
    }
  }

  private async saveBinaryImages(
    images: Array<{ base64: string; extension: string }>,
    outputDir: string
  ): Promise<string[]> {
    await fs.ensureDir(outputDir);
    const outputPaths: string[] = [];
    const timestamp = Date.now();

    try {
      this.log(chalk.gray(`💾 Saving ${images.length} image(s)...`));

      for (let i = 0; i < images.length; i++) {
        const { base64, extension } = images[i];
        const filename =
          images.length === 1
            ? `icon-${timestamp}.${extension}`
            : `icon-${timestamp}-${i + 1}.${extension}`;
        const outputPath = path.join(outputDir, filename);
        const buffer = Buffer.from(base64, "base64");
        await fs.writeFile(outputPath, buffer);
        outputPaths.push(outputPath);
      }

      return outputPaths;
    } catch (error: any) {
      throw new Error(`Failed to save image(s): ${error.message}`);
    }
  }
}
