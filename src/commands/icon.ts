import { Command, Flags } from "@oclif/core";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { OpenAIService } from "../services/openai.js";
import { ReplicateService } from "../services/replicate.js";
import { ValidationService } from "../utils/validation.js";
import { StyleTemplates } from "../utils/styleTemplates.js";

export default class IconCommand extends Command {
  static description =
    "Generate AI-powered app icons using OpenAI models (GPT-Image-1, DALL-E 3, DALL-E 2) or Recraft V3 SVG via Replicate";

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
    "",
    // Style options
    '<%= config.bin %> <%= command.id %> --prompt "calculator app" --style minimalism',
    '<%= config.bin %> <%= command.id %> --prompt "music player" --style glassy',
    '<%= config.bin %> <%= command.id %> --prompt "weather app" --style neon',
    "",
    // Recraft V3 SVG (Replicate)
    '<%= config.bin %> <%= command.id %> --prompt "calculator icon" --model recraft-v3-svg',
    '<%= config.bin %> <%= command.id %> --prompt "logo" --model recraft-v3-svg --style-design line_art',
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
        "AI model: gpt-image-1 (best), dall-e-3 (creative), dall-e-2 (fast), recraft-v3-svg (vector SVG via Replicate)",
      default: "gpt-image-1",
      options: ["dall-e-2", "dall-e-3", "gpt-image-1", "recraft-v3-svg"],
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
      description: "Output format: png, jpeg, webp, svg (svg for recraft-v3-svg)",
      default: "png",
      options: ["png", "jpeg", "webp", "svg"],
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

    // === Style Options ===
    style: Flags.string({
      description: "Icon style: minimalism, glassy, woven, geometric, neon, gradient, flat, material, ios-classic, android-material",
      options: StyleTemplates.getAvailableStyles(),
    }),
    "style-design": Flags.string({
      description: "Recraft V3 SVG only: design style (any, engraving, line_art, line_circuit, linocut)",
      options: ["any", "engraving", "line_art", "line_circuit", "linocut"],
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

      const isRecraft = flags.model === "recraft-v3-svg";
      this.log(
        isRecraft
          ? chalk.blue("📥 Generating and downloading SVG icon...")
          : chalk.blue("🎨 Generating your app icon...")
      );
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
      if (isRecraft && flags["style-design"]) {
        this.log(chalk.blue(`🎨 Recraft style-design: ${flags["style-design"]}`));
      }

      let outputPaths: string[];
      if (isRecraft) {
        const svgContents = await ReplicateService.downloadSvg({
          prompt: flags.prompt,
          size: flags.size,
          style: flags["style-design"] ?? "any",
        });
        outputPaths = await this.saveSvgFiles(svgContents, flags.output);
      } else {
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
          style: flags.style as any,
        });
        outputPaths = await this.saveBase64Images(
          imageBase64Array,
          flags.output,
          flags["output-format"]
        );
      }

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

        const buffer = Buffer.from(base64Data, "base64");
        await fs.writeFile(outputPath, buffer);

        outputPaths.push(outputPath);
      }

      return outputPaths;
    } catch (error: any) {
      throw new Error(`Failed to save image(s): ${error.message}`);
    }
  }

  /** Download and save SVG file(s) from raw SVG markup (Recraft / Replicate flow). */
  private async saveSvgFiles(
    svgContents: string[],
    outputDir: string
  ): Promise<string[]> {
    await fs.ensureDir(outputDir);

    const outputPaths: string[] = [];
    const timestamp = Date.now();

    try {
      this.log(chalk.gray(`💾 Downloading ${svgContents.length} SVG(s)...`));

      for (let i = 0; i < svgContents.length; i++) {
        const filename =
          svgContents.length === 1
            ? `icon-${timestamp}.svg`
            : `icon-${timestamp}-${i + 1}.svg`;
        const outputPath = path.join(outputDir, filename);
        await fs.writeFile(outputPath, svgContents[i], "utf-8");
        outputPaths.push(outputPath);
      }

      return outputPaths;
    } catch (error: any) {
      throw new Error(`Failed to save SVG(s): ${error.message}`);
    }
  }
}
