import { Command, Flags } from "@oclif/core";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { OpenAIService } from "../services/openai.js";
import { ValidationService } from "../utils/validation.js";

export default class IconCommand extends Command {
  static description =
    "Generate AI-powered app icons using OpenAI models (GPT-Image-1, DALL-E 3, DALL-E 2)";

  static examples = [
    // Basic usage
    '<%= config.bin %> <%= command.id %> --prompt "minimalist calculator app icon"',
    '<%= config.bin %> <%= command.id %> --prompt "fitness tracker" --output ./assets/icons',
    "",
    // Model selection
    '<%= config.bin %> <%= command.id %> --prompt "artistic icon" --model dall-e-3 --quality hd',
    '<%= config.bin %> <%= command.id %> --prompt "quick concept" --model dall-e-2',
    "",
    // Advanced options
    '<%= config.bin %> <%= command.id %> --prompt "logo" --background transparent --output-format png',
    '<%= config.bin %> <%= command.id %> --prompt "variations" --num-images 3 --model gpt-image-1',
    '<%= config.bin %> <%= command.id %> --prompt "custom design" --raw-prompt',
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

    // === Model & Quality ===
    model: Flags.string({
      char: "m",
      description:
        "AI model: gpt-image-1 (best), dall-e-3 (creative), dall-e-2 (fast)",
      default: "gpt-image-1",
      options: ["dall-e-2", "dall-e-3", "gpt-image-1"],
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
      char: "q",
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
      char: "n",
      description: "Number of images 1-10 (DALL-E 3 supports 1 only)",
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
      this.log(chalk.gray(`Prompt: ${flags.prompt}`));
      if (flags["raw-prompt"]) {
        this.log(chalk.yellow("⚠️  Using raw prompt (no iOS enhancement)"));
      }

      // Generate icon using OpenAI
      const imageBase64Array = await OpenAIService.generateIcon({
        prompt: flags.prompt,
        output: flags.output,
        model: flags.model as "dall-e-2" | "dall-e-3" | "gpt-image-1",
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
        rawPrompt: flags["raw-prompt"],
      });

      // Save all generated images
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
      this.log("");
      this.log(
        chalk.dim(
          "Built with ❤️  by \u001b]8;;https://codewithbeto.dev\u001b\\codewithbeto.dev\u001b]8;;\u001b\\ - Ship faster, contribute more, lead with confidence"
        )
      );
    } catch (error) {
      this.error(
        chalk.red(`Failed to generate icon: ${(error as Error).message}`)
      );
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
}
